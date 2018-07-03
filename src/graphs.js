



import  $ from 'jquery';
import jquery from 'jquery';
import 'jquery-ui-bundle';
import { getAllUrlParams, calculMaxTime, log, cuttingString } from './Fonctions auxiliaires.js';


export default function graphs(can, res,ctx,tps3,selectedGraph,colorSliderGraphs,isDraging) {

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
  for(let classe of res.trainingSet.phrases){

      //assignation du nom de la classe et recuperation de la proportion de la classe etudiee
      let classeName= classe.label
      let proportion = dictProp[classeName];


      //console.log('classGraphe: '+ classeName);
      ctx.font = "15px Arial";
      ctx.fillStyle="rgb(0,0,100)"


      //affichage du nom de la classe
      //ctx.fillText(classeName , 500 ,graphSize*5/100 + 15 + i*graphSize);
      //log("",ctx.measureText(classeName) )
       ctx.fillText(classeName , can.width -20 -ctx.measureText(classeName).width ,graphSize*5/100 + 15 + i*graphSize);



      ctx.strokeStyle="rgb(0,0,0)"

      //ligne verticale
      ctx.beginPath();
      ctx.moveTo(10,graphSize*15/100+ i*graphSize);
      ctx.lineTo(10,graphSize +  i*graphSize);
      ctx.stroke();

      //ligne horizontale de temps
      ctx.beginPath();
      ctx.moveTo(0,i*graphSize + graphSize*97/100);
      ctx.lineTo(can.width ,graphSize*97/100+ i*graphSize)
      ctx.stroke();

      //battons de temps
      ctx.lineWidth=2
      for(let j=0;j<10;j++){
        ctx.strokeStyle="rgb(0,"+ 128*j/9  + ","+ (160+ 95*j/9) +")"
        ctx.beginPath();
        ctx.moveTo(10 + j*(790/9),i*graphSize + graphSize*97/100 - graphSize*8/100);
        ctx.lineTo(10 + j*(790/9) ,graphSize*97/100+ i*graphSize + graphSize*8/100)
        ctx.stroke();

      }

      //ligne horizontale blanche de separation
      ctx.beginPath();
      ctx.strokeStyle = "rgb(255,255,255)"
      ctx.lineWidth=graphSize*8/100;
      ctx.moveTo(0, graphSize*7/100+ (i+1)*graphSize);
      ctx.lineTo(can.width ,graphSize*7/100+ (i+1)*graphSize)
      ctx.stroke();

      //tracé de la ligne indiquant le temps etudie

        //si le slider est en drag and drop alors on affiche un "halo" autour de la barre
        if(isDraging){
          ctx.lineWidth=4;
          ctx.strokeStyle = "rgb(0,200,255)"

          ctx.beginPath();

          ctx.moveTo(10 + 790*tps3/(maxTime-1),graphSize*15/100+ i*graphSize);
          ctx.lineTo(10 + 790*tps3/(maxTime-1), graphSize +  i*graphSize);

          ctx.stroke();
        }

        ctx.lineWidth=2;
        ctx.strokeStyle = colorSliderGraphs

        ctx.beginPath();

        ctx.moveTo(10 + 790*tps3/(maxTime-1),graphSize*15/100+ i*graphSize);
        ctx.lineTo(10 + 790*tps3/(maxTime-1), graphSize +  i*graphSize);

        ctx.stroke();


        ctx.lineWidth=1;
        ctx.strokeStyle = "rgb(0,0,0)"

      if(tps3< classe.length){
        //calcul utile au calcul de la reconnaissance Moyenne
         recoMean += classe.likelihoods[tps3][classeName]
      }


      let stckClassSym;
      let stckClassParall;


      //parcour de chaque classe dans le graphe
      for(let classe2 of res.model.models){
        //console.log('classeInGraphe ' +classe.label);
        //si on a afaire a la classe correspondante a celle du graphe on la dessinera plus tard en rouge
        if(classe2.label == classeName){
            //l affichage de la classe symetriaue se fera apres dans une autre couleur et a la fin pour que le trait soit au dessus des autres
            stckClassSym = classe2;


          }else if(selectedGraph && selectedGraph[1]==classe.label && selectedGraph[0]==classe2.label) {
            //si c est la ligne symetriaue de celle sur laquelle est la souris on la trace a la fin pour la faire ressortir
            stckClassParall = classe2


          }else{

            if(tps3< classe.length){
                  ctx.strokeStyle="rgb(0,0,0)"
            }else{
                    ctx.strokeStyle="rgb(70,70,70)"
            }





            let data =  []

            //recuperation dans un tableau des valeurs correspondantes
            for(let x=0; x<classe.length;x++){
              data.push(classe.likelihoods[x][classe2.label]);

            }

            // log("", classe)
            //console.log('taille' + data.length);
            //console.log(data);




            //trace de la courbe


            ctx.beginPath();
            ctx.moveTo(10, i*graphSize + graphSize*97/100 - data[0]*graphSize*82/100);

            //si c est la ligne  sur laquelle est la souris
             if(selectedGraph && selectedGraph[0]==classe.label && selectedGraph[1]==classe2.label){

              ctx.lineWidth = 2;

              if(tps3< classe.length){
                      ctx.strokeStyle="rgb(0,160,80)"
                }else{
                        ctx.strokeStyle="rgb(0,100,50)"
                }

            }



              for (let j=1; j<data.length; j++){

                ctx.lineTo(10+j*(((can.width-10)*proportion)/(data.length-1)),  i*graphSize + graphSize*97/100 - data[j]*graphSize*82/100);
              }

              //console.log(ctx.strokeStyle);
            ctx.stroke();
            ctx.lineWidth = 1;
          }

      }


    if(stckClassParall){
      if(tps3< classe.length){
              ctx.strokeStyle="rgb(0,160,80   )"
        }else{
                ctx.strokeStyle="rgb(0,100,50)"
        }

    //meme code aue precedemment
        let data =  []

        for(let x=0; x<classe.length;x++){
          data.push(classe.likelihoods[x][stckClassParall.label]);

        }


        ctx.beginPath();
        ctx.moveTo(10, i*graphSize + graphSize*97/100 - data[0]*graphSize*82/100);

          ctx.lineWidth = 2;


          for (let j=1; j<data.length; j++){

            ctx.lineTo(10+j*(((can.width-10)*proportion)/(data.length-1)),i*graphSize + graphSize*97/100 - data[j]*graphSize*82/100);
          }


        ctx.stroke();
        ctx.lineWidth = 1;


    }

  //dessin de la ligne rouge en dernier pour la faire ressortir

    if(tps3< classe.length){
            ctx.strokeStyle="rgb(150,0,0)"
      }else{
              ctx.strokeStyle="rgb(150,80,80)"
      }

  //meme code aue precedemment
      let data =  []

      for(let x=0; x<classe.length;x++){
        data.push(classe.likelihoods[x][stckClassSym.label]);

      }
      //console.log('taille' + data.length);
      //console.log(data);





      ctx.beginPath();
      ctx.moveTo(10, i*graphSize + graphSize*97/100 - data[0]*graphSize*82/100);

      //si c est la ligne sur laquelle est la souris
      if(selectedGraph && selectedGraph[0]==stckClassSym.label && selectedGraph[1]==classe.label){

        ctx.lineWidth = 2;
      }

        for (let j=1; j<data.length; j++){

          ctx.lineTo(10+j*(((can.width-10)*proportion)/(data.length-1)),i*graphSize + graphSize*97/100 - data[j]*graphSize*82/100);
        }

        //console.log(ctx.strokeStyle);
      ctx.stroke();
      ctx.lineWidth = 1;

      i++;

  }

  //calcul de la reconnaissance moyenne
  //troncature de la reconnaissance moyenne
  //console.log("recomean: " + recoMean);
  recoMean = recoMean/res.model.models.length
  recoMean = recoMean*100;
  recoMean = Math.round(recoMean);
  recoMean /=100
  $("#recoMean").text(recoMean);

}
