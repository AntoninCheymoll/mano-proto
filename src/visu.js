import $ from 'jquery';
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.css';
import {
  normalizedata,
  setCan2Param,
  synchronizeSlider,
  getAllUrlParams,
  calculMaxTime,
  log,
  displayTooltipOnCan,
} from './Fonctions auxiliaires';
import { newValue, prevPressed, nextPressed } from './buttonPrevNext';
import drawClassNameList from './drawClassNameList';
import drawSecondCan from './drawSecondCan';

import graphs from './graphs';
import histogramme from './histogramme';
import heatmap from './heatmap';
import onMouseOnHM from './onMouseOnHM';
import onMouseOnGraph from './onMouseOnGraph';
import onMouseOnHisto from './onMouseOnHisto';


const can = document.createElement('canvas');
const can2 = document.createElement('canvas');

const ctx = can.getContext('2d');
const ctx2 = can2.getContext('2d');

let secondCanParam = null;

let mouseOverCan = false;

// fichier json
let res;

// variable de temps
let tps = 0;
let timeMax;

// stocke les precedentes valeures du slider de Temps
let momentMemory = [0];
let currentMoment = 0;

// numero de la visu a afficher
let numVis = 1;
let selectedGraph = null;

// variable des graphs

let colorSliderGraphs = 'rgb(0,0,160)';
let isDraging = false;

// variable de l'histogramme
const tooltipHisto = [];
let rectList = [];
let selectedRectHisto = null;


// variables de la heatmap
let valHM = 0;
let numLinClickedHM = -1;
let numColClickedHM = -1;
const tooltipHM = [];

// websocket (communication avec le serveur d'entrainement)
let socket = null;

// dessin du canevas en fonction du numero de visu demandé
function draw() {
  if (numVis === 1) {
    graphs(can, res, ctx, tps, selectedGraph, colorSliderGraphs, isDraging);
  } else if (numVis === 2) {
    rectList = histogramme(can, res, ctx, tps, tooltipHisto, selectedRectHisto);
  } else if (numVis === 3) {
    heatmap(can, res, ctx, valHM, tps, numLinClickedHM, numColClickedHM,
      tooltipHM, ctx2, can2, colorSliderGraphs, timeMax);
  }
}

