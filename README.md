# FBA Fitness — Frontend Demo

Next.js 16 · Tailwind CSS v4 · Framer Motion · TypeScript

## Requirements

- Node.js **18+** (check with `node -v`)
- npm **9+** (check with `npm -v`)

## Getting Started

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd fba-fitness

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
fba-fitness/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Home
│   ├── plans/            # Plans shop
│   ├── fitness-plan/     # Fitness recommendation + form
│   ├── meal-plan/        # Meal recommendation + form
│   ├── bmi/              # BMI calculator
│   ├── about/
│   ├── blog/
│   ├── contact/
│   ├── faq/
│   ├── how-it-works/
│   ├── testimonials/
│   ├── login/
│   └── register/
├── components/
│   ├── layout/           # Navbar, Footer
│   └── ui/               # Shared components
├── lib/
│   └── data.ts           # All static data + recommendation engine
└── public/
    └── images/           # Local images
```

## Notes

- All content is currently hardcoded in `lib/data.ts` — ready to be replaced with API calls
- No `.env` file needed for the demo — no external services connected yet
- Images are served from `public/images/` — included in the repo
