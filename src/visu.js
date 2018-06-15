import  $ from 'jquery';
import jquery from 'jquery';
//import 'jquery-ui';
import 'jquery-ui-bundle';
//import 'jquery-ui-bundle/jquery-ui.css';



//import * as d3 from "d3";

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

// variable de la visu4
var val6  = 0;
var tps6 = 0;


function init(){


  document.body.appendChild(can);



  $("#canvasvisu").css('background','rgba(0,255,128,0.4)')

  //recuperation du fichier
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


   $( "#sliderVisu6tps" ).slider({
         range: "min",
         min: 0,
         max: timeMax,
         value:  0,
         slide: function( event, ui ) {
           $( "#amount" ).val( "$" + ui.value );
           $( "#pasDeTemps6" ).text(ui.value);
           tps6= ui.value
           draw();
         }
       })

  });

  $( "#sliderVisu4" ).slider({
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

  $( "#sliderVisu6meanMin" ).slider({
        range: "min",
        min: 0,
        max: 100,
        value:  0,
        slide: function( event, ui ) {
          $( "#amount" ).val( "$" + ui.value );
          $( "#meanMin6" ).text(ui.value/100);
          val6= ui.value
          draw();

        }
      })




  //
  // $( ".radioVisu").on('change', function (event) {
  //           $( ".radioVisu").checked = false;
  //
  //           this.checked = true;
  //           });



  $("#mean").click(function() {

    meanb = !meanb;
    draw();
  });


  $("#cov").click(function() {

    covb = !covb;
    draw();
  });


  //changemet de l index visu1
  $(".cb").click(function() {

    clearButtonInd($(this).prop("value"));
    index = $(this).prop("value");
    draw();
  });


  //changment de visu a afficher
  // $(".visu").click(function() {
  //
  //
  //   clearButtonVisu($(this).prop("value"));
  //   numVis = $(this).prop("value");
  //
  //
  //   draw();
  //
  // });




  $( "#tabs" ).tabs({
    activate: function(event, ui) {
      numVis = $("#tabs").tabs('option', 'active') +1 ;
      console.log($("#tabs").tabs('option', 'active'));
      draw();
    }
});



}


// function aff(e){
//
//   clearButtonVisu(e.target.value);
//   numVis = e.target.value;
//
//   draw();
// }

//affichage de la bonne visu et suppression des autres
// function AffVis(i){
//
//   if(i==1){
//     $("#Visu1").show();
//     $("#Visu3").hide();
//     $("#Visu4").hide();
//     $("#Visu5").hide();
//     $("#Visu6").hide();
//
//
//   }else if (i==2){
//
//     $("#Visu1").hide();
//     $("#Visu3").hide();
//     $("#Visu4").hide();
//     $("#Visu5").hide();
//     $("#Visu6").hide();
//
//   }else if (i==3){
//     $("#Visu1").hide();
//     $("#Visu3").show();
//     $("#Visu4").hide();
//     $("#Visu5").hide();
//     $("#Visu6").hide();
//
//   }else if (i==4){
//     $("#Visu1").hide();
//     $("#Visu3").hide();
//     $("#Visu4").show();
//     $("#Visu5").hide();
//     $("#Visu6").hide();
//
//
//   }else if (i==5){
//     $("#Visu1").hide();
//     $("#Visu3").hide();
//     $("#Visu4").hide();
//     $("#Visu5").show();
//     $("#Visu6").hide();
//
//   }else if (i==6){
//
//       $("#Visu1").hide();
//       $("#Visu3").hide();
//       $("#Visu4").hide();
//       $("#Visu5").hide();
//       $("#Visu6").show();
//
//
//     }
//
// }

//uncheck les boutons d in dex (visu1) autres aue celui aui vient d etre selectionné
function clearButtonInd(i){
  for(let j of $(".cb")){

    if(j.getAttribute("value")!=i){
      j.checked = false;
    }
  }
}

//uncheck les boutons de choix visu autres que celui aui vient d etre selectionné
function clearButtonVisu(i){
  for(let j of $(".visu")){
    if(j.getAttribute("value")!=i){
      j.checked = false;
    }

  }

  AffVis(i)

}



//temps maximum des phrases, le nombre retourné est celui de la valeure de la derniere phrase (0 si la longueur est 1)

function calculMaxTime(){
  let max = 0;
  for(let ph of res.trainingSet.phrases){
      max = Math.max(max,ph.length);
  }

  return max-1;
}

//dessin du canevas en fonction du numero de visu demandé
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

      //taille d un graphe unique
      let graphSize = 800/res.trainingSet.phrases.length;

      let recoMean = 0;


      can.width = '800';
      can.height = '800';


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


      //assignation a chaque phrases leur longueur par rapport a la longueur max
      for( let ph of res.trainingSet.phrases){
            dictProp[ph.label]=dictProp[ph.label]/maxTime;

      }


      //pour chaque classe
      for(let labelNum of res.model.models){

          //assignation du nom de la classe et recuperation de la proportion de la classe etudiee
          let classeName= labelNum.label
          let proportion = dictProp[classeName];

          console.log('classGraphe: '+ classeName);
          ctx.font = "15px Arial";
          ctx.fillStyle="rgb(0,0,100)"


          //affichage du nom de la classe
          ctx.fillText(classeName , 15,graphSize*5/100 + 15 + i*graphSize);



          ctx.strokeStyle="rgb(0,0,0)"

          //ligne verticale
          ctx.beginPath();
          ctx.moveTo(10,graphSize*15/100+ i*graphSize);
          ctx.lineTo(10,graphSize +  i*graphSize);
          ctx.stroke();

          //ligne horizontale
          ctx.beginPath();
          ctx.moveTo(0,i*graphSize + graphSize*97/100);
          ctx.lineTo(can.width ,graphSize*97/100+ i*graphSize)
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

          //tracé de la ligne indiquant le temps etudie si on ne depasse pas le temps de la phrase
          if(tps3< res.trainingSet.phrases[classIndex].length){

            ctx.moveTo(10 + 790*tps3/(maxTime-1),graphSize*15/100+ i*graphSize);
            console.log('tps3:' + tps3);
            console.log('mt:' + (maxTime-1));
            ctx.lineTo(10 + 790*tps3/(maxTime-1), graphSize +  i*graphSize);

            ctx.lineWidth=2;
            ctx.stroke();
            ctx.lineWidth=1;

            //calcul utile au calcul de la reconnaissance Moyenne
             recoMean += res.trainingSet.phrases[classIndex].likelihoods[tps3][classeName]
          }


          let stckClassSym;
          //parcour de chaque classe dans le graphe
          for(let classe of res.model.models){
            console.log('classeInGraphe ' +classe.label);
            //si on a afaire a la classe correspondante a celle du graphe on la dessinera plus tard en rouge
            if(classe.label == classeName){
                //l affichage de la classe symetriaue se fera apres dans une autre couleur et a la fin pour que le trait soit au dessus des autres
                stckClassSym = classe;


              }else{
                ctx.strokeStyle="rgb(0,0,0)"


                let data =  []

                //recuperation dans un tableau des valeurs correspondantes
                for(let x=0; x<res.trainingSet.phrases[classIndex].length;x++){
                  data.push(res.trainingSet.phrases[classIndex].likelihoods[x][classe.label]);

                }
                console.log('taille' + data.length);
                console.log(data);




                //trace de la courbe
                ctx.beginPath();
                ctx.moveTo(10, i*graphSize + graphSize*97/100 - data[0]*graphSize*82/100);


                  for (let j=1; j<data.length; j++){

                    ctx.lineTo(10+j*(((can.width-10)*proportion)/(data.length-1)),  i*graphSize + graphSize*97/100 - data[j]*graphSize*82/100);
                  }

                  console.log(ctx.strokeStyle);
                ctx.stroke();
              }

          }
//dessin de la ligne rouge en dernier pour la faire ressortir

          ctx.strokeStyle="rgb(255,0,0)"

//meme code aue precedemment
          let data =  []

          for(let x=0; x<res.trainingSet.phrases[classIndex].length;x++){
            data.push(res.trainingSet.phrases[classIndex].likelihoods[x][stckClassSym.label]);

          }
          console.log('taille' + data.length);
          console.log(data);





          ctx.beginPath();
          ctx.moveTo(10, i*graphSize + graphSize*97/100 - data[0]*graphSize*82/100);


            for (let j=1; j<data.length; j++){

              ctx.lineTo(10+j*(((can.width-10)*proportion)/(data.length-1)),i*graphSize + graphSize*97/100 - data[j]*graphSize*82/100);
            }

            console.log(ctx.strokeStyle);
          ctx.stroke();



            i++;
      }

      //calcul de la reconnaissance moyenne
      //troncature de la reconnaissance moyenne
      console.log("recomean: " + recoMean);
      recoMean = recoMean/res.model.models.length
      recoMean = recoMean*100;
      recoMean = Math.round(recoMean);
      recoMean /=100
      $("#recoMean").text(recoMean);



    }else if(numVis==4){
      can.width =  800;
      can.height = 800;

      //calcul de la taille d un carre de la heatmap (en fct du nombre de classe)
      let squaresize = 800/(res.model.models.length+1);

      var grd=ctx.createLinearGradient(0, 0,800*3/4 ,800*3/4);
      grd.addColorStop(0,"rgb(255,230,150,0.4)");
      grd.addColorStop(1,"rgb(255,125,0,0.4)");


      ctx.fillStyle = grd;
      ctx.fillRect(0, 0 , can.width,can.height);



      let i = 0;




      for(let model of res.model.models){

        ctx.fillStyle = "rgb(255,200,150)"
        ctx.fillRect(i*squaresize + squaresize, 0 , squaresize,squaresize);
        ctx.fillRect(0, i*squaresize + squaresize , squaresize,squaresize);

        ctx.fillRect(0, 0 , squaresize,squaresize);
        ctx.beginPath()
        ctx.moveTo(squaresize + i*squaresize, 0)
        ctx.lineTo(squaresize + i*squaresize, can.height)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(0, squaresize + i*squaresize)
        ctx.lineTo(can.width, squaresize + i*squaresize)
        ctx.stroke()

        ctx.fillStyle = "rgb(0,0,0)"

        // let s = "";
        // let snum = 0;
        // for(let x = 0; x<model.label.length; x++){
        //   //if(model.label[i]==/ /g){
        //       console.log("qqqqqqqqaaaaaaaaaaqqqq" + "/g" + "aaaaaaaaa");
        // //  }
        //   s.concat(model.label.charAt(i));
        // }

        var labelList = model.label.split(" ");

        let labelWordNum =0;

        ctx.font ="15px Arial";
        for(let mot of labelList){
          ctx.fillText(mot, squaresize/10, 17*labelWordNum+ squaresize + i*squaresize + squaresize/2)
          ctx.fillText(mot, squaresize + i*squaresize + squaresize/10 , 17*labelWordNum+  squaresize/2)
          labelWordNum++;
        }



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
              let valMod1Mod2 = 0;
              console.log('model2:'+model2.label);
              for(let i =0; i<phrase.length;i++){
                  valMod1Mod2 += phrase.likelihoods[i][model2.label]
              }
              valMod1Mod2 = valMod1Mod2/phrase.length;
              console.log('mean '+valMod1Mod2);

              if(valMod1Mod2*100>val4){
                ctx.fillStyle = "rgb("+ (255 - valMod1Mod2*255)+"," + (255 - valMod1Mod2*255)+ ","+ (255 - valMod1Mod2*255) +")";
                console.log(255 - valMod1Mod2*255);
                ctx.fillRect(numcol*squaresize, numligne*squaresize,squaresize , squaresize)
                if(valMod1Mod2>0.5){
                  ctx.fillStyle = "rgb(255,255,255)";
                }else{
                  ctx.fillStyle = "rgb(0,0,0)";
                }
                valMod1Mod2 *= 100;
                valMod1Mod2 = Math.round(valMod1Mod2);
                valMod1Mod2 /=100


                ctx.font ="15px Arial";
                ctx.fillText(valMod1Mod2, numcol*squaresize -10 + squaresize/2 , numligne*squaresize + squaresize/2);
               }
              //else{
              //
              //   var grd=ctx.createLinearGradient(numcol*squaresize, numligne*squaresize,numcol*squaresize + squaresize*3/4 , numligne*squaresize + squaresize*3/4);
              //   grd.addColorStop(0,"rgb(255,255,255,0)");
              //   grd.addColorStop(1,"rgb(255,125,0,0.4)");
              //
              //
              //   ctx.fillStyle = grd;
              //   ctx.fillRect(numcol*squaresize, numligne*squaresize,squaresize , squaresize)
              //
              // }
        }


      }



    }else if(numVis==5){
      can.width = '800';
      can.height = '800';

      //calcul de la classe d un histogramme en fct du nombre de classe
      let histoSize = 800/res.trainingSet.phrases.length;


      ctx.fillStyle = "rgba(255,128,0,0.2)";
      ctx.fillRect(0, 0 , can.width,can.height);

      //numero de classe etudie
      let index =0;

      for(let ph of res.trainingSet.phrases){


        //ligne horizontale
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.lineWidth=1;
        ctx.beginPath();
        ctx.moveTo(0,histoSize*91/100+ index*histoSize  );
        ctx.lineTo(can.width ,histoSize*91/100+ index*histoSize );
        ctx.stroke();


        //nom de la classe
        ctx.fillStyle = "rgb(0,0,175)";
        ctx.font ="15px Arial";
        ctx.fillText(ph.label, 5, 15 + index*histoSize);


        ctx.fillStyle = "rgb(0,0,0)";
        //barre verticale (curseur)
        ctx.beginPath();

        ctx.moveTo(15, histoSize*16/100 + index*histoSize );
        ctx.lineTo(31, histoSize*16/100 + index*histoSize);

        ctx.moveTo(15+8, histoSize*16/100 + index*histoSize );
        ctx.lineTo(15+8, histoSize*85/100 + index*histoSize);

        ctx.moveTo(15, histoSize*85/100 + index*histoSize );
        ctx.lineTo(31, histoSize*85/100 + index*histoSize);

        ctx.stroke();

        ctx.fillText(0 ,35, histoSize*21/100 + index*histoSize);
        ctx.fillText(ph.length-1,35, histoSize*88/100 + index*histoSize);

        //dessin de la barre de pas de temps sur le curseur en rouge

        ctx.beginPath();
        ctx.strokeStyle = "rgb(200,0,0)";
        ctx.lineWidth=2;



        if(ph.length>tps5){

          ctx.moveTo(15, histoSize*16/100 + index*histoSize  + histoSize*69/100*tps5/(ph.length-1) );
          ctx.lineTo(31, histoSize*16/100 + index*histoSize  + histoSize*69/100*tps5/(ph.length-1) );

        }else{

          ctx.moveTo(15, histoSize*85/100 + index*histoSize );
          ctx.lineTo(31, histoSize*85/100 + index*histoSize);

        }

        ctx.stroke();

        ctx.lineWidth=1;
        ctx.strokeStyle = "rgb(0,0,0)";

        //pour chaque classe (/pour chaque classe)
        for(let i = 0; i<res.model.models.length;i++){
          //recuperation du nom
          let classLabel = res.model.models[i].label;
          console.log(classLabel);
          ctx.fillStyle = "rgb(0,0,0)";
          ctx.font ="13px Arial";
          //affichage du nom
          ctx.fillText(classLabel, (i+1)*800/(res.model.models.length+1)-30, histoSize*98/100 + histoSize*index)



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


          //si on a pas atteint la fin de la phrase
          if(ph.length>tps5){
            //la valeur correspondante
            let likelihood = ph.likelihoods[tps5][classLabel]

            //troncature
            likelihood = likelihood*100;
            likelihood = Math.round(likelihood)
            likelihood = likelihood/100

            //couleur differente pour la classe symetrique
            if(classLabel == ph.label){
              ctx.fillStyle = "rgb(150,0,0)";
            }else{
              ctx.fillStyle = "rgb(0,0,0)";
            }

            //dessin du rectangle
            ctx.fillRect((i+1)*800/(res.model.models.length+1)-30, histoSize*16/100 + index*histoSize + (1-likelihood)*histoSize*75/100, 60, likelihood*histoSize*75/100)

            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillText(likelihood ,(i+1)*800/(res.model.models.length+1) - 10, -2 +  histoSize*16/100 + index*histoSize + (1-likelihood)*histoSize*75/100);

          }else{//si on est apres la fin de la phrase on affiche la derniere valeure

            //la valeur correspondante
            let likelihood = ph.likelihoods[ph.length-1][classLabel]

            //troncature
            likelihood = likelihood*100;
            likelihood = Math.round(likelihood)
            likelihood = likelihood/100

            //couleur differente pour la classe symetrique
            if(classLabel == ph.label){
              ctx.fillStyle = "rgb(150,100,100)";
            }else{
              ctx.fillStyle = "rgb(70,70,70)";
            }

            //dessin du rectangle
            ctx.fillRect((i+1)*800/(res.model.models.length+1)-30, histoSize*16/100 + index*histoSize + (1-likelihood)*histoSize*75/100, 60, likelihood*histoSize*75/100)

            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillText(likelihood ,(i+1)*800/(res.model.models.length+1) - 10, -2 +  histoSize*16/100 + index*histoSize + (1-likelihood)*histoSize*75/100);

          }
        }


        index++;
      }

    }else if(numVis==6){
      can.width =  800;
      can.height = 800;

      let phrases = [];

      //recuperation des phrases non finiess au temps tps6
      for(let ph of res.trainingSet.phrases){
          if(ph.length > tps6){
            phrases.push(ph);
          }
      }

      //dessin du fond en degradé
      var grd=ctx.createLinearGradient(0, 0,800*3/4 ,800*3/4);
      grd.addColorStop(0,"rgb(255,230,150,0.4)");
      grd.addColorStop(1,"rgb(255,125,0,0.4)");


      ctx.fillStyle = grd;

      ctx.fillRect(0, 0 , can.width,can.height);

      //calcul de la longueur d un carré
      let squaresize = 800/(phrases.length+1);


      let i = 0;//numero de la classe etudiee
      ctx.fillStyle = "rgb(255,200,150)"

      ctx.fillRect(0, 0, squaresize, squaresize);
      for(let model of phrases){

        //dessin de la grille
        ctx.beginPath()
        ctx.moveTo(squaresize + i*squaresize, 0)
        ctx.lineTo(squaresize + i*squaresize, can.height)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(0, squaresize + i*squaresize)
        ctx.lineTo(can.width, squaresize + i*squaresize)
        ctx.stroke()

        ctx.fillStyle = "rgb(255,200,150)"
        ctx.fillRect(squaresize*i + squaresize, 0, squaresize, squaresize);
        ctx.fillRect(0,squaresize*i + squaresize, squaresize, squaresize);

        ctx.fillStyle = "rgb(0,0,0)"

        // let s = "";
        // let snum = 0;
        // for(let x = 0; x<model.label.length; x++){
        //   //if(model.label[i]==/ /g){
        //       console.log("qqqqqqqqaaaaaaaaaaqqqq" + "/g" + "aaaaaaaaa");
        // //  }
        //   s.concat(model.label.charAt(i));
        // }

        //decoupage du label a chaue espace
        var labelList = model.label.split(" ");

        let labelWordNum =0;


        //affichage chaue partie a une hauteur differente
        ctx.font ="15px Arial";
        for(let mot of labelList){
          ctx.fillText(mot, squaresize/10, 17*labelWordNum+ squaresize + i*squaresize + squaresize/2)
          ctx.fillText(mot, squaresize + i*squaresize + squaresize/10 , 17*labelWordNum+  squaresize/2)
          labelWordNum++;
        }



        i++;
      }

      //numero de la ligne concernee
      let numligne = 0;
      for(let phrase of phrases){ //ligne
        numligne++;
        // let phrase;
        // for(let ph of res.trainingSet.phrases){
        //     if (ph.label == model1.label){
        //       phrase = ph;
        //       break;
        //     }
        // }

        console.log('phrase: '+phrase.label);


        ctx.beginPath();

        //partie fixe du curseur de temps
        ctx.moveTo( squaresize*numligne +squaresize*10/100, squaresize*89/100 );
        ctx.lineTo( squaresize*numligne +squaresize*10/100, squaresize*95/100);


         ctx.moveTo(squaresize*numligne +squaresize*10/100, squaresize*92/100 );
         ctx.lineTo(squaresize*numligne +squaresize*90/100, squaresize*92/100);

         ctx.moveTo(squaresize*numligne + squaresize*90/100, squaresize*89/100 );
         ctx.lineTo(squaresize*numligne + squaresize*90/100, squaresize*95/100);

        ctx.stroke();

        ctx.font ="10px Arial";

        ctx.fillStyle = "rgb(0,0,0)"
        ctx.fillText(0 ,squaresize*numligne +squaresize*10/100-3 , squaresize*89/100-2);
        ctx.fillText(phrase.length-1,squaresize*numligne + squaresize*90/100 - 3*(JSON.stringify(phrase.length)).length, squaresize*89/100-2);



        //partie rouge mobile du curseur

        ctx.beginPath();
        ctx.strokeStyle = "rgb(200,0,0)";
        ctx.lineWidth=2;



        ctx.moveTo(squaresize*numligne +squaresize*10/100 + squaresize*80/100*tps6/(phrase.length-1), squaresize*89/100 );
        ctx.lineTo(squaresize*numligne +squaresize*10/100 + squaresize*80/100*tps6/(phrase.length-1), squaresize*95/100 );



        ctx.stroke();

        ctx.lineWidth=1;
        ctx.strokeStyle = "rgb(0,0,0)";

        //num de la colonne concernee
        let numcol =0;
        for(let model2 of phrases){ //colonne
              numcol++;
              let valMod1Mod2 = phrase.likelihoods[tps6][model2.label];
              // console.log('model2:'+model2.label);
              // for(let i =0; i<phrase.length;i++){
              //     meanMod1Mod2 += phrase.likelihoods[i][model2.label]
              // }
              // meanMod1Mod2 = meanMod1Mod2/phrase.length;
              // console.log('mean '+meanMod1Mod2);


              //affichage de la heatmap seuleument si sa valeur n est pas en dessous du seuil a ignorer
              if(valMod1Mod2*100>val6){
                ctx.fillStyle = "rgb("+ (255 - valMod1Mod2*255)+"," + (255 - valMod1Mod2*255)+ ","+ (255 - valMod1Mod2*255) +")";
                console.log(255 - valMod1Mod2*255);

                //dessin du carre
                ctx.fillRect(numcol*squaresize, numligne*squaresize,squaresize , squaresize)

                //la couleur du texte depend de la couleur dessous pour etre la plus lisibl possible
                if(valMod1Mod2>0.5){
                  ctx.fillStyle = "rgb(255,255,255)";
                }else{
                  ctx.fillStyle = "rgb(0,0,0)";
                }

                //affichage de la valeur apres troncature
                valMod1Mod2 *= 100;
                valMod1Mod2 = Math.round(valMod1Mod2);
                valMod1Mod2 /=100


                ctx.font ="15px Arial";
                ctx.fillText(valMod1Mod2, numcol*squaresize - 10 + squaresize/2,  numligne*squaresize +squaresize/2);


               }
              //si on ne doit pas afficher la heatmap on affiche un degradé
              //else{
              //
              //   var grd=ctx.createLinearGradient(numcol*squaresize, numligne*squaresize,numcol*squaresize + squaresize*3/4 , numligne*squaresize + squaresize*3/4);
              //   grd.addColorStop(0,"rgb(255,255,255,0)");
              //   grd.addColorStop(1,"rgb(255,125,0,0.4)");
              //
              //
              //   ctx.fillStyle = grd;
              //   ctx.fillRect(numcol*squaresize, numligne*squaresize,squaresize , squaresize)

              //}
        }


      }



    }
}



window.onload = init;
