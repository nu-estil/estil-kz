from crud import create_interaction as create_interaction_db
from crud import get_recommendations as get_recommendations_db
from database import Base, SessionLocal, engine
from fastapi import Depends, FastAPI, HTTPException
from schemas import Interaction
from sqlalchemy.orm import Session

Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/interactions/")
def create_interaction(interaction: Interaction, db: Session = Depends(get_db)):
    db_interaction = create_interaction_db(db, interaction)
    if db_interaction is None:
        raise HTTPException(status_code=400, detail="Error creating interaction")
    return {"message": "schemas.Interaction created"}

@app.get("/recommendations/{user_id}")
def get_recommendations(user_id: int, db: Session = Depends(get_db)):
    recommendations = get_recommendations_db(db, user_id)
    if recommendations is None:
        raise HTTPException(status_code=404, detail="Recommendations not found")
    return {"item_ids": recommendations}
