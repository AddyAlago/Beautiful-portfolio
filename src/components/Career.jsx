import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Briefcase, GraduationCap, Wrench, LayoutList, Workflow } from "lucide-react";

// ---- CONFIG-DRIVEN TABS (EASY TO EDIT) ----
const TAB_CONFIG = [
  { value: "overview", label: "Overview", Icon: LayoutList },
  { value: "core", label: "Core Skills", Icon: Wrench },
  { value: "automation", label: "Automation", Icon: Workflow },
  { value: "experience", label: "Experience", Icon: Briefcase },
  { value: "education", label: "Education & Certifications", Icon: GraduationCap },
];

// Experience data you can tweak quickly
const EXPERIENCE = [
  {
    role: "Sr. Manager of Software Quality Engineering",
    company: "TextNow",
    dates: "Jun 2023 – Present",
    bullets: [
      "Lead QA practices for the core experience pod (Android/iOS calling & messaging).",
      "Unified Pytest + Appium automation framework for both mobile platforms.",
      "Partnered with Product to shift from engineering-led to product-led delivery culture."
    ],
  },
  {
    role: "QA Manager / QA Lead",
    company: "Grid News / The Messenger",
    dates: "Sep 2021 – Jun 2023",
    bullets: [
      "Built end-to-end automation coverage using Cypress, Postman, and XCTest.",
      "Hired and managed QA team for Grid’s mobile and web launch — zero launch defects.",
      "Established story documentation standards reducing missed requirements by 90%."
    ],
  },
  {
    role: "Associate Director of Quality Assurance",
    company: "Silverchair Information Systems",
    dates: "Jun 2017 – Sep 2021",
    bullets: [
      "Created company’s first Selenium + SpecFlow automation framework still in use today.",
      "Led 13 QA engineers across 8 Agile teams; improved sprint velocity and quality KPIs.",
      "Built Power BI dashboards tracking escaped defects and hotfix trends."
    ],
  },
  {
    role: "Director of Operations / QA",
    company: "E-N Computers",
    dates: "Jun 2014 – Jun 2017",
    bullets: [
      "Directed operations for MSP serving clients across Washington DC and Shenandoah Valley.",
      "Introduced endpoint management automation reducing onsite calls by 30%.",
      "Developed SLA and QA processes for helpdesk and engineering teams."
    ],
  },
  {
    role: "IT / Salesforce Admin",
    company: "Rosetta Stone",
    dates: "Earlier",
    bullets: [
      "Administered Salesforce environment and led helpdesk operations.",
      "Supported enterprise user management, reporting, and release testing."
    ],
  },
];


// --- ICON-READY SKILL DATA ---
// Place SVG icons in /public/icons/<slug>.svg (e.g., /icons/playwright.svg)
// Slug should match the "slug" below. If an icon is missing, a fallback monogram will render.
const PLATFORMS_LANGUAGES = [
  { name: "TypeScript", slug: "typescript" },
  { name: "JavaScript (Node.js)", slug: "nodejs" },
  { name: "Python", slug: "python" },
  { name: "C# / .NET", slug: "dotnet" },
  { name: "AWS", slug: "aws" },
  { name: "Docker", slug: "docker" },
];

const TOOLING = [
  { name: "Playwright", slug: "playwright" },
  { name: "Cypress", slug: "cypress" },
  { name: "Selenium", slug: "selenium" },
  { name: "Appium", slug: "appium" },
  { name: "Allure Reporting", slug: "allure" },
  { name: "GitHub Actions", slug: "github-actions" },
  { name: "LaunchDarkly", slug: "launchdarkly" },
  { name: "Braze", slug: "braze" },
  { name: "Postman", slug: "postman" },
  { name: "Jira", slug: "jira" },
  { name: "Xray", slug: "xray" },
];

// Education & Certifications data (icon-ready)
// Add official SVGs to /public/icons/<slug>.svg to render logos.
const EDUCATION = [
  { title: "B.S., Computer Science", subtitle: "Old Dominion University, 2016", slug: "odu" },
];

const CERTIFICATIONS = [
  { title: "ISTQB", subtitle: "Certified Tester Foundation Level", slug: "istqb" },
  { title: "Scrum Alliance", subtitle: "Certified Scrum Master", slug: "scrum" },
  { title: "Scrum Alliance", subtitle: "Certified Scrum Product Owner", slug: "scrum" },
  { title: "SAFe", subtitle: "SAFe Agilist", slug: "scaledagile" },
];

function SkillItem({ name, slug }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border p-3 hover:shadow-sm transition bg-background/60">
      <div className="h-8 w-8 shrink-0 rounded-lg border flex items-center justify-center overflow-hidden">
        {/* Try to load /icons/<slug>.svg. If it fails, show monogram fallback. */}
        <img
          src={`/icons/${slug}.svg`}
          alt={name}
          className="h-6 w-6"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent && !parent.querySelector('[data-fallback]')) {
              const span = document.createElement('span');
              span.setAttribute('data-fallback', '');
              span.className = 'text-xs font-semibold';
              span.textContent = name
                .replace(/[^A-Za-z0-9 ]/g, '')
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 3)
                .toUpperCase();
              parent.appendChild(span);
            }
          }}
        />
      </div>
      <span className="text-sm font-medium leading-tight">{name}</span>
    </div>
  );
}

