import  $ from 'jquery';
import jquery from 'jquery';
import 'jquery-ui-bundle';
//import 'jquery-ui-bundle/jquery-ui.css';
import { getAllUrlParams, calculMaxTime, log, cuttingString, displayTooltipOnCan } from './Fonctions auxiliaires.js';

import graphs from './graphs.js';
import histogramme from './histogramme.js';
import heatmap from './heatmap.js';
import onMouseOnHM from './onMouseOnHM.js';

export function toto (){return "toto"}

var can = document.createElement('canvas');

var ctx = can.getContext("2d")

var mouseOverCan = false;

//fichier json
var res;

//numero de la visu a afficher
var numVis = 1;

// variable des graphs
var tpsGraph  = 0;

// variable de l'histogramme
var tpsHisto  = 0;
var tooltipHisto = [];

// variables de la heatmap
var valHM  = 0;
var tpsHM = 0;
var numLinClickedHM = -1;
var numColClickedHM = -1;
var tooltipHM = [];





function mainVisu(json) {
  res = json;
  res.trainingSet.phrases.sort((a, b) => a.label.localeCompare(b.label));

  draw();

  let timeMax = calculMaxTime(res);


$( "#pasDeTemps" ).text(0);



 $( "#sliderGraphs " ).slider({
       range: "min",
       min: 0,
       max: timeMax +1,
       value:  0,
       slide: function( event, ui ) {
         $( "#amount" ).val( "$" + ui.value );
         $( "#pasDeTempsGraphs" ).text(ui.value);
         tpsGraph= ui.value;
         draw();

       }
     })


 $( "#sliderHisto " ).slider({
       range: "min",
       min: 0,
       max: timeMax +1 ,
       value:  0,
       slide: function( event, ui ) {
         $( "#amount" ).val( "$" + ui.value );
         $( "#pasDeTempsHisto" ).text(ui.value);
         tpsHisto= ui.value
         draw();
       }
     })


 $( "#sliderHMtps" ).slider({
       range: "min",
       min: 0,
       max: timeMax + 1,
       value:  0,
       slide: function( event, ui ) {
         $( "#amount" ).val( "$" + ui.value );
         $( "#pasDeTempsHM" ).text(ui.value);
         tpsHM= ui.value
         draw();
       }
     })

}

function init() {

  document.body.appendChild(can);

  $("#canvasvisu").css('background','rgba(0,255,128,0.4)')

  var tooltipCan = $('#tooltipCan');
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



  $( "#sliderHMmeanMin" ).slider({
        range: "min",
        min: 0,
        max: 100,
        value:  0,
        slide: function( event, ui ) {
          $( "#amount" ).val( "$" + ui.value );
          $( "#meanMinHM" ).text(ui.value/100);
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


  document.body.onmousemove = function(e) {
      tooltipCan.css('visibility', 'hidden')
      numColClickedHM = -1
      numLinClickedHM = -1

      if(mouseOverCan && numVis == 3){

        displayTooltipOnCan(tooltipHM, e)

        let result = onMouseOnHM(e,can,numVis,res);
        numColClickedHM = result[0]
        numLinClickedHM = result[1]


      }else if(mouseOverCan && numVis == 2){
        displayTooltipOnCan(tooltipHisto, e)

      }

        draw()
    }



  $( "#tabs" ).tabs({
    activate: function(event, ui) {
      numVis = $("#tabs").tabs('option', 'active') +1;
      draw();
    }
});


// $( "#sliderVisu4" ).slider({
//       range: "min",
//       min: 0,
//       max: 100,
//       value:  0,
//       slide: function( event, ui ) {
//         $( "#amount" ).val( "$" + ui.value );
//         $( "#valeur4" ).text(ui.value/100);
//         val4= ui.value
//         draw();
//
//       }
//     })


//changemet de l index visu1
// $(".cb").click(function() {
//
//   clearButtonInd($(this).prop("value"));
//   index = $(this).prop("value");
//   draw();
// });


// $("#mean").click(function() {
//
//   meanb = !meanb;
//   draw();
// });
//
//
//
// $("#cov").click(function() {
//
//   covb = !covb;
//   draw();
// });

}




//dessin du canevas en fonction du numero de visu demandé
function draw(){

    if (numVis == 1 ){
        graphs(can,res,ctx,tpsGraph );

    }else if(numVis==2){
        histogramme(can,res,ctx, tpsHisto, tooltipHisto);


    }else if(numVis==3){
            heatmap(can,res,ctx, valHM,tpsHM,numLinClickedHM,numColClickedHM,tooltipHM);
    }

    // console.log(tooltipHisto);
}



window.onload = init;
