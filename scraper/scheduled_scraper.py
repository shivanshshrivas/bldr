
from selenium import webdriver
import pandas as pd
import os

from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC


import time







chrome_options=webdriver.ChromeOptions()
prefs = {
    "download.default_directory": r"C:\Users\evere\OneDrive\Desktop\project\bldr\scraper\downloads"
   
}

chrome_options.add_experimental_option("prefs", prefs)
chrome_options.add_argument("--headless")  
driver = webdriver.Chrome(options=chrome_options)
driver.get('https://classes.ku.edu/')


option_button = driver.find_element(By.CLASS_NAME, 'moreOptionsButton')
option_button.click()


WebDriverWait(driver, 2).until(
            EC.element_to_be_clickable((By.ID, "classesDisplayResultsFormat"))).click()

dropdown = Select(driver.find_element(By.ID, "classesDisplayResultsFormat"))
dropdown.select_by_value("XLS-multiple")
search_button = driver.find_element(By.CLASS_NAME, 'classSearchButton')
search_button.click()

time.sleep(40)
driver.quit()

df=pd.read_excel(r"C:\Users\evere\OneDrive\Desktop\project\bldr\scraper\downloads\classes.xls", sheet_name=None)


df.to_csv(r"C:\Users\evere\OneDrive\Desktop\project\bldr\scraper\downloads\classes.csv", index=False)
os.remove(r"C:\Users\evere\OneDrive\Desktop\project\bldr\scraper\downloads\classes.xls")

