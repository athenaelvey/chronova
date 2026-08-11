import pulsars from './displaydata/pulsars.json'
import './CatalogTable.css'

function CatalogTable({ currClass, setClass, currRow, setRow }){

    const tableArray = pulsars.filter(item => item.classification === currClass || currClass === "All");

    return(
        <div className="catalog-container">
            <select className="catalog-select" onChange={(e) => setClass(e.target.value)}>
                <option value="All">All</option>
                <option value="Magnetars">Magnetars</option>
                <option value="Millisecond Pulsars">Millisecond Pulsars</option>
                <option value="Ordinary Pulsars">Ordinary Pulsars</option>
            </select>
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