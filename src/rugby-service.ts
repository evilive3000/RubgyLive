import {
  ApiResponseCompetition,
  ApiResponseFixtures,
  ApiResponseMatch,
  RugbyCompetition,
  RugbyFixture,
  RugbyMatch
} from "./types";
import axios, {AxiosInstance} from "axios";

export class RugbyService {
  private client: AxiosInstance;

  constructor(rapidApiKey: string) {
    this.client = axios.create({
      baseURL: 'https://rugby-live-data.p.rapidapi.com',
      timeout: 20000,
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': 'rugby-live-data.p.rapidapi.com',
        // 'useQueryString': true
      }
    });
  }

  async _get<T>(url: string): Promise<T> {
    console.info(url);
    return this.client
      .get<T>(url)
      .then(({data}) => data)
  }

  async getMatch(matchId: number): Promise<RugbyMatch> {
    return this._get<ApiResponseMatch>(`match/${matchId}`)
      .then(({results}) => results)
  }

  async getFixtures(competitionId: number, season: string | number): Promise<RugbyFixture[]> {
    return this._get<ApiResponseFixtures>(`fixtures/${competitionId}/${season}`)
      .then(({results}) => results.flat())
  }

  async getCompetitions(): Promise<RugbyCompetition[]> {
    return this._get<ApiResponseCompetition>(`competitions`)
      .then(({results}) => results);
  }

  async getAllFixtures(): Promise<RugbyFixture[]> {
    const comps = await this.getCompetitions();
    const fixtures: RugbyFixture[] = [];

    for (const {id, season} of comps) {
      const data = await this.getFixtures(id, season);
      fixtures.push(...data)
    }

    return fixtures;
  }
}
