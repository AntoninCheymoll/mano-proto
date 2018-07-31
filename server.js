import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import WebSocket from 'ws';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { readFileSync } from 'fs';

import train from './training';

import config from './webpack.config';

let phrases = [];

function broadcastModel(wss, hmmParams) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'model',
        data: hmmParams,
      }));
    }
  });
}

function broadcastPhrases(wss, p) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'phrases',
        data: p,
      }));
    }
  });
}

function createWebsocketServer() {
  const wss = new WebSocket.Server({ port: 8000 });

  wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        if (!data.type) throw new Error('no type is available');
        let shouldTrain = true;
        if (data.type === 'example/add') {
          phrases.push(data);
        } else if (data.type === 'example/activate') {
          phrases[data.index].active = true;
        } else if (data.type === 'example/deactivate') {
          phrases[data.index].active = false;
        } else if (data.type === 'file/load') {
          console.log(`Loading file: "${data.filename}"`);
          const fileJson = readFileSync(`./dist/${data.filename}.json`, 'utf8');
          const fileData = JSON.parse(fileJson);
          phrases = fileData.phrases; // eslint-disable-line prefer-destructuring
          broadcastModel(wss, fileData.model);
          broadcastPhrases(wss, fileData.phrases);
        } else {
          console.log('message type', data.type);
          console.log('data', data);
          shouldTrain = false;
        }
        if (shouldTrain) {
          try {
            const res = train(phrases);
            broadcastModel(wss, res.model);
            broadcastPhrases(wss, res.phrases);
          } catch (e) {
            console.log(e);
          }
        }
      } catch (e) {
        console.log('Error: ', e);
      }
    });
  });
  return wss;
}

function createHttpServer() {
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
      path: '/__webpack_hmr',
      heartbeat: 10 * 1000,
    }));
  }
  app.listen(3000, () => console.log('Example app listening on port 3000!'));
}

createWebsocketServer();
createHttpServer();
