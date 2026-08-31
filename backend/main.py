from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Pulsar
from schemas import PulsarOut

app = FastAPI()

@app.get("/pulsars", response_model=list[PulsarOut])
def get_pulsar(db: Session = Depends(get_db)):
    return db.query(Pulsar).all()