import { Example } from 'mano-js/common';
import { ProcessedSensors } from 'mano-js/client';
import { HierarchicalHMMPredictor } from 'xmm';

const $error = document.querySelector('#error');
const $label = document.querySelector('#label');
const $fortraining = document.querySelector('#fortraining');
const $result = document.querySelector('#result');
const $recordBtn = document.querySelector('#recording-control');

const socket = new WebSocket(`ws://${window.location.hostname}:8000`);

const xmm = {
  predictor: null,
};

// globals
let state = 'idle';
let example = null;

const processedSensors = new ProcessedSensors();

/**
 * Initialize and start sensors
 */
processedSensors.init().then(() => processedSensors.start());

/**
 * Function that decode the stream created by the `mano.ProcessedSensors`
 * according to the examples previously provided.
 */
function decode(data) {
  xmm.predictor.predict(data.slice(0, 8));
  const { likeliest } = xmm.predictor.results;
  $result.textContent = likeliest;
}

/**
 * Function that creates a new `mano.Example` and add its `addElement` method
 * as a callback of the processed sensors.
 */
function record(label) {
  processedSensors.removeListener(decode);
  example = new Example();
  example.setLabel(label);

  processedSensors.addListener(example.addElement);
}

function train() {
  processedSensors.removeListener(example.addElement);

  const rapidMixJSONExample = example.toJSON();
  const phraseData = {
    type: 'example/add',
    active: $fortraining.checked,
    length: rapidMixJSONExample.payload.input.length,
    data: rapidMixJSONExample.payload.input,
    label: rapidMixJSONExample.payload.label,
  };
  socket.send(JSON.stringify(phraseData));
}

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type !== 'model') { return; }

  const hmmParams = message.data;
  xmm.predictor = HierarchicalHMMPredictor(hmmParams, 1);
  xmm.predictor.reset();

  processedSensors.addListener(decode);

  state = 'idle';
  $label.value = '';
  $recordBtn.textContent = 'Record';
};

/**
 * Handle application logic
 */
$recordBtn.addEventListener('click', () => {
  $error.textContent = '';

  switch (state) {
    case 'idle': {
      const label = $label.value;

      if (label === '') {
        const error = 'Invalid label';
        $error.textContent = error;
      } else {
        state = 'recording';
        $recordBtn.textContent = 'Stop';

        record(label);
      }
      break;
    }
    case 'recording': {
      state = 'training';
      $recordBtn.textContent = 'Training';

      train();
      break;
    }
    default:
      break;
  }
});
