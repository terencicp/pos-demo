"""
Creates CSV and JSON subsets of 'MUNICIPIOS.csv', containing spanish municipalities, obtained from:
https://centrodedescargas.cnig.es/CentroDescargas/nomenclator-geografico-municipios-entidades-poblacion

This script performs the following actions:
1. Reads specific columns from the input CSV (delimiter ';').
2. Cleans the 'PROVINCIA' column by keeping only the text before '/'.
3. Splits rows where 'NOMBRE_ACTUAL' contains two names separated by '/',
   keeping the same 'COD_INE' for both resulting rows.
4. Capitalizes the first letter of the 'NOMBRE_ACTUAL' (municipality name).
5. Identifies municipalities with the same name across different provinces and disambiguates them
   by appending the province name in parentheses, e.g., "Municipio (Provincia)".
6. Renames the final columns to 'cod_ine', 'provincia', 'municipio', 'longitud', 'latitud'.
7. Saves the full processed data (all 5 columns) to 'cities.csv'.
8. Saves a subset of the processed data (only 'municipio', 'latitud', 'longitud')
   to 'cities.json' in a compact format (no extra whitespace).
"""

import pandas as pd
import json
import os
import numpy as np # Import numpy for handling potential NaN during capitalization

# --- Configuration ---
INPUT_CSV_FILENAME = 'municipios.csv'
OUTPUT_BASENAME = 'cities'
OUTPUT_CSV_FILENAME = f'{OUTPUT_BASENAME}.csv'
OUTPUT_JSON_FILENAME = f'{OUTPUT_BASENAME}.json'

# Original column names to select and use during processing
COLS_TO_KEEP = [
    'COD_INE',
    'PROVINCIA',
    'NOMBRE_ACTUAL',
    'LONGITUD_ETRS89',
    'LATITUD_ETRS89',
]

# Original column names in the desired order for final selection (before rename)
FINAL_COLS_ORDER_ORIGINAL = [
    'COD_INE',
    'PROVINCIA',
    'NOMBRE_ACTUAL',
    'LONGITUD_ETRS89',
    'LATITUD_ETRS89',
]

# Define the final column name mapping for renaming
COLUMN_RENAME_MAP = {
    'COD_INE': 'cod_ine',
    'PROVINCIA': 'provincia',
    'NOMBRE_ACTUAL': 'municipio',
    'LONGITUD_ETRS89': 'lon',
    'LATITUD_ETRS89': 'lat'
}

# Define the columns specifically required for the JSON output (using final names)
JSON_ONLY_COLUMNS = ['municipio', 'lat', 'lon']


# --- Functions ---

def clean_provincia(provincia_name):
    """Keeps only the part before '/' if present, strips whitespace."""
    if isinstance(provincia_name, str) and '/' in provincia_name:
        return provincia_name.split('/')[0].strip()
    elif isinstance(provincia_name, str):
        return provincia_name.strip()
    return provincia_name

def create_name_code_pairs(row):
    """
    Splits NOMBRE_ACTUAL if it contains '/'. COD_INE remains the same.
    Returns a list of tuples: [(name1, cod), (name2, cod)] or [(name, cod)].
    """
    original_name = row['NOMBRE_ACTUAL_ORIG']
    cod_ine = str(row['COD_INE']) # Use original COD_INE

    if isinstance(original_name, str) and '/' in original_name:
        parts = [name.strip() for name in original_name.split('/')]
        if len(parts) == 2:
             if parts[0] and parts[1]:
                return [(parts[0], cod_ine), (parts[1], cod_ine)]
             elif parts[0]:
                 print(f"Warning: Empty name after '/' for COD_INE {cod_ine}. Keeping first part: '{parts[0]}'")
                 return [(parts[0], cod_ine)]
             elif parts[1]:
                  print(f"Warning: Empty name before '/' for COD_INE {cod_ine}. Keeping second part: '{parts[1]}'")
                  return [(parts[1], cod_ine)]
             else:
                 print(f"Warning: Both names empty after splitting '/' for COD_INE {cod_ine}. Keeping original: '{original_name}'")
                 return [(original_name, cod_ine)]
        else:
            print(f"Warning: Unexpected format in NOMBRE_ACTUAL '{original_name}' for COD_INE {cod_ine}. Not splitting.")
            return [(original_name, cod_ine)]
    elif isinstance(original_name, str):
         return [(original_name.strip(), cod_ine)]
    else:
         return [(original_name, cod_ine)]


