import { useState, useEffect } from 'react'
import './DiffPage.css'

function DiffPage(){
    const oldId = 1;
    const newId = 2;
    const[loading, setLoading] = useState(true);
    const[diff, setDiff] = useState(null);
    const[error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`http://127.0.0.1:8000/pipeline/diff?old_id=${oldId}&new_id=${newId}`)
        .then(response => response.json().then(data => ({ ok: response.ok, data})))
        .then(({ ok, data}) => {
            if (ok) {
                setDiff(data);
            }
            else {
                setDiff(null);
                setError(data.detail);
            }
            setLoading(false);
        })
        .catch(() => {
            setError("Could not reach the server.");
            setLoading(false);
        });
    }, [oldId, newId]);

    if (loading) return <div>Loading..</div>;
    if(error) return<div>{error}</div>;

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
                <div>
                    Run {oldId}: {diff.runs.old.pulsar_count} pulsars, {diff.runs.old.anomaly_count} anomalies
                </div>
                <div>
                    Run {newId}: {diff.runs.new.pulsar_count} pulsars, {diff.runs.new.anomaly_count} anomalies
                </div>
            </div>

            <div className="diff-lists">
                <section>
                    <h2>Added ({diff.added.length})</h2>
                    <ul>
                        {diff.added.map(name => <li key = {name}>{name}</li>)}
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