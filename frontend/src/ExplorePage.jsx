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
            <QueryBuilder
                conditions={conditions} 
                combinator={combinator} 
                setConditions={setConditions} 
                setCombinator={setCombinator} 
            />
            <CatalogTable 
                conditions={conditions} 
                combinator={combinator} 
                currRow = {currRow}
                setRow = {setRow}
            />  
        </div>
    )
}

export default ExplorePage