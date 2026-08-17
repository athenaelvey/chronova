function getSpinDuration(p0, p0Min, p0Max)
{
    let normalized;

    if(!(p0Max === p0Min))
    {
        normalized = (Math.log(p0) - Math.log(p0Min)) / (Math.log(p0Max) - Math.log(p0Min));
    }
    else
    {
        normalized = 0.5;
    }

    const minDuration = 0.3;
    const maxDuration = 4;
    const duration;

    
    duration = minDuration + normalized * (maxDuration - minDuration);

    return duration;
}