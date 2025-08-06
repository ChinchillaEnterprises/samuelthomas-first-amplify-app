import { BettingPrediction, Sport, Platform, BetType } from '../types/betting';
import { addHours, addDays } from 'date-fns';

const teams = {
  football: [
    ['Kansas City Chiefs', 'Buffalo Bills'],
    ['Dallas Cowboys', 'Philadelphia Eagles'],
    ['Green Bay Packers', 'Chicago Bears'],
    ['New England Patriots', 'Miami Dolphins'],
    ['San Francisco 49ers', 'Los Angeles Rams']
  ],
  basketball: [
    ['Los Angeles Lakers', 'Boston Celtics'],
    ['Golden State Warriors', 'Phoenix Suns'],
    ['Milwaukee Bucks', 'Brooklyn Nets'],
    ['Denver Nuggets', 'Utah Jazz'],
    ['Miami Heat', 'Philadelphia 76ers']
  ],
  baseball: [
    ['New York Yankees', 'Boston Red Sox'],
    ['Los Angeles Dodgers', 'San Francisco Giants'],
    ['Houston Astros', 'Texas Rangers'],
    ['Atlanta Braves', 'New York Mets'],
    ['Chicago Cubs', 'St. Louis Cardinals']
  ],
  soccer: [
    ['Manchester United', 'Liverpool FC'],
    ['Real Madrid', 'Barcelona'],
    ['Bayern Munich', 'Borussia Dortmund'],
    ['Paris Saint-Germain', 'Marseille'],
    ['Juventus', 'AC Milan']
  ],
  tennis: [
    ['Novak Djokovic', 'Rafael Nadal'],
    ['Carlos Alcaraz', 'Jannik Sinner'],
    ['Daniil Medvedev', 'Stefanos Tsitsipas'],
    ['Andrey Rublev', 'Casper Ruud'],
    ['Taylor Fritz', 'Frances Tiafoe']
  ],
  hockey: [
    ['Tampa Bay Lightning', 'Florida Panthers'],
    ['Colorado Avalanche', 'Minnesota Wild'],
    ['Toronto Maple Leafs', 'Montreal Canadiens'],
    ['Edmonton Oilers', 'Calgary Flames'],
    ['New York Rangers', 'New Jersey Devils']
  ]
};

const betDescriptions = {
  moneyline: (team: string) => `${team} to win`,
  spread: (team: string, spread: number) => `${team} ${spread > 0 ? '+' : ''}${spread}`,
  'over/under': (total: number) => `Over ${total} points`,
  prop: (player: string, stat: string, value: number) => `${player} ${stat} ${value}+`,
  parlay: () => '3-leg parlay (see details)'
};

export function generateMockPredictions(count: number = 20): BettingPrediction[] {
  const predictions: BettingPrediction[] = [];
  const sports = Object.keys(teams) as Sport[];
  const platforms: Platform[] = ['DraftKings', 'FanDuel', 'BetMGM', 'Caesars', 'PointsBet'];
  const betTypes: BetType[] = ['moneyline', 'spread', 'over/under', 'prop', 'parlay'];

  for (let i = 0; i < count; i++) {
    const sport = sports[Math.floor(Math.random() * sports.length)];
    const matchup = teams[sport][Math.floor(Math.random() * teams[sport].length)];
    const [awayTeam, homeTeam] = matchup;
    const betType = betTypes[Math.floor(Math.random() * betTypes.length)];
    const isLive = Math.random() > 0.85;
    
    let recommendedBet = '';
    const favoredTeam = Math.random() > 0.5 ? homeTeam : awayTeam;
    
    switch (betType) {
      case 'moneyline':
        recommendedBet = betDescriptions.moneyline(favoredTeam);
        break;
      case 'spread':
        const spread = Math.floor(Math.random() * 14) - 7;
        recommendedBet = betDescriptions.spread(favoredTeam, spread);
        break;
      case 'over/under':
        const total = Math.floor(Math.random() * 50) + 200;
        recommendedBet = betDescriptions['over/under'](total);
        break;
      case 'prop':
        const playerName = favoredTeam.split(' ')[0] + ' Player';
        const stats = ['Points', 'Rebounds', 'Assists', 'Yards', 'Goals'];
        const stat = stats[Math.floor(Math.random() * stats.length)];
        const value = Math.floor(Math.random() * 30) + 10;
        recommendedBet = betDescriptions.prop(playerName, stat, value);
        break;
      case 'parlay':
        recommendedBet = betDescriptions.parlay();
        break;
    }

    const confidence = Math.floor(Math.random() * 40) + 60;
    const odds = Math.floor(Math.random() * 400) - 200;
    const stake = [25, 50, 100, 200, 500][Math.floor(Math.random() * 5)];
    const potentialReturn = odds > 0 ? stake * (odds / 100 + 1) : stake * (100 / Math.abs(odds) + 1);

    predictions.push({
      id: `pred-${i + 1}`,
      sport,
      homeTeam,
      awayTeam,
      matchDate: isLive ? new Date() : addHours(new Date(), Math.floor(Math.random() * 72)),
      recommendedBet,
      confidence,
      odds,
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      analysis: `Based on recent performance and statistical analysis, this bet offers strong value. Key factors include team form, head-to-head records, and current market inefficiencies.`,
      potentialReturn,
      stake,
      betType,
      isLive,
      result: isLive ? 'pending' : undefined
    });
  }

  return predictions.sort((a, b) => b.confidence - a.confidence);
}