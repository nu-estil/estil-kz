from database import Base
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func


class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    # ... other item fields ...

class UserInteraction(Base):
    __tablename__ = "user_interactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    item_id = Column(Integer, nullable=False)
    interaction_type = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    count = Column(Integer, default=1)
