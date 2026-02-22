/**
 * Event metadata for all 2025–26 FBLA competitive events.
 *
 * Each event is mapped to:
 *   - rubricUrl       – direct link to the official FBLA guideline / rating-sheet PDF
 *   - bizybearUrl     – link to BizYBear practice questions for that event
 *   - isObjectiveTest – whether the event is a written/online test or a performance
 *
 * High-school and middle-school (FBLA-ML) events link to their respective
 * rubric PDFs. BizYBear URL slugs are mapped per-event because their site uses
 * inconsistent slug formatting (lowercase-hyphenated, plus-separated, etc.).
 */

/* ---------- Rubric PDF base URLs (unsigned, publicly accessible) ---------- */
const HS_RUBRIC_URL =
  "https://greektrack-fbla-public.s3.amazonaws.com/files/1/High%20School%20Competitive%20Events%20Resources/25-26-High-School-Guidelines-All-in-One.pdf";

const MS_RUBRIC_URL =
  "https://greektrack-fbla-public.s3.amazonaws.com/files/1/Middle%20School%20Competitive%20Events%20Resources/25-26-Middle-School-Guidelines-All-in-One.pdf";

/* ---------- BizYBear URL slug mapping ----------------------------------- */
// Maps each canonical event name → the exact path segment used on bizybear.app.
const BIZYBEAR_SLUGS: Record<string, string> = {
  // Objective Tests
  "Accounting":                              "accounting",
  "Advanced Accounting":                     "advanced-accounting",
  "Advertising":                             "Advertising",
  "Agribusiness":                            "Agribusiness",
  "Business Communication":                  "Business+Communication",
  "Business Law":                            "Business+Law",
  "Career Exploration":                      "Career+Exploration",
  "Career Research":                         "Career+Research",
  "Computer Problem Solving":                "Computer+Problem+Solving",
  "Cybersecurity":                           "Cyber+Security",
  "Data Science & AI":                       "data-science-ai",
  "Digital Citizenship":                     "Digital+Citizenship",
  "Economics":                               "Economics",
  "Exploring Agribusiness":                  "exploring-agribusiness",
  "Exploring Accounting & Finance":          "exploring-accounting-finance",
  "Exploring Business Communication":        "exploring-business-communication",
  "Exploring Business Concepts":             "exploring-business-concepts",
  "Exploring Computer Science":              "Exploring+Computer+Science",
  "Exploring Economics":                     "Exploring+Economics",
  "Exploring FBLA":                          "exploring-fbla",
  "Exploring Leadership":                    "Exploring+Leadership",
  "Exploring Marketing Concepts":            "exploring-marketing-concepts",
  "Exploring Parliamentary Procedure":       "Exploring+Parliamentary+Procedure",
  "Exploring Personal Finance":              "exploring-personal-finance",
  "Exploring Professionalism":               "exploring-professionalism",
  "Exploring Technology":                    "Exploring+Technology",
  "Health Care Administration":              "Healthcare+Administration",
  "Human Resource Management":               "Human+Resource+Management",
  "Insurance & Risk Management":             "Insurance+%26+Risk+Management",
  "Interpersonal Communication":             "Interpersonal+Communication",
  "Introduction to Business Communication":  "Introduction+to+Business+Communication",
  "Introduction to Business Concepts":       "Introduction+to+Business+Concepts",
  "Introduction to Business Procedures":     "Introduction+to+Business+Procedures",
  "Introduction to FBLA":                    "Introduction+to+FBLA",
  "Introduction to Information Technology":  "Introduction+to+Information+Technology",
  "Introduction to Marketing Concepts":      "Introduction+to+Marketing+Concepts",
  "Introduction to Parliamentary Procedure": "Introduction+to+Parliamentary+Procedure",
  "Introduction to Retail & Merchandising":  "intro-retail-merchandising",
  "Introduction to Supply Chain Management": "intro-supply-chain-management",
  "Journalism":                              "Journalism",
  "Networking Infrastructures":              "Networking+Infrastructures",
  "Organizational Leadership":               "Organizational+Leadership",
  "Personal Finance":                        "Personal+Finance",
  "Project Management":                      "project-management",
  "Public Administration & Management":      "public-administration-management",
  "Real Estate":                             "real-estate",
  "Retail Management":                       "retail-management",
  "Securities & Investments":                "Securities+%26+Investments",

  // Performance / Production / Chapter Events
  "American Enterprise Project":             "American+Enterprise+Project",
  "Banking & Financial Systems":             "Banking+%26+Financial+Systems",
  "Broadcast Journalism":                    "Broadcast+Journalism",
  "Business Ethics":                         "Business+Ethics",
  "Business Management":                     "Business+Management",
  "Business Plan":                           "Business+Plan",
  "Career Portfolio":                        "career-portfolio",
  "Coding and Programming":                  "Coding+%26+Programming",
  "Community Service Project":               "Community+Service+Project",
  "Computer Applications":                   "Computer+Applications",
  "Computer Game & Simulation Programming":  "Computer+Game+%26+Simulation+Programming",
  "Customer Service":                        "customer-service",
  "Data Analysis":                           "Data+Analysis",
  "Digital Animation":                       "Digital+Animation",
  "Digital Video Production":                "Digital+Video+Production",
  "Entrepreneurship":                        "Entrepreneurship",
  "Event Planning":                          "event-planning",
  "Exploring Animation":                     "exploring-animation",
  "Exploring Business Ethics":               "Exploring+Business+Ethics",
  "Exploring Business Issues":               "Exploring+Business+Issues",
  "Exploring Customer Service":              "exploring-customer-service",
  "Exploring Management & Entrepreneurship": "exploring-management-entrepreneurship",
  "Exploring Marketing Strategies":          "exploring-marketing-strategies",
  "Exploring Public Speaking":               "Exploring+Public+Speaking",
  "Exploring Website Design":                "Exploring+Website+Design",
  "Financial Planning":                      "financial-planning",
  "Financial Statement Analysis":            "Financial+Statement+Analysis",
  "Future Business Educator":                "Future+Business+Educator",
  "Future Business Leader":                  "Future+Business+Leader",
  "Graphic Design":                          "Graphic+Design",
  "Hospitality and Event Management":        "Hospitality+%26+Event+Management",
  "Impromptu Speaking":                      "Impromptu+Speaking",
  "International Business":                  "International+Business",
  "Introduction to Business Presentation":   "Introduction+to+Business+Presentation",
  "Introduction to Programming":             "Introduction+to+Programming",
  "Introduction to Public Speaking":         "Introduction+to+Public+Speaking",
  "Introduction to Social Media Strategy":   "Introduction+to+Social+Media+Strategy",
  "Job Interview":                           "Job+Interview",
  "Local Chapter Annual Business Report":    "Local+Chapter+Annual+Business+Report",
  "Management Information Systems":          "Management+Information+Systems",
  "Marketing":                               "Marketing",
  "Mobile Application Development":          "Mobile+Application+Development",
  "Network Design":                          "Network+Design",
  "Parliamentary Procedure":                 "Parliamentary+Procedure",
  "Partnership with Business Project":       "Partnership+with+Business+Project",
  "Public Service Announcement":             "Public+Service+Announcement",
  "Public Speaking":                         "Public+Speaking",
  "Sales Presentation":                      "Sales+Presentation",
  "Slide Deck Applications":                 "slide-deck-applications",
  "Social Media Strategies":                 "Social+Media+Strategies",
  "Sports & Entertainment Management":       "Sports+%26+Entertainment+Management",
  "Supply Chain Management":                 "Supply+Chain+Management",
  "Visual Design":                           "Visual+Design",
  "Website Coding & Development":            "Website+Coding+%26+Development",
  "Website Design":                          "Website+Design",
};

