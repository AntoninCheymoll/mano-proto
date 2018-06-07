import  $ from 'jquery';
import jquery from 'jquery';
//import 'jquery-ui';
import 'jquery-ui-bundle';
//import 'jquery-ui-bundle/jquery-ui.css';


import * as d3 from "d3";

var can = document.createElement('canvas');
var ctx = can.getContext("2d")

//fichier json
var res;

//numero de la visu a afficher
var numVis = 1;

//variables de la visu1
var index = 0;
var meanb = true;
var covb = false;

// variable de la visu3
var tps3  = 50;

// variable de la visu4
var val4  = 0;

// variable de la visu4
var tps5  = 0;


function init(){


  document.body.appendChild(can);



  $("#canvasvisu").css('background','rgba(0,255,128,0.4)')

  $.ajax({
    url: "/dist/au_boulot_antonin.json",
    dataType:"json",
    context: document.body
  }).done(function(json) {
    res = json;
    draw();

    let timeMax = calculMaxTime();
    console.log('timeMax:'+ timeMax);

  $( "#pasDeTemps " ).text(0);

   $( "#sliderVisu3 " ).slider({
         range: "min",
         min: 0,
         max: timeMax,
         value:  0,
         slide: function( event, ui ) {
           $( "#amount" ).val( "$" + ui.value );
           $( "#pasDeTemps3" ).text(ui.value);
           tps3= ui.value;
           draw();
         }
       })


   $( "#sliderVisu5 " ).slider({
         range: "min",
         min: 0,
         max: timeMax,
         value:  0,
         slide: function( event, ui ) {
           $( "#amount" ).val( "$" + ui.value );
           $( "#pasDeTemps5" ).text(ui.value);
           tps5= ui.value
           draw();
         }
       })




  });

  $( "#sliderVisu4 " ).slider({
        range: "min",
        min: 0,
        max: 100,
        value:  0,
        slide: function( event, ui ) {
          $( "#amount" ).val( "$" + ui.value );
          $( "#valeur4" ).text(ui.value/100);
          val4= ui.value
          draw();
        }
      })





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
    $("#Visu3").hide();
    $("#Visu4").hide();
    $("#Visu5").hide();


  }else if (i==2){

    $("#Visu1").hide();
    $("#Visu3").hide();
    $("#Visu4").hide();
    $("#Visu5").hide();


  }else if (i==3){
    $("#Visu1").hide();
    $("#Visu3").show();
    $("#Visu4").hide();
    $("#Visu5").hide();


  }else if (i==4){
    $("#Visu1").hide();
    $("#Visu3").hide();
    $("#Visu4").show();
    $("#Visu5").hide();



  }else if (i==5){
    $("#Visu1").hide();
    $("#Visu3").hide();
    $("#Visu4").hide();
    $("#Visu5").show();


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




function calculMaxTime(){
  let max = 0;
  for(let ph of res.trainingSet.phrases){
      max = Math.max(max,ph.length);
  }

  return max-1;
}

function draw(){
  console.log(res);
  ctx.textBaseline="Top";


    if(numVis == 1 ){
      // let can = document.createElement('canvas');
      can.width = '600';
      can.height = res.model.models.length*60 +20;

      // can.backgroundColor = "rgb(0,0,200)";
      // document.body.appendChild(can);

      // let ctx = can.getContext("2d")

      // ctx.clearRect(0, 0, $("#canvasvisu")[0].width, $("#canvasvisu")[0].height);




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
          let classeName= labelNum.label
          console.log(classeName);




          let data =  []

          for(let i=0; i<ph.likelihoods.length;i++){
            data.push(ph.likelihoods[i][classeName]);

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




    }else if (numVis == 3 ){


      let recoMean = 0;



      can.width = '800';
      can.height = 430*res.model.models.length;


      ctx.fillStyle = "rgba(255,128,0,0.2)";
      ctx.fillRect(0, 0 , can.width,can.height);

      ctx.textBaseline='Top'
      ctx.fillStyle = "rgb(0,0,0)";
      let i = 0;//numéro de la classe étudiée





      //recherche de la phrase la plus longue pour les proportions
      let dictProp = {};
      let maxTime =0;
      for( let ph of res.trainingSet.phrases){
            dictProp[ph.label]=ph.length;
            maxTime = Math.max(maxTime, ph.length)
      }

      for( let ph of res.trainingSet.phrases){
            dictProp[ph.label]=dictProp[ph.label]/maxTime;

      }


      //pour chaque classe
      for(let labelNum of res.model.models){


          let classeName= labelNum.label
          let proportion = dictProp[classeName];

          console.log('classGraphe: '+ classeName);
          ctx.font = "15px Arial";
          ctx.fillText('Class name: ' + classeName , 100,25 + i*430);



          ctx.strokeStyle="rgb(0,0,0)"

          //ligne verticale
          ctx.beginPath();
          ctx.moveTo(10,30+ i*430);
          ctx.lineTo(10, 30+ 400 +  i*430);
          ctx.stroke();

          //ligne horizontale
          ctx.beginPath();
          ctx.moveTo(0,30 + 400 + i*430 -10 );
          ctx.lineTo((can.width-10)*proportion +10 ,30 + 400 + i*430 -10)
          ctx.stroke();
          ctx.beginPath();

          //on associe chaue classe à son index dans le training set
          let classIndex = 0;
          for(let phs of res.trainingSet.phrases ){
            if(phs.label == classeName){
                classIndex = phs.index;
                break;
            }
          }

          //tracé de la ligne indiquant le te;ps etudie
          if(tps3<= res.trainingSet.phrases[classIndex].length){

            ctx.moveTo(10 + 790*tps3/maxTime,30+ i*430);
            ctx.lineTo(10 + 790*tps3/maxTime, 30+ 400 +  i*430);

            ctx.lineWidth=2;
            ctx.stroke();
            ctx.lineWidth=1;

            recoMean += res.trainingSet.phrases[classIndex].likelihoods[tps3][classeName]
          }


          let stckClassSym;
          //parcour de chaque classe dans le graphe
          for(let classe of res.model.models){
            console.log('classeInGraphe ' +classe.label);
            //si on a afaire a la classe correspondante a celle du graphe on la dessinera plus tard en rouge
            if(classe.label == classeName){

                stckClassSym = classe;


              }else{
                ctx.strokeStyle="rgb(0,0,0)"


                let data =  []

                for(let x=0; x<res.trainingSet.phrases[classIndex].length;x++){
                  data.push(res.trainingSet.phrases[classIndex].likelihoods[x][classe.label]);

                }
                console.log('taille' + data.length);
                console.log(data);




                //trace de la courbe
                ctx.beginPath();
                ctx.moveTo(10, i*430 + 430 -10 - data[0]*(400-10));


                  for (let j=1; j<data.length; j++){

                    ctx.lineTo(10+j*((can.width*proportion-10)/(data.length-1)), i*430 + 430 -10 - data[j]*(400-10));
                  }

                  console.log(ctx.strokeStyle);
                ctx.stroke();
              }

          }
//dessin de la ligne rouge en dernier pour la faire ressortir
          ctx.strokeStyle="rgb(255,0,0)"


          let data =  []

          for(let x=0; x<res.trainingSet.phrases[classIndex].length;x++){
            data.push(res.trainingSet.phrases[classIndex].likelihoods[x][stckClassSym.label]);

          }
          console.log('taille' + data.length);
          console.log(data);





          ctx.beginPath();
          ctx.moveTo(10, i*430 + 430 -10 - data[0]*(400-10));


            for (let j=1; j<data.length; j++){

              ctx.lineTo(10+j*((can.width*proportion-10)/(data.length-1)), i*430 + 430 -10 - data[j]*(400-10));
            }

            console.log(ctx.strokeStyle);
          ctx.stroke();



            i++;
      }


      // console.log("recomean: " + recoMean);
      recoMean = recoMean/res.model.models.length
      recoMean = recoMean*100;
      recoMean = Math.round(recoMean);
      recoMean /=100
      $("#recoMean").text(recoMean);



    }else if(numVis==4){
      can.width =  150 + 150*res.model.models.length;
      can.height = 150 + 150*res.model.models.length;



      ctx.fillStyle = "rgba(255,128,0,0.2)";
      ctx.fillRect(0, 0 , can.width,can.height);



      let i = 0;
      for(let model of res.model.models){

        ctx.beginPath()
        ctx.moveTo(150 + i*150, 0)
        ctx.lineTo(150 + i*150, can.height)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(0, 150 + i*150)
        ctx.lineTo(can.width, 150 + i*150)
        ctx.stroke()

        ctx.fillStyle = "rgb(0,0,0)"
        ctx.fillText(model.label, 10, 150 + i*150 + 50)
        ctx.fillText(model.label, 150 + i*150 + 10  , 50)

        i++;
      }
      let numligne = 0;
      for(let model1 of res.model.models){ //ligne
        numligne++;
        let phrase;
        for(let ph of res.trainingSet.phrases){
            if (ph.label == model1.label){
              phrase = ph;
              break;
            }

        }

        console.log('phrase: '+phrase.label);

        let numcol =0;
        for(let model2 of res.model.models){ //colonne
              numcol++;
              let meanMod1Mod2 = 0;
              console.log('model2:'+model2.label);
              for(let i =0; i<phrase.length;i++){
                  meanMod1Mod2 += phrase.likelihoods[i][model2.label]
              }
              meanMod1Mod2 = meanMod1Mod2/phrase.length;
              console.log('mean '+meanMod1Mod2);

              if(meanMod1Mod2*100>val4){
                ctx.fillStyle = "rgb("+ (255 - meanMod1Mod2*255)+"," + (255 - meanMod1Mod2*255)+ ","+ (255 - meanMod1Mod2*255) +")";
                console.log(255 - meanMod1Mod2*255);
                ctx.fillRect(numcol*150, numligne*150,150 , 150)
                if(meanMod1Mod2>0.5){
                  ctx.fillStyle = "rgb(255,255,255)";
                }else{
                  ctx.fillStyle = "rgb(0,0,0)";
                }
                meanMod1Mod2 *= 100;
                meanMod1Mod2 = Math.round(meanMod1Mod2);
                meanMod1Mod2 /=100


                ctx.font ="15px Arial";
                ctx.fillText(meanMod1Mod2, numcol*150 + 70, 70 +numligne*150);
              }
        }


      }



    }else if(numVis==5){
      can.width = '800';
      can.height = 430*res.model.models.length;


      ctx.fillStyle = "rgba(255,128,0,0.2)";
      ctx.fillRect(0, 0 , can.width,can.height);

      let index =0;

      for(let ph of res.trainingSet.phrases){


        //ligne horizontale
        ctx.beginPath();
        ctx.moveTo(0,360+15+ index*430  );
        ctx.lineTo(can.width ,360+15+ index*430);
        ctx.stroke();
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.font ="15px Arial";

        ctx.fillText("Nom de la classe: " + ph.label, 15, 15 + index*430);

        ctx.beginPath();

        ctx.moveTo(15, 45 + index*430 );
        ctx.lineTo(31, 45 + index*430);

        ctx.moveTo(15+8, 45 + index*430 );
        ctx.lineTo(15+8, 345 + index*430);

        ctx.moveTo(15, 345 + index*430 );
        ctx.lineTo(31, 345 + index*430);

        ctx.stroke();

        ctx.fillText(0,35, 50 + index*430);
        ctx.fillText(ph.length-1,35, 350 + index*430);


        if(ph.length>tps5){
          ctx.beginPath();
          ctx.strokeStyle = "rgb(200,0,0)";
          ctx.lineWidth=2;
          ctx.moveTo(15, 45 + index*430  + 300*tps5/ph.length );
          ctx.lineTo(31, 45 + index*430 + 300*tps5/ph.length );
          ctx.stroke();

          ctx.lineWidth=1;
          ctx.strokeStyle = "rgb(0,0,0)";
        }


        for(let i = 0; i<res.model.models.length;i++){
          let classLabel = res.model.models[i].label;
          console.log(classLabel);
          ctx.fillStyle = "rgb(0,0,0)";
          ctx.fillText(classLabel, (i+1)*800/(res.model.models.length+1)-50, 390 + 430*index)



          //calcul du likelihood moyen
          //
          // let meanLikelihood = 0;
          //
          // for(let i =0; i<ph.length;i++){
          //     meanLikelihood += ph.likelihoods[i][classLabel]
          // }
          // meanLikelihood = meanLikelihood/ph.length;
          // meanLikelihood = meanLikelihood*100;
          // meanLikelihood = Math.round(meanLikelihood)
          // meanLikelihood = meanLikelihood/100



          if(ph.length>tps5){
            let likelihood = ph.likelihoods[tps5][classLabel]

            likelihood = likelihood*100;
            likelihood = Math.round(likelihood)
            likelihood = likelihood/100

            if(classLabel == ph.label){
              ctx.fillStyle = "rgb(150,0,0)";
            }else{
              ctx.fillStyle = "rgb(0,0,0)";
            }
            ctx.fillRect((i+1)*800/(res.model.models.length+1)-30, 15 + index*430 + (1-likelihood)*360, 60, likelihood*360)

            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillText(likelihood ,(i+1)*800/(res.model.models.length+1)-10,  10 +index*430 + (1-likelihood)*360);

          }
        }


        index++;
      }

    }
}



window.onload = init;
