import { useState } from 'react'
import PPDiagram from './PPDiagram'
import CatalogTable from './CatalogTable'
import DetailPanel from './DetailPanel'

function ExplorePage(){

    const [currClass, setClass] = useState("All")
    const [currRow, setRow] = useState(null)
    
    return(
        <div className="explore-container">
            <PPDiagram /> 
            <DetailPanel currRow={currRow}/>
            <CatalogTable 
                currClass={currClass} 
                setClass={setClass} 
                currRow={currRow} 
                setRow={setRow} 
            />
        </div>
    )
}

export default ExplorePage