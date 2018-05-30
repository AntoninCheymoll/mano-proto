import $ from 'jquery';
import * as d3 from "d3";

var res;
var index = 0;
var numVis = 1;

var meanb = true;
var covb = false;

var can = document.createElement('canvas');

var ctx = can.getContext("2d")

function init(){

  document.body.appendChild(can);


  // $("#canvasvisu").css('background','rgba(0,255,128,0.4)')



  $.ajax({
    url: "/au_boulot_antonin.json",
    dataType:"json",
    context: document.body
  }).done(function(json) {
    res = json;
    draw();
  });

  $("#btt").click(function() {

    index = $("#index").val();

    draw();
  });

  $("#mean").click(function() {

    meanb = !meanb;
    draw();
  });

  $("#cov").click(function() {

    covb = !covb;
    draw();
  });



  $(".cb").click(function() {

    clearButtonInd($(this).prop("value"));
    index = $(this).prop("value");
    draw();
  });

  $(".visu").click(function() {


    clearButtonVisu($(this).prop("value"));
    numVis = $(this).prop("value");


    draw();

  });







}




function AffVis(i){

  if(i==1){
    $("#Visu1").show();
    // $("#visu1").hide();

  }else if (i==2){
      // console.log($("#Visu1"));
      $("#Visu1").hide();

  }


}

function clearButtonInd(i){
  for(let j of $(".cb")){




    if(j.getAttribute("value")!=i){
      j.checked = false;
    }

  }

}


function clearButtonVisu(i){
  for(let j of $(".visu")){
    if(j.getAttribute("value")!=i){
      j.checked = false;
    }

  }

  AffVis(i)

}


function red() {

  $("#canvasvisu").css('background','rgba(255,0,0,0.95)');
  let ctx = $("#canvasvisu")[0].getContext("2d");
  ctx.fillStyle = "rgb(0,0,200)"; // définit la couleur de remplissage du rectangle
  ctx.fillRect(10, 10, 55, 50);   // dessine le rectangle à la position 10, 10 d'une largeur de 55 et d'une hauteur de 50
  draw();
  draw();
}

function draw(){
  console.log(res);



    if(numVis == 1 ){
      // let can = document.createElement('canvas');
      can.width = '600';
      can.height = '150';
      // can.backgroundColor = "rgb(0,0,200)";
      // document.body.appendChild(can);

      // let ctx = can.getContext("2d")

      // ctx.clearRect(0, 0, $("#canvasvisu")[0].width, $("#canvasvisu")[0].height);

      ctx.textBaseline="top";


      ctx.fillStyle = "rgba(255,128,0,0.2)";
      ctx.fillRect(0, 0 , can.width,can.height);

      for (let i=0; i<res.model.models.length; i++){
        // console.log(res.model.models[i]);
        ctx.fillStyle = "rgb(0,0,200)"; // définit la couleur de remplissage du rectangle
        ctx.fillRect(10, 10 + i * 60, 50, 50);

        ctx.fillStyle = "#FFF"; // définit la couleur de remplissage du rectangle
        ctx.fillText(res.model.models[i].label, 15, 20 + i*60);

        let minmean = res.model.models[i].states[0].components[0].mean[index]
        let maxmean = res.model.models[i].states[0].components[0].mean[index]
        let mincovar = res.model.models[i].states[0].components[0].covariance[index]
        let maxcovar = res.model.models[i].states[0].components[0].covariance[index]
        for (let j in res.model.models[i].states){
          let covar = res.model.models[i].states[j].components[0].covariance[index];
          let mean = res.model.models[i].states[j].components[0].mean[index];

          minmean = Math.min(minmean, mean);
          maxmean = Math.max(maxmean, mean);

          mincovar = Math.min(mincovar, covar);
          maxcovar = Math.max(maxcovar, covar);
        }

        for (let j in res.model.models[i].states){
          let covar = res.model.models[i].states[j].components[0].covariance[index];
          let mean = res.model.models[i].states[j].components[0].mean[index];


            if(covb && meanb){

              if((covar-mincovar)/(maxcovar-mincovar)>(mean-minmean)/(maxmean-minmean)){
                ctx.beginPath();

                ctx.fillStyle = "#00F"; // définit la couleur de remplissage du rectangle
                ctx.arc(10+50+30+j*100, 10 + 25 + i*60, 25*(covar-mincovar)/(maxcovar-mincovar),0, Math.PI*2);
                ctx.fill();


                ctx.beginPath();
                ctx.fillStyle = "#0A0"; // définit la couleur de remplissage du rectangle
                ctx.arc(10+50+30+j*100, 10 + 25 + i*60, 25*(mean-minmean)/(maxmean-minmean),0, Math.PI*2);
                ctx.fill();

              }else{

                ctx.beginPath();
                ctx.fillStyle = "#0A0"; // définit la couleur de remplissage du rectangle
                ctx.arc(10+50+30+j*100, 10 + 25 + i*60, 25*(mean-minmean)/(maxmean-minmean),0, Math.PI*2);
                ctx.fill();

                ctx.beginPath();
                ctx.fillStyle = "#00F"; // définit la couleur de remplissage du rectangle
                ctx.arc(10+50+30+j*100, 10 + 25 + i*60, 25*(covar-mincovar)/(maxcovar-mincovar),0, Math.PI*2);
                ctx.fill();

                }
            }else if(covb){

              ctx.beginPath();
              ctx.fillStyle = "#00F"; // définit la couleur de remplissage du rectangle
              ctx.arc(10+50+30+j*100, 10 + 25 + i*60, 25*(covar-mincovar)/(maxcovar-mincovar),0, Math.PI*2);
              ctx.fill();

            }else if(meanb){


              ctx.beginPath();
              ctx.fillStyle = "#0A0"; // définit la couleur de remplissage du rectangle
              ctx.arc(10+50+30+j*100, 10 + 25 + i*60, 25*(mean-minmean)/(maxmean-minmean),0, Math.PI*2);
              ctx.fill();



            }


        }
      }
    }else if (numVis ==2){


      let r=0
      let g=128
      let b=0

      // let can = document.createElement('canvas');
      can.width = '800';
      can.height = '400';




      ctx.fillStyle = "rgba(255,128,0,0.2)";
      ctx.fillRect(0, 0 , can.width,can.height);
      // document.body.appendChild(can);

      // let ctx = can.getContext("2d")


      for(let ph of res.trainingSet.phrases){
        for(let labelNum of res.model.models){
          let label= labelNum.label
          console.log(label);




          let data =  []

          for(let i=0; i<ph.likelihoods.length;i++){
            data.push(ph.likelihoods[i][label]);

          }

          console.log(data);


          ctx.strokeStyle="rgb("+ r + "," + g +"," + b +")"
          ctx.beginPath();
          ctx.moveTo(10, (can.height-10)-data[0]*(can.height-20));
            for (let i=1; i<data.length; i++)
              ctx.lineTo(10+i*((can.width-10)/(data.length-1)), can.height -10 -data[i]*(can.height-20));



          ctx.stroke();


          }

          b= b + 255/(res.trainingSet.phrases.length-1);
      }



      ctx.moveTo(10,0);
      ctx.lineTo(10, can.height);
      ctx.stroke();

      ctx.moveTo(0, can.height-10);
      ctx.lineTo(can.width, can.height-10)

      ctx.stroke();

    }

}



window.onload = init;
