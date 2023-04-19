import numpy as np
from lightfm import LightFM
from lightfm.data import Dataset
from models import UserInteraction
from schemas import Interaction
from sqlalchemy.orm import Session


def create_interaction(db: Session, interaction: Interaction):
    existing_interaction = (
        db.query(UserInteraction)
        .filter(
            UserInteraction.user_id == interaction.user_id,
            UserInteraction.item_id == interaction.item_id,
            UserInteraction.interaction_type == interaction.interaction_type,
        )
        .first()
    )

    if existing_interaction:
        existing_interaction.count += 1
        db.commit()
        return existing_interaction
    else:
        db_interaction = UserInteraction(**interaction.dict())
        db.add(db_interaction)
        db.commit()
        db.refresh(db_interaction)
        return db_interaction

def get_recommendations(db: Session, user_id: int):
    interactions = db.query(UserInteraction).all()

    dataset = Dataset()
    dataset.fit((x.user_id for x in interactions),
                (x.item_id for x in interactions))

    num_users, num_items = dataset.interactions_shape()
    interaction_data = dataset.build_interactions(((x.user_id, x.item_id, x.count) for x in interactions))

    model = LightFM(loss="warp")
    model.fit(interaction_data[0], epochs=30, num_threads=2)

    # Ensure the user_id is within the model's user range
    mappings = dataset.mapping()
    user_id_mapping, item_id_mapping = mappings[0], mappings[1]
    
    if user_id not in user_id_mapping:
        return []

    internal_user_id = user_id_mapping[user_id]
    scores = model.predict(internal_user_id, np.arange(num_items))

    top_internal_items = np.argsort(-scores)[:10]

    # Reverse the mapping to return the original item_ids
    reverse_item_id_mapping = {v: k for k, v in item_id_mapping.items()}
    return [reverse_item_id_mapping[internal_item_id] for internal_item_id in top_internal_items if internal_item_id in reverse_item_id_mapping]
