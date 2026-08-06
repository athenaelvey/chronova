import pandas as pd
import numpy as np
from psrqpy import QueryATNF

query = QueryATNF(params=["PSRJ", "P0", "P1", "DIST", "TYPE"])
df = query.pandas

conditions = [pd.isna(df["P1"]), df["TYPE"] == "AXP", df["P0"] <= 0.03]
choices = ["Insufficient Data", "Magnetars", "Millisecond Pulsar"]

df["classification"] = np.select(conditions, choices, default="Ordinary Pulsar")

filtered_df = df[df["classification"] != "Insufficient Data"]

display_df = filtered_df.groupby('classification').sample(n=10)
print(display_df["classification"].value_counts())

display_df.to_json("../frontend/src/displaydata/pulsars.json", orient="records", indent=2, double_precision=15)
