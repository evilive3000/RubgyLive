import http from 'http';
import App from './app';
import { RugbyService } from './rugby-service';
import { TelegaService } from './telega-service';

const main = async () => {
  const rugby = new RugbyService();
  const telega = new TelegaService();

  // create http app
  const app = App(Number(process.env.PORT), rugby, telega);
  // app.set('trust proxy', true);
  const server = http.createServer(app);

  // start server
  server.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
  });

  server.on('error', console.error);

  const shutdown = () => {
    console.info('SIGTERM signal received.');
    console.log('Closing http server.');
    server.close(() => {
      console.log('Http server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

main().catch(console.error);