/* ---------- Types -------------------------------------------------------- */

export interface EventMetadata {
  rubricUrl: string;
  bizybearUrl: string | null;
  isObjectiveTest: boolean;
}

/* ---------- Internal registry -------------------------------------------- */

const eventMap: Record<string, EventMetadata> = {};

/* FBLA-ML (middle-school) events that use the middle-school rubric PDF. */
const middleSchoolEvents = new Set([
  "Career Exploration",
  "Digital Citizenship",
  "Interpersonal Communication",
  "Slide Deck Applications",
  "Exploring Agribusiness",
  "Exploring Accounting & Finance",
  "Exploring Animation",
  "Exploring Business Communication",
  "Exploring Business Concepts",
  "Exploring Business Ethics",
  "Exploring Business Issues",
  "Exploring Computer Science",
  "Exploring Customer Service",
  "Exploring Economics",
  "Exploring FBLA",
  "Exploring Leadership",
  "Exploring Management & Entrepreneurship",
  "Exploring Marketing Concepts",
  "Exploring Marketing Strategies",
  "Exploring Parliamentary Procedure",
  "Exploring Personal Finance",
  "Exploring Professionalism",
  "Exploring Public Speaking",
  "Exploring Technology",
  "Exploring Website Design",
]);

/** Build the full BizYBear URL for an event, or null if it has no page. */
function bizybearUrl(name: string): string | null {
  const slug = BIZYBEAR_SLUGS[name];
  return slug ? `https://bizybear.app/fbla/${slug}` : null;
}

