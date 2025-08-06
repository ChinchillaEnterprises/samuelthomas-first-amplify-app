import React from 'react';
import { Trophy, TrendingUp, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { BettingPrediction } from '../types/betting';
import { format } from 'date-fns';

interface BetCardProps {
  prediction: BettingPrediction;
  onSelect?: () => void;
}

export const BetCard: React.FC<BetCardProps> = ({ prediction, onSelect }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-50';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const formatOdds = (odds: number) => {
    return odds > 0 ? `+${odds}` : odds.toString();
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-600 uppercase">{prediction.sport}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            {prediction.awayTeam} @ {prediction.homeTeam}
          </h3>
        </div>
        <div className={`px-3 py-1 rounded-full ${getConfidenceColor(prediction.confidence)}`}>
          <span className="text-sm font-semibold">{prediction.confidence}%</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(prediction.matchDate), 'MMM d, yyyy h:mm a')}</span>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Recommended Bet</span>
            <span className="text-sm font-semibold text-gray-900 uppercase">{prediction.betType}</span>
          </div>
          <p className="text-lg font-bold text-gray-900 mb-2">{prediction.recommendedBet}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-lg font-bold text-green-600">{formatOdds(prediction.odds)}</span>
            </div>
            <span className="text-sm text-gray-600">via {prediction.platform}</span>
          </div>
        </div>

        {prediction.stake && prediction.potentialReturn && (
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Stake: ${prediction.stake}</span>
            </div>
            <span className="text-sm font-semibold text-green-600">
              Potential Return: ${prediction.potentialReturn.toFixed(2)}
            </span>
          </div>
        )}

        {prediction.isLive && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">LIVE BET</span>
          </div>
        )}
      </div>
    </div>
  );
};