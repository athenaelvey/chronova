from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from sqlalchemy.exc import NoResultFound

from database import get_db
from models import Pulsar
from schemas import PulsarOut
from schemas import Condition, FilterRequest

from pipeline_diff import diff_runs

app = FastAPI()

app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_methods=["*"],
        allow_headers=["*"],
)

@app.get("/pulsars", response_model=list[PulsarOut])
def get_pulsar(db: Session = Depends(get_db)):
    return db.query(Pulsar).all()

def build_filter_expression(condition: Condition):
    column = getattr(Pulsar, condition.field)

    if condition.operator == "=":
        return column == condition.value
    elif condition.operator == ">":
        return column > condition.value
    elif condition.operator == "<":
        return column < condition.value
    elif condition.operator == ">=":
        return column >= condition.value
    elif condition.operator == "<=":
        return column <= condition.value
    elif condition.operator == "contains":
        return column.contains(condition.value)
        
@app.post("/pulsars/filter", response_model=list[PulsarOut])
def filter_pulsars(request: FilterRequest, db: Session = Depends(get_db)):
    query = db.query(Pulsar)
    expressions = [build_filter_expression(c) for c in request.conditions]
    if not expressions:
        return query.all()
    if request.combinator == "AND":
        combined = and_(*expressions)
    else:
        combined = or_(*expressions)
    query = query.filter(combined)
    return query.all()

@app.get("/pipeline/diff")
def get_pipeline_diff(old_id: int, new_id: int):
    try:
        return diff_runs(old_id, new_id)
    except NoResultFound:
        raise HTTPException(status_code=404, detail="one or both run IDs weren't found")