import json
from bs4 import BeautifulSoup
import requests
import re

batch_years = {
    "2024-25": "",
    "2023-24": "2023-24",
    "2022-23": "2022-23"
}

majors = {
    "Electrical Engineering": "electrical-engineering/#graduationplantext",
    "Computer Science": "computer-science/#plantext",
    "Computer Engineering": "computer-engineering/#graduationplantext",
    "IC-Astronomy": "applied-computing/astronomy-conc/",
    "IC-Biology": "applied-computing/biology-conc/",
    "IC-Chemistry": "applied-computing/chemistry-conc/",
    "IC-Economics": "applied-computing/economics-conc/",
    "IC-Journalism": "applied-computing/journalism-conc/",
    "IC-Physics": "applied-computing/physics-conc/",
}

base_url = "https://catalog.ku.edu/archives/{year}/engineering/electrical-engineering-computer-science/bs-{major}"
current_year_base_url = "https://catalog.ku.edu/engineering/electrical-engineering-computer-science/bs-{major}"
ic_archive_url = "https://catalog.ku.edu/archives/{year}/engineering/electrical-engineering-computer-science/bs-interdisciplinary-computing/#degreeplantext"

def process_table(table):
    years_data = {
        "Freshman": {"Fall": {}, "Spring": {}},
        "Sophomore": {"Fall": {}, "Spring": {}},
        "Junior": {"Fall": {}, "Spring": {}},
        "Senior": {"Fall": {}, "Spring": {}}
    }
    rows = table.find_all('tr')
    year_index = -1
    term_index = 0

    for row in rows:
        if 'plangridyear' in row.get('class', []):
            year_index += 1
            term_index = 0
            year_name = row.find('th').text.strip().replace(" ", "")
        elif 'plangridterm' in row.get('class', []):
            continue
        elif 'plangridsum' in row.get('class', []):
            continue
        elif 'plangridtotal' in row.get('class', []):
            break
        else:
            cols = row.find_all('td')
            if len(cols) >= 4:
                fall_course = cols[0].text.strip()
                fall_hours = cols[1].text.strip()
                spring_course = cols[2].text.strip()
                spring_hours = cols[3].text.strip()

                if fall_course and fall_hours:
                    fall_course = fall_course.replace('\xa0', ' ').split('(')[0].strip()
                    years_data[year_name]["Fall"][fall_course] = fall_hours
                if spring_course and spring_hours:
                    spring_course = spring_course.replace('\xa0', ' ').split('(')[0].strip()
                    years_data[year_name]["Spring"][spring_course] = spring_hours
            elif len(cols) == 2:
                fall_course = cols[0].text.strip()
                fall_hours = cols[1].text.strip()
                if fall_course and fall_hours:
                    fall_course = fall_course.replace('\xa0', ' ').split('(')[0].strip()
                    years_data[year_name]["Fall"][fall_course] = fall_hours
    return years_data

all_data = {}

for year_key, year_value in batch_years.items():
    all_data[year_key] = {}
    for major_key, major_value in majors.items():
        if year_key == "2024-25":
            if "applied-computing" in major_value:
                url = current_year_base_url.format(major=major_value)
            elif "computer-science" in major_value:
                url = current_year_base_url.format(major=major_value.replace("#plantext", "#degreeplantext"))
            else:
                url = current_year_base_url.format(major=major_value)
        elif "IC-" in major_key:
            url = ic_archive_url.format(year=year_value)
        else:
            url = base_url.format(year=year_value, major=major_value)

        try:
            response = requests.get(url)
            response.raise_for_status()
            html_content = response.text
            soup = BeautifulSoup(html_content, 'html.parser')

            if "IC-" in major_key and year_key == "2024-25":
                table = soup.find('table', class_='sc_plangrid')
                if table:
                    years_data = process_table(table)
                    all_data[year_key][major_key] = years_data
                else:
                    print(f"No table found on URL: {url}")
            elif "IC-" in major_key and year_key != "2024-25":
                table = soup.find('table', class_='sc_plangrid')
                if table:
                    years_data = process_table(table)
                    all_data[year_key][major_key] = years_data
                else:
                    print(f"No table found on URL: {url}")
            else:
                table = soup.find('table', class_='sc_plangrid')
                if table:
                    years_data = process_table(table)
                    all_data[year_key][major_key] = years_data
                else:
                    print(f"No table found on URL: {url}")

        except requests.exceptions.RequestException as e:
            print(f"Error fetching URL {url}: {e}")
        except Exception as e:
            print(f"An unexpected error occurred processing {url}: {e}")

with open("all_data.json", 'w', encoding='utf-8') as json_file:
    json.dump(all_data, json_file, indent=4)

print("All data saved to all_data.json")