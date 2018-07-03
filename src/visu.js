import  $ from 'jquery';
import jquery from 'jquery';
import 'jquery-ui-bundle';
//import 'jquery-ui-bundle/jquery-ui.css';
import { getAllUrlParams, calculMaxTime, log, cuttingString, displayTooltipOnCan } from './Fonctions auxiliaires.js';

import graphs from './graphs.js';
import histogramme from './histogramme.js';
import heatmap from './heatmap.js';
import onMouseOnHM from './onMouseOnHM.js';
import onMouseOnGraph from './onMouseOnGraph.js';
import onMouseOnHisto from './onMouseOnHisto.js';



var can = document.createElement('canvas');

var ctx = can.getContext("2d")

var mouseOverCan = false;

//fichier json
var res;


//numero de la visu a afficher
var numVis = 1;
var selectedGraph = null

// variable des graphs
var tps1=0;
var colorSliderGraphs = "rgb(0,0,160)";
var isDraging = false;

// variable de l'histogramme
var tooltipHisto = [];
var rectList = []
var selectedRectHisto = null;
var tps2=0;


// variables de la heatmap
var valHM  = 0;
var numLinClickedHM = -1;
var numColClickedHM = -1;
var tooltipHM = [];
var tps3=0;





function mainVisu(json) {
  res = json;
  res.trainingSet.phrases.sort((a, b) => a.label.localeCompare(b.label));

  log("data",res)
  draw();

  let timeMax = calculMaxTime(res);

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
          draw()
        },
        slide: function( event, ui ) {
         $( "#amount" ).val( "$" + ui.value );
         $( "#handleGraphs" ).text(ui.value);
         colorSliderGraphs = "rgb(" + 0 + "," + (ui.value*128)/timeMax +"," + (160+ ui.value*95/timeMax) +")"
         $( "#handleGraphs" ).css("background",colorSliderGraphs);
         tps1= ui.value;


         // sliderHisto.slider("value", tps)
         // sliderHM.slider("value", tps)
         draw();

       }
     })





 var sliderHisto = $( "#sliderHisto " ).slider({
       range: "min",
       min: 0,
       max: timeMax +1 ,
       value:  0,
       slide: function( event, ui ) {
         $( "#amount" ).val( "$" + ui.value );
         $( "#handleHisto" ).text(ui.value);
         $( "#handleHisto" ).css("background","rgb(" + 0 + "," + (ui.value*128)/timeMax +"," + (160+ ui.value*95/timeMax) +")");
         tps2= ui.value

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
       slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.value );
        $( "#handleHM" ).text(ui.value);
        $( "#handleHM" ).css("background","rgb(" + 0 + "," + (ui.value*128)/timeMax +"," + (160+ ui.value*95/timeMax) +")");
         tps3= ui.value

         //sliderHisto.slider("value", tps)
         //sliderGraph.slider("value", tps)
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

  $( "#meanMinHM" ).text(1);

  $( "#sliderHMmeanMin" ).slider({
        range: "min",
        min: 0,
        max: 100,
        value:  0,
        slide: function( event, ui ) {
          $( "#amount" ).val( "$" + ui.value );

          $( "#handleSeuilHM" ).text(ui.value/100);
          $( "#handleSeuilHM" ).css("background","rgb(" + (95 + ui.value/100*160) + "," +  (0 +ui.value*160/100) +"," + (0+ ui.value*160/100) +")");

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
      selectedGraph = []


      if(mouseOverCan && numVis == 3){

        displayTooltipOnCan(tooltipHM, e)

        let result = onMouseOnHM(e,can,res);
        numColClickedHM = result[0]
        numLinClickedHM = result[1]


      }else if(mouseOverCan && numVis == 2){
        displayTooltipOnCan(tooltipHisto, e)
        selectedRectHisto = onMouseOnHisto(e,can,ctx,rectList);

      }else if(mouseOverCan && numVis == 1){
        selectedGraph = onMouseOnGraph(e,can,res);

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
        graphs(can,res,ctx,tps1, selectedGraph, colorSliderGraphs, isDraging );



    }else if(numVis==2){
        rectList = histogramme(can,res,ctx, tps2, tooltipHisto, selectedRectHisto);

    }else if(numVis==3){
        heatmap(can,res,ctx, valHM,tps3,numLinClickedHM,numColClickedHM,tooltipHM);
    }


}



window.onload = init;
