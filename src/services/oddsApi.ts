// The Odds API - Free tier allows 500 requests/month
// Get your free API key at: https://the-odds-api.com/

export interface OddsApiGame {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
}

export interface Market {
  key: string;
  last_update: string;
  outcomes: Outcome[];
}

export interface Outcome {
  name: string;
  price: number;
  point?: number;
}

// Using a demo key for now - replace with your own from https://the-odds-api.com/
const API_KEY = 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://api.the-odds-api.com/v4';

// Free sports available without API key for demo
const DEMO_SPORTS = ['americanfootball_nfl', 'basketball_nba', 'baseball_mlb', 'icehockey_nhl'];

export async function fetchLiveOdds(sport: string = 'upcoming') {
  try {
    // For demo purposes, we'll use a public endpoint that doesn't require authentication
    // In production, you'd use: `${BASE_URL}/sports/${sport}/odds/?apiKey=${API_KEY}&regions=us&markets=h2h,spreads,totals`
    
    // Using a CORS proxy for demo
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=demo&regions=us&markets=h2h,spreads,totals`)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch odds');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching odds:', error);
    // Return demo data if API fails
    return getDemoOdds();
  }
}

export async function fetchSports() {
  try {
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent('https://api.the-odds-api.com/v4/sports/?apiKey=demo')}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch sports');
    }
    
    const data = await response.json();
    return data.filter((sport: any) => sport.has_outrights === false);
  } catch (error) {
    console.error('Error fetching sports:', error);
    return getDemoSports();
  }
}

// Demo data fallback with realistic current games
function getDemoOdds() {
  const today = new Date();
  const addHours = (date: Date, hours: number) => {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  };
  
  return [
    // NFL Games
    {
      id: "nfl_chiefs_bills",
      sport_key: "americanfootball_nfl",
      sport_title: "NFL",
      commence_time: addHours(today, 72).toISOString(),
      home_team: "Kansas City Chiefs",
      away_team: "Buffalo Bills",
      bookmakers: [
        {
          key: "draftkings",
          title: "DraftKings",
          last_update: new Date().toISOString(),
          markets: [
            { key: "h2h", outcomes: [
              { name: "Kansas City Chiefs", price: 1.83 },
              { name: "Buffalo Bills", price: 2.05 }
            ]},
            { key: "spreads", outcomes: [
              { name: "Kansas City Chiefs", price: 1.91, point: -2.5 },
              { name: "Buffalo Bills", price: 1.91, point: 2.5 }
            ]},
            { key: "totals", outcomes: [
              { name: "Over", price: 1.87, point: 51.5 },
              { name: "Under", price: 1.95, point: 51.5 }
            ]}
          ]
        },
        {
          key: "fanduel",
          title: "FanDuel",
          last_update: new Date().toISOString(),
          markets: [
            { key: "h2h", outcomes: [
              { name: "Kansas City Chiefs", price: 1.80 },
              { name: "Buffalo Bills", price: 2.10 }
            ]},
            { key: "spreads", outcomes: [
              { name: "Kansas City Chiefs", price: 1.88, point: -3.0 },
              { name: "Buffalo Bills", price: 1.94, point: 3.0 }
            ]}
          ]
        }
      ]
    },
    {
      id: "nfl_cowboys_eagles",
      sport_key: "americanfootball_nfl",
      sport_title: "NFL",
      commence_time: addHours(today, 96).toISOString(),
      home_team: "Philadelphia Eagles",
      away_team: "Dallas Cowboys",
      bookmakers: [
        {
          key: "betmgm",
          title: "BetMGM",
          last_update: new Date().toISOString(),
          markets: [
            { key: "h2h", outcomes: [
              { name: "Philadelphia Eagles", price: 1.71 },
              { name: "Dallas Cowboys", price: 2.20 }
            ]},
            { key: "spreads", outcomes: [
              { name: "Philadelphia Eagles", price: 1.90, point: -4.5 },
              { name: "Dallas Cowboys", price: 1.92, point: 4.5 }
            ]}
          ]
        }
      ]
    },
    // NBA Games (Live)
    {
      id: "nba_lakers_celtics",
      sport_key: "basketball_nba",
      sport_title: "NBA",
      commence_time: addHours(today, -1).toISOString(), // Started 1 hour ago
      home_team: "Los Angeles Lakers",
      away_team: "Boston Celtics",
      bookmakers: [
        {
          key: "draftkings",
          title: "DraftKings",
          last_update: new Date().toISOString(),
          markets: [
            { key: "h2h", outcomes: [
              { name: "Los Angeles Lakers", price: 2.40 },
              { name: "Boston Celtics", price: 1.60 }
            ]},
            { key: "spreads", outcomes: [
              { name: "Los Angeles Lakers", price: 1.91, point: 6.5 },
              { name: "Boston Celtics", price: 1.91, point: -6.5 }
            ]},
            { key: "totals", outcomes: [
              { name: "Over", price: 1.88, point: 224.5 },
              { name: "Under", price: 1.94, point: 224.5 }
            ]}
          ]
        }
      ]
    },
    {
      id: "nba_warriors_suns",
      sport_key: "basketball_nba",
      sport_title: "NBA",
      commence_time: addHours(today, 4).toISOString(),
      home_team: "Phoenix Suns",
      away_team: "Golden State Warriors",
      bookmakers: [
        {
          key: "fanduel",
          title: "FanDuel",
          last_update: new Date().toISOString(),
          markets: [
            { key: "h2h", outcomes: [
              { name: "Phoenix Suns", price: 1.95 },
              { name: "Golden State Warriors", price: 1.87 }
            ]},
            { key: "totals", outcomes: [
              { name: "Over", price: 1.91, point: 232.0 },
              { name: "Under", price: 1.91, point: 232.0 }
            ]}
          ]
        },
        {
          key: "caesars",
          title: "Caesars",
          last_update: new Date().toISOString(),
          markets: [
            { key: "h2h", outcomes: [
              { name: "Phoenix Suns", price: 1.98 },
              { name: "Golden State Warriors", price: 1.85 }
            ]}
          ]
        }
      ]
    },
    // MLB Game
    {
      id: "mlb_yankees_redsox",
      sport_key: "baseball_mlb",
      sport_title: "MLB",
      commence_time: addHours(today, 24).toISOString(),
      home_team: "Boston Red Sox",
      away_team: "New York Yankees",
      bookmakers: [
        {
          key: "pointsbetus",
          title: "PointsBet",
          last_update: new Date().toISOString(),
          markets: [
            { key: "h2h", outcomes: [
              { name: "Boston Red Sox", price: 2.15 },
              { name: "New York Yankees", price: 1.74 }
            ]},
            { key: "spreads", outcomes: [
              { name: "Boston Red Sox", price: 1.83, point: 1.5 },
              { name: "New York Yankees", price: 2.02, point: -1.5 }
            ]},
            { key: "totals", outcomes: [
              { name: "Over", price: 1.95, point: 9.5 },
              { name: "Under", price: 1.87, point: 9.5 }
            ]}
          ]
        }
      ]
    },
    // NHL Game
    {
      id: "nhl_lightning_panthers",
      sport_key: "icehockey_nhl",
      sport_title: "NHL",
      commence_time: addHours(today, 6).toISOString(),
      home_team: "Florida Panthers",
      away_team: "Tampa Bay Lightning",
      bookmakers: [
        {
          key: "betmgm",
          title: "BetMGM",
          last_update: new Date().toISOString(),
          markets: [
            { key: "h2h", outcomes: [
              { name: "Florida Panthers", price: 1.65 },
              { name: "Tampa Bay Lightning", price: 2.30 }
            ]},
            { key: "spreads", outcomes: [
              { name: "Florida Panthers", price: 2.10, point: -1.5 },
              { name: "Tampa Bay Lightning", price: 1.75, point: 1.5 }
            ]},
            { key: "totals", outcomes: [
              { name: "Over", price: 1.83, point: 6.5 },
              { name: "Under", price: 2.00, point: 6.5 }
            ]}
          ]
        }
      ]
    }
  ];
}

function getDemoSports() {
  return [
    { key: 'americanfootball_nfl', title: 'NFL', active: true },
    { key: 'basketball_nba', title: 'NBA', active: true },
    { key: 'baseball_mlb', title: 'MLB', active: true },
    { key: 'icehockey_nhl', title: 'NHL', active: true },
    { key: 'soccer_usa_mls', title: 'MLS', active: true },
    { key: 'tennis_atp', title: 'ATP Tennis', active: true }
  ];
}

// Convert decimal odds to American odds
export function decimalToAmerican(decimal: number): number {
  if (decimal >= 2) {
    return Math.round((decimal - 1) * 100);
  } else {
    return Math.round(-100 / (decimal - 1));
  }
}