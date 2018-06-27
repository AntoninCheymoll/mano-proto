



import  $ from 'jquery';
import jquery from 'jquery';
import 'jquery-ui-bundle';
import { getAllUrlParams, calculMaxTime, log, cuttingString } from './Fonctions auxiliaires.js';


export default function graphs(can, res,ctx,tps3) {

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

      //ligne horizontale
      ctx.beginPath();
      ctx.moveTo(0,i*graphSize + graphSize*97/100);
      ctx.lineTo(can.width ,graphSize*97/100+ i*graphSize)
      ctx.stroke();
      ctx.beginPath();


      //tracé de la ligne indiquant le temps etudie


        ctx.moveTo(10 + 790*tps3/(maxTime-1),graphSize*15/100+ i*graphSize);
        //console.log('tps3:' + tps3);
        //console.log('mt:' + (maxTime-1));
        ctx.lineTo(10 + 790*tps3/(maxTime-1), graphSize +  i*graphSize);

        ctx.lineWidth=2;
        ctx.stroke();
        ctx.lineWidth=1;

      if(tps3< classe.length){
        //calcul utile au calcul de la reconnaissance Moyenne
         recoMean += classe.likelihoods[tps3][classeName]
      }


      let stckClassSym;
      //parcour de chaque classe dans le graphe
      for(let classe2 of res.model.models){
        //console.log('classeInGraphe ' +classe.label);
        //si on a afaire a la classe correspondante a celle du graphe on la dessinera plus tard en rouge
        if(classe2.label == classeName){
            //l affichage de la classe symetriaue se fera apres dans une autre couleur et a la fin pour que le trait soit au dessus des autres
            stckClassSym = classe;


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


              for (let j=1; j<data.length; j++){

                ctx.lineTo(10+j*(((can.width-10)*proportion)/(data.length-1)),  i*graphSize + graphSize*97/100 - data[j]*graphSize*82/100);
              }

              //console.log(ctx.strokeStyle);
            ctx.stroke();
          }

      }
  //dessin de la ligne rouge en dernier pour la faire ressortir

    if(tps3< classe.length){
            ctx.strokeStyle="rgb(255,0,0)"
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


        for (let j=1; j<data.length; j++){

          ctx.lineTo(10+j*(((can.width-10)*proportion)/(data.length-1)),i*graphSize + graphSize*97/100 - data[j]*graphSize*82/100);
        }

        //console.log(ctx.strokeStyle);
      ctx.stroke();



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
