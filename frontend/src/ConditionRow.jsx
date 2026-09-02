import { filterableFields, operators } from './util/fieldMeta.js';

function ConditionRow({ condition, onChange, onRemove})
{
    const fieldMeta = filterableFields.find(f => f.key === condition.field)
    const availableOperators = operators[fieldMeta.type];

    return(
    <div className="condition-row">
      <select
        value={condition.field}
        onChange={(e) => {
          const newField = e.target.value;
          const newFieldMeta = filterableFields.find(f => f.key === newField);
          const newOperator = operators[newFieldMeta.type][0];
          onChange({ ...condition, field: newField , operator: newOperator, value: ""});
        }}
      >
        {filterableFields.map(f => (
          <option key={f.key} value={f.key}>{f.label}</option>
        ))}
      </select>

      <select
        value={condition.operator}
        onChange={(e) => onChange({ ...condition, operator: e.target.value })}
      >
        {availableOperators.map(op => (
          <option key={op} value={op}>{op}</option>
        ))}
      </select>

      {fieldMeta.type === "categorical" ? (
      <select
        value={condition.value}
        onChange={(e) => onChange({ ...condition, value: e.target.value })}
      >
        <option value="">Select...</option>
        {fieldMeta.options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    ) : (
      <input
        type="text"
        value={condition.value}
        onChange={(e) => onChange({ ...condition, value: e.target.value })}
      />
    )}

      <button onClick={onRemove}>Remove</button>
    </div>
    )
}

export default ConditionRow