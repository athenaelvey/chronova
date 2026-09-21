import math
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

def same_value(a, b):
    both_nan = (
        isinstance(a, float) and isinstance(b, float)
        and math.isnan(a) and math.isnan(b)
    )
    return both_nan or a == b

def changed_fields(old_p, new_p):
    changes = {}
    for field in DATA_FIELDS:
        if not same_value(old_p.get(field), new_p.get(field)):
            changes[field] = {"old": old_p.get(field), "new": new_p.get(field)}
    return changes

def diff_runs(old_id, new_id):
    old = get_snapshot(old_id)
    new = get_snapshot(new_id)

    added = sorted(set(new) - set(old))
    removed = sorted(set(old) - set(new))

    changed = {}
    for psrj in sorted(set(old) & set(new)):
        changes = changed_fields(old[psrj], new[psrj])
        if changes:
            changed[psrj] = changes

    return {"added": added, "removed": removed, "changed": changed}