from pydantic import BaseModel


class Interaction(BaseModel):
    user_id: int
    item_id: int
    interaction_type: str
