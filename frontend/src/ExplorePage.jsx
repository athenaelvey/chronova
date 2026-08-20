import { useState } from 'react'
import PPDiagram from './PPDiagram'
import CatalogTable from './CatalogTable'
import DetailPanel from './DetailPanel'
import QueryBuilder from './QueryBuilder'

function ExplorePage(){

    const [currRow, setRow] = useState(null)

    const [conditions, setConditions] = useState([])
    const [combinator, setCombinator] = useState("AND")
    
    return(
        <div className="explore-container">
            <PPDiagram /> 
            <DetailPanel currRow={currRow}/>
            <CatalogTable 
                conditions={conditions} 
                combinator={combinator} 
                currRow = {currRow}
                setRow = {setRow}
            />
            <QueryBuilder
                conditions={conditions} 
                combinator={combinator} 
                setConditions={setConditions} 
                setCombinator={setCombinator} 
            />
        </div>
    )
}

export default ExplorePage