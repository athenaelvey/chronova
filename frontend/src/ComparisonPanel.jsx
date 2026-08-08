import { useState } from 'react'
import pulsars from './displaydata/pulsars.json'
import { characteristicAge, BField } from './util/derivedFields.js';
import { formatAge, formatBField } from './util/formatters.js';

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

    return(
    <div>
        <select onChange={(event) => {
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
        <div>
            <p>{selectedFirstPulsar.PSRJ}</p>
            <p>{selectedFirstPulsar.classification}</p>
            <p>{formattedAge}</p>
            <p>{formattedField}</p>
        </div>
        ) : (
        <p>Select another pulsar</p>
        )}

        <select onChange={(event) => {
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
        <div>
            <p>{selectedSecondPulsar.PSRJ}</p>
            <p>{selectedSecondPulsar.classification}</p>
            <p>{formattedAgeB}</p>
            <p>{formattedFieldB}</p>
        </div>
        ) : ( <p></p>
        )}

    </div>
    )
}

export default ComparisonPanel