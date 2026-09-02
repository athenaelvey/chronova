import { useState, useEffect } from 'react'
import './CatalogTable.css'

function CatalogTable({ conditions, combinator, currRow, setRow }){

    const [pulsars, setPulsars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch('http://127.0.0.1:8000/pulsars/filter',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ conditions, combinator})
        })

            .then(response => response.json().then(data => ({ ok: response.ok, data})))
            .then(({ ok , data }) => {
                if(ok){
                    setPulsars(data);
                }
                else{
                    console.error('Filter request failed:', data);
                    setPulsars([]);
                }
                setLoading(false);
            });
    }, [conditions, combinator]);

    if (loading) {
        return <div className="catalog-container">Loading..</div>;
    }

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
                    {pulsars.map(pulsar =>(
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