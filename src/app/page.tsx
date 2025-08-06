"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from "@aws-amplify/ui-react";
import type { Schema } from "../../amplify/data/resource";
import "@aws-amplify/ui-react/styles.css";
import "./amplify-config";
import { BetCard } from "../components/BetCard";
import { StatsCard } from "../components/StatsCard";
import { Filters } from "../components/Filters";
import { generateMockPredictions } from "../utils/mockData";
import { BettingPrediction, Sport, Platform, BetType } from "../types/betting";
import { TrendingUp, DollarSign, Target, Award, Activity, Bell, RefreshCw } from "lucide-react";
import { fetchLiveOdds, fetchSports } from "../services/oddsApi";
import { convertOddsApiToPredictions } from "../utils/oddsConverter";
import { format } from 'date-fns';

const client = generateClient<Schema>();

export default function Home() {
  const [predictions, setPredictions] = useState<BettingPrediction[]>([]);
  const [selectedSport, setSelectedSport] = useState<Sport | 'all'>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [selectedBetType, setSelectedBetType] = useState<BetType | 'all'>('all');
  const [selectedPrediction, setSelectedPrediction] = useState<BettingPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchRealOdds = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch odds for multiple sports
      const sports = ['americanfootball_nfl', 'basketball_nba', 'baseball_mlb', 'icehockey_nhl'];
      const allGames = [];
      
      for (const sport of sports) {
        try {
          const games = await fetchLiveOdds(sport);
          if (Array.isArray(games)) {
            allGames.push(...games);
          }
        } catch (err) {
          console.error(`Failed to fetch ${sport}:`, err);
        }
      }
      
      if (allGames.length > 0) {
        const realPredictions = convertOddsApiToPredictions(allGames);
        setPredictions(realPredictions);
      } else {
        // Fallback to mock data if no real data available
        const mockData = generateMockPredictions(20);
        setPredictions(mockData);
        setError('Using demo data. For real odds, sign up at the-odds-api.com');
      }
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching odds:', err);
      setError('Failed to fetch live odds. Using demo data.');
      const mockData = generateMockPredictions(20);
      setPredictions(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRealOdds();
    
    // Refresh odds every 5 minutes
    const interval = setInterval(fetchRealOdds, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter predictions based on selected filters
  const filteredPredictions = predictions.filter(pred => {
    if (selectedSport !== 'all' && pred.sport !== selectedSport) return false;
    if (selectedPlatform !== 'all' && pred.platform !== selectedPlatform) return false;
    if (selectedBetType !== 'all' && pred.betType !== selectedBetType) return false;
    return true;
  });

  // Calculate stats
  const totalBets = filteredPredictions.length;
  const avgConfidence = filteredPredictions.reduce((acc, pred) => acc + pred.confidence, 0) / totalBets || 0;
  const potentialProfit = filteredPredictions.reduce((acc, pred) => 
    acc + ((pred.potentialReturn || 0) - (pred.stake || 0)), 0
  );
  const highConfidenceBets = filteredPredictions.filter(pred => pred.confidence >= 80).length;

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
                  <h1 className="text-2xl font-bold text-gray-900">BetPredict Pro</h1>
                  <span className="ml-4 text-sm text-gray-500">
                    Real-Time Odds
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={fetchRealOdds}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh Odds
                  </button>
                  <div className="text-xs text-gray-500">
                    Updated: {format(lastUpdated, 'h:mm a')}
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Bell className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="text-sm text-gray-600">
                    {user?.signInDetails?.loginId}
                  </span>
                  <button
                    onClick={signOut}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-4 rounded-lg"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">{error}</p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Active Predictions"
                value={totalBets}
                icon={Activity}
                trend={{ value: 12, isPositive: true }}
                color="blue"
              />
              <StatsCard
                title="Average Confidence"
                value={`${avgConfidence.toFixed(1)}%`}
                icon={Target}
                trend={{ value: 5, isPositive: true }}
                color="green"
              />
              <StatsCard
                title="Potential Profit"
                value={`$${potentialProfit.toFixed(2)}`}
                icon={DollarSign}
                trend={{ value: 23, isPositive: true }}
                color="purple"
              />
              <StatsCard
                title="High Confidence"
                value={highConfidenceBets}
                icon={Award}
                color="orange"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <Filters
                  selectedSport={selectedSport}
                  selectedPlatform={selectedPlatform}
                  selectedBetType={selectedBetType}
                  onSportChange={setSelectedSport}
                  onPlatformChange={setSelectedPlatform}
                  onBetTypeChange={setSelectedBetType}
                />
              </div>

              {/* Predictions Grid */}
              <div className="lg:col-span-3">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Betting Predictions ({filteredPredictions.length})
                  </h2>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      Sort by Confidence
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      Live Bets Only
                    </button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Fetching live odds from sportsbooks...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredPredictions.map((prediction) => (
                        <BetCard
                          key={prediction.id}
                          prediction={prediction}
                          onSelect={() => setSelectedPrediction(prediction)}
                        />
                      ))}
                    </div>

                    {filteredPredictions.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No predictions match your current filters.</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </main>

          {/* Prediction Detail Modal */}
          {selectedPrediction && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                <h3 className="text-xl font-bold mb-4">Prediction Details</h3>
                <div className="space-y-4">
                  <p><strong>Match:</strong> {selectedPrediction.awayTeam} @ {selectedPrediction.homeTeam}</p>
                  <p><strong>Recommended Bet:</strong> {selectedPrediction.recommendedBet}</p>
                  <p><strong>Analysis:</strong> {selectedPrediction.analysis}</p>
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      onClick={() => setSelectedPrediction(null)}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Close
                    </button>
                    <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                      Place Bet on {selectedPrediction.platform}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Authenticator>
  );
}
