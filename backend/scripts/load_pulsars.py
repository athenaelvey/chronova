from sqlalchemy.dialects.postgresql import insert as pg_insert
import json
import os
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))
from database import SessionLocal
from models import Pulsar, PipelineRun, PulsarSnapshot
from pathlib import Path


PULSARS_JSON_PATH = Path(__file__).parent.parent.parent / "frontend"/ "src" / "displaydata" / "pulsars.json"

def replace_pulsars(pulsars_data, anomaly_count, insufficient_data_count):
    session = SessionLocal()
    try:
        session.query(Pulsar).delete()
        session.execute(Pulsar.__table__.insert(), pulsars_data)

        run = PipelineRun(
            pulsar_count=len(pulsars_data),
            anomaly_count=anomaly_count,
            insufficient_data_count=insufficient_data_count,
        )
        session.add(run)
        session.flush()

        snapshot_rows = [{**p, "run_id": run.id} for p in pulsars_data]
        session.execute(PulsarSnapshot.__table__.insert(), snapshot_rows)

        session.commit()
        print(f"Replaced table with {len(pulsars_data)} pulsars and saved run {run.id}.")
    finally:
        session.close()

def upsert_pulsars(pulsars_data):
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

def load_pulsars():
    with open(PULSARS_JSON_PATH, "r") as f:
        pulsars_data = json.load(f)
    upsert_pulsars(pulsars_data)

if __name__ == "__main__":
    load_pulsars()
    