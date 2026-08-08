import { characteristicAge, BField } from './util/derivedFields.js';
import { formatAge, formatBField } from './util/formatters.js';

function DetailPanel({currRow}){
    if(!currRow){
        return <p>Select a pulsar to see details</p>;
    }
    const age = characteristicAge(currRow.P0, currRow.P1);
    const displayAge = formatAge(age);

    const bfield = BField(currRow.P0, currRow.P1);
    const displayField = formatBField(bfield);

    return (
        <div>
            <p>{currRow.PSRJ}</p>
            <p>{currRow.classification}</p>
            <p>{currRow.P0}</p>
            <p>{displayAge}</p>
            <p>{displayField}</p>
        </div>
    )
}


export default DetailPanel