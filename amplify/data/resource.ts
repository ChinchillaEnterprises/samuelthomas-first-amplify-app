import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  BettingPrediction: a
    .model({
      sport: a.string().required(),
      homeTeam: a.string().required(),
      awayTeam: a.string().required(),
      matchDate: a.datetime().required(),
      recommendedBet: a.string().required(),
      confidence: a.float().required(),
      odds: a.float().required(),
      platform: a.string().required(),
      analysis: a.string(),
      potentialReturn: a.float(),
      stake: a.float(),
      betType: a.string().required(),
      isLive: a.boolean().default(false),
      result: a.string(),
    })
    .authorization((allow) => allow.owner()),
  
  UserPreferences: a
    .model({
      favoriteSports: a.string().array(),
      preferredPlatforms: a.string().array(),
      bankroll: a.float(),
      riskTolerance: a.string(),
    })
    .authorization((allow) => allow.owner()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});