/* ---------- Objective test events ---------------------------------------- */
const objectiveTests = [
  "Accounting",
  "Advanced Accounting",
  "Advertising",
  "Agribusiness",
  "Business Communication",
  "Business Law",
  "Career Exploration",
  "Career Research",
  "Computer Problem Solving",
  "Cybersecurity",
  "Data Science & AI",
  "Digital Citizenship",
  "Economics",
  "Exploring Agribusiness",
  "Exploring Accounting & Finance",
  "Exploring Business Communication",
  "Exploring Business Concepts",
  "Exploring Computer Science",
  "Exploring Economics",
  "Exploring FBLA",
  "Exploring Leadership",
  "Exploring Marketing Concepts",
  "Exploring Parliamentary Procedure",
  "Exploring Personal Finance",
  "Exploring Professionalism",
  "Exploring Technology",
  "Health Care Administration",
  "Human Resource Management",
  "Insurance & Risk Management",
  "Interpersonal Communication",
  "Introduction to Business Communication",
  "Introduction to Business Concepts",
  "Introduction to Business Procedures",
  "Introduction to FBLA",
  "Introduction to Information Technology",
  "Introduction to Marketing Concepts",
  "Introduction to Parliamentary Procedure",
  "Introduction to Retail & Merchandising",
  "Introduction to Supply Chain Management",
  "Journalism",
  "Networking Infrastructures",
  "Organizational Leadership",
  "Personal Finance",
  "Project Management",
  "Public Administration & Management",
  "Real Estate",
  "Retail Management",
  "Securities & Investments",
];

/* ---------- Performance / production / chapter events -------------------- */
const performanceEvents = [
  "American Enterprise Project",
  "Banking & Financial Systems",
  "Broadcast Journalism",
  "Business Ethics",
  "Business Management",
  "Business Plan",
  "Career Portfolio",
  "Coding and Programming",
  "Community Service Project",
  "Computer Applications",
  "Computer Game & Simulation Programming",
  "Customer Service",
  "Data Analysis",
  "Digital Animation",
  "Digital Video Production",
  "Entrepreneurship",
  "Event Planning",
  "Exploring Animation",
  "Exploring Business Ethics",
  "Exploring Business Issues",
  "Exploring Customer Service",
  "Exploring Management & Entrepreneurship",
  "Exploring Marketing Strategies",
  "Exploring Public Speaking",
  "Exploring Website Design",
  "Financial Planning",
  "Financial Statement Analysis",
  "Future Business Educator",
  "Future Business Leader",
  "Graphic Design",
  "Hospitality and Event Management",
  "Impromptu Speaking",
  "International Business",
  "Introduction to Business Presentation",
  "Introduction to Programming",
  "Introduction to Public Speaking",
  "Introduction to Social Media Strategy",
  "Job Interview",
  "Local Chapter Annual Business Report",
  "Management Information Systems",
  "Marketing",
  "Mobile Application Development",
  "Network Design",
  "Parliamentary Procedure",
  "Partnership with Business Project",
  "Public Service Announcement",
  "Public Speaking",
  "Sales Presentation",
  "Slide Deck Applications",
  "Social Media Strategies",
  "Sports & Entertainment Management",
  "Supply Chain Management",
  "Visual Design",
  "Website Coding & Development",
  "Website Design",
];

/* ---------- Populate eventMap -------------------------------------------- */

// Objective tests
for (const name of objectiveTests) {
  eventMap[name] = {
    rubricUrl: middleSchoolEvents.has(name) ? MS_RUBRIC_URL : HS_RUBRIC_URL,
    bizybearUrl: bizybearUrl(name),
    isObjectiveTest: true,
  };
}

// Performance / production events
for (const name of performanceEvents) {
  eventMap[name] = {
    rubricUrl: middleSchoolEvents.has(name) ? MS_RUBRIC_URL : HS_RUBRIC_URL,
    bizybearUrl: bizybearUrl(name),
    isObjectiveTest: false,
  };
}

/* ---------- Public helpers ----------------------------------------------- */

/**
 * Look up metadata for an event by display name.
 * Tries an exact match first, then a prefix/substring match to handle
 * minor formatting differences in the schedule data.
 */
export function getEventMetadata(eventName: string): EventMetadata | null {
  // Exact match
  if (eventMap[eventName]) return eventMap[eventName];

  // Prefix / substring fallback
  const lower = eventName.toLowerCase();
  for (const [key, meta] of Object.entries(eventMap)) {
    if (lower.startsWith(key.toLowerCase()) || key.toLowerCase().startsWith(lower)) {
      return meta;
    }
  }

  // Fallback — default to the high-school rubric with no practice link
  return {
    rubricUrl: HS_RUBRIC_URL,
    bizybearUrl: null,
    isObjectiveTest: false,
  };
}

/**
 * Filter out non-event entries that may appear in the schedule data
 * (e.g. category headers, time rows, or other artifacts).
 */
export function isRealEvent(competitionName: string): boolean {
  if (eventMap[competitionName]) return true;

  const lower = competitionName.toLowerCase();
  if (/^\d/.test(competitionName)) return false;
  if (lower.startsWith("performance (")) return false;
  if (lower.startsWith("role play (")) return false;
  if (lower.startsWith("production")) return false;
  if (lower === "state parliamentarian candidate") return false;
  if (/^\d{1,2}:\d{2}/.test(competitionName)) return false;

  return true;
}

export default eventMap;
