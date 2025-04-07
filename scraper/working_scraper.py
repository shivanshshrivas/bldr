import json

from selenium import webdriver

from selenium.webdriver.common.by import By

from selenium.webdriver.common.keys import Keys

from selenium.webdriver.chrome.options import Options

from selenium.webdriver.support.ui import WebDriverWait

from selenium.webdriver.support import expected_conditions as EC

from selenium.common.exceptions import NoAlertPresentException, NoSuchElementException, TimeoutException

import time
from typing import List, Dict, Union

import re


start_time = time.time()


key = "EECS"  # The key to search for in the input field (e.g., "EECS", "CS", etc.


# Function to extract content from the <div> with id='classes_ajaxDiv' and save to text file

def extract_div_content():

    # Set up Chrome options for headless mode (no GUI)

    chrome_options = Options()

    chrome_options.add_argument('--headless')  # Run in headless mode


    # Initialize the Chrome WebDriver (make sure chromedriver is in PATH)

    driver = webdriver.Chrome(options=chrome_options)


    # Open the target URL (KU Classes)

    url = 'https://classes.ku.edu/'  # Replace with the target URL

    driver.get(url)


    # Wait for the page to load completely

    with open('classes.txt', mode='a', encoding='utf-8') as file:

        try:

            # Locate the input field by its ID ('classesSearchText') and fill it with 'EECS'

            search_input = driver.find_element(By.ID, "classesSearchText")

            # Clear any existing text in the input field

            search_input.send_keys(key)  # Fill the input field with the key

            search_input.send_keys(Keys.RETURN)  # Press Enter to trigger search (if applicable)


            # Conditional wait times

            button_wait_time = 2 if key == "" else 5

            div_wait_time = 40 if key == "" else 2


            # Locate the button with the specific class and click it to reveal the div

            button = WebDriverWait(driver, button_wait_time).until(

                EC.element_to_be_clickable((By.CLASS_NAME, "btn.btn-primary.classSearchButton.classes_searchBarItem"))

            )

            button.click()


            # Handle potential alert dialogs

            try:

                alert = driver.switch_to.alert

                alert.accept()  # Accept the alert

                print("Alert accepted.")


            except NoAlertPresentException:

                print("No alert present.")

                pass  # No alert, continue normally


            # Wait for the <div> with id='classes_ajaxDiv' to become visible

            div = WebDriverWait(driver, div_wait_time).until(

                EC.visibility_of_element_located((By.ID, 'classes_ajaxDiv'))

            )


            # Extract the text content of the div

            div_text = div.text.strip()  # This extracts only the text and removes any leading/trailing spaces


            # Split the text by new lines

            lines = div_text.split("\n")


            # Initialize a flag to check if we're at a new class

            last_class = None

            current_class_info = []


            # General regex to identify class names (3 or 4 capital letters followed by a space and 3 digits)

            course_name_pattern = r"^[A-Z]{3,4} \d{3}$"  # Matches patterns like "EECS 361", "AAAS 101", "MATH 202"


            # Loop through each line and gather the course information

            for line in lines:

                line = line.strip()  # Remove extra spaces


                # Check if the line matches the class name pattern

                if re.match(course_name_pattern, line):

                    # If we were previously at a class, write its information to the text file

                    if last_class:

                        # Write the current class data into the text file

                        file.write("\n---------------------------- Class ends here ----------------------------\n")

                        file.write("\n")  # Add a newline before the next class


                    # Print "Class starts here" before the next class

                    file.write("Class starts here\n")


                    # Update the last class to the current one and add it to the info

                    last_class = line

                    current_class_info.append(last_class)

                    file.write(line + "\n")  # Write the current class name


                else:

                    # Append the remaining lines as needed for the current class's info

                    current_class_info.append(line)

                    file.write(line + "\n")  # Write the additional lines to the text file


            # After the loop, write the last class info to the text file

            if current_class_info:

                file.write("\n---------------------------- Class ends here ----------------------------\n")


        except (NoSuchElementException, TimeoutException) as e:

            print(f"Element not found or timeout: {e}")

        except Exception as e:

            print(f"An unexpected error occurred: {e}")


    # Close the browser after scraping

    driver.quit()
extract_div_content()



