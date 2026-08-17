import { useState } from 'react'
import pulsars from './displaydata/pulsars.json'
import { characteristicAge, BField } from './util/derivedFields.js';
import { formatAge, formatBField } from './util/formatters.js';
import { getSpinDuration } from './util/spinVisuals.js'
import PulsarSphere from './PulsarSphere.jsx'
import './ComparisonPanel.css';

function ComparisonPanel(){
    const [selectedFirstPulsar, setFirstPulsar] = useState(null)
    const [selectedSecondPulsar, setSecondPulsar] = useState(null)

    const age = selectedFirstPulsar ? characteristicAge(selectedFirstPulsar.P0, selectedFirstPulsar.P1) : null;
    const field = selectedFirstPulsar ? BField(selectedFirstPulsar.P0, selectedFirstPulsar.P1) : null;

    const formattedAge = selectedFirstPulsar ? formatAge(age) : null;
    const formattedField = selectedFirstPulsar ? formatBField(field) : null;

    const ageB = selectedSecondPulsar ? characteristicAge(selectedSecondPulsar.P0, selectedSecondPulsar.P1) : null;
    const fieldB = selectedSecondPulsar ? BField(selectedSecondPulsar.P0, selectedSecondPulsar.P1) : null;

    const formattedAgeB = selectedSecondPulsar ? formatAge(ageB) : null;
    const formattedFieldB = selectedSecondPulsar ? formatBField(fieldB) : null;

    const p0Min = Math.min(...pulsars.map(item => item.P0));
    const p0Max = Math.max(...pulsars.map(item => item.P0));

    const durationA = selectedFirstPulsar ? getSpinDuration(selectedFirstPulsar.P0, p0Min, p0Max) : null;
    const durationB = selectedSecondPulsar ? getSpinDuration(selectedSecondPulsar.P0, p0Min, p0Max) : null;

    return(
    <div className="compare-panel">
        <div className="compare-column">
            <div className="compare-card">
                <span className="compare-label">Pulsar A</span>
                <select className="compare-select" onChange={(event) => {
                const match = pulsars.find(item => item.PSRJ === event.target.value);
                setFirstPulsar(match);
                }}>
                {pulsars.map(item => (
                    <option key={item.PSRJ} value={item.PSRJ}>
                    {item.PSRJ}
                    </option>
                ))}
                </select>

                {selectedFirstPulsar ? (
                <>
                    <div className="compare-details">
                        <p className="compare-name">{selectedFirstPulsar.PSRJ}</p>
                        <p>{selectedFirstPulsar.classification}</p>
                        <p>{formattedAge}</p>
                        <p>{formattedField}</p>
                    </div>
                    <div className="sphere-card">
                        <PulsarSphere key={selectedFirstPulsar.PSRJ} duration={durationA} />
                    </div>
                </>
                ) : (
                <p className="compare-empty">Select a pulsar</p>
                )}
            </div>
        </div>

        <div className="compare-column">
            <div className="compare-card">
                <span className="compare-label">Pulsar B</span>
                <select className="compare-select" onChange={(event) => {
                const match = pulsars.find(item => item.PSRJ === event.target.value);
                setSecondPulsar(match);
                }}>
                {pulsars.map(item => (
                    <option key={item.PSRJ} value={item.PSRJ}>
                    {item.PSRJ}
                    </option>
                ))}
                </select>

                {selectedSecondPulsar ? (
                <>
                    <div className="compare-details">
                        <p className="compare-name">{selectedSecondPulsar.PSRJ}</p>
                        <p>{selectedSecondPulsar.classification}</p>
                        <p>{formattedAgeB}</p>
                        <p>{formattedFieldB}</p>
                    </div>
                    <div className="sphere-card">
                        <PulsarSphere key={selectedFirstPulsar.PSRJ} duration={durationA} />
                    </div>
                </>
                ) : (
                <p className="compare-empty">Select a pulsar</p>
                )}
            </div>
            
        </div>
    </div>
    
    )
}

export default ComparisonPanel