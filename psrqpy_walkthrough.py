import pandas as pd
import numpy as np

from psrqpy import QueryATNF

# Query the live ATNF Pulsar Catalog for key parameters
query = QueryATNF(params=["PSRJ", "P0", "P1", "DIST", "TYPE"])

# Convert straight to a pandas DataFrame
df = query.pandas

print(df.shape)        # (num_pulsars, num_columns)
print(df.head(10))

print("\n--- TYPE breakdown ---")
type_counts = df["TYPE"].value_counts(dropna=False)
print(type_counts)

print("Missing P0:", df["P0"].isna().sum())
print("Missing P1:", df["P1"].isna().sum())
print("Missing both P0 and P1:", df[["P0", "P1"]].isna().all(axis=1).sum())
print("Missing DIST:", df["DIST"].isna().sum())

conditions = [pd.isna(df["P1"]), df["TYPE"] == "AXP", df["P0"] <= 0.03]
choices = ["Insufficient Data", "Magnetars", "Millisecond Pulsar"]

df["classification"] = np.select(conditions, choices, default="Ordinary Pulsar")
print(df["classification"].value_counts())