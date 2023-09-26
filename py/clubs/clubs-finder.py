import json
from docx import Document

# Load the .docx file
doc_path = "../../data/clubs_doc.docx"
doc = Document(doc_path)

# Initialize variables
clubs = []
current_club = {}

# Iterate through paragraphs and extract club information
for para in doc.paragraphs:
    text = para.text.strip()

    # Check for club name (assuming club name is a standalone paragraph)
    if text and all(c.isupper() or c.isspace() for c in text):
        # Save the previous club if exists
        if current_club:
            clubs.append(current_club)
            current_club = {}
        current_club['name'] = text
    elif text.startswith("Sponsor(s):"):
        current_club['sponsors'] = text.split(":", 1)[1].strip()
    elif text.startswith("Description:"):
        current_club['description'] = text.split(":", 1)[1].strip()
    elif text.startswith("Club Meeting Info:"):
        current_club['meeting_info'] = text.split(":", 1)[1].strip()

# Add the last club
if current_club:
    clubs.append(current_club)

# Write to JSON file
with open('../../data/clubs.json', 'w') as f:
    json.dump(clubs, f, indent=4)

print("Clubs have been successfully written to clubs.json")
