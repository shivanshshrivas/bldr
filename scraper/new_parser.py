import re
import json
from collections import defaultdict

def parse_courses_nested(text):
    """
    Parses the course text, creating a nested structure for labs under lectures,
    and excludes prerequisite information.
    """
    all_courses_data = []
    # Split into individual course blocks using a more robust regex
    course_blocks = re.split(r'\s*^-* Class starts here -*$\s*', text, flags=re.MULTILINE)

    # Regex patterns (mostly same as before, removed prerequisite patterns)
    code_pattern = re.compile(r'^\s*([A-Z]+)\s+(\d+[A-Z]*)\s*$')
    title_pattern = re.compile(r'^\s*(.*?)\s+\(\s*(\d+)\s*\)\s+.*$')
    section_pattern = re.compile(r'^\s*([A-Z]{3})\s+(.*?)\s+(\d+)\s+(\d+)(?:\s*\(Save\))?\s+(.*?)\s*$')
    notes_pattern = re.compile(r'^\s*Notes\s+(.*?)\s+([A-Z\d\s\.\-]+)\s*-\s*([A-Z]+)\s*$') # Adjusted location part
    notes_appt_pattern = re.compile(r'^\s*Notes\s+APPT\s*$')
    location_appt_pattern = re.compile(r'^\s*([A-Z\d\s\.\-]+)\s+APPT\s*-\s*([A-Z]+)\s*$') # Adjusted location part
    section_header = "Type Time/Place and Instructor Credit Hours Class # Seats Available"
    end_marker = "---------------------------- Class ends here ----------------------------"

    for block in course_blocks:
        block = block.strip()
        if not block or end_marker not in block:
            continue

        lines = block.split('\n')
        course_data = {}
        flat_sections = [] # Temporarily store all sections flat
        current_section_details = None # To hold parts from the main section line
        line_iter = iter(lines)
        
        try:
            # --- Parse Header ---
            line = next(line_iter).strip()
            while not line: # Skip blank lines
                 line = next(line_iter).strip()
            code_match = code_pattern.match(line)
            if not code_match: continue
            course_data['class_code'] = f"{code_match.group(1)} {code_match.group(2)}"

            line = next(line_iter).strip()
            title_match = title_pattern.match(line)
            if not title_match: continue
            course_data['class_name'] = title_match.group(1).strip()
            course_data['credit_hours'] = int(title_match.group(2))

            # --- Skip Description, Find Sections ---
            while True:
                line = next(line_iter)
                if section_header in line:
                    break
                if end_marker in line: # Header not found before end
                    raise StopIteration # Stop processing this block

            # --- Parse Sections (into flat list) ---
            while True:
                line = next(line_iter).strip()
                if not line or end_marker in line:
                    # Before breaking, check if there's a partially parsed section waiting for notes
                    if current_section_details:
                        # If notes were expected but not found, add section with null time/location or skip?
                        # Let's add it with nulls for now, or you could choose to discard.
                        full_section = {**current_section_details, 'time': None, 'location': None}
                        flat_sections.append(full_section)
                        current_section_details = None
                    break # End of block

                # Check for Section Detail line
                sec_match = section_pattern.match(line)
                if sec_match:
                     # If notes were expected for the *previous* section but didn't come, handle it
                    if current_section_details:
                         full_section = {**current_section_details, 'time': None, 'location': None}
                         flat_sections.append(full_section)
                         
                    seats_str = sec_match.group(5).strip()
                    try:
                        seats = 0 if seats_str.upper() == 'FULL' else int(seats_str)
                    except ValueError:
                        seats = seats_str # Keep original if not 'Full' or number

                    instructor_name = sec_match.group(2).strip() or None

                    current_section_details = {
                        "type": sec_match.group(1),
                        "instructor": instructor_name,
                        "class_number": int(sec_match.group(4)),
                        "seats_available": seats
                        # Section credits (sec_match.group(3)) are ignored per requirement
                    }
                    continue # Move to next line (expecting Notes)

                # Check for Notes line (only if we just parsed a section header)
                if current_section_details:
                    notes_match = notes_pattern.match(line)
                    if notes_match:
                        time_str = notes_match.group(1).strip()
                        location_str = f"{notes_match.group(2).strip()} - {notes_match.group(3).strip()}"
                        full_section = {**current_section_details, 'time': time_str, 'location': location_str}
                        flat_sections.append(full_section)
                        current_section_details = None # Reset
                        continue

                    notes_appt_match = notes_appt_pattern.match(line)
                    if notes_appt_match:
                        location_str = "APPT - Location Unknown" # Default
                        # Look ahead one line for APPT location
                        try:
                            next_line = next(line_iter).strip()
                            loc_appt_match = location_appt_pattern.match(next_line)
                            if loc_appt_match:
                                location_str = f"{loc_appt_match.group(1).strip()} APPT - {loc_appt_match.group(2).strip()}"
                            # If next_line wasn't APPT location, we consumed it. This might need more robust lookahead/backup.
                        except StopIteration:
                            pass # Reached end, use default location_str

                        full_section = {**current_section_details, 'time': "APPT", 'location': location_str}
                        flat_sections.append(full_section)
                        current_section_details = None # Reset
                        continue
                        
                    # If line follows a section line but isn't notes, assume notes were missing
                    full_section = {**current_section_details, 'time': None, 'location': None}
                    flat_sections.append(full_section)
                    current_section_details = None
                    # Reprocess the current line in the next iteration (if needed - complicated)
                    # For simplicity, we'll just assume notes were missing and move on.


        except StopIteration:
             # End of lines for this block. Add any pending section.
            if current_section_details:
                full_section = {**current_section_details, 'time': None, 'location': None}
                flat_sections.append(full_section)
            pass # Continue to grouping

        # --- Group Sections (Nest Labs under Lectures) ---
        grouped_sections = []
        last_lecture = None
        for section in flat_sections:
            # Fields required by user: instructor, seats_available, time. Also keep location.
            section_output = {
                "instructor": section.get("instructor"),
                "seats_available": section.get("seats_available"),
                "time": section.get("time"),
                "location": section.get("location"),
                 # Keep type/class_number for structure/debugging, remove if strictly not needed
                "type": section.get("type"), 
                "class_number": section.get("class_number") 
            }
            
            if section['type'] == 'LEC':
                section_output['labs'] = [] # Add labs key to lectures
                grouped_sections.append(section_output)
                last_lecture = section_output # Reference the dict in grouped_sections
            elif section['type'] == 'LBN' and last_lecture:
                # Don't add 'labs' key to labs themselves
                last_lecture['labs'].append(section_output)
            else: # Standalone LBN or other type
                grouped_sections.append(section_output)
                last_lecture = None # Reset if non-LEC/LBN encountered

        if grouped_sections: # Only add course if sections were found
            course_data['sections'] = grouped_sections
            all_courses_data.append(course_data)

    return all_courses_data

# --- Main Execution ---
input_filename = 'courses.txt'
output_filename = 'courses_nested.json'

try:
    # It's good practice to specify encoding, especially if data might have special chars
    with open(input_filename, 'r', encoding='utf-8') as f:
        raw_text = f.read()

    parsed_data = parse_courses_nested(raw_text)

    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(parsed_data, f, indent=2) # indent=2 for pretty printing

    print(f"Successfully parsed data and saved to {output_filename}")

except FileNotFoundError:
    print(f"Error: Input file '{input_filename}' not found.")
except Exception as e:
    print(f"An error occurred during parsing or writing: {e}")
    import traceback
    traceback.print_exc() # Print detailed traceback for debugging