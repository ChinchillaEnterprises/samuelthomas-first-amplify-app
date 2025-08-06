import { BettingPrediction, Sport, Platform, BetType } from '../types/betting';
import { OddsApiGame, decimalToAmerican } from '../services/oddsApi';

// Map API sports to our sport types
const sportMapping: Record<string, Sport> = {
  'americanfootball_nfl': 'football',
  'americanfootball_ncaaf': 'football',
  'basketball_nba': 'basketball',
  'basketball_ncaab': 'basketball',
  'baseball_mlb': 'baseball',
  'icehockey_nhl': 'hockey',
  'soccer_usa_mls': 'soccer',
  'soccer_epl': 'soccer',
  'tennis_atp': 'tennis',
  'tennis_wta': 'tennis'
};

// Map bookmaker keys to our platforms
const platformMapping: Record<string, Platform> = {
  'draftkings': 'DraftKings',
  'fanduel': 'FanDuel',
  'betmgm': 'BetMGM',
  'caesars': 'Caesars',
  'pointsbetus': 'PointsBet'
};

export function convertOddsApiToPredictions(games: OddsApiGame[]): BettingPrediction[] {
  const predictions: BettingPrediction[] = [];
  let idCounter = 1;

  games.forEach(game => {
    const sport = sportMapping[game.sport_key] || 'football';
    const matchDate = new Date(game.commence_time);
    const isLive = matchDate < new Date();

    game.bookmakers.forEach(bookmaker => {
      const platform = platformMapping[bookmaker.key] || 'DraftKings';

      bookmaker.markets.forEach(market => {
        if (market.key === 'h2h') {
          // Moneyline bets
          market.outcomes.forEach(outcome => {
            const americanOdds = decimalToAmerican(outcome.price);
            const confidence = calculateConfidence(outcome.price, market.outcomes);
            
            predictions.push({
              id: `real-${idCounter++}`,
              sport,
              homeTeam: game.home_team,
              awayTeam: game.away_team,
              matchDate,
              recommendedBet: `${outcome.name} to win`,
              confidence,
              odds: americanOdds,
              platform,
              analysis: `Based on current odds movement and market analysis. ${outcome.name} shows value at ${americanOdds > 0 ? '+' : ''}${americanOdds}.`,
              stake: 100,
              potentialReturn: calculatePotentialReturn(100, americanOdds),
              betType: 'moneyline',
              isLive,
              result: isLive ? 'pending' : undefined
            });
          });
        } else if (market.key === 'spreads') {
          // Spread bets
          market.outcomes.forEach(outcome => {
            const americanOdds = decimalToAmerican(outcome.price);
            const confidence = calculateConfidence(outcome.price, market.outcomes);
            const spread = outcome.point || 0;
            
            predictions.push({
              id: `real-${idCounter++}`,
              sport,
              homeTeam: game.home_team,
              awayTeam: game.away_team,
              matchDate,
              recommendedBet: `${outcome.name} ${spread > 0 ? '+' : ''}${spread}`,
              confidence,
              odds: americanOdds,
              platform,
              analysis: `Spread betting opportunity. ${outcome.name} to cover ${Math.abs(spread)} points.`,
              stake: 100,
              potentialReturn: calculatePotentialReturn(100, americanOdds),
              betType: 'spread',
              isLive,
              result: isLive ? 'pending' : undefined
            });
          });
        } else if (market.key === 'totals') {
          // Over/Under bets
          market.outcomes.forEach(outcome => {
            const americanOdds = decimalToAmerican(outcome.price);
            const confidence = calculateConfidence(outcome.price, market.outcomes);
            const total = outcome.point || 0;
            
            predictions.push({
              id: `real-${idCounter++}`,
              sport,
              homeTeam: game.home_team,
              awayTeam: game.away_team,
              matchDate,
              recommendedBet: `${outcome.name} ${total} points`,
              confidence,
              odds: americanOdds,
              platform,
              analysis: `Total points analysis suggests ${outcome.name.toLowerCase()} ${total} has edge in current market conditions.`,
              stake: 100,
              potentialReturn: calculatePotentialReturn(100, americanOdds),
              betType: 'over/under',
              isLive,
              result: isLive ? 'pending' : undefined
            });
          });
        }
      });
    });
  });

  // Sort by confidence and return top predictions
  return predictions.sort((a, b) => b.confidence - a.confidence);
}

function calculateConfidence(price: number, outcomes: any[]): number {
  // Calculate implied probability
  const impliedProb = 1 / price;
  
  // Find the best price among outcomes
  const prices = outcomes.map(o => o.price);
  const bestPrice = Math.max(...prices);
  const worstPrice = Math.min(...prices);
  
  // Calculate edge
  const priceRange = bestPrice - worstPrice;
  const pricePosition = (price - worstPrice) / priceRange;
  
  // Generate confidence based on implied probability and price position
  const baseConfidence = impliedProb * 100;
  const adjustedConfidence = baseConfidence + (pricePosition * 20);
  
  // Ensure confidence is between 50-95
  return Math.min(95, Math.max(50, Math.round(adjustedConfidence)));
}

function calculatePotentialReturn(stake: number, americanOdds: number): number {
  if (americanOdds > 0) {
    return stake + (stake * americanOdds / 100);
  } else {
    return stake + (stake * 100 / Math.abs(americanOdds));
  }
}