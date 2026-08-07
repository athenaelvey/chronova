import { useState } from 'react';
import pulsars from './displaydata/pulsars.json'

function CatalogTable(){
    const [currClass, setClass] = useState("All");
    const [currRow, setRow] = useState(null);

    const tableArray = pulsars.filter(item => item.classification === currClass || currClass === "All")
}