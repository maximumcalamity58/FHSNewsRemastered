from docx import Document
import json

# Load the .docx file
doc_path = "../../data/clubs_doc.docx"
doc = Document(doc_path)

# Initialize variables
clubs = []
current_club = {}
extraction_started = False  # Flag to indicate whether the extraction of club information has started

# Iterate through paragraphs and extract club information
for para in doc.paragraphs:
    text = para.text.strip()

    # Skip empty paragraphs
    if not text:
        continue

    # Check if the extraction of club information should start
    if "2000s FUN" in text:
        extraction_started = True

    # If extraction has not started, skip the paragraph
    if not extraction_started:
        continue

    # Check for club name (standalone paragraph, no colons, and shorter length)
    if ':' not in text and len(text) < 80:
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
