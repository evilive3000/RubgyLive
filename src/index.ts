process.env.NTBA_FIX_319 = "1";
import {formatMatch} from "./formatter";
import {RugbyMatch} from "./types";
import {RugbyService} from "./rugby-service";
import {UniqueIdsStorage} from "./storage";
import TelegramBot from "node-telegram-bot-api";

async function findChangedGames(rugby: RugbyService): Promise<Set<number>> {
  // достаем из хранилища id всех незавершенных матчей
  const notStarted = new UniqueIdsStorage('not-started');
  await notStarted.load();
  const changed = new Set<number>();
  const fixtures = await rugby.getAllFixtures();

  for (const {id, status} of fixtures) {
    // если матч завершился или отменен
    if (["Result", "Cancelled"].includes(status)) {
      // пытаемся удалить из локальной базы сохраненных
      // если id там был, то запоминаем его
      notStarted.del(id) && changed.add(id);
    } else {
      notStarted.add(id);
    }
  }

  await notStarted.persist();

  return changed;
}

async function publishMessage(bot, channels, txt): Promise<void> {
  for (const channel of channels.list()) {
    await bot.sendMessage(channel, txt, {parse_mode: 'Markdown'})
      .catch(err => {
        if (err.response.statusCode === 403) {
          channels.del(channel);
        }
      });
  }
}

async function loadChannels(bot: TelegramBot): Promise<UniqueIdsStorage> {
  const channels = new UniqueIdsStorage('channels');
  await channels.load();
  let lastUpdateId: number = 0;
  let updates: TelegramBot.Update[] = await bot.getUpdates();

  while (updates.length > 0) {
    for (const update of updates) {
      lastUpdateId = update.update_id;
      const msg = update.message || update.channel_post;
      if (msg) {
        channels.add(msg.chat.id);
      }
    }
    updates = await bot.getUpdates({offset: lastUpdateId + 1});
  }

  return channels.persist();
}

async function main() {
  const rugby = new RugbyService(process.env.TOKEN_RUGBY_API!);
  const ids = await findChangedGames(rugby);
  // const ids = [80890, 80899, 80971];
  const bot = new TelegramBot(process.env.TOKEN_TELEGRAM!);
  const channels = await loadChannels(bot);

  const matches: RugbyMatch[] = [];
  for (const id of ids) {
    matches.push(await rugby.getMatch(id))
  }

  matches.sort((a, b) => {
    return new Date(a.match.date).getTime() - new Date(b.match.date).getTime()
  });

  for (const match of matches) {
    await publishMessage(bot, channels, formatMatch(match));
  }
  // только при публикации сообщения мы можем узнать об отписке
  await channels.persist();
}

main().catch(console.error)
