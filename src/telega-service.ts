process.env.NTBA_FIX_319 = "1";

import {UniqueIdsStorage} from "./storage";
import TelegramBot from "node-telegram-bot-api";

export class TelegaService {
  private readonly bot = new TelegramBot(process.env.TOKEN_TELEGRAM!, {polling: false});
  private readonly channels: UniqueIdsStorage;
  private isListening = false;
  private _intervalId?: NodeJS.Timeout;

  constructor() {
    this.channels = new UniqueIdsStorage('channels');
  }

  async loadChannels(): Promise<UniqueIdsStorage> {
    await this.channels.load();
    let lastUpdateId: number = 0;
    let updates: TelegramBot.Update[] = await this.bot.getUpdates();

    while (updates.length > 0) {
      for (const update of updates) {
        lastUpdateId = update.update_id;
        const msg = update.message || update.channel_post;
        if (msg) {
          this.channels.add(msg.chat.id);
        }
      }
      updates = await this.bot.getUpdates({offset: lastUpdateId + 1});
    }

    return this.channels.persist();
  }

  async startListenUpdates(): Promise<void> {
    if (this.isListening) return;

    await this.loadChannels();
    this.isListening = true;
    await this.bot.startPolling()
    this.bot.on('message', (msg) => {
      this.channels.add(msg.chat.id);
    });
    this._intervalId = setInterval(() => {
      this.channels.persist().catch(console.error)
    }, 3000);
  }

  async stopListenUpdates(): Promise<void> {
    this.isListening = false;
    await this.bot.stopPolling();
    this.bot.removeAllListeners('message');
    await this.channels.persist();
    this._intervalId && clearInterval(this._intervalId)
  }

  async publishMessage(txt: string): Promise<void> {
    let hasDeletedChannels = false;
    for (const channel of this.channels.list()) {
      await this.bot
        .sendMessage(channel, txt, {parse_mode: 'Markdown'})
        .catch(err => {
          if (err.response.statusCode === 403) {
            hasDeletedChannels = hasDeletedChannels || this.channels.del(channel);
          }
        });
    }
    if (hasDeletedChannels) {
      await this.channels.persist();
    }
  }

}
