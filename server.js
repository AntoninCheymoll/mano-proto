import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import rapidMixAdapters from "rapid-mix-adapters";
import xmm from "xmm-node";
import { HhmmDecoder } from "xmm-client";
import { writeFileSync } from "fs";
import WebSocket from 'ws';

const app = express();
const wss = new WebSocket.Server({ port: 8000 });

/**
 * instanciate a `xmm` instance for each alogrithm
 */
const xmms = {
  gmm: new xmm("gmm"),
  hhmm: new xmm("hhmm")
};

function estimateLikelihoods(xmmDecoder, phrase) {
  const order = xmmDecoder.getModel().models.map(x => x.label);
  const likelihoods = [];
  xmmDecoder.reset();
  for (let i = 0; i < phrase.length; i++) {
    const frame = phrase.data.slice(i * 8, (i + 1) * 8);
    const res = xmmDecoder.filter(frame);
    const likbyClass = res.likelihoods
      .map((x, i) => ({ [order[i]]: x }))
      .reduce((x, y) => Object.assign({}, x, y), {});
    likelihoods.push(likbyClass);
  }
  return likelihoods;
}

/**
 * open a 'POST' route for the training. The route should correspond to the
 * `url` parameter passed to `mano.XmmProcessor`
 *
 * @example
 * // cf. src/client/index.js
 * const xmmProcessor = new mano.XmmProcessor({ url: '/train' });
 */
function train(req, res) {
  // convert configuration and `TrainingSet` from RAPID-MIX to XMM formalisms
  const payload = req.body.payload;
  const xmmConfig = rapidMixAdapters.rapidMixToXmmConfig(payload.configuration);
  const xmmTrainingSet = rapidMixAdapters.rapidMixToXmmTrainingSet(
    payload.trainingSet
  );

  // find which instance of XMM should be used ('gmm' or  'hhmm')
  // const target = req.body.configuration.target.name;
  const xmm = xmms[xmmConfig.modelType];

  xmm.setConfig(xmmConfig);
  xmm.setTrainingSet(xmmTrainingSet);
  xmm.train((err, model) => {
    if (err) console.error(err.stack);

    const decoder = new HhmmDecoder();
    xmmTrainingSet.phrases.forEach((phrase, i) => {
      decoder.setModel(model);
      xmmTrainingSet.phrases[i].likelihoods = estimateLikelihoods(
        decoder,
        phrase
      );

      console.log(
        xmmTrainingSet.phrases[i].likelihoods[
          xmmTrainingSet.phrases[i].likelihoods.length - 1
        ]
      );
    });

    const fileObj = {
      model,
      trainingSet: xmmTrainingSet
    };
    writeFileSync("./dist/au_boulot_antonin.json", JSON.stringify(fileObj));

    // create a RAPID-MIX JSON compliant response
    const rapidMixHttpResponse = rapidMixAdapters.createComoHttpResponse(
      req.body.configuration,
      rapidMixAdapters.xmmToRapidMixModel(model)
    );

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(rapidMixHttpResponse));
  });
}

/**
 * open a 'POST' route for the training. The route should correspond to the
 * `url` parameter passed to `mano.XmmProcessor`
 *
 * @example
 * // cf. src/client/index.js
 * const xmmProcessor = new mano.XmmProcessor({ url: '/train' });
 */
function train_ws(trainingSet) {
  const xmmConfig = {
    gaussians: 1,
    absoluteRegularization: 0.01,
    relativeRegularization: 0.01,
    covarianceMode: 'diagonal',
    hierarchical: true,
    states: 5,
    transitionMode: 'leftright',
    regressionEstimator: 'full',
    modelType: 'hhmm',
  };
  const xmmTrainingSet = rapidMixAdapters.rapidMixToXmmTrainingSet(trainingSet);

  // find which instance of XMM should be used ('gmm' or  'hhmm')
  // const target = req.body.configuration.target.name;
  const xmm = xmms[xmmConfig.modelType];
  xmm.setConfig(xmmConfig);
  xmm.setTrainingSet(xmmTrainingSet);
  xmm.train((err, model) => {
    console.log('trained model', model);
    if (err) console.error(err.stack);

    const decoder = new HhmmDecoder();
    xmmTrainingSet.phrases.forEach((phrase, i) => {
      decoder.setModel(model);
      xmmTrainingSet.phrases[i].likelihoods = estimateLikelihoods(
        decoder,
        phrase
      );

      console.log(
        xmmTrainingSet.phrases[i].likelihoods[
          xmmTrainingSet.phrases[i].likelihoods.length - 1
        ]
      );
    });

    const fileObj = {
      model,
      trainingSet: xmmTrainingSet
    };
    writeFileSync("./dist/au_boulot_antonin.json", JSON.stringify(fileObj));

    // websocket broadcast
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'model',
          data: model,
        }));
        client.send(JSON.stringify({
          type: 'trainingSet',
          data: xmmTrainingSet,
        }));
      }
    });
  });
}

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

app.get("/", (req, res) => res.send("Hello World!"));
app.post("/train", train);

wss.on('connection', function connection(ws) {
  console.log('Client connected');
  ws.on('message', function incoming(message) {
    try {
      train_ws(JSON.parse(message));
    } catch (e) {
      console.log('received: %s', message);
    }
  });
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));
