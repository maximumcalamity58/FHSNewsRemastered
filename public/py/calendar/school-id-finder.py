import os
import json
import re

# Define the path to the directory containing the school folders
data_dir = 'calendar-data'

# Get a list of all folder names in the data directory
folder_names = [name for name in os.listdir(data_dir) if os.path.isdir(os.path.join(data_dir, name))]

# Sort the folder names numerically based on the leading digits
folder_names.sort(key=lambda name: int(re.match(r'^\d+', name).group()))

# Define a dictionary to hold the mapping from folder names to school titles
school_titles = {}

# Iterate over each folder name and generate the corresponding school title
for folder_name in folder_names:
    # Remove any leading digits and hyphen from the folder name
    name_without_digits = re.sub(r'^\d+-', '', folder_name)

    # Split the string by hyphen, capitalize each part, and join with spaces
    title = ' '.join(part.capitalize() for part in name_without_digits.split('-'))

    # Add the mapping from folder name to title to the dictionary
    school_titles[folder_name] = title

# Write the mapping to a JSON file
output_file = 'school-ids.json'
with open(output_file, 'w') as f:
    json.dump(school_titles, f, indent=2)
