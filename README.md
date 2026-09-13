# Chronova

**An interactive explorer for real pulsar data from the ATNF Pulsar Catalogue.**

Chronova turns raw radio-astronomy catalog data into a browsable, filterable web app — built to demonstrate full-stack engineering, data analytics, and data engineering skills against a real, scientific dataset.

---

## Why this project

Pulsar catalogs are a great real-world dataset: they're sparse (a third of entries are missing spin-down measurements), contain physically meaningful "weird" values (negative period derivatives from globular cluster dynamics), and support genuinely interesting derived science (characteristic age, magnetic field strength, the pulsar death line). Chronova is built to explore all of that interactively across three tracks:

- **Full-stack engineering** — React frontend, FastAPI backend, Postgres database, containerized dev environment
- **Data analytics** — interactive P-Ṗ diagram, derived astrophysical metrics, a dynamic query builder
- **Data engineering** — automated ingestion pipeline from the live ATNF catalog

---

## Features

- **Interactive P-Ṗ diagram** (period vs. period-derivative) — the standard tool astronomers use to classify pulsars, rendered with Plotly, including a pulsar death-line overlay
- **Dynamic query builder** — filter the catalog by any field (period, distance, classification, etc.) with AND/OR combinators, validated against each field's valid operators
- **Derived astrophysics on demand** — characteristic age and magnetic field strength computed from raw catalog values
- **3D pulsar visualization** — Three.js-rendered sphere view per pulsar
- **Real ATNF catalog data** — sourced via `psrqpy`

---

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React + Vite, React Router, Plotly (`react-plotly.js`), Three.js, Tailwind v4 |
| Backend | FastAPI, SQLAlchemy, Alembic, Pydantic v2 |
| Database | PostgreSQL (Docker) |
| Data ingestion | Python, `psrqpy` (ATNF Pulsar Catalogue client) |
| Testing | pytest |

---

## Architecture

```
┌─────────────┐      HTTP       ┌──────────────┐      SQL       ┌──────────────┐
│   React     │  ─────────────► │   FastAPI    │  ────────────► │  PostgreSQL  │
│  (Vite SPA) │  ◄───────────── │   backend    │  ◄──────────── │   database   │
└─────────────┘   JSON /pulsars └──────────────┘                └──────────────┘
                                        ▲
                                        │ upsert on PSRJ
                                 ┌──────────────┐
                                 │ load_pulsars │
                                 │    .py       │
                                 └──────────────┘
                                        ▲
                                        │ psrqpy
                                 ┌──────────────┐
                                 │ ATNF Pulsar  │
                                 │  Catalogue   │
                                 └──────────────┘
```

The query builder in the frontend sends structured filter conditions (field, operator, value, combinator) to `POST /pulsars/filter`, which builds the corresponding SQLAlchemy expression dynamically and returns matching rows as JSON.

---

## Getting started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker

### 1. Database

```bash
docker run --name chronova-db -e POSTGRES_DB=chronova -e POSTGRES_PASSWORD=<your-password> -p 5432:5432 -d postgres
```

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt

# copy .env.example to .env and set DATABASE_URL

alembic upgrade head
python scripts/load_pulsars.py   # populate the pulsars table
uvicorn main:app --reload
```

API docs available at `http://localhost:8000/docs`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at `http://localhost:5173`.

---

## API

| Endpoint | Method | Description |
|---|---|---|
| `/pulsars` | `GET` | Return all pulsars in the catalog |
| `/pulsars/filter` | `POST` | Return pulsars matching a list of filter conditions, combined with AND/OR |

Example filter request body:

```json
{
  "conditions": [
    { "field": "P0", "operator": "<", "value": 0.03 },
    { "field": "classification", "operator": "=", "value": "MSP" }
  ],
  "combinator": "AND"
}
```

---

## Data notes

A few things about the ATNF catalog worth knowing if you're reading the code:

- **Missing period derivatives (P1) are real** — about a third of catalog entries lack a Ṗ measurement. This is an astrophysical constraint (not all pulsars have been timed precisely enough), not a data quality issue, so these rows are kept with `null` rather than dropped.
- **Negative P1 values are physically real** — pulsars in globular clusters can show negative apparent spin-down due to line-of-sight acceleration in the cluster's gravitational field.
- **Millisecond pulsars carry no `TYPE` tag** in the raw catalog and are instead classified by a period threshold.
- The death-line overlay assumes rotation-powered spin-down, so magnetars (which are powered by magnetic field decay, not rotation) are expected to fall outside the model — that's correct behavior, not a bug.

---

## Roadmap / future ideas

- Sky map view — plot pulsars by RA/Dec on a 2D star-chart projection
- Glossary tooltips for astrophysics terms (characteristic age, P-Ṗ diagram, etc.)
- Starfield background on the landing page
- Live catalog stats on the landing page, refreshed by the ingestion pipeline

---

## Data source

Pulsar data from the [ATNF Pulsar Catalogue](https://www.atnf.csiro.au/research/pulsar/psrcat/), accessed via [`psrqpy`](https://github.com/mattpitkin/psrqpy).

---

## Author

Athena Elvey — CS + Cognitive Science, RPI
[GitHub](https://github.com/athenaelvey)

<!-- TODO: pick a license -->
