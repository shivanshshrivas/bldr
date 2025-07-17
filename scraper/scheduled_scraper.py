from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
import time
import os

# Optional: Set your download directory
download_dir = "/path/to/save/excel"

options = webdriver.ChromeOptions()
prefs = {
    "download.default_directory": download_dir,
    "download.prompt_for_download": False,
    "directory_upgrade": True,
    "safebrowsing.enabled": True
}
options.add_experimental_option("prefs", prefs)

# Start browser
driver = webdriver.Chrome(options=options)
driver.get("https://classes.ku.edu/Classes/Display.action")

# === Step 1: Click the "More Options" button ===
more_button = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, "toggleOptionalSearchFieldsButton"))
)
more_button.click()

# === Step 2: Select "Excel file (all meeting times)" from dropdown ===
dropdown = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, "classesDisplayResultsFormat"))
)
Select(dropdown).select_by_value("XLS-multiple")

# === Step 3: Click the "Search" button ===
search_button = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CLASS_NAME, "classSearchButton"))
)
search_button.click()

# === Step 4: Wait for download (or check file exists) ===
time.sleep(10)

driver.quit()
