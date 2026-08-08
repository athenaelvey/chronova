export function formatAge(curr){
    if(curr.status === 'present')
        return (curr.value * 3.169e-14) + ' Myr';
    else if(curr.status === 'missing')
        return 'N/A';
    else if(curr.status === 'contaminated')
        return 'N/A (contaminated)';
}

export function formatBField(curr){
    if(curr.status === 'present')
        return curr.value.toExponential(2) + ' G';
    else if(curr.status === 'missing')
        return 'N/A';
    else if(curr.status === 'contaminated')
        return 'N/A (contaminated)';
}