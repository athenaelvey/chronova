import './PulsarSpinner.css';

function PulsarSpinner({ duration })
{
    return(
        
        <svg viewBox = "0 0 100 100" width="60" height="60">
            <g className="pulsar-spinner-group" style={{ animationDuration: `${duration}s`}}>
                <circle cx="50" cy="50" r="40" fill="var(--accent)" />
                <line x1="50" y1="50" x2="50" y2="10" stroke="var(--accent-secondary)" strokeWidth="3" />
            </g>
        </svg>
        
    )
}

export default PulsarSpinner