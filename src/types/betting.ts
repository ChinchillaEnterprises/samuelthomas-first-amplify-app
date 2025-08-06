export type Sport = 'football' | 'basketball' | 'baseball' | 'soccer' | 'tennis' | 'hockey';
export type Platform = 'DraftKings' | 'FanDuel' | 'BetMGM' | 'Caesars' | 'PointsBet';
export type BetType = 'moneyline' | 'spread' | 'over/under' | 'prop' | 'parlay';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface BettingPrediction {
  id: string;
  sport: Sport;
  homeTeam: string;
  awayTeam: string;
  matchDate: Date;
  recommendedBet: string;
  confidence: number; // 0-100
  odds: number;
  platform: Platform;
  analysis?: string;
  potentialReturn?: number;
  stake?: number;
  betType: BetType;
  isLive: boolean;
  result?: 'win' | 'loss' | 'push' | 'pending';
}

export interface UserPreferences {
  favoriteSports: Sport[];
  preferredPlatforms: Platform[];
  bankroll: number;
  riskTolerance: RiskLevel;
}

export interface PlatformOdds {
  platform: Platform;
  odds: number;
  lastUpdated: Date;
}

export interface BettingStats {
  totalBets: number;
  winRate: number;
  profit: number;
  roi: number;
  streak: number;
}