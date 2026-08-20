
export function evaluateCondition(pulsar, condition)
{
    const comparisons = {
        ">": (a,b) => a > b,
        "<": (a,b) => a < b,
        "=": (a,b) => a === b,
        ">=": (a,b) => a >= b,
        "<=": (a,b) => a <= b,
        "contains": (a,b) => (a.toLowerCase()).includes(b.toLowerCase())
    }

    const fieldValue = pulsar[condition.field];

    if(fieldValue == null)
    {
        return false;
    }
    const compareField = comparisons[condition.operator];
    return compareField(fieldValue, condition.value);
}

export function evaluatePulsar(pulsar, conditions, combinator)
{
    const results = conditions.map(condition => evaluateCondition(pulsar, condition));
    let filteredResults;

    if(combinator == "AND")
    {
        filteredResults = results.every(x => x);
    }
    else
    {
        filteredResults = results.some(x => x);
    }

    return filteredResults;
}