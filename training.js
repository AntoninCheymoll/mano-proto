import {
  TrainingSet,
  trainMulticlassHMM,
  HierarchicalHMMPredictor,
} from 'xmm-js';
import { writeFileSync } from "fs";

/**
 * HMM Training Configuration
 */
const xmmConfig = {
  gaussians: 1,
  absoluteRegularization: 0.01,
  relativeRegularization: 0.1,
  covarianceMode: 'diagonal',
  hierarchical: true,
  states: 5,
  transitionMode: 'leftright',
  regressionEstimator: 'full',
  modelType: 'hhmm',
};

/**
 * Train a Hidden Markov Model
 * @param  {[type]} trainingSet [description]
 * @return {[type]}             [description]
 */
export default function train(phrases) {
  const trainingSet = TrainingSet({ inputDimension: 8 });
  phrases.filter(x => x.active)
    .forEach((phrase, idx) => {
      const p = trainingSet.push(idx, phrase.label);
      phrase.data.forEach((frame) => {
        p.push(frame.slice(0, 8));
      })
    });

  const model = trainMulticlassHMM(trainingSet, xmmConfig);

  const predictor = HierarchicalHMMPredictor(model, 1);
  phrases.forEach((phrase) => {
    const res = estimateLikelihood(phrase, predictor);
    Object.assign(phrase, res);
  });

  writeFileSync('./dist/current.json', JSON.stringify({ model, phrases }));

  return { model, phrases };
}

/**
 * Estimate the likelihood of a phrase given all trained models
 */
function estimateLikelihood(phrase, predictor) {
  const results = {
    smoothedLogLikelihoods: [],
    smoothedNormalizedLikelihoods: [],
    instantNormalizedLikelihoods: [],
  };
  predictor.reset();
  phrase.data.forEach((frame) => {
    predictor.predict(frame.slice(0, 8));
    const order = predictor.results.labels;
    results.smoothedLogLikelihoods.push(predictor.results
      .smoothedLogLikelihoods
      .map((x, i) => ({ [order[i]]: x }))
      .reduce((x, y) => Object.assign({}, x, y), {}))
    results.smoothedNormalizedLikelihoods.push(predictor.results
      .smoothedNormalizedLikelihoods
      .map((x, i) => ({ [order[i]]: x }))
      .reduce((x, y) => Object.assign({}, x, y), {}))
    results.instantNormalizedLikelihoods.push(predictor.results
      .instantNormalizedLikelihoods
      .map((x, i) => ({ [order[i]]: x }))
      .reduce((x, y) => Object.assign({}, x, y), {}))
  });
  return results;
}