# Function to parse the class data from the text file and convert it to JSON format
# def parse_class_file(file_path: str) -> List[Dict]:
#     """Parse a class schedule text file into structured JSON data."""
    
#     with open(file_path, 'r') as f:
#         content = f.read()

#     classes = []
#     class_blocks = re.split(r'Class starts here\n', content)[1:]
    
#     for block in class_blocks:
#         block = block.split('---------------------------- Class ends here ----------------------------')[0].strip()
#         if not block:
#             continue
            
#         lines = [line.strip() for line in block.split('\n') if line.strip()]
        
#         # Parse class header
#         class_code = lines[0]
        
#         # Extract class name and credit hours
#         name_match = re.match(r'.*?-\s*(.*?)\s*\((\d+)\)', lines[1])
#         if not name_match:
#             continue
            
#         class_name = name_match.group(1)
#         credit_hours = int(name_match.group(2))
        
#         # Parse prerequisites and corequisites
#         prereqs = {"prerequisite": [], "corequisite": []}
#         for line in lines[2:]:
#             if 'Prerequisite:' in line:
#                 prereqs["prerequisite"] = re.findall(r'([A-Z]+\s\d+)', line)
#             if 'Corequisite:' in line:
#                 prereqs["corequisite"] = re.findall(r'([A-Z]+\s\d+)', line)
#             if line.startswith('Type '):
#                 break
        
#         # Parse sections
#         sections = []
#         i = next((i for i, line in enumerate(lines) 
#                  if line.startswith('Type Time/Place and Instructor')), len(lines))
        
#         while i + 1 < len(lines):
#             line = lines[i]
#             if line.startswith(('LEC', 'LBN')):
#                 section = parse_section_line(line, credit_hours)
                
#                 # Get time and location from next lines
#                 if i + 2 < len(lines):
#                     if 'Notes' in lines[i+1]:
#                         section['time'] = lines[i+1].replace('Notes', '').strip()
#                         section['location'] = lines[i+2].strip()
#                         i += 3
#                     else:
#                         i += 1
#                     sections.append(section)
#                 else:
#                     i += 1
#             else:
#                 i += 1
        
#         classes.append({
#             "class_code": class_code,
#             "class_name": class_name,
#             "credit_hours": credit_hours,
#             "prerequisite": prereqs,
#             "sections": sections
#         })
    
#     return classes

# def parse_section_line(line: str, default_credits: int) -> Dict[str, Union[str, int, None]]:
#     """Parse a single section line into a structured dictionary."""
#     parts = line.split()
#     section_type = parts[0]
    
#     # Initialize with defaults
#     section = {
#         "type": section_type,
#         "instructor": None,
#         "credit_hours": default_credits,
#         "class_number": 0,
#         "seats_available": 0
#     }
    
#     try:
#         if section_type == 'LEC':
#             # Find where the numbers start (credit hours)
#             num_start = next(i for i, p in enumerate(parts[1:], 1) if p.isdigit())
            
#             if num_start > 1:
#                 section["instructor"] = ' '.join(parts[1:num_start])
#                 section["credit_hours"] = int(parts[num_start])
#                 section["class_number"] = int(parts[num_start+1])
                
#                 # Find seats available (could be after "(Save)" or similar)
#                 seats_idx = next((i for i in range(num_start+2, len(parts)) 
#                                if parts[i].isdigit() and int(parts[i]) < 1000), 
#                                num_start+3)
#                 section["seats_available"] = int(parts[seats_idx])
        
#         elif section_type == 'LBN':
#             if len(parts) >= 5:
#                 section["credit_hours"] = int(parts[1])
#                 section["class_number"] = int(parts[2])
#                 section["seats_available"] = int(parts[4].replace('(Save)', ''))
    
#     except (ValueError, IndexError, StopIteration):
#         pass  # Keep defaults if parsing fails
    
#     return section

# def save_to_json(data: List[Dict], output_file: str) -> None:
#     """Save parsed data to JSON file."""
#     with open(output_file, 'w') as f:
#         json.dump(data, f, indent=2)

# if __name__ == "__main__":
#     try:
#         parsed_data = parse_class_file('classes.txt')
#         save_to_json(parsed_data, 'classes.json')
#         print("Successfully parsed and saved to classes.json")
#     except Exception as e:
#         print(f"Error: {str(e)}")