function mainVisu(json) {
  res = json;

  res = normalizedata(res);
  // res.phrases.sort((a, b) => a.label.localeCompare(b.label));
  // res.model.classe.sort((a, b) => a.label.localeCompare(b.label));
  res.phrases.forEach((x, i) => {
    x.index = i;
  });
  res.phrases.sort((a) => {
    if (a.active) {
      return -1;
    }
    return 1;
  });

  log('data', res);
  draw();

  timeMax = calculMaxTime(res);

  $('.pasDeTemps').text(timeMax + 1);

  // set les valeurs max des sliders


  $('#sliderGraphs ').slider({
    range: 'min',
    min: 0,
    max: timeMax + 1,
    value: 0,

    start() {
      isDraging = true;
      draw();
    },
    stop(event, ui) {
      isDraging = false;

      const result = newValue(ui.value, momentMemory, currentMoment);
      [momentMemory, currentMoment] = result;
      // momentMemory = result[0];
      // currentMoment = result[1];


      draw();
    },
    slide(event, ui) {
      synchronizeSlider(ui.value, timeMax);

      colorSliderGraphs = `rgb(${0},${(ui.value * 128) / timeMax},${160 + ui.value * 95 / timeMax})`;

      tps = ui.value;

      draw();
    },
  });


  $('#sliderHisto ').slider({
    range: 'min',
    min: 0,
    max: timeMax + 1,
    value: 0,
    stop(event, ui) {
      const result = newValue(ui.value, momentMemory, currentMoment);
      [momentMemory, currentMoment] = result;

      draw();
    },
    slide(event, ui) {
      synchronizeSlider(ui.value, timeMax);

      colorSliderGraphs = `rgb(${0},${(ui.value * 128) / timeMax},${160 + ui.value * 95 / timeMax})`;
      tps = ui.value;

      // sliderHM.slider("value", tps)
      // sliderGraph.slider("value", tps)
      draw();
    },
  });

  // console.log($( "#handleHisto" ));

  $('#sliderHMtps').slider({
    range: 'min',
    min: 0,
    max: timeMax + 1,
    value: 0,
    stop(event, ui) {
      const result = newValue(ui.value, momentMemory, currentMoment);
      [momentMemory, currentMoment] = result;

      draw();
    },
    slide(event, ui) {
      synchronizeSlider(ui.value, timeMax);
      colorSliderGraphs = `rgb(${0},${(ui.value * 128) / timeMax},${160 + ui.value * 95 / timeMax})`;
      tps = ui.value;

      // sliderHisto.slider("value", tps)
      // sliderGraph.slider("value", tps)
      draw();
    },
  });


  // for (const bt of $('.prevButton')) {
  //   bt.disabled = true;
  // }
  $('.prevButton').each((_, bt) => {
    bt.disabled = true;
    bt.onclick = () => {
      const result = prevPressed(momentMemory, currentMoment, timeMax);
      momentMemory = result[0];
      currentMoment = result[1];
      tps = result[2];
      draw();
    };
  });
  $('.nextButton').each((_, bt) => {
    bt.disabled = true;
    bt.onclick = () => {
      const result = nextPressed(momentMemory, currentMoment, timeMax);
      momentMemory = result[0];
      currentMoment = result[1];
      tps = result[2];
      draw();
    };
  });

  drawClassNameList(can, ctx, res, numVis, socket);

  const tooltipCan = $('#tooltipCan');
  can.onclick = () => {
    if (secondCanParam) {
      if (mouseOverCan && numVis === 1) {
        drawSecondCan(ctx2, can2, res, tps, secondCanParam[0],
          secondCanParam[1], colorSliderGraphs, timeMax);
      } else if (mouseOverCan && numVis === 2) {
        drawSecondCan(ctx2, can2, res, tps, secondCanParam[0],
          secondCanParam[1], colorSliderGraphs, timeMax);
      } else if (mouseOverCan && numVis === 3) {
        drawSecondCan(ctx2, can2, res, tps, secondCanParam[0],
          secondCanParam[1], colorSliderGraphs, timeMax);
      }
    }
  };

  document.body.onmousemove = (e) => {
    tooltipCan.css('visibility', 'hidden');
    numColClickedHM = -1;
    numLinClickedHM = -1;
    selectedGraph = [];


    if (mouseOverCan && numVis === 3) {
      displayTooltipOnCan(tooltipHM, e);

      const result = onMouseOnHM(e, can, res);
      numColClickedHM = result[0];
      numLinClickedHM = result[1];

      if (result[0] > 0 && result[1] > 0) {
        secondCanParam = [res.phrases[numLinClickedHM - 1].index, numColClickedHM - 1];
      } else {
        secondCanParam = null;
      }
    } else if (mouseOverCan && numVis === 2) {
      displayTooltipOnCan(tooltipHisto, e);


      selectedRectHisto = onMouseOnHisto(e, rectList);
      if (selectedRectHisto) {
        secondCanParam = [selectedRectHisto.classIndex, selectedRectHisto.modelIndex];
      } else { selectedGraph = null; }
    } else if (mouseOverCan && numVis === 1) {
      const result = onMouseOnGraph(e, can, res);
      if (result) {
        selectedGraph = result[0];
        secondCanParam = result[1];
      } else {
        selectedGraph = null;
        secondCanParam = null;
      }
    }

    draw();
  };
}

function init() {
  const div2 = document.createElement('div');
  div2.appendChild(can);
  div2.appendChild(can2);
  div2.style = 'position:relative;';
  div2.id = 'divMilieu';
  document.body.appendChild(div2);

  setCan2Param(can, can2, ctx2);


  const urlParams = getAllUrlParams();
  if (urlParams.file) {
    // recuperation du fichier
    $.ajax({
      url: `/${urlParams.file}.json`,
      dataType: 'json',
      context: document.body,
    }).done((data) => {
      socket.send(JSON.stringify({
        type: 'file/load',
        filename: urlParams.file,
      }));
      mainVisu(data);
    });
  }

  $('#meanMinHM').text(1);

  $('#sliderHMmeanMin').slider({
    range: 'min',
    min: 0,
    max: 100,
    value: 0,
    slide(event, ui) {
      $('#amount').val(`$${ui.value}`);

      $('#handleSeuilHM').text(ui.value / 100);
      $('#handleSeuilHM').css('background', `rgb(${255 - ui.value / 100 * 160},${160 - ui.value * 160 / 100},${160 - ui.value * 160 / 100})`);

      valHM = ui.value;
      draw();
    },
  });

  can.onmouseenter = () => {
    mouseOverCan = true;
  };

  can.onmouseleave = () => {
    mouseOverCan = false;
  };


  $('#tabs').tabs({
    activate() {
      numVis = $('#tabs').tabs('option', 'active') + 1;
      drawClassNameList(can, ctx, res, numVis);
      draw();
    },
  });
}

function preinit() {
  // Receive Model data by websocket
  const ws = new WebSocket(`ws://${window.location.hostname}:8000`);
  const jsonData = { model: {}, phrases: [] };
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('Received a new model!', message);
    if (['model', 'phrases'].includes(message.type)) {
      jsonData[message.type] = message.data;
      mainVisu(jsonData);
    }
  };
  ws.onopen = (event) => {
    socket = event.target;
    init();
    // activateExample(2);
    // deactivateExample(0);
  };
}

window.onload = preinit;
