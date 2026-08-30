from sqlalchemy.dialects.postgresql import insert as pg_insert
import json
import os
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))
from database import SessionLocal
from models import Pulsar
from pathlib import Path


PULSARS_JSON_PATH = Path(__file__).parent.parent.parent / "frontend"/ "src" / "displaydata" / "pulsars.json"

def load_pulsars():
    with open(PULSARS_JSON_PATH, "r") as f:
        pulsars_data = json.load(f)

    session = SessionLocal()
    try:
        stmt = pg_insert(Pulsar).values(pulsars_data)
        set_ = {
            col: stmt.excluded[col]
            for col in Pulsar.__table__.columns.keys()
            if col not in ["id", "PSRJ"]
        }
        stmt = stmt.on_conflict_do_update(
            index_elements=["PSRJ"],
            set_=set_
        )
        session.execute(stmt)
        session.commit()
        print(f"Loaded {len(pulsars_data)} pulsars.")
    finally:
        session.close()

if __name__ == "__main__":
    load_pulsars()
    