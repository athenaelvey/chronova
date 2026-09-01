import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
import os
from dotenv import load_dotenv

from main import app
from database import get_db 
from models import Base, Pulsar

load_dotenv()

TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL")

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture()
def db_session():
    session = TestingSessionLocal()
    yield session
    session.close()

@pytest.fixture()
def client(db_session):
    def override_get_db():
        yield db_session
    
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()

@pytest.fixture()
def seed_pulsars(db_session):
    test_pulsars = [
        Pulsar(PSRJ="J0000+0001", classification="Magnetars", P0=5.0, P0_ERR=0.1, P1=1e-12, TYPE="AXP"),
        Pulsar(PSRJ="J0000+0002", classification="Millisecond Pulsars", P0=0.005, P0_ERR=0.0001, P1=1e-20),
        Pulsar(PSRJ="J0000+0003", classification="Ordinary Pulsars", P0=1.2, P0_ERR=0.01, P1=1e-15, TYPE="XINS"),
    ]
    db_session.add_all(test_pulsars)
    db_session.commit()

    yield test_pulsars

    db_session.query(Pulsar).filter(Pulsar.PSRJ.like("J0000+%")).delete()
    db_session.commit()
