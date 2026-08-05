import pandas as pd

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
type_counts.to_csv("type_breakdown.csv")

print("Missing P0:", df["P0"].isna().sum())
print("Missing P1:", df["P1"].isna().sum())
print("Missing both P0 and P1:", df[["P0", "P1"]].isna().all(axis=1).sum())
print("Missing DIST:", df["DIST"].isna().sum())