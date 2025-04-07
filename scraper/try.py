import json
from bs4 import BeautifulSoup
import requests
import re

html_string = """
<div id="degreeplantextcontainer" class="page_content tab_content" role="tabpanel" aria-labelledby="degreeplantexttab" aria-hidden="false">
    <h2>Interdisciplinary Computing with Astronomy 4-Year Graduation Plan</h2>
    <h3>Students Entering in Fall of Odd Years</h3>
    <table class="sc_plangrid">
    <colgroup><col>
    <col>
    </colgroup>
    <colgroup><col>
    <col>
    </colgroup>
    <thead>
    <tr class="plangridyear firstrow"><th scope="colgroup" id="year0" colspan="4">Freshman</th></tr><tr class="plangridterm"><th scope="col" id="year0_Term0_codecol" class="plangridtermhdr" style="width: 40%;">Fall</th><th scope="col" id="year0_Term0_hourscol" style="width: 10%;" class="hourscol">Hours</th><th scope="col" id="year0_Term1_codecol" class="plangridtermhdr" style="width: 40%;">Spring</th><th scope="col" id="year0_Term1_hourscol" style="width: 10%;" class="hourscol">Hours</th></tr>
    </thead>
    <tbody>
    <tr class="even">
    <td header="year0 year0_Term0_codecol" class="codecol"><a href="/search/?P=EECS%20101" title="" class="bubblelink code" onclick="return showCourse(this, 'EECS 101');">EECS&nbsp;101</a> (Part of KU Core AE 5.1)</td><td header="year0 year0_Term0_hourscol" class="hourscol">1</td><td header="year0 year0_Term1_codecol" class="codecol">KU Core GE 2.1 (second)<sup>1</sup></td><td header="year0 year0_Term1_hourscol" class="hourscol">3</td></tr>
    <tr class="odd">
    <td header="year0 year0_Term0_codecol" class="codecol"><a href="/search/?P=EECS%20168" title="" class="bubblelink code" onclick="return showCourse(this, 'EECS 168');">EECS&nbsp;168</a></td><td header="year0 year0_Term0_hourscol" class="hourscol">4</td><td header="year0 year0_Term1_codecol" class="codecol"><a href="/search/?P=EECS%20140" title="" class="bubblelink code" onclick="return showCourse(this, 'EECS 140');">EECS&nbsp;140</a></td><td header="year0 year0_Term1_hourscol" class="hourscol">4</td></tr>
    <tr class="even">
    <td header="year0 year0_Term0_codecol" class="codecol">KU Core GE 2.1 (first)<sup>1</sup></td><td header="year0 year0_Term0_hourscol" class="hourscol">3</td><td header="year0 year0_Term1_codecol" class="codecol"><a href="/search/?P=MATH%20126" title="" class="bubblelink code" onclick="return showCourse(this, 'MATH 126');">MATH&nbsp;126</a></td><td header="year0 year0_Term1_hourscol" class="hourscol">4</td></tr>
    <tr class="odd">
    <td header="year0 year0_Term0_codecol" class="codecol"><a href="/search/?P=MATH%20125" title="" class="bubblelink code" onclick="return showCourse(this, 'MATH 125');">MATH&nbsp;125</a> (KU Core GE 1.2)</td><td header="year0 year0_Term0_hourscol" class="hourscol">4</td><td header="year0 year0_Term1_codecol" class="codecol"><a href="/search/?P=EPHX%20210" title="" class="bubblelink code" onclick="return showCourse(this, 'EPHX 210');">EPHX&nbsp;210</a></td><td header="year0 year0_Term1_hourscol" class="hourscol">3</td></tr>
    </tr>
    <tr class="even">
    <td header="year0 year0_Term0_codecol" class="codecol">KU Core GE 3H<sup>1</sup></td><td header="year0 year0_Term0_hourscol" class="hourscol">3</td><td header="year0 year0_Term1_codecol" class="codecol"><a href="/search/?P=PHSX%20216" title="" class="bubblelink code" onclick="return showCourse(this, 'PHSX 216');">PHSX&nbsp;216</a></td><td header="year0 year0_Term1_hourscol" class="hourscol">1</td></tr>
    <tr class="plangridsum"><td>&nbsp;</td><td header="year0 year0_Term0_hourscol" class="hourscol">15</td><td>&nbsp;</td><td header="year0 year0_Term1_hourscol" class="hourscol">15</td></tr>
    <tr class="plangridyear"><th scope="colgroup" id="year1" colspan="4">Sophomore</th></tr><tr class="plangridterm"><th id="year1_Term0_codecol" class="plangridtermhdr" style="width: 40%;">Fall</th><th id="year1_Term0_hourscol" style="width: 10%;" class="hourscol">Hours</th><th id="year1_Term1_codecol" class="plangridtermhdr" style="width: 40%;">Spring</th><th id="year1_Term1_hourscol" style="width: 10%;" class="hourscol">Hours</th></tr>
    <tr class="even">
    <td header="year1 year1_Term0_codecol" class="codecol"><a href="/search/?P=MATH%20127" title="" class="bubblelink code" onclick="return showCourse(this, 'MATH 127');">MATH&nbsp;127</a></td><td header="year1 year1_Term0_hourscol" class="hourscol">4</td><td header="year1 year1_Term1_codecol" class="codecol"><a href="/search/?P=EECS%20210" title="" class="bubblelink code" onclick="return showCourse(this, 'EECS 210');">EECS&nbsp;210</a></td><td header="year1 year1_Term1_hourscol" class="hourscol">4</td></tr>
    <tr class="odd">
    <td header="year1 year1_Term0_codecol" class="codecol"><a href="/search/?P=MATH%20220" title="" class="bubblelink code" onclick="return showCourse(this, 'MATH 220');">MATH&nbsp;220</a></td><td header="year1 year1_Term0_hourscol" class="hourscol">3</td><td header="year1 year1_Term1_codecol" class="codecol"><a href="/search/?P=EECS%20468" title="" class="bubblelink code" onclick="return showCourse(this, 'EECS 468');">EECS&nbsp;468</a></td><td header="year1 year1_Term1_hourscol" class="hourscol">3</td></tr>
    <tr class="even">
    <td header="year1 year1_Term0_codecol" class="codecol"><a href="/search/?P=MATH%20290" title="" class="bubblelink code" onclick="return showCourse(this, 'MATH 290');">MATH&nbsp;290</a></td><td header="year1 year1_Term0_hourscol" class="hourscol">2</td><td header="year1 year1_Term1_codecol" class="codecol"><a href="/search/?P=EECS%20348" title="" class="bubblelink code" onclick="return showCourse(this, 'EECS 348');">EECS&nbsp;348</a></td><td header="year1 year1_Term1_hourscol" class="hourscol">4</td></tr>
    </tr>
    <tr class="odd">
    <td header="year1 year1_Term0_codecol" class="codecol"><a href="/search/?P=PHSX%20212" title="" class="bubblelink code" onclick="return showCourse(this, 'PHSX 212');">PHSX&nbsp;212</a> (KU Core GE 3N)</td><td header="year1 year1_Term0_hourscol" class="hourscol">3</td><td header="year1 year1_Term1_codecol" class="codecol"><a href="/search/?P=ASTR%20391" title="" class="bubblelink code" onclick="return showCourse(this, 'ASTR 391');">ASTR&nbsp;391</a></td><td header="year1 year1_Term1_hourscol" class="hourscol">3</td></tr>
    <tr class="even">
    <td header="year1 year1_Term0_codecol" class="codecol"><a href="/search/?P=PHSX%20236" title="" class="bubblelink code" onclick="return showCourse(this, 'PHSX 236');">PHSX&nbsp;236</a></td><td header="year1 year1_Term0_hourscol" class="hourscol">1</td><td header="year1 year1_Term1_codecol" class="codecol">KU Core GE 3S<sup>1</sup></td><td header="year1 year1_Term1_hourscol" class="hourscol">3</td></tr>
    <tr class="odd">
    <td header="year1 year1_Term0_codecol" class="codecol"><a href="/search/?P=EECS%20268" title="" class="bubblelink code" onclick="return showCourse(this, 'EECS 268');">EECS&nbsp;268</a></td><td header="year1 year1_Term0_hourscol" class="hourscol">4</td><td colspan="2">&nbsp;</td></tr>
    <tr class="plangridsum"><td>&nbsp;</td><td header="year1 year1_Term0_hourscol" class="hourscol">17</td><td>&nbsp;</td><td header="year1 year1_Term1_hourscol" class="hourscol">17</td></tr>
    <tr class="plangridyear"><th scope="colgroup" id="year2" colspan="4">Junior</th></tr><tr class="plangridterm"><th id="year2_Term0_codecol" class="plangridtermhdr" style="width: 40%;">Fall</th><th id="year2_Term0_hourscol" style="width: 10%;" class="hourscol">Hours</th><th id="year2_Term1_codecol" class="plangridtermhdr" style="width: 40%;">Spring</th><th id="year2_Term1_hourscol" style="width: 10%;" class="hourscol">Hours</th></tr>
    <tr class="even">
    <td header="year2 year2_Term0_codecol" class="codecol"><a href="/search/?P=EECS%20461" title="" class="bubblelink code" onclick="return showCourse(this, 'EECS 461');">EECS&nbsp;461</a></td><td header="year2 year2_Term0_hourscol" class="hourscol">3</td><td header="year2 year2_Term1_codecol" class="codecol">EECS 330</td><td header="year2 year2_Term1_hourscol" class="hourscol">4</td></tr>
    <tr class="odd">
    <td header="year2 year2_Term0_codecol" class="codecol"><a href="/search/?P=EECS%20388" title="" class="bubblelink code" onclick="return showCourse(this, 'EECS 388');">EECS&nbsp;388</a></td><td header="year2 year2_Term0_hourscol" class="hourscol">4</td><td header="year2 year2_Term1_codecol" class="codecol"><a href="/search/?P=EECS%20678" title="" class="bubblelink code" onclick="return showCourse(this, 'EECS 678');">EECS&nbsp;678</a></td><td header="year2 year2_Term1_hourscol" class="hourscol">4</td></tr>
    <tr class="even">
    <td header="year2 year2_Term0_codecol" class="codecol"><a href="/search/?P=ASTR%20591" title="" class="bubblelink code" onclick="return showCourse(this, 'ASTR 591');">ASTR&nbsp;591</a></td><td header="year2 year2_Term0_hourscol" class="hourscol">3</td><td header="year2 year2_Term1_codecol" class="codecol"><a href="/search/?P=PHSX%20313" title="" class="bubblelink code" onclick="return showCourse(this, 'PHSX 313');">PHSX&nbsp;313</a></td><td header="year2 year2_Term1_hourscol" class="hourscol">3</td></tr>
    <tr class="odd">
    <td header="year2 year2_Term0_codecol" class="codecol"><a href="/search/?P=ASTR%20596" title="" class="bubblelink code" onclick="return showCourse(this, 'ASTR 596');">ASTR&nbsp;596</a></td><td header="year2 year2_Term0_hourscol" class="hourscol">3</td><td header="year2 year2_Term1_codecol" class="codecol"><a href="/search/?P=PHSX%20316" title="" class="bubblelink code" onclick="return showCourse(this, 'PHSX 316');">PHSX&nbsp;316</a></td><td header="year2 year2_Term1_hourscol" class="hourscol">1</td></tr>
    <tr class="even">
    <td header="year2 year2_Term0_codecol" class="codecol">KU Core GE 2.2<sup>1</sup></td><td header="year2 year2_Term0_hourscol" class="hourscol">3</td><td header="year2 year2_Term1_codecol" class="codecol"><a href="/search/?P=ASTR%20592" title="" class="bubblelink code" onclick="return showCourse(this, 'ASTR 592');">ASTR&nbsp;592</a></td><td header="year2 year2_Term1_hourscol" class="hourscol">3</td></tr>
    <tr class="plangridsum"><td>&nbsp;</td><td header="year2 year2_Term0_hourscol" class="hourscol">16</td><td>&nbsp;</td><td header="year2 year2_Term1_hourscol" class="hourscol">15</td></tr>
    <tr class="plangridyear"><th scope="colgroup" id="year3" colspan="4">Senior</th></tr><tr class="plangridterm"><th id="year3_Term0_codecol" class="plangridtermhdr" style="width: 40%;">Fall</th><th id="year3_Term0_hourscol" style="width: 10%;" class="hourscol">Hours</th><th id="year3_Term1_codecol" class="plangridtermhdr" style="width: 40%;">Spring</th><th id="year3_Term1_hourscol" style="width: 10%;" class="hourscol">Hours</th></tr>
    <tr class="even">
    <td header="year3 year3_Term0_codecol" class="codecol"><a href="/search/?P=EECS%20581" title="" class="bubblelink code" onclick="return showCourse(this, 'EECS 581');">EECS&nbsp;581</a> (Part of KU Core AE 5.1)</td><td header="year3 year3_Term0_hourscol" class="hourscol">3</td><td header="year3 year3_Term1_codecol" class="codecol"><a href="/search/?P=EECS%20582" title="" class="bubblelink code" onclick="return showCourse(this, 'EECS 582');">EECS&nbsp;582</a> (KU Core AE 6.1)</td><td header="year3 year3_Term1_hourscol" class="hourscol">3</td></tr>
    <tr class="odd">
    <td header="year3 year3_Term0_codecol" class="codecol">EECS 565</td><td header="year3 year3_Term0_hourscol" class="hourscol">3</td><td header="year3 year3_Term1_codecol" class="codecol">CS elective 2</td><td header="year3 year3_Term1_hourscol" class="hourscol">3</td></tr>
    <tr class="even">
    <td header="year3 year3_Term0_codecol" class="codecol">CS elective 1</td><td header="year3 year3_Term0_hourscol" class="hourscol">3</td><td header="year3 year3_Term1_codecol" class="codecol">CS elective 3</td><td header="year3 year3_Term1_hourscol" class="hourscol">3</td></tr>
    <tr class="odd">
    <td header="year3 year3_Term0_codecol" class="codecol">ASTR elective 1</td><td header="year3 year3_Term0_hourscol" class="hourscol">3</td><td header="year3 year3_Term1_codecol" class="codecol">ASTR elective 2</td><td header="year3 year3_Term1_hourscol" class="hourscol">3</td></tr>
    <tr class="even">
    <td header="year3 year3_Term0_codecol" class="codecol"><a href="/search/?P=ASTR%20503" title="" class="bubblelink code" onclick="return showCourse(this, 'ASTR 503');">ASTR&nbsp;503</a></td><td header="year3 year3_Term0_hourscol" class="hourscol">2</td><td header="year3 year3_Term1_codecol" class="codecol">KU Core AE 4.2<sup>1</sup></td><td header="year3 year3_Term1_hourscol" class="hourscol">3</td></tr>
    <tr class="odd">
    <td header="year3 year3_Term0_codecol" class="codecol">KU Core AE4.1<sup>1</sup></td><td header="year3 year3_Term0_hourscol" class="hourscol">3</td><td colspan="2">&nbsp;</td></tr>
    <tr class="plangridsum"><td>&nbsp;</td><td header="year3 year3_Term0_hourscol" class="hourscol">17</td><td>&nbsp;</td><td header="year3 year3_Term1_hourscol" class="hourscol">15</td></tr>
    <tr class="plangridtotal lastrow"><td header="year0 year1 year2 year3" colspan="4">Total Hours 127</td></tr>
    </tbody>
    </table>
</div>
"""

url="https://catalog.ku.edu/archives/2023-24/engineering/electrical-engineering-computer-science/bs-interdisciplinary-computing/#degreeplantext"

response = requests.get(url)
html_string = response.text  
soup = BeautifulSoup(html_string, 'html.parser')
div = soup.find('div', id='degreeplantextcontainer')

result = {}

if div:
    h2_tags = div.find_all('h2')
    for h2 in h2_tags:
        h2_text = h2.text.strip()
        table = h2.find_next_sibling('table', class_='sc_plangrid')

        if table:
            years_data = {
                "Freshman": {"Fall": {}, "Spring": {}},
                "Sophomore": {"Fall": {}, "Spring": {}},
                "Junior": {"Fall": {}, "Spring": {}},
                "Senior": {"Fall": {}, "Spring": {}}
            }

            rows = table.find_all('tr')
            year_index = -1

            for row in rows:
                if 'plangridyear' in row.get('class', []):
                    year_index += 1
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

            result[h2_text] = years_data

print(json.dumps(result, indent=4))