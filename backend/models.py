from sqlalchemy import Column, Integer, String, Enum, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
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

class PipelineRun(Base):
    __tablename__ = "pipeline_runs"
    id = Column(Integer, primary_key=True)
    ran_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    pulsar_count = Column(Integer, nullable=False)
    anomaly_count = Column(Integer, nullable=False)
    insufficient_data_count = Column(Integer, nullable=False)

class PulsarSnapshot(Base):
    __tablename__ = "pulsar_snapshots"
    id = Column(Integer, primary_key=True)
    run_id = Column(Integer, ForeignKey("pipeline_runs.id"), nullable=False)
    PSRJ = Column(String, nullable=False)
    classification = Column(String, nullable=False)
    TYPE = Column(String)
    P0 = Column(Float, nullable=False)
    P0_ERR = Column(Float)
    P1 = Column(Float)
    P1_ERR = Column(Float)
    DIST = Column(Float)