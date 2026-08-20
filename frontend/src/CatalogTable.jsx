import pulsars from './displaydata/pulsars.json'
import './CatalogTable.css'
import { evaluatePulsar } from './util/queryBuilder';

function CatalogTable({ conditions, combinator, currRow, setRow }){

    const tableArray = pulsars.filter(item => evaluatePulsar(item, conditions, combinator));

    return(
        <div className="catalog-container">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Classification</th>
                        <th>Period (s)</th>
                    </tr>
                </thead>
                <tbody>
                    {tableArray.map(pulsar =>(
                        <tr key={pulsar.PSRJ} onClick={() => setRow(pulsar)}>
                            <td>{pulsar.PSRJ}</td>
                            <td>{pulsar.classification}</td>
                            <td>{pulsar.P0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default CatalogTable