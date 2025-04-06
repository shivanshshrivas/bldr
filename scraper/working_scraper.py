import json
from selenium import webdriver
from selenium.webdriver.common.by import By  # Ensure this import is included
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import re

start_time = time.time()

key = "EECS168 EECS 268"  # Replace with your search keyword

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
    with open('classes_info.txt', mode='w', encoding='utf-8') as file:
        try:
            # Locate the input field by its ID ('classesSearchText') and fill it with 'EECS'
            search_input = driver.find_element(By.ID, "classesSearchText")
            search_input.clear()  # Clear any existing text in the input field
            search_input.send_keys(key)  # Fill the input field with 'EECS'
            search_input.send_keys(Keys.RETURN)  # Press Enter to trigger search (if applicable)

            # Locate the button with the specific class and click it to reveal the div
            button = WebDriverWait(driver, 5).until(
                EC.element_to_be_clickable((By.CLASS_NAME, "btn.btn-primary.classSearchButton.classes_searchBarItem"))
            )
            button.click()

            # Wait for the <div> with id='classes_ajaxDiv' to become visible
            div = WebDriverWait(driver, 2).until(
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

        except Exception as e:
            print(f"Error occurred: {e}")

    # Close the browser after scraping
    driver.quit()

# Call the function to execute the scraping and save data to a text file
extract_div_content()

print(time.time() - start_time)
