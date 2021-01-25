import express, {Express, NextFunction, Request, Response} from "express";
import cors from 'cors';
import {RugbyService} from "./rugby-service";
import {TelegaService} from "./telega-service";
import {RugbyMatch} from "./types";
import {formatMatch} from "./formatter";

async function checkMatches(rugby: RugbyService, telega: TelegaService) {
  const ids = await rugby.detectPlayedGames();
  const matches: RugbyMatch[] = [];
  for (const id of ids) {
    matches.push(await rugby.getMatch(id))
  }

  matches.sort((a, b) => new Date(a.match.date).getTime() - new Date(b.match.date).getTime());

  for (const match of matches) {
    await telega.publishMessage(formatMatch(match));
  }
}

async function sampleMatch(id, rugby: RugbyService, telega: TelegaService): Promise<any> {
  const match = await rugby.getMatch(id);
  await telega.publishMessage(formatMatch(match));
  return {
    txt: formatMatch(match),
    match
  };
}

const App = (port: number, rugby: RugbyService, telega: TelegaService): Express => {
  const app = express();

  app.set('port', port);
  app.use(cors({origin: true}));
  app.use(express.urlencoded({extended: true}));
  app.use(express.json());

  app.post('/1844c16378ad1aacf0a39a72b2423f29', (req: Request, res: Response, next: NextFunction) => {
    checkMatches(rugby, telega)
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  app.get('/test', (req: Request, res: Response, next: NextFunction) => {
    const {id = 80890} = req.query;
    sampleMatch(id, rugby, telega)
      .then((data) => res.json(data))
      .catch(next);
  });

  app.get('/', (req: Request, res: Response) => res.json({ok: true, now: new Date()}))

  return app;
};

export default App;
