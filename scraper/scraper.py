import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import csv
import time

# Function to extract and print course name from <h3> inside <td> within <tr>
def extract_course_names():
    # Set up Firefox options for headless mode (no GUI)
    class_to_take = "EECS"  # Example class to search for
    firefox_options = Options()
    firefox_options.add_argument('--headless')  # Run in headless mode

    # Initialize the Firefox WebDriver (it will automatically use geckodriver from PATH)
    driver = webdriver.Firefox(options=firefox_options)

    # Open the target URL (KU Classes)
    url = 'https://classes.ku.edu/'  # Replace with the target URL
    driver.get(url)

    # Wait for the page to load completely
    time.sleep(3)  # Optionally, use WebDriverWait for more control

    try:
        # Locate the input field by its ID ('classesSearchText') and fill it with 'EECS'
        search_input = driver.find_element(By.ID, "classesSearchText")
        search_input.clear()  # Clear any existing text in the input field
        search_input.send_keys(class_to_take)  # Fill the input field with 'EECS'
        search_input.send_keys(Keys.RETURN)  # Press Enter to trigger search (if applicable)

        # Locate the button with the specific class and click it to reveal the div
        button = WebDriverWait(driver, 2).until(
            EC.element_to_be_clickable((By.CLASS_NAME, "btn.btn-primary.classSearchButton.classes_searchBarItem"))
        )
        button.click()

        # Wait for the <div> with id='classes_ajaxDiv' to become visible
        div = WebDriverWait(driver, 5).until(
            EC.visibility_of_element_located((By.ID, 'classes_ajaxDiv'))
        )

        # Locate the table inside the div
        table = div.find_element(By.TAG_NAME, 'table')

        # Locate the tbody inside the table
        tbody = table.find_element(By.TAG_NAME, 'tbody')

        # Find all rows (<tr>) inside the tbody
        rows = tbody.find_elements(By.TAG_NAME, 'tr')
        data= []
        # Loop through each row and find the <h3> inside the <td> of each row
        for row in rows:
            try:
                td = row.find_element(By.TAG_NAME, 'td')  # Find <td> within each row
                
                    # Find <h3> inside the <td> and extract its text (course name)
                if  td.find_element(By.TAG_NAME, 'h3'):
                    h3 = td.find_element(By.TAG_NAME, 'h3')
                    course_name = h3.text.strip()  # Extract the course name from <h3>
                    
                    # # Extract the rest of the text in <td>, excluding <h3> content
                    # td_text = td.text.strip()
                    # additional_text = td_text.replace(course_name, '').strip()

                    # # Use regex to capture the part after the '-' and before '('
                    # match = re.search(r"-(.*?)\s?\(", additional_text)
                    # if match:
                    #     name = match.group(1).strip()
                    # else:
                    #     name = "Description not found"

                    # # Print the course name and the cleaned-up course description
                    
                    # print(f"Course Description: {name}")
                    # print("---")  # Separator for clarity
                if len(rows) > 1 and rows.index(row) == 1:  # second <tr> will contain the description
                    description_td = row.find_element(By.TAG_NAME, 'td')
                    description = description_td.text.strip()
                    print(f"Course Description: {description}")

                
            except Exception as e:
                continue  # Skip rows that don't contain an <h3> tag

    except Exception as e:
        print(f"Error occurred: {e}")
    # data.append({"number": course_name,
    #                              "name": name,
    #                              "description": description})
    
    # with open('EECS_388_Fall_2025.csv', mode='w', newline='') as file:
    #         fieldnames = ['number', 'name', 'description']
    #         writer = csv.DictWriter(file, fieldnames=fieldnames)
            
    #         # Write header
    #         writer.writeheader()
            
    #         # Write course data rows
    #         for row in data:
    #             writer.writerow(row)
        
    # print("Data has been saved to EECS_388_Fall_2025.csv")
    # Close the browser after scraping
    driver.quit()

# Call the function to execute the scraping
extract_course_names()
