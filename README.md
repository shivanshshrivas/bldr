# bldr
BLDR: Repository for HackKU 2025 
--Update: We are on track to deliver this app to KU advising and our tool will be used for schedule design by students from Fall 2025.
## Inspiration

Our university’s only scheduling tool was taken down right before enrollment opened, leaving us to design our semester class schedule on our own, trying out different combinations of class time to fit our classes into schedule. This left us scrambling with spreadsheets and papers. We knew there had to be a better way—so we built **bldr**.

## What It Does

**bldr** is an AI-driven scheduling assistant that:

- Parses your academic advising report or unofficial transcript  
- Suggests an optimal set of courses for your degree path  
- Lets you refine or rebuild schedules via natural-language chat  
- Syncs your final schedule to Google Calendar and email  

## Key Features

- **Transcript Parsing**  
  Automatically detect which courses you’ve completed from PDF or image uploads.  
- **Gemini-Powered Chatbot**  
  Talk to bldr as if it were your academic advisor—impose constraints, ask for suggestions, or build a full schedule in one sentence.  
- **Google Calendar Integration**  
  One-click sync exports your schedule to your calendar of choice.  
- **Live Class Data Scraping**  
  Real-time section availability pulled from your school’s portal with Selenium & BeautifulSoup.  
- **Multi-Schedule Management**  
  Build, compare, and switch between multiple semester plans.  
- **Schedule Sharing**  
  Instantly email schedules to yourself or friends.  
- **Constraint-Based Planning**  
  Avoid 9 AM classes, limit credit hours, or block specific days with a simple prompt.

## How We Built It

### Frontend

- **Next.js** for SSR/SSG and routing  
- **Tailwind CSS** & **Shadcn UI** for rapid, responsive styling  
- Clean, mobile-first design powered by **Framer Motion** animations  

### Backend

- **Express.js** REST API  
- **PostgreSQL** for structured data (course catalog, user profiles)  
- **MongoDB Atlas** for flexible, document-based schedule storage  

### Parsing & Automation

- **Selenium** & **BeautifulSoup** scrape live course listings  
- Custom parsers normalize disparate HTML structures into clean JSON  

### LLM Integration

- **Google Gemini API** powers our chatbot:
  - Ingests user context: completed courses, major requirements, current schedule  
  - Differentiates passive vs. active intents (e.g., “What should I take?” vs. “Build my schedule”)  
  - Calls our own endpoints (`suggestedClasses()`, `addClassToSchedule()`, etc.) to modify schedules agentically  

### Calendar & Email APIs

- **Google Calendar API** for one-click schedule export  
- **SendGrid** (or similar) for instant email sharing  

---

## Architecture & Flowchart

![bldr Flowchart](docs/flowchart.png)  
*High-level overview of data flow between frontend, backend, scraper, databases, and Gemini API.*

---

## Challenges We Ran Into

- **Web Scraping**  
  Inconsistent HTML required robust selectors and graceful failure handling.  
- **Conflict Detection**  
  Building a rules engine that respects time-block constraints, credit limits, and user preferences was non-trivial.  
- **Chatbot Contextuality**  
  Teaching Gemini to carry state—so it knows what you’ve already taken and your current plan—required careful prompt engineering.  
- **Agentic Features**  
  Enabling Gemini to actually call our APIs and update MongoDB documents on the fly was a complex orchestration.

---

## Deep Dives

### Using MongoDB Atlas

- **Dynamic Schedule Storage**  
  Each schedule is a document with fields like `schedID`, `semester`, `scheduleName`, and a nested array of course objects.  
- **Schema Flexibility**  
  Perfect for handling multiple sections, temporary swaps, and AI-generated suggestions without rigid joins.  
- **Seamless Updates**  
  Fine-grained modifications (add/remove/replace classes) with single-field updates.

### Using Google Gemini API

- **Context-Aware Prompts**  
  Sends completed courses, major/catalog year, current schedule, and available classes in each request.  
- **Intent Classification**  
  Distinguishes between passive queries (“What do you recommend?”) and active commands (“Add ECON 101 at 10 AM”).  
- **Agentic Behavior**  
  On “active” intents, Gemini triggers our backend endpoints automatically, then confirms changes to the user.

---


 