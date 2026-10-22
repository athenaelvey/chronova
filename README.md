# Chronova

An interactive full-stack explorer for real pulsar data from the [ATNF Pulsar Catalogue](https://www.atnf.csiro.au/research/pulsar/psrcat/), with a data pipeline that tracks how the catalogue changes between ingestion runs.

**Live site:** https://chronovapt.vercel.app
**API docs:** https://chronova-api.onrender.com/docs

> The backend runs on a free Render instance that sleeps when idle, so the first request after a quiet period can take up to a minute.

## What it does

- **Explore:** build queries over pulsar fields, plot the P-Ṗ diagram with a death line, and inspect individual pulsars in a detail panel
- **Compare and Catalog:** side-by-side comparison and a browsable table of the curated sample
- **Pipeline Diff:** shows what changed between ingestion runs (pulsars added, removed, or with changed values), with run counts and timestamps
- **3D visuals:** a Three.js pulsar model and an armillary sphere on the landing page

## Architecture

```mermaid
flowchart LR
    ATNF[ATNF Pulsar Catalogue] -->|psrqpy| PIPE[Ingest pipeline<br/>Python + pandas]
    GHA[GitHub Actions<br/>weekly, Mondays 03:00 UTC] -->|runs| PIPE
    PIPE -->|replace_pulsars +<br/>run snapshot, one transaction| DB[(Neon PostgreSQL)]
    API[FastAPI on Render] -->|SQLAlchemy| DB
    WEB[React + Vite on Vercel] -->|HTTPS + CORS| API
    USER((Browser)) --> WEB
```

| Layer | Technology | Hosting |
| --- | --- | --- |
| Frontend | React, Vite, React Router, Three.js, Plotly | Vercel |
| Backend | FastAPI, SQLAlchemy, Alembic, Pydantic | Render |
| Database | PostgreSQL | Neon |
| Pipeline | Python, pandas, psrqpy | GitHub Actions |

## Data pipeline

`backend/scripts/ingest_pipeline.py` runs four stages: fetch raw data, validate and classify, curate a sample, and load.

- **Classification** is recomputed from raw fields on every run: `TYPE == "AXP"` is a magnetar, `P0 <= 0.03` is a millisecond pulsar, and everything else is an ordinary pulsar.
- **Two-tier discard model:** rows missing an identifier or period go to an anomaly log with the field name and a timestamp. Rows missing only the period derivative are counted separately as insufficient data, since that is expected incompleteness rather than a data-quality signal.
- **Deterministic sampling:** the curated 30 pulsars are chosen by an md5 hash of each pulsar's name, so the same pulsars are selected whenever the catalogue is unchanged. This is what makes run-to-run diffs meaningful.
- **Atomic loads:** the pulsar table is replaced and the run record is written in a single transaction, so a failed run never leaves the database half-updated.
- **Missing values:** psrqpy returns NaN rather than None, so validation uses `pd.isna()` throughout. NaN is converted to null before values reach JSON.

### Run history and diffing

Each run writes one row to `pipeline_runs` (timestamp and counts) and one row per pulsar to `pulsar_snapshots`. `GET /pipeline/diff` matches pulsars between two runs by name and reports added, removed, and changed entries.

### Scheduling

A GitHub Actions workflow runs the pipeline every Monday at 03:00 UTC and can also be triggered manually. Manual runs have a dry-run option that fetches, validates, and classifies without writing to the database.

## API

| Endpoint | Purpose |
| --- | --- |
| `GET /stats` | Summary stats for the landing page (pulsar count) |
| `GET /pipeline/runs` | Ingestion runs, newest first, with counts and timestamps |
| `GET /pipeline/diff?old_id=&new_id=` | Differences between two runs |
| `GET /docs` | Interactive API documentation |

## Running locally

Requires Python 3.11+, Node.js, and Docker.

```bash
# Database
docker run --name chronova-db -e POSTGRES_PASSWORD=devpassword -e POSTGRES_DB=chronova -p 5432:5432 -d postgres

# Backend
cd backend
python -m venv venv
# Windows: .\venv\Scripts\Activate.ps1   macOS/Linux: source venv/bin/activate
pip install -r requirements-ingest.txt
# create backend/.env with DATABASE_URL=postgresql://postgres:devpassword@127.0.0.1:5432/chronova
alembic upgrade head
python scripts/ingest_pipeline.py
uvicorn main:app --reload

# Frontend (second terminal)
cd frontend
npm install
npm run dev
```

### Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Backend, GitHub Actions secret | PostgreSQL connection string |
| `CORS_ORIGINS` | Backend | Comma-separated list of allowed frontend origins (defaults to `http://localhost:5173`) |
| `VITE_API_URL` | Frontend | Base URL of the API (defaults to `http://127.0.0.1:8000`) |

Tests run with `pytest` against a separate `chronova_test` database.

## Design notes

- `requirements.txt` holds only what the API needs, while `requirements-ingest.txt` adds psrqpy and pandas, so the Render build stays lean and the pipeline gets its extra dependencies.
- Pipeline history lives in its own tables rather than the pulsars table, so the live catalogue stays simple and history can grow independently.
- Snapshot-based diffing was chosen over a change log because it is easier to reason about and to verify.
