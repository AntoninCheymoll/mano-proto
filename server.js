import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import rapidMixAdapters from 'rapid-mix-adapters';
import xmm from 'xmm-node';
import { writeFileSync } from 'fs';

const app = express();

/**
 * instanciate a `xmm` instance for each alogrithm
 */
const xmms = {
  'gmm': new xmm('gmm'),
  'hhmm': new xmm('hhmm'),
};

function estimateLikelihoods(xmmProcessor, phrase) {
  console.log('phrase.length', phrase.length);
  console.log('xmmProcessor', xmmProcessor);
  const order = xmmProcessor.getModel().models.map(x => x.label);
  console.log('order', order);
  const likelihoods = [];
  console.log('xmmProcessor.classes', xmmProcessor.classes);
  for (let i = 0; i < phrase.length; i++) {
    const frame = phrase.data.slice(i * 8, (i + 1) * 8);
    const res = xmmProcessor.filter(frame);
    const likbyClass = res.smoothed_normalized_likelihoods.map((x, i) => ({ [order[i]]: x }))
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
  const xmmTrainingSet = rapidMixAdapters.rapidMixToXmmTrainingSet(payload.trainingSet);

  // find which instance of XMM should be used ('gmm' or  'hhmm')
  // const target = req.body.configuration.target.name;
  const xmm = xmms[xmmConfig.modelType];

  xmm.setConfig(xmmConfig);
  xmm.setTrainingSet(xmmTrainingSet);
  xmm.train((err, model) => {
    if (err)
      console.error(err.stack);

    xmmTrainingSet.phrases.forEach((phrase, i) => {
      xmmTrainingSet.phrases[i].likelihoods = estimateLikelihoods(xmm, phrase);
    })

    const fileObj = {
      model,
      trainingSet: xmmTrainingSet
    };
    writeFileSync('./dist/au_boulot_antonin.json', JSON.stringify(fileObj));

    // create a RAPID-MIX JSON compliant response
    const rapidMixHttpResponse = rapidMixAdapters.createComoHttpResponse(
      req.body.configuration,
      rapidMixAdapters.xmmToRapidMixModel(model),
    );

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(rapidMixHttpResponse));
  });
}

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/train', train);

app.listen(3000, () => console.log('Example app listening on port 3000!'));
