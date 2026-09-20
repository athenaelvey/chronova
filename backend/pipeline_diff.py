from database import SessionLocal 
from models import PulsarSnapshot

DATA_FIELDS = ["classification", "TYPE", "P0", "P0_ERR", "P1", "P1_ERR", "DIST"]

def get_snapshot(run_id):
    session = SessionLocal()
    try:
        rows = session.query(PulsarSnapshot).filter(PulsarSnapshot.run_id == run_id).all()
        return {row.PSRJ: {f: getattr(row, f) for f in DATA_FIELDS} for row in rows}
    finally:
        session.close()

def diff_runs(old_id, new_id):
    old = get_snapshot(old_id)
    new = get_snapshot(new_id)

    added = sorted(set(new) - set(old))
    removed = sorted(set(old) - set(new))

    return {"added": added, "removed": removed}