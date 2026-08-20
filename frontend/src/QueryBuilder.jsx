import ConditionRow from './ConditionRow';
import { filterableFields } from './util/fieldMeta';
import { operators } from './util/fieldMeta';
import './QueryBuilder.css';

function blankCondition(){
    const firstField = filterableFields[0];
    const firstOperator = operators[firstField.type][0];
    return { field: firstField.key, operator: firstOperator, value: ""};
}
function QueryBuilder({ conditions, combinator, setConditions, setCombinator})
{
    return(
        <div className ="query-builder">
            <div className="conditions-list">
                {conditions.map((condition, index) => (
                    <ConditionRow
                        key = {index}
                        condition = {condition}
                        onChange={(updatedCondition) => setConditions(
                            conditions.map((c,i) => i === index ? updatedCondition : c)
                        )}
                        onRemove={() => setConditions(conditions.filter((c,i) => i !== index))}
                    ></ConditionRow>
                ))
                }       
            </div>

            <button onClick ={() => setConditions([...conditions, blankCondition()])}>
                Add condition
            </button>

            <div className = "combinator-toggle">
                <label>
                    <input
                        type="radio"
                        checked={combinator === "AND"}
                        onChange={() => setCombinator("AND")}
                    />
                    AND
                </label>
                <label>
                    <input
                        type="radio"
                        checked={combinator === "OR"}
                        onChange={() => setCombinator("OR")}
                    />
                    OR
                </label>
            </div>
        </div>
    )
}

export default QueryBuilder;