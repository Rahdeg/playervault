# PlayerVault

Search, compare, and discover athletes across multiple sports. Built with React + Vite as a university web design project at the University of Roehampton.

## Features

- Real-time player search powered by [TheSportsDB](https://www.thesportsdb.com/)
- Filter by sport, nationality, position, and age range
- Side-by-side player comparison with weighted scoring across 9 criteria
- Orbital player cards with animated stats
- Contact form via EmailJS

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd player-finder

# Install dependencies
npm install
```

### Environment Variables

The app requires a `.env` file in the project root for the contact form to work. Create one by copying the example below:

```bash
cp .env.example .env
```

Then open `.env` and fill in your own values:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

#### How to get your EmailJS credentials

1. Sign up at [emailjs.com](https://www.emailjs.com/)
2. Go to **Email Services** and add your email provider — copy the **Service ID**
3. Go to **Email Templates**, create a template, and copy the **Template ID**
4. Go to **Account > API Keys** and copy your **Public Key**

> The player search works without any API key — TheSportsDB's free tier is used directly and requires no authentication.

---

## Running the App

```bash
# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

---

## How to Use

### Search for a Player

1. Navigate to the **Search** page from the header
2. Type a player's name in the search bar — results update as you type
3. Use the **Filters** panel to narrow results by:
   - Sport (Football, Basketball, Cricket, etc.)
   - Nationality
   - Position
   - Age range

### Compare Players

1. From the search results, click the **Compare** button on any player card to add them to the comparison tray (up to 2 players)
2. Once two players are selected, click **Compare** in the tray at the bottom of the screen
3. The comparison page shows a side-by-side breakdown with a weighted score across 9 criteria

### Player Detail

Click any player card to open their detail page — includes biography, team, nationality, position, and an orbital stats visualization.

### Contact

Use the **About** page to send a message via the contact form. This requires your EmailJS credentials to be set up in `.env`.

---

## Project Structure

```
src/
├── pages/              # Route-level components (Home, Search, Player, Compare, About)
├── components/
│   ├── layout/         # Header, Footer, ScrollProgressNav
│   ├── search/         # SearchBar, FiltersPanel, PlayersGrid, PlayerCard, CompareBar
│   └── ui/             # shadcn/ui primitives (Button, Card, Input, etc.)
├── context/            # PreferencesContext — shared search query and filter state
└── lib/
    ├── providers/      # TheSportsDB API integration and data normalization
    └── comparePlayers.js  # Weighted scoring logic for player comparison
```

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 19 + React Router 7 | UI and client-side routing |
| Vite 7 | Dev server and bundler |
| Tailwind CSS 4 + shadcn/ui | Styling and component primitives |
| Framer Motion 12 | Animations and page transitions |
| TheSportsDB API | Player data (free tier, no key required) |
| EmailJS | Contact form email delivery |
| Vercel | Deployment (SPA rewrite configured in `vercel.json`) |

---

## Deployment

The app is configured for Vercel. Push to your connected branch and Vercel will build automatically. Ensure your environment variables are added in the Vercel project settings under **Settings > Environment Variables** — the `.env` file is not deployed.
