import pulsars from './displaydata/pulsars.json'
import Plot from 'react-plotly.js'
import { deathLinePdot } from './util/derivedFields.js';


const magnetarArray = pulsars.filter(item => item.classification === "Magnetars")
const mspArray = pulsars.filter(item => item.classification === "Millisecond Pulsars")
const pulsarArray = pulsars.filter(item => item.classification === "Ordinary Pulsars")

const magnetarArrayP0 = magnetarArray.map(item => item.P0)
const magnetarArrayP1 = magnetarArray.map(item => item.P1)
const mspArrayP0 = mspArray.map(item => item.P0)
const mspArrayP1 = mspArray.map(item => item.P1)
const pulsarArrayP0 = pulsarArray.map(item => item.P0)
const pulsarArrayP1 = pulsarArray.map(item => item.P1)

const allP0 = pulsars.map(item => item.P0);

const pMin = Math.min(...allP0);
const pMax = Math.max(...allP0);

const deathLineStart = { P0: pMin, Pdot: deathLinePdot(pMin) };
const deathLineEnd = { P0: pMax, Pdot: deathLinePdot(pMax) };

const magnetarTrace = {
  x: magnetarArrayP0,
  y: magnetarArrayP1,
  mode: 'markers',
  type: 'scatter',
  name: 'Magnetars'
}

const mspTrace = {
  x: mspArrayP0,
  y: mspArrayP1,
  mode: 'markers',
  type: 'scatter',
  name: 'Millisecond Pulsars'
}

const pulsarTrace = {
  x: pulsarArrayP0,
  y: pulsarArrayP1,
  mode: 'markers',
  type: 'scatter',
  name: 'Ordinary Pulsars'
}

const deathLineTrace = {
  x: [deathLineStart.P0, deathLineEnd.P0],
  y: [deathLineStart.Pdot, deathLineEnd.Pdot],
  mode: 'lines',
  type: 'scatter',
  name: 'Death Line'
}

const layout = {
    xaxis: {
        title: 'Period (s)',
        type: 'log'
    },
    yaxis: {
        title: 'Period Derivative',
        type: 'log'
    },
    title: 'P-Ṗ Diagram'
    }

function PPDiagram(){
    return (
        <Plot
        data={[magnetarTrace, mspTrace, pulsarTrace, deathLineTrace]}
        layout={layout}
        />
  )
}

export default PPDiagram;