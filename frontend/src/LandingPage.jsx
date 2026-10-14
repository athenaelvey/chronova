import { useState, useEffect } from "react";
import "./LandingPage.css";
import ArmillarySphere from "./ArmillarySphere";

function LandingPage(){
    
    const [pulsarCount, setPulsarCount] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8000/stats")
        .then((res) => res.json())
        .then((data) => setPulsarCount(data.pulsar_count));
    }, []);

    return(
        <div className="landing">
            <h1>Chronova</h1>
            <span className="status-badge">In active development</span>

            <div className="hero">
                <p className="hero-left">Explore real pulsar data from the ATNF catalogue.</p>
                <div className="hero-sphere"><ArmillarySphere /></div>
                <p className="hero-right">A live pipeline that tracks changes with every update.</p>
            </div>

            {pulsarCount !== null && <p className="stat">{pulsarCount} pulsars tracked</p>}
        </div>
    )
}

export default LandingPage