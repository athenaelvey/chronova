import { API_BASE } from './api'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';
import './DiffPage.css'

function formatRanAt(runs, id){
    const run = runs.find(r => r.id === Number(id));
    if(!run) return "";
    return new Date(run.ran_at).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

function DiffPage(){
    const [searchParams] = useSearchParams();
    const oldURL = searchParams.get("old_id");
    const newURL = searchParams.get("new_id");
    const[runs, setRuns] = useState(null);
    const[loading, setLoading] = useState(true);
    const[diff, setDiff] = useState(null);
    const[error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE}/pipeline/runs`)
        .then(response => response.json())
        .then(data => setRuns(data))
        .catch(() => {
            setError("Could not reach the server.");
            setRuns([]);
        });
    }, []);

    const useDefaults = !oldURL || !newURL;
    const oldId = useDefaults ? runs?.[1]?.id : oldURL;
    const newId = useDefaults ? runs?.[0]?.id : newURL;

    useEffect(() => {
        if (!oldId || !newId) return;
        setLoading(true);
        setError(null);
        fetch(`${API_BASE}/pipeline/diff?old_id=${oldId}&new_id=${newId}`)
        .then(response => response.json().then(data => ({ ok: response.ok, data})))
        .then(({ ok, data}) => {
            if (ok) {
                setDiff(data);
            }
            else {
                setDiff(null);
                setError(typeof data.detail === "string" ? data.detail : "Invalid run IDs.");
            }
            setLoading(false);
        })
        .catch(() => {
            setError("Could not reach the server.");
            setLoading(false);
        });
    }, [oldId, newId]);

    if (error) return <div>{error}</div>;
    if (runs === null) return <div>Loading..</div>;
    if (!oldId || !newId) return <div>Need at least two pipeline runs to compare.</div>;
    if (loading || !diff) return <div>Loading..</div>;

    const changedCount = Object.keys(diff.changed).length;
    const noChanges = diff.added.length === 0 &&
    diff.removed.length === 0 &&
    changedCount === 0;

    return (
        <div className="diff-page">
            <h1>Pipeline Diff</h1>

            {noChanges ? (
                <p className="diff-summary-empty">No changes between run {oldId} and run {newId}.</p>
            ) : (
                <p className="diff-summary">
                    {diff.added.length} added, {diff.removed.length} removed, {changedCount} changed
                </p>
            )}

            <div className="run-info">
                <div className="run-col">
                    <div className="run-box">
                        Run {oldId}: {diff.runs.old.pulsar_count} pulsars, {diff.runs.old.anomaly_count} anomalies
                    </div>
                    <div className="run-box run-date">{formatRanAt(runs, oldId)}</div>
                </div>
                <div className="run-col">
                    <div className="run-box">
                        Run {newId}: {diff.runs.new.pulsar_count} pulsars, {diff.runs.new.anomaly_count} anomalies
                    </div>
                    <div className="run-box run-date">{formatRanAt(runs, newId)}</div>
                </div>
            </div>

            <div className="diff-lists">
                <section>
                    <h2>Added ({diff.added.length})</h2>
                    <ul>
                        {diff.added.map(name => <li key={name}>{name}</li>)}
                    </ul>
                </section>
                <section>
                    <h2>Removed ({diff.removed.length})</h2>
                    <ul>
                        {diff.removed.map(name => <li key={name}>{name}</li>)}
                    </ul>
                </section>
            </div>
        </div>
    );
}

export default DiffPage