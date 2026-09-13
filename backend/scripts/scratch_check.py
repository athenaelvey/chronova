from psrqpy import QueryATNF

query = QueryATNF(params=['PSRJ', 'TYPE', 'P0', 'P1', 'DIST'])
df = query.pandas

print(df[['PSRJ', 'TYPE', 'P0', 'P1', 'DIST']].head(10))
print(df[['PSRJ', 'TYPE', 'P0', 'P1', 'DIST']].isna().sum())
print(df.dtypes)