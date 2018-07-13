import  $ from 'jquery';
import jquery from 'jquery';
import 'jquery-ui-bundle';
//import 'jquery-ui-bundle/jquery-ui.css';
import {normalizedata, setCan2Param, synchronizeSlider, getAllUrlParams, calculMaxTime, log, cuttingString, displayTooltipOnCan } from './Fonctions auxiliaires.js';
import {newValue,prevPressed,nextPressed} from './buttonPrevNext.js';
import drawClassNameList from './drawClassNameList.js'
import {drawSecondCan} from './drawSecondCan.js';

import graphs from './graphs.js';
import histogramme from './histogramme.js';
import heatmap from './heatmap.js';
import onMouseOnHM from './onMouseOnHM.js';
import onMouseOnGraph from './onMouseOnGraph.js';
import onMouseOnHisto from './onMouseOnHisto.js';



var can = document.createElement('canvas');
var can2 = document.createElement('canvas');


var ctx = can.getContext("2d")
var ctx2 = can2.getContext("2d")


var mouseOverCan = false;

//fichier json
var res;

//variable de temps
var tps=0;
var timeMax;

//stocke les precedentes valeures du slider de Temps
var momentMemory = [0]
var currentMoment = 0;

//numero de la visu a afficher
var numVis = 1;
var selectedGraph = null

// variable des graphs

var colorSliderGraphs = "rgb(0,0,160)";
var isDraging = false;

// variable de l'histogramme
var tooltipHisto = [];
var rectList = []
var selectedRectHisto = null;



// variables de la heatmap
var valHM  = 0;
var numLinClickedHM = -1;
var numColClickedHM = -1;
var tooltipHM = [];





function mainVisu(json) {
  res = json;

  res = normalizedata(res)
  res.trainingSet.phrases.sort((a, b) => a.label.localeCompare(b.label));

  log("data",res)
  draw();

  timeMax = calculMaxTime(res);

  $( ".pasDeTemps" ).text(timeMax +1)

  //set les valeurs max des sliders



  var sliderGraph = $( "#sliderGraphs " ).slider({
        range: "min",
        min: 0,
        max: timeMax +1,
        value:  0,

        start: function( event, ui ) {
          isDraging = true;
          draw()
        },
        stop: function( event, ui ) {
          isDraging = false;

          let result = newValue(ui.value, momentMemory,currentMoment)
          momentMemory = result[0]
          currentMoment = result[1]


          draw()
        },
        slide: function( event, ui ) {
         synchronizeSlider(ui.value,timeMax)

         colorSliderGraphs = "rgb(" + 0 + "," + (ui.value*128)/timeMax +"," + (160+ ui.value*95/timeMax) +")"

         tps= ui.value;

         draw();

       }
     })





 var sliderHisto = $( "#sliderHisto " ).slider({
       range: "min",
       min: 0,
       max: timeMax +1 ,
       value:  0,
       stop: function( event, ui ) {
         let result = newValue(ui.value, momentMemory,currentMoment)
         momentMemory = result[0]
         currentMoment = result[1]

         draw()
       },
       slide: function( event, ui ) {
         synchronizeSlider(ui.value,timeMax)

         colorSliderGraphs = "rgb(" + 0 + "," + (ui.value*128)/timeMax +"," + (160+ ui.value*95/timeMax) +")"
         tps= ui.value

         //sliderHM.slider("value", tps)
         //sliderGraph.slider("value", tps)
         draw();
       }
     })

// console.log($( "#handleHisto" ));

 var sliderHM = $( "#sliderHMtps" ).slider({
       range: "min",
       min: 0,
       max: timeMax + 1,
       value:  0,
       stop: function( event, ui ) {
         let result = newValue(ui.value, momentMemory,currentMoment)
         momentMemory = result[0]
         currentMoment = result[1]

         draw()
       },
       slide: function( event, ui ) {
        synchronizeSlider(ui.value,timeMax)
        colorSliderGraphs = "rgb(" + 0 + "," + (ui.value*128)/timeMax +"," + (160+ ui.value*95/timeMax) +")"
         tps= ui.value

         //sliderHisto.slider("value", tps)
         //sliderGraph.slider("value", tps)
         draw();
       }
     })


     for(let bt of $(".prevButton")){
       bt.disabled=true;
     }

     for(let bt of $(".nextButton")){
       bt.disabled=true;
     }


     for(let prevBtt of $(".prevButton")){
       prevBtt.onclick = function(){
         let result = prevPressed(momentMemory, currentMoment , timeMax)
         momentMemory = result[0]
         currentMoment = result[1]
         tps = result[2]
         draw()
       }
     }

     for(let nextBtt of $(".nextButton")){
       nextBtt.onclick = function(){
         let result = nextPressed(momentMemory, currentMoment , timeMax)
         momentMemory = result[0]
         currentMoment = result[1]
         tps = result[2]
       }
     }
     drawClassNameList(can,ctx,res,numVis)

       var tooltipCan = $('#tooltipCan');

     document.body.onmousemove = function(e) {

         tooltipCan.css('visibility', 'hidden')
         numColClickedHM = -1
         numLinClickedHM = -1
         selectedGraph = []


         if(mouseOverCan && numVis == 3){

           displayTooltipOnCan(tooltipHM, e)

           let result = onMouseOnHM(e,can,res);
           numColClickedHM = result[0]
           numLinClickedHM = result[1]


         }else if(mouseOverCan && numVis == 2){
           displayTooltipOnCan(tooltipHisto, e)

           const drawRect = function(rc, rm) {
             drawSecondCan(ctx2, can2, res, tps, rc , rm ,colorSliderGraphs,timeMax)
           };

           selectedRectHisto = onMouseOnHisto(e, rectList, drawRect);

         }else if(mouseOverCan && numVis == 1){
           const drawRect = function(rc, rm) {
             drawSecondCan(ctx2, can2, res, tps, rc , rm ,colorSliderGraphs,timeMax)
           };

           selectedGraph = onMouseOnGraph(e,can,res,drawRect);


         }

           draw()

       }


}

