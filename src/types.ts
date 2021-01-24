export type RugbyEvent = {
  event_id: number;
  home_or_away: 'home' | 'away';
  // id: number;
  player_1_id: number;
  player_1_name: string;
  team_id: number;
  time: number;
  type: 'Try' | 'Penalty Try' | 'Conversion' | 'Penalty' | 'Drop Goal' | 'Missed Drop Goal';
} | {
  event_id: number;
  home_or_away: 'home' | 'away';
  // id: number;
  player_1_id: number;
  player_1_name: string;
  player_2_id: number;
  // player_2_name: string;
  player_2: string;
  team_id: number;
  time: number;
  type: 'Substitution';
}

type GameStatus =
  'Not Started'
  | 'First Half'
  | 'Half Time'
  | 'Second Half'
  | 'Full Time'
  | 'Result'
  | 'Postponed'
  | 'Cancelled';

export type MatchDetails = {
  id: number;
  comp_id: number;
  comp_name: string;
  season: string;
  status: GameStatus;
  match_minute: number;
  venue: string;
  game_week: number;
  home_team: string;
  away_team: string;
  home_id: number;
  away_id: number;
  date: string;
  home_score: number;
  away_score: number;
  home_tries: number;
  away_tries: number;
  home_conversions: number;
  away_conversions: number;
  home_penalties: number;
  away_penalties: number;
  home_drop_goals: number;
  away_drop_goals: number;
  updated: string;
}

export type RugbyCompetition = {
  id: number;
  name: string;
  season: number;
  season_name: string;
}

export type RugbyFixture = {
  away: string;
  away_id: number;
  away_score: number;
  comp_id: number;
  comp_name: string;
  date: string;
  game_week: number;
  home: string;
  home_id: number;
  home_score: number;
  id: number;
  season: string;
  status: GameStatus;
  updated: string;
  venue: string;
}

export type RugbyMatch = {
  [P: string]: any,
  match: MatchDetails,
  events: RugbyEvent[]
}


export type ApiResponseMatch = {
  results: RugbyMatch
};

export type ApiResponseCompetition = {
  results: RugbyCompetition[]
};

export type ApiResponseFixtures = {
  results: Array<RugbyFixture[]>
};
