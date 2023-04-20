from database import Base
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func


class UserInteraction(Base):
    __tablename__ = "user_interactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    item_id = Column(Integer, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    score = Column(Integer, default=1)
