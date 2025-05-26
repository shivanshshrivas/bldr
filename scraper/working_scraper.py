import json
import re
import time

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC

from bs4 import BeautifulSoup
from collections import OrderedDict

# Helper to parse days and times
DAY_MAP = OrderedDict([
    ("Th", "Thursday"), ("Tu", "Tuesday"), ("Su", "Sunday"),
    ("Sa", "Saturday"), ("M", "Monday"), ("W", "Wednesday"), ("F", "Friday"),
])

def parse_schedule(raw: str):
    txt = " ".join(raw.split())
    m = re.match(r"^([A-Za-z]+)\s+(.*)$", txt)
    if not m:
        return [], "", ""
    day_part, time_part = m.groups()
    days, i = [], 0
    while i < len(day_part):
        for abbr, full in DAY_MAP.items():
            if day_part.startswith(abbr, i):
                days.append(full)
                i += len(abbr)
                break
                
        else:
            i += 1
    tm = re.match(r"(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})\s*([AP]M)$", time_part)
    if tm:
        s, e, ap = tm.groups()
        return days, f"{s} {ap}", f"{e} {ap}"
    parts = time_part.split("-", 1)
    return days, parts[0].strip(), parts[1].strip() if len(parts) > 1 else ""

def scrape_ku_classes(subject: str,
                      career: str = "UndergraduateGraduate",
                      term_value: str = "4259",
                      mode: str = "", 
                      output_file: str = "classes.json"):
  
    chrome_opts = Options()
    chrome_opts.add_argument("--headless")
    driver = webdriver.Chrome(options=chrome_opts)
    
    try:
        driver.get("https://classes.ku.edu/")
        # select career
        Select(WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "classesSearchCareer"))
        )).select_by_value(career)
        # select term (e.g., Fall 2025)
        Select(driver.find_element(By.ID, "classesSearchTerm")) \
            .select_by_value(term_value)
        # select instruction mode if provided
        if mode:
            Select(driver.find_element(By.ID, "instructionMode")) \
                .select_by_value(mode)
        
        # enter subject
        search = driver.find_element(By.ID, "classesSearchText")
        search.clear()
        search.send_keys(subject, Keys.RETURN)

        # click search button
        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, ".btn.btn-primary.classSearchButton"))
        ).click()

        ajax = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.ID, "classes_ajaxDiv"))
        )
        html = ajax.get_attribute("innerHTML")
    finally:
        driver.quit()

    soup = BeautifulSoup(html, "html.parser")
    courses = []
    for h3 in soup.find_all("h3"):
        header_tr = h3.find_parent("tr")
        if not header_tr:
            continue
        desc_tr = header_tr.find_next_sibling(lambda t: t.name == "tr")
        if not desc_tr:
            continue
        desc_td = desc_tr.find("td")
        hdr = header_tr.td.get_text(" ", strip=True)
        m = re.match(r"^([A-Z]{3,4}\s*\d{1,4})\s+(.*?)\s*\(\s*([\d\-]+)\s*\)\s*(Fall|Spring|Summer)\s*(\d{4})", hdr)
        # Match class code, title, credit hours, term, and year
        if not m:
            continue
        code, title, cred, term, year = m.groups()
        desc_text = desc_td.get_text(" ", strip=True)
        prereq = re.search(r"Prerequisite:([^\.]+)\.", desc_text)
        coreq  = re.search(r"Corequisite:([^\.]+)\.", desc_text)

        sec_tr = desc_tr.find_next_sibling(lambda t: t.name == "tr")
        if not sec_tr:
            continue
        table = sec_tr.find("table", class_="class_list")
        if not table:
            continue

        sections = []
        rows = table.find_all("tr")
        i = 1
        while i < len(rows):
            cols = rows[i].find_all("td")
            typ = cols[0].get_text(strip=True)
            if typ in ("LEC", "LBN"):
                inst = cols[1].find("a")
                instr = inst.get_text(strip=True) if inst else None
                cr    = int(cols[2].get_text(strip=True))
                clsno = cols[3].strong.get_text(strip=True)
                seats = cols[4].get_text(strip=True)
                detail = rows[i+1].find_all("td")[1]
                parts = [p.strip() for p in detail.get_text("|", strip=True).split("|") if p.strip()]
                raw_days = parts[0] if parts else ""
                days, start_time, end_time = parse_schedule(raw_days)
                room_c = parts[1] if len(parts) > 1 else ""
                campus = parts[-1] if parts else ""
                bld, room = (room_c.split(" ", 1) + [""])[:2]

                sections.append({
                    "type": typ,
                    "instructor": instr,
                    "credit_hours": cr,
                    "class_number": clsno,
                    "seats_available": seats,
                    "days": days,
                    "start_time": start_time,
                    "end_time": end_time,
                    "building": bld,
                    "room": room,
                    "campus": campus
                })
                i += 2
            else:
                i += 1

        courses.append({
            "class_code": code,
            "title": title,
            "credit_hours": [int(x) for x in cred.split("-")] if "-" in cred else int(cred),
            "term": f"{term} {year}",
            "description": desc_text,
            "prerequisites": prereq.group(1).split(",") if prereq else [],
            "corequisites": coreq.group(1).split(",") if coreq else [],
            "sections": sections
        })

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(courses, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(courses)} courses to {output_file}")

if __name__ == "__main__":
    scrape_ku_classes(" EECS 210 MATH 127")

