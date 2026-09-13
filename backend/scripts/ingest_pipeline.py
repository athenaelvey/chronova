from datetime import datetime, timezone
from psrqpy import QueryATNF
from load_pulsars import upsert_pulsars
import pandas as pd

def fetch_raw_data():
    query = QueryATNF(params=["PSRJ", "P0", "P1", "DIST", "TYPE"])
    df = query.pandas
    return df

def validate_and_classify(df):

    valid_rows = []
    anomaly_log = []
    insufficient_data_count = 0

    for index, row in df.iterrows():

        if pd.isna(row['PSRJ']) or pd.isna(row['P0']):
            failed_fields = []
            if pd.isna(row['PSRJ']):
                failed_fields.append('PSRJ')
            if pd.isna(row['P0']):
                failed_fields.append('P0')

            anomaly_log.append({
                'PSRJ': row['PSRJ'] if not pd.isna(row['PSRJ']) else None,
                'failed_fields': failed_fields,
                'timestamp': datetime.now(timezone.utc).isoformat()
            })
        elif pd.isna(row['P1']):
            insufficient_data_count += 1
        else:
            if row['TYPE'] == 'AXP':
                classification = 'Magnetars'
            elif row['P0'] <= 0.03:
                classification = 'Millisecond Pulsars'
            else:
                classification = 'Ordinary Pulsars'

            clean_row = row.to_dict()
            clean_row['classification'] = classification
            valid_rows.append(clean_row)

    return valid_rows, anomaly_log, insufficient_data_count

def curate_sample(valid_rows, n_per_class=10):
    if not valid_rows:
        return pd.DataFrame()

    df = pd.DataFrame(valid_rows)

    sampled_groups = []
    for classification, group in df.groupby('classification'):
        sampled_groups.append(group.sample(n=min(n_per_class, len(group))))

    curated = pd.concat(sampled_groups).reset_index(drop=True)
    return curated

def run_pipeline():
    df = fetch_raw_data()
    valid_rows, anomaly_log, insufficient_data_count = validate_and_classify(df)
    curated_df = curate_sample(valid_rows, 10)
    pulsars_data = curated_df.to_dict(orient='records')
    upsert_pulsars(pulsars_data)
    print(f"Upserted {len(pulsars_data)} pulsars.")
    print(f"Anomalies discarded: {len(anomaly_log)}")
    print(f"Insufficient data (missing P1): {insufficient_data_count}")

if __name__ == "__main__":
    run_pipeline()