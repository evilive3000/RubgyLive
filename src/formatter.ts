import {RugbyEvent, RugbyMatch} from "./types";

const reduceEvents = (events: RugbyEvent[], types: RugbyEvent['type'][]) => {
  const reduced = events.reduce((result, event) => {
    if (types.includes(event.type)) {
      const side = result[event.home_or_away == 'home' ? 0 : 1];
      const times = side.get(event.player_1_name) || [];
      side.set(event.player_1_name, [...times, event.time]);
    }
    return result;
  }, [new Map<string, number[]>(), new Map<string, number[]>()])

  if (reduced[0].size + reduced[1].size === 0) return false;

  return reduced
    .map(side => [...side.entries()]
      .map(([name, times]) => `${name} (${times.join(',')})`)
      .join(', '))
    .join(' - ')
}

const stats: Array<[string, RugbyEvent['type'][]]> = [
  ['Tries', ['Try', 'Penalty Try']],
  ['Conversions', ['Conversion']],
  ['Penalties', ['Penalty']],
  ['Drop-goals', ['Drop Goal']],
];

export const formatMatch = (data: RugbyMatch) => {
  const {comp_name, game_week, home_team, away_team, home_score, away_score, date} = data.match;
  const locDate = (new Date(date)).toLocaleDateString('en-CA');
  const header = `🏆 *${comp_name}* 📆 *Round ${game_week}* (${locDate})\n\n*${home_team} [${home_score}:${away_score}] ${away_team}*\n\n`;

  return stats.reduce((result, [title, filters]) => {
    const stat = reduceEvents(data.events as RugbyEvent[], filters);
    return stat ? result + `*${title}:* _${stat}_\n` : result;
  }, header);
}
