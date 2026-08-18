function formatRatio(ratio){
    return ratio >= 10 ? Math.round(ratio) : ratio.toFixed(1);
}

export function comparisonSentences(pulsarA, pulsarB, ageA, ageB, fieldA, fieldB){

    const sentences = [];

    if(pulsarA.P0 < pulsarB.P0)
    {
        const ratio = formatRatio(pulsarB.P0/pulsarA.P0);
        sentences.push(`${pulsarA.PSRJ} spins about ${ratio}x times faster than ${pulsarB.PSRJ}`)
    }
    else{
        const ratio = formatRatio(pulsarA.P0/pulsarB.P0);
        sentences.push(`${pulsarB.PSRJ} spins about ${ratio}x times faster than ${pulsarA.PSRJ}`)
    }

    if(ageA.status === 'present' && ageB.status === 'present')
    {
        if(ageA.value > ageB.value)
        {
            const ratio = formatRatio(ageA.value/ageB.value);
            sentences.push(`${pulsarA.PSRJ} is roughly ${ratio}× older than ${pulsarB.PSRJ}.`)
        }
        else
        {
            const ratio = formatRatio(ageB.value/ageA.value);
            sentences.push(`${pulsarB.PSRJ} is roughly ${ratio}× older than ${pulsarA.PSRJ}.`)
        }
    }
    else
    {
        sentences.push("Age comparison unavailable for one or both pulsars.")
    }

    if(fieldA.status === 'present' && fieldB.status === 'present')
    {
        if(fieldA.value > fieldB.value)
        {
            const ratio = formatRatio(fieldA.value/fieldB.value);
            sentences.push(`${pulsarA.PSRJ} has a magnetic field about ${ratio}× stronger than ${pulsarB.PSRJ}.`)
        }
        else
        {
            const ratio = formatRatio(fieldB.value/fieldA.value);
            sentences.push(`${pulsarB.PSRJ} has a magnetic field about ${ratio}× stronger than ${pulsarA.PSRJ}.`)
        }
    }
    else
    {
        sentences.push("Magnetic field comparison unavailable for one or both pulsars.")
    }

    return sentences;
}

