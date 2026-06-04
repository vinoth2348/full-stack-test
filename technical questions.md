Question 1
How long did you spend on the coding test? What would you add if you had more time?

"I spent around 4 to 5 hours on it. I focused on getting the core functionality solid — the three-column layout, the tab and slider sync, responsive accordion on mobile, and the full PHP CRUD with a clean API structure. I kept CSS, JS, and PHP separated properly so it's maintainable.
If I had more time, the first thing I'd add is proper input validation on the frontend before hitting the API — right now validation only happens server-side. I'd also add authentication to protect the admin panel, since anyone can currently access it. Beyond that, I'd add image cropping before upload, keyboard navigation for accessibility, and unit tests for the API endpoints using PHPUnit. I'd also look at adding a drag-and-drop reorder for tabs and slides instead of manually setting sort order numbers."

Question 2
How would you track down a performance issue in production? Have you ever had to do this?

"My first step is always to measure before touching anything. I open browser DevTools, check the Network tab for slow requests, and run Lighthouse to get Core Web Vitals — LCP, CLS, and interaction delay. That tells me which layer the problem is in.
If it's the frontend, I look at render-blocking scripts, large uncompressed images, or JavaScript doing too much work on the main thread. If it's the backend, I check PHP response times and run EXPLAIN on database queries to spot missing indexes or N+1 problems.
I did run into this during a project where pages were loading slowly on mobile. Lighthouse showed LCP was over 6 seconds. I traced it to a large image being loaded eagerly without compression. After converting it to WebP and adding lazy loading, LCP dropped to under 2 seconds. I also found the API was running multiple queries in a loop — replacing that with a single JOIN cut the response time from about 340ms down to 28ms. The key thing I learned is — fix one thing at a time and measure after each change, otherwise you don't know what actually made the difference."

Question 3
"Please describe yourself using JSON.

{
  "name": "Vinoth R",
  "role": "Full Stack Developer",
  "experience_years": 3.8,
  "strengths": ["clean code", "pixel-perfect UI", "problem solving"],
  "core_skills": {
    "frontend": ["HTML5","CSS3","JavaScript (ES6+)","jQuery","Bootstrap","Responsive Design"],
    "backend": ["PHP","MySQL","REST APIs"],
    "cms": {
      "wordpress": {
        "custom_theme_development": true,
        "custom_plugin_development": true,
        "custom_template_development": true,
        "theme_customization": true,
        "gutenberg_blocks": true,
        "woocommerce": true
      }
    },
    "tools": ["Git","VS Code","Chrome DevTools","Postman"]
  },
  "code_philosophy": "readable over clever",
  "when_stuck": "research first, then attempt, then ask",
  "outside_of_work": ["cricket", "exploring new tools"],
  "open_to": "new challenges and growth"
}