
import pandas as pd

# Load the CSV file into a DataFrame
symptoms_df = pd.read_csv('Recommendation\symtoms_df.csv')

# Extract all the symptom columns (Symptom_1 to Symptom_4)
symptom_columns = ['Symptom_1', 'Symptom_2', 'Symptom_3', 'Symptom_4']

# Combine all symptom columns into a single list
all_symptoms = pd.concat([symptoms_df[col] for col in symptom_columns])

# Remove duplicates and NaN values, then convert it to a list
unique_symptoms = all_symptoms.dropna().unique().tolist()

# Print the unique symptoms
for symptom in unique_symptoms:
    print(symptom)
