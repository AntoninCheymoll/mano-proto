import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import WebSocket from 'ws';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import train from './training';

import config from './webpack.config';
let phrases = [];

function createTrainingSet(phrases) {
  phrases.filter(x => x.active);
}

function broadcastModel(wss, hmmParams) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'model',
        data: hmmParams,
      }));
    }
  });
}

function broadcastPhrases(wss, phrases) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'phrases',
        data: phrases,
      }));
    }
  });
}

function createWebsocketServer() {
  const wss = new WebSocket.Server({ port: 8000 });

  wss.on('connection', function connection(ws) {
    console.log('Client connected');
    ws.on('message', function incoming(message) {
      try {
        const data = JSON.parse(message);
        if (!data.type) throw new Error('no type is available');
        if (data.type === 'example/add') {
          phrases.push(data);
          try {
            const res = train(phrases);
            broadcastModel(wss, res.model);
            broadcastPhrases(wss, res.phrases);
          } catch (e) {
            console.log(e);
          }
        } else {
          console.log('message type', data.type);
          console.log('data', data);
        }
      } catch (e) {
        console.log('Received: %s', message);
      }
    });
  });
  return wss;
}

function createHttpServer(wss) {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(express.static(path.resolve(__dirname, '.', 'dist/')));

  if (process.env.NODE_ENV !== 'production') {
    const compiler = webpack(config);
    app.use(webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: config.output.publicPath,
    }));
    app.use(webpackHotMiddleware(compiler, {
      log: console.log,
      path: '/__webpack_hmr', heartbeat: 10 * 1000
    }));
  }
  app.listen(3000, () => console.log("Example app listening on port 3000!"));
}

createHttpServer(createWebsocketServer());
