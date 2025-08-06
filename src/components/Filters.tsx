import React from 'react';
import { Sport, Platform, BetType } from '../types/betting';

interface FiltersProps {
  selectedSport: Sport | 'all';
  selectedPlatform: Platform | 'all';
  selectedBetType: BetType | 'all';
  onSportChange: (sport: Sport | 'all') => void;
  onPlatformChange: (platform: Platform | 'all') => void;
  onBetTypeChange: (betType: BetType | 'all') => void;
}

export const Filters: React.FC<FiltersProps> = ({
  selectedSport,
  selectedPlatform,
  selectedBetType,
  onSportChange,
  onPlatformChange,
  onBetTypeChange,
}) => {
  const sports: (Sport | 'all')[] = ['all', 'football', 'basketball', 'baseball', 'soccer', 'tennis', 'hockey'];
  const platforms: (Platform | 'all')[] = ['all', 'DraftKings', 'FanDuel', 'BetMGM', 'Caesars', 'PointsBet'];
  const betTypes: (BetType | 'all')[] = ['all', 'moneyline', 'spread', 'over/under', 'prop', 'parlay'];

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sport</label>
        <select
          value={selectedSport}
          onChange={(e) => onSportChange(e.target.value as Sport | 'all')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sports.map(sport => (
            <option key={sport} value={sport}>
              {sport === 'all' ? 'All Sports' : sport.charAt(0).toUpperCase() + sport.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
        <select
          value={selectedPlatform}
          onChange={(e) => onPlatformChange(e.target.value as Platform | 'all')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {platforms.map(platform => (
            <option key={platform} value={platform}>
              {platform === 'all' ? 'All Platforms' : platform}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bet Type</label>
        <select
          value={selectedBetType}
          onChange={(e) => onBetTypeChange(e.target.value as BetType | 'all')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {betTypes.map(betType => (
            <option key={betType} value={betType}>
              {betType === 'all' ? 'All Bet Types' : betType.charAt(0).toUpperCase() + betType.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};