def capitalize_first(name):
    """Capitalizes the first letter of a string, handles NaN."""
    if isinstance(name, str) and name:
        parts = name.split("'")
        if len(parts) == 2 and parts[0].lower() in ['d', 'l']:
             return parts[0] + "'" + parts[1][0].upper() + parts[1][1:]
        return name[0].upper() + name[1:]
    return name

def modify_duplicate_nombre(row, duplicate_names_set):
    """Appends cleaned provincia in parentheses if NOMBRE_ACTUAL is a duplicate."""
    nombre = row['NOMBRE_ACTUAL'] # Use final capitalized name
    provincia_clean = row['PROVINCIA'] # Use cleaned provincia
    if pd.notna(nombre) and nombre in duplicate_names_set:
        if pd.notna(provincia_clean):
             return f"{row['NOMBRE_ACTUAL']} ({row['PROVINCIA']})"
        else:
            return nombre
    else:
        return nombre


# --- Main Script ---
if __name__ == "__main__":
    print(f"Starting processing of '{INPUT_CSV_FILENAME}'...")
    # Setting the current date based on your specified time
    current_date_str = "2025-05-02" # As per context
    print(f"Processing date: {current_date_str}")


    if not os.path.exists(INPUT_CSV_FILENAME):
        print(f"Error: Input file '{INPUT_CSV_FILENAME}' not found.")
        exit()

    try:
        # 1. Read the CSV file
        try:
            df_raw = pd.read_csv(INPUT_CSV_FILENAME, delimiter=';',
                                 dtype={'COD_INE': str}, usecols=COLS_TO_KEEP)
        except UnicodeDecodeError:
            print("UTF-8 decoding failed, trying 'latin-1' encoding...")
            df_raw = pd.read_csv(INPUT_CSV_FILENAME, delimiter=';',
                                 encoding='latin-1', dtype={'COD_INE': str},
                                 usecols=COLS_TO_KEEP)
        except ValueError as e:
             print(f"Error reading CSV columns: {e}")
             print(f"Please ensure '{INPUT_CSV_FILENAME}' contains: {', '.join(COLS_TO_KEEP)}")
             exit()
        except Exception as e:
             print(f"Error reading CSV: {e}")
             exit()

        df = df_raw.copy()
        print(f"Read {len(df)} initial rows from '{INPUT_CSV_FILENAME}'.")

        # Keep original NOMBRE_ACTUAL for splitting logic
        df['NOMBRE_ACTUAL_ORIG'] = df['NOMBRE_ACTUAL']

        # 2. Clean the 'PROVINCIA' column
        df['PROVINCIA'] = df['PROVINCIA'].apply(clean_provincia)
        print("Cleaned 'PROVINCIA' column.")

        # 3. Create Name/Code pairs for potential splitting (COD_INE unchanged)
        df['NAME_COD_PAIRS'] = df.apply(create_name_code_pairs, axis=1)
        print("Generated name/code pairs for splitting (COD_INE unchanged).")

        # 4. Explode rows based on NAME_COD_PAIRS
        if 'NAME_COD_PAIRS' in df.columns:
            df = df.explode('NAME_COD_PAIRS', ignore_index=True)
            print(f"Exploded rows. DataFrame now has {len(df)} rows.")

            # 5. Extract final NOMBRE_ACTUAL and COD_INE from pairs
            try:
                df['NOMBRE_ACTUAL'] = df['NAME_COD_PAIRS'].apply(lambda x: x[0] if isinstance(x, (list, tuple)) and len(x)>0 else None)
                df['COD_INE'] = df['NAME_COD_PAIRS'].apply(lambda x: x[1] if isinstance(x, (list, tuple)) and len(x)>1 else None)
            except Exception as e:
                print(f"Error extracting name/code from pairs: {e}.")
                exit()

            df = df.drop(columns=['NAME_COD_PAIRS', 'NOMBRE_ACTUAL_ORIG'])
            print("Extracted final NOMBRE_ACTUAL and COD_INE.")
        else:
             print("Error: 'NAME_COD_PAIRS' column not created successfully.")
             if 'NOMBRE_ACTUAL_ORIG' in df.columns:
                  df = df.drop(columns=['NOMBRE_ACTUAL_ORIG'])

        # 6. Capitalize the first letter of NOMBRE_ACTUAL
        df['NOMBRE_ACTUAL'] = df['NOMBRE_ACTUAL'].apply(capitalize_first)
        print("Capitalized first letter of 'NOMBRE_ACTUAL'.")

        # 7. Identify duplicate 'NOMBRE_ACTUAL' values (post-split/capitalization)
        name_counts = df.loc[df['NOMBRE_ACTUAL'].notna(), 'NOMBRE_ACTUAL'].value_counts()
        duplicate_names = set(name_counts[name_counts > 1].index)
        print(f"Found {len(duplicate_names)} unique names (post-processing) that appear more than once.")

        # 8. Modify 'NOMBRE_ACTUAL' for duplicates
        df['NOMBRE_ACTUAL'] = df.apply(lambda row: modify_duplicate_nombre(row, duplicate_names), axis=1)
        print("Disambiguated duplicate 'NOMBRE_ACTUAL' values.")

        # --- Final Output Generation ---
        # 9. Select final columns using original names and order
        missing_cols = [col for col in FINAL_COLS_ORDER_ORIGINAL if col not in df.columns]
        if missing_cols:
            print(f"Error: Final columns missing before rename: {', '.join(missing_cols)}")
            exit()
        df_intermediate = df[FINAL_COLS_ORDER_ORIGINAL].copy()
        print(f"Selected columns before final rename: {', '.join(FINAL_COLS_ORDER_ORIGINAL)}")

        # 10. Rename columns to final desired names
        df_final_all_cols = df_intermediate.rename(columns=COLUMN_RENAME_MAP)
        final_columns_list = list(df_final_all_cols.columns)
        print(f"Renamed columns to: {', '.join(final_columns_list)}")

        # 10.5 Round latitude and longitude to 3 decimal places
        print("Rounding 'lon' and 'lat' columns to 3 decimal places...")
        for col in ['lon', 'lat']:
            # Ensure columns are numeric before rounding.
            # Handles potential string values or commas used as decimal separators.
            if df_final_all_cols[col].dtype == 'object':
                 df_final_all_cols[col] = df_final_all_cols[col].str.replace(',', '.', regex=False)
            df_final_all_cols[col] = pd.to_numeric(df_final_all_cols[col], errors='coerce') # errors='coerce' turns invalid values into NaN
            # Perform the rounding
            df_final_all_cols[col] = df_final_all_cols[col].round(3)
        print("Finished rounding coordinates.")

        # 11. Save the full result as CSV (using df_final_all_cols)
        df_final_all_cols.to_csv(OUTPUT_CSV_FILENAME, index=False, sep=',', encoding='utf-8')
        print(f"Successfully saved full CSV subset to '{OUTPUT_CSV_FILENAME}'.")

        # --- Prepare and Save JSON ---
        # 12. Select ONLY the columns needed for JSON output from the fully processed DataFrame
        missing_json_cols = [col for col in JSON_ONLY_COLUMNS if col not in df_final_all_cols.columns]
        if missing_json_cols:
             print(f"Error: Columns required for JSON missing after processing: {', '.join(missing_json_cols)}")
             exit() # Exit if essential JSON columns are somehow missing
        else:
             # Create the specific subset for JSON
             df_json_subset = df_final_all_cols[JSON_ONLY_COLUMNS].copy()
             print(f"Selected columns specifically for JSON: {', '.join(JSON_ONLY_COLUMNS)}")

             # 13. Convert JSON subset to list of dictionaries and save compactly
             data_json = df_json_subset.to_dict(orient='records')
             with open(OUTPUT_JSON_FILENAME, 'w', encoding='utf-8') as f:
                 # Use separators=(',', ':') for most compact output
                 json.dump(data_json, f, ensure_ascii=False, separators=(',', ':'))
             print(f"Successfully saved compact JSON subset ({', '.join(JSON_ONLY_COLUMNS)}) to '{OUTPUT_JSON_FILENAME}'.")

    except FileNotFoundError:
        print(f"Error: Input file '{INPUT_CSV_FILENAME}' not found.")
    except KeyError as e:
        print(f"Error processing columns. Likely missing column during selection/processing.")
        print(f"Column causing issue: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        # import traceback # Uncomment for detailed trace
        # print(traceback.format_exc()) # Uncomment for detailed trace

    print("Script finished.")