#  Tuliza AI — Frontend

> Mobile-first clinical navigator interface for early pregnancy loss care  
> Built for the **AI for Reproductive Health in Africa Innovation Challenge** · APHRC 2026

[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-purple)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-teal)](https://tailwindcss.com)

---

## What This Is

The Tuliza AI frontend is a mobile-first React application that gives
Community Health Volunteers (CHVs) and frontline health workers a simple,
three-step interface to:

1. **Triage** — assess care-seeking risk via NLP symptom analysis or structured form
2. **Route** — find the nearest equipped facility with PAC services available
3. **Support** — access bilingual aftercare guidance in English and Kiswahili

Designed to match APHRC's clinical branding and optimised for low-bandwidth,
mobile-browser use in informal settlement settings.

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Tuliza AI backend running on port 8000

### 1. Clone the repository

```bash
git clone https://github.com/TULIZA-AI/Tuliza-Frontend-v2.git
cd Tuliza-Frontend-v2
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:8000
```

For production, set this to your deployed backend URL.

### 4. Start development server

```bash
npm run dev
```

App is live at: **http://localhost:5173**

> Make sure the backend is running at port 8000 before using the app.

---

## Building for Production

```bash
npm run build
```

Output is in `dist/`. Deploy to any static host (Vercel, Netlify,
Render Static Sites).

---

## Project Structure

```
Tuliza-Frontend-v2/
├── src/
│   ├── App.tsx                    # Root component, step state, navigation
│   ├── types.ts                   # Shared TypeScript interfaces
│   ├── api/
│   │   └── tuliza.ts              # All API calls (axios client)
│   ├── pages/
│   │   ├── Triage.tsx             # Step 1 — NLP analyser + clinical form
│   │   ├── Facilities.tsx         # Step 2 — facility routing results
│   │   └── Aftercare.tsx          # Step 3 — bilingual aftercare content
│   └── components/
│       ├── StepIndicator.tsx      # 3-step progress indicator
│       ├── RiskBadge.tsx          # Risk level display component
│       └── FacilityCard.tsx       # Individual facility card
├── public/
├── index.html
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## Key Features

### NLP Symptom Analyser
Type symptoms in English or Swahili — the AI layer returns an urgency
assessment instantly before the CHV completes the structured form.

```
Input:  "heavy bleeding and fever since yesterday"
        "ana damu nyingi na homa kali sana"

Output: HIGH URGENCY · 89% confidence
        Detected: Haemorrhage risk, Fever
        → Immediate referral required
```

### Intelligent Facility Routing
Facilities are scored and ranked by PAC capacity, stock availability,
and distance. HIGH risk cases always see the highest-capacity available
facility first. Stocked-out facilities are excluded.

### Bilingual Aftercare
Toggle between English and Kiswahili for:
- Emotional support messaging
- Physical care guidance
- Clinical danger signs (6 warning signs)
- Community support resources

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | Backend API base URL |

---

## Connecting to Backend

The frontend expects the Tuliza AI backend at `VITE_API_URL`.

All API calls are centralised in `src/api/tuliza.ts`:

```typescript
// Triage assessment
export const assessRisk = (d: TriageRequest) =>
  api.post<TriageResponse>('/api/triage/assess', d);

// NLP symptom analysis
export const analyseSymptoms = (text: string) =>
  api.post<NLPResult>('/api/nlp/symptom-triage', { text });

// Facility routing
export const findFacilities = (d: FacilityQuery) =>
  api.post('/api/facilities/find', d);

// Aftercare content
export const getAftercare = (d: AftercareQuery) =>
  api.post('/api/aftercare/support', d);
```

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 5 | Build tool |
| Tailwind CSS | 3 | Styling |
| Axios | 1.6 | HTTP client |
| Lucide React | latest | Icons |

---

## Team

**Team Tuliza AI** — AI for Reproductive Health in Africa Innovation Challenge 2026

| Member | Role |
|--------|------|
| Jackson Mugwe | Lead Engineer |
| Alex Muriuki | ML Engineer |
| Samuel Kiragu | Backend Engineer |
| Sharon Kariuki | Clinical Lead |
| Kemunto Zawadi | UX & Clinical Insight |
| Vivian Rehema | UX & Clinical Insight |

---

## Licence

MIT Licence

*Built on APHRC data · Designed for Kenyan CHVs · Built to save lives 🌿*
