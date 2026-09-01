from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from database import get_db
from models import Pulsar
from schemas import PulsarOut
from schemas import Condition, FilterRequest

app = FastAPI()

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