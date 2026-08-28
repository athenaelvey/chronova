from sqlalchemy import Column, Integer, String, Enum, Float
from database import Base

class Pulsar(Base):
    __tablename__ = "pulsars"
    id = Column(Integer, primary_key=True)
    PSRJ = Column(String, unique=True, nullable=False)
    classification = Column(Enum("Magnetars", "Ordinary Pulsars","Millisecond Pulsars", name="classification_enum"), nullable = False)
    TYPE = Column(String)
    P0 = Column(Float, nullable=False)
    P0_ERR = Column(Float)
    P1 = Column(Float)
    P1_ERR = Column(Float)
    DIST = Column(Float)


