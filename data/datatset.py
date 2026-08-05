query = QueryATNF(params=["PSRJ", "P0", "P1", "DIST", "TYPE"])
df = query.pandas

conditions = [df["TYPE"] == "AXP", df["P0"] <= 0.03]
choices = ["Magnetars", "Millisecond Pulsar"]

df["classification"] = np.select(conditions, choices, default="Ordinary Pulsar")
print(df["classification"].value_counts())

display_df = df.groupby('classificsation').sample(n = 10)