import  $ from 'jquery';
import jquery from 'jquery';
import 'jquery-ui-bundle';
import { getAllUrlParams, calculMaxTime, log, cuttingString } from './Fonctions auxiliaires.js';

export default function histogramme(can, res,ctx, tps5) {
  can.width = '800';
  can.height = '800';

  //calcul de la classe d un histogramme en fct du nombre de classe
   let histoSize = (800-30)/res.trainingSet.phrases.length;


  let classNameSize = 30

  ctx.fillStyle = "rgba(255,128,0,0.2)";
  ctx.fillRect(0, 0 , can.width,can.height);


  ctx.fillStyle = "rgb(0,0,0)";
  let cpt = 0;
  ctx.font ="15px Arial";


  for(let modelName of res.model.models){
    let txt = cuttingString((800-50)/(res.model.models.length)-2, ctx, modelName.label)//texte coupe si trop long

    ctx.fillText(txt,
      50  + cpt*(800-50)/(res.model.models.length) +((800-50)/(res.model.models.length) -ctx.measureText(txt).width)/2,
      20)

    cpt++
  }

  //numero de classe etudie
  let index =0;

  for(let ph of res.trainingSet.phrases){


    //ligne horizontale
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(0,histoSize*91/100+ index*histoSize + classNameSize  );
    ctx.lineTo(can.width ,histoSize*91/100+ index*histoSize + classNameSize );
    ctx.stroke();


    ctx.fillStyle = "rgb(0,0,0)";

    //barre verticale (curseur)
    ctx.beginPath();

    ctx.moveTo(15, histoSize*16/100 + index*histoSize + classNameSize);
    ctx.lineTo(31, histoSize*16/100 + index*histoSize + classNameSize);

    ctx.moveTo(15+8, histoSize*16/100 + index*histoSize + classNameSize);
    ctx.lineTo(15+8, histoSize*85/100 + index*histoSize + classNameSize);

    ctx.moveTo(15, histoSize*85/100 + index*histoSize + classNameSize);
    ctx.lineTo(31, histoSize*85/100 + index*histoSize + classNameSize);

    ctx.stroke();


    //nom de la classe

    if(res.trainingSet.phrases.length<10){

      ctx.fillStyle = "rgb(0,0,175)";
      ctx.font ="15px Arial";

      ctx.fillText(0 ,35, histoSize*16/100 + 15/2  + index*histoSize + classNameSize);
      ctx.fillText(ph.length-1,35, histoSize*85/100 + Math.min(15/2, histoSize*6/100-2) + index*histoSize + classNameSize);
    }else if(res.trainingSet.phrases.length<20){

      ctx.fillStyle = "rgb(0,0,175)";
      let tamp = (res.trainingSet.phrases.length*(-1) - 10)/10*5 + 10
      ctx.font = tamp + "px Arial";

      ctx.fillText(0 ,35, histoSize*16/100 + 15/2  + index*histoSize + classNameSize);
      ctx.fillText(ph.length-1,35, histoSize*85/100 + Math.min(15/2, histoSize*6/100-2) + index*histoSize + classNameSize);

    }


    //dessin de la barre de pas de temps sur le curseur en rouge

    ctx.beginPath();
    ctx.strokeStyle = "rgb(200,0,0)";
    ctx.lineWidth=2;



    if(ph.length>tps5){

      ctx.moveTo(15, histoSize*16/100 + index*histoSize  + histoSize*69/100*tps5/(ph.length-1) + classNameSize);
      ctx.lineTo(31, histoSize*16/100 + index*histoSize  + histoSize*69/100*tps5/(ph.length-1) + classNameSize);

    }else{

      ctx.moveTo(15, histoSize*85/100 + index*histoSize + classNameSize );
      ctx.lineTo(31, histoSize*85/100 + index*histoSize + classNameSize);

    }

    ctx.stroke();

    ctx.lineWidth=1;
    ctx.strokeStyle = "rgb(0,0,0)";

    //pour chaque classe (/pour chaque classe)
    for(let i = 0; i<res.model.models.length;i++){
      //recuperation du nom
      let classLabel = res.model.models[i].label;
      //console.log(classLabel);
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.font ="13px Arial";





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
        let histoWidth = (800-50)/(res.model.models.length)*3/4
        ctx.fillRect((i)*(800-50)/(res.model.models.length) +50 + histoWidth/3/2, histoSize*16/100 + index*histoSize + (1-likelihood)*histoSize*75/100 + classNameSize, histoWidth, likelihood*histoSize*75/100)

        ctx.fillStyle = "rgb(0,0,0)";

        if(res.trainingSet.phrases.length<10){
          ctx.font ="15px Arial";
          ctx.fillText(likelihood ,(i + 0.5)*(800 - 50)/(res.model.models.length) +50 -ctx.measureText(likelihood).width/2, -2 +  histoSize*16/100 + index*histoSize + (1-likelihood)*histoSize*75/100 + classNameSize);
        }else if(res.trainingSet.phrases.length<20){

          let tamp = (res.trainingSet.phrases.length*(-1) - 10)/10*5 + 10
          ctx.font = tamp + "px Arial";


          ctx.fillText(likelihood ,(i + 0.5)*(800 - 50)/(res.model.models.length) +50 -ctx.measureText(likelihood).width/2, -2 +  histoSize*16/100 + index*histoSize + (1-likelihood)*histoSize*75/100 + classNameSize);


         }

      }else{//si on est apres la fin de la phrase on affiche la derniere valeure

        //la valeur correspondante
        let likelihood = ph.likelihoods[ph.length-1][classLabel]

        //troncature
        likelihood = likelihood*100;
        likelihood = Math.round(likelihood)
        likelihood = likelihood/100

        //couleur differente pour la classe symetrique
        if(classLabel == ph.label){
          ctx.fillStyle = "rgb(150,80,80)";
        }else{
          ctx.fillStyle = "rgb(70,70,70)";
        }

        //dessin du rectangle
        let histoWidth = (800-50)/(res.model.models.length)*3/4
        ctx.fillRect((i)*(800-50)/(res.model.models.length) +50 +  histoWidth/3/2, histoSize*16/100 + index*histoSize + (1-likelihood)*histoSize*75/100 + classNameSize, histoWidth, likelihood*histoSize*75/100)


        ctx.fillStyle = "rgb(0,0,0)";


        if(res.trainingSet.phrases.length<10){
          ctx.font ="15px Arial";
          ctx.fillText(likelihood ,(i + 0.5)*(800 - 50)/(res.model.models.length) +50 -ctx.measureText(likelihood).width/2, -2 +  histoSize*16/100 + index*histoSize + (1-likelihood)*histoSize*75/100 + classNameSize);


        }else if(res.trainingSet.phrases.length<20){

          let tamp = (res.trainingSet.phrases.length*(-1) - 10)/10*5 + 10
          ctx.font = tamp + "px Arial";


          ctx.fillText(likelihood ,(i + 0.5)*(800 - 50)/(res.model.models.length) +50 -ctx.measureText(likelihood).width/2, -2 +  histoSize*16/100 + index*histoSize + (1-likelihood)*histoSize*75/100 + classNameSize);


         }
      }
    }


    index++;
  }
}
