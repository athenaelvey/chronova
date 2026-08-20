export const filterableFields = [
    {key: "PSRJ", label: "Name", type: "string"},
    {key: "TYPE", label: "Catalog Type", type: "string"},
    {key: "classification", label: "Classification", type: "categorical",
        options:["Magnetars", "Millisecond Pulsars", "Ordinary Pulsars"]},
    {key: "P0", label: "Period (s)", type: "numeric"},
    {key: "P1", label: "Period Derivative", type: "numeric"},
    {key: "DIST", label: "Distance (kpc)", type: "numeric"},
]

export const operators = {
    numeric: [">", "<", "=", ">=", "<="],
    string: ["contains", "="],
    categorical: ["="],
}