function init() {



  var div2 = document.createElement('div');
  div2.appendChild(can);
  div2.appendChild(can2);
  div2.style="position:relative;";
  div2.id = "divMilieu";
  document.body.appendChild(div2);

  setCan2Param(can,can2,ctx2);




  var labelCan = $('#labelCan');


  const urlParams = getAllUrlParams();
  if (urlParams.file) {
    //recuperation du fichier
    $.ajax({
      url: `/dist/${urlParams.file}.json`,
      dataType:"json",
      context: document.body
    }).done(mainVisu);
  }

  // Receive Model data by websocket
  const socket = new WebSocket(`ws://${window.location.hostname}:8000`);
  const jsonData = { model: {}, trainingSet: {}};
  socket.onmessage = function(event) {
    const message = JSON.parse(event.data);
    if (['model', 'trainingSet'].includes(message.type)) {
      jsonData[message.type] = message.data;
      mainVisu(jsonData);
    }
  }

  $( "#meanMinHM" ).text(1);

  $( "#sliderHMmeanMin" ).slider({
        range: "min",
        min: 0,
        max: 100,
        value:  0,
        slide: function( event, ui ) {
          $( "#amount" ).val( "$" + ui.value );

          $( "#handleSeuilHM" ).text(ui.value/100);
          $( "#handleSeuilHM" ).css("background","rgb(" + (255 - ui.value/100*160) + "," +  (160 -ui.value*160/100) +"," + (160 - ui.value*160/100) +")");

          valHM= ui.value
          draw();

        }
      })

    can.onmouseenter = function(e){
        mouseOverCan = true;

    };

    can.onmouseleave = function(e){
        mouseOverCan = false;

    };









  $( "#tabs" ).tabs({

    activate: function(event, ui) {

      numVis = $("#tabs").tabs('option', 'active') +1;
      drawClassNameList(can,ctx,res,numVis)
      draw();
    }
});




}




//dessin du canevas en fonction du numero de visu demandé
function draw(){

    if (numVis == 1 ){
        graphs(can,res,ctx,tps, selectedGraph, colorSliderGraphs, isDraging );

    }else if(numVis==2){
        rectList = histogramme(can,res,ctx, tps, tooltipHisto, selectedRectHisto);

    }else if(numVis==3){


        heatmap(can,res,ctx, valHM,tps,numLinClickedHM,numColClickedHM,tooltipHM,ctx2, can2,colorSliderGraphs,timeMax);
    }


}



window.onload = init;
