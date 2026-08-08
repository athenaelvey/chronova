export function characteristicAge(P0, P1){
    const status = helper(P1);

    if(status !== 'ok')
        return { value: null, status };
    else 
        return {value:P0/(2*P1), status:'present'};
}

export function BField(P0, P1){
    const status = helper(P1);

    if(status !== 'ok')
        return { value: null, status };
    else 
        return {value:(Math.sqrt(P0*P1))*3.2e19, status:'present'};
}

function helper(P1){
    if (!P1) 
        return 'missing';
    if (P1 < 0) 
        return 'contaminated';
    return 'ok';
}

export function deathLinePdot(P0) {
    return 2.82e-17 * Math.pow(P0, 3);
}