function ListItemWithIcon({ title, subtitle, slug }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border p-3 bg-background/60">
      <div className="h-8 w-8 shrink-0 rounded-lg border flex items-center justify-center overflow-hidden">
        <img
          src={`/icons/${slug}.svg`}
          alt={title}
          className="h-6 w-6"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent && !parent.querySelector('[data-fallback]')) {
              const span = document.createElement('span');
              span.setAttribute('data-fallback', '');
              span.className = 'text-xs font-semibold';
              span.textContent = title
                .replace(/[^A-Za-z0-9 ]/g, '')
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 3)
                .toUpperCase();
              parent.appendChild(span);
            }
          }}
        />
      </div>
      <div className="leading-tight">
        <div className="text-sm font-medium text-left">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      </div>
    </div>
  );
}

function ExperienceItem(props) {
  const { role, company, dates, bullets } = props;
  return (
    <div className="rounded-3xl border p-4 md:p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
        <div className="font-semibold text-base md:text-lg">
          {role} - <span className="text-muted-foreground">{company}</span>
        </div>
        <div className="text-sm text-muted-foreground">{dates}</div>
      </div>
      <ul className="mt-3 list-disc pl-6 space-y-2 text-left">
        {bullets && bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Career() {
  return (
    <section id="career" className="py-24 px-4 relative" data-testid="section-career">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          {" "}
          My <span className="text-primary"> Career </span>
        </h2>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5">
            {TAB_CONFIG.map(({ value, label, Icon }) => (
              <TabsTrigger key={value} value={value} className="gap-2">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview">
            <Card className="mt-4">
              <CardHeader className="text-left">
                <h3 className="text-xl font-semibold">About Me</h3>
              </CardHeader>
              <CardContent className="space-y-5 leading-relaxed text-left md:max-w-3xl">
                <p>
                  I’m a husband and proud father to a bright, curious five-year-old who keeps life joyful and full of surprises. My family and I live in the beautiful Shenandoah Valley, where I find balance between career, creativity, and the simple joys of building intricate LEGO sets with my son.
                </p>
              
                <p>
                  Professionally, I’ve spent more than a decade in Software Quality Assurance and Engineering Leadership — guiding teams to deliver reliable, high-performing products across industries from telecommunications to media and SaaS. My work has centered on building modern automation frameworks, leading distributed QA teams, and fostering a “shift-left” culture where quality is everyone’s responsibility.
                </p>
                  <blockquote class="text-l italic font-semibold text-gray-900 dark:text-white">
                  <svg class="w-8 h-8 text-gray-400 dark:text-gray-600 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
        <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
    </svg>
                  <p>"Honest, empathetic feedback is the foundation of great quality outcomes..."</p>
                </blockquote>
                <p>
                  At the core of my leadership philosophy is a belief that honest, empathetic feedback is the foundation of great outcomes. When people feel safe to share ideas and mistakes alike, innovation thrives and quality naturally follows. I strive to model that mindset daily — with my team, my peers, and even at home — because quality, whether in software or relationships, is always the result of care and communication.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CORE SKILLS */}
          <TabsContent value="core">
            <Card className="mt-4">
              <CardContent className="space-y-8 p-6">
                {/* Platforms & Languages first */}
                <div>
                  <h4 className="font-semibold mb-4 text-lg">Platforms & Languages</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {PLATFORMS_LANGUAGES.map((s) => (
                      <SkillItem key={s.name} {...s} />
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Tooling second */}
                <div>
                  <h4 className="font-semibold mb-4 text-lg">Tooling & Frameworks</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {TOOLING.map((s) => (
                      <SkillItem key={s.name} {...s} />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AUTOMATION */}
          <TabsContent value="automation">
            <Card className="mt-4">
              <CardContent className="space-y-4 p-6 text-left">
                <h4 className="font-semibold">This site is a live automation demo with the following features:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Samples of API, Playwright, Visual regression, and Axe tests running automatically on commit through github actions. </li>
                  <li>Reporting rolled up to one master Allure report.</li>
                  <li>POM model automation, factory examples, custom matcher examples and more.</li>
                </ul>
                <Separator />
                <div className="text-sm text-muted-foreground">Ask me about: custom matchers (viewport checks), deterministic screenshots, and GitHub Pages report routing.</div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* EXPERIENCE */}
          <TabsContent value="experience">
            <Card className="mt-4">
              <CardContent className="space-y-6 p-6">
                {EXPERIENCE.map((e, idx) => (
                  <ExperienceItem key={idx} {...e} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* EDUCATION & CERTIFICATIONS */}
          <TabsContent value="education">
            <Card className="mt-4">
              <CardContent className="grid md:grid-cols-2 gap-6 p-6">
                <div>
                  <h4 className="font-semibold mb-4">Education</h4>
                  <div className="space-y-3">
                    {EDUCATION.map((e, i) => (
                      <ListItemWithIcon key={i} {...e} />
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Certifications</h4>
                  <div className="space-y-3">
                    {CERTIFICATIONS.map((c, i) => (
                      <ListItemWithIcon key={i} {...c} />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
