import  $ from 'jquery';
import jquery from 'jquery';
import 'jquery-ui-bundle';
import { getAllUrlParams, calculMaxTime, log, cuttingString } from './Fonctions auxiliaires.js';

export default function histogramme(can, res,ctx, tps5, tooltipHisto, selectedRectHisto) {
  can.width = '800';
  can.height = '800';

  //tableau qui stockera la liste des rectangle pour la surbrillance en vert lorsqu on pqsse le curseur
  let rectList = []

  //calcul de la taille d une serie d histogramme en fct du nombre de classe
   let histoSize = (800-30)/res.trainingSet.phrases.length;

   // calcul de la largeur d'un batton
   let histoWidth = (800-50)/(res.model.models.length)*3/4

  let classNameSize = 30

  ctx.fillStyle = "rgba(255,128,0,0.2)";
  ctx.fillRect(0, 0 , can.width,can.height);

  //tracé de la ligne blanche verticale
  ctx.strokeStyle = "rgb(255,255,255)"
  ctx.lineWidth = 3

  ctx.beginPath();
  ctx.moveTo(51 ,0);
  ctx.lineTo( 51 ,can.height)
  ctx.stroke();


  ctx.lineWidth = 1
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.font ="15px Arial";

  let cpt = 0;

  for(let modelName of res.model.models){

    //ecriture des noms de classe
    let txt = cuttingString((800-50)/(res.model.models.length)-2, ctx, modelName.label)//texte coupe si trop long

    if(txt != modelName.label){

       tooltipHisto.push([50  + cpt*(800-50)/(res.model.models.length) +((800-50)/(res.model.models.length) -ctx.measureText(txt).width)/2,
             20-15,ctx.measureText(txt).width,15,modelName.label])


    }

    ctx.fillText(txt,
      50  + cpt*(800-50)/(res.model.models.length) +((800-50)/(res.model.models.length) -ctx.measureText(txt).width)/2,
      20)


      //tracé des lignes de separation verticales
      ctx.strokeStyle = "rgb(128,128,128)"

      ctx.beginPath();
      ctx.moveTo(51 + (cpt+1)*histoWidth*4/3,0);
      ctx.lineTo( 51 + (cpt+1)*histoWidth*4/3 ,can.height)
      ctx.stroke();


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

    //ligne horizontale blanche
    ctx.strokeStyle = "rgb(255,255,255)";
    ctx.lineWidth=histoSize*8/100;
    ctx.beginPath();
    ctx.moveTo(0,histoSize*3/100 + (index)*histoSize + classNameSize  );
    ctx.lineTo(can.width ,histoSize*3/100 + (index)*histoSize + classNameSize);
    ctx.stroke();

    ctx.fillStyle = "rgb(0,0,0)";
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.lineWidth = 1;

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
      ctx.fillStyle = "rgb(0,128,255)";

      ctx.font ="15px Arial";

      ctx.fillText(ph.length-1 ,35, histoSize*16/100 + 15/2  + index*histoSize + classNameSize);

      ctx.fillStyle = "rgb(0,0,160)";
      ctx.fillText(0,35, histoSize*85/100 + Math.min(15/2, histoSize*6/100-2) + index*histoSize + classNameSize);
    }else if(res.trainingSet.phrases.length<20){
      ctx.fillStyle = "rgb(0,128,255)";
      ctx.fillStyle = "rgb(0,0,160)";
      let tamp = (res.trainingSet.phrases.length*(-1) - 10)/10*5 + 10
      ctx.font = tamp + "px Arial";

      ctx.fillText(ph.length-1 ,35, histoSize*16/100 + 15/2  + index*histoSize + classNameSize);
      ctx.fillStyle = "rgb(0,0,160)";
      ctx.fillText(0,35, histoSize*85/100 + Math.min(15/2, histoSize*6/100-2) + index*histoSize + classNameSize);

    }


    //dessin de la barre de pas de temps sur le curseur en bleu



    ctx.beginPath();

    ctx.lineWidth=2;

    if(ph.length>tps5){
      ctx.strokeStyle = "rgb(" + 0 + "," + (tps5*128)/(ph.length-1) +"," + (160+ tps5*95/(ph.length-1)) +")";
      ctx.moveTo(15, histoSize*85/100 + index*histoSize  - histoSize*69/100*tps5/(ph.length-1) + classNameSize);
      ctx.lineTo(31, histoSize*85/100 + index*histoSize  - histoSize*69/100*tps5/(ph.length-1) + classNameSize);

    }else{

      ctx.strokeStyle = "rgb(0,128,255)";

      ctx.moveTo(15, histoSize*16/100 + index*histoSize + classNameSize );
      ctx.lineTo(31, histoSize*16/100 + index*histoSize + classNameSize);

    }

    ctx.stroke();

    // ctx.beginPath
    // ctx.moveTo(0,0)
    // ctx.lineTo(can.)

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

        ctx.fillRect((i)*(800-50)/(res.model.models.length) +50 + histoWidth/3/2, histoSize*16/100 + index*histoSize + (1-likelihood)*histoSize*75/100 + classNameSize, histoWidth, likelihood*histoSize*75/100)

        // recuperation des positions de tous les rectangles
        rectList.push({x:(i)*(800-50)/(res.model.models.length) +50 + histoWidth/3/2,
                       y:histoSize*16/100 + index*histoSize  + classNameSize,
                       w:histoWidth,
                       h:histoSize*75/100,
                       class:ph.label,
                       model:classLabel
                     })

        if(selectedRectHisto ){

          if((selectedRectHisto.class == ph.label && selectedRectHisto.model == classLabel) || (selectedRectHisto.model == ph.label && selectedRectHisto.class == classLabel)){

            ctx.strokeStyle="rgb(0,160,80)"
            ctx.beginPath();
            ctx.rect((i)*(800-50)/(res.model.models.length) +50 + histoWidth/3/2, histoSize*16/100 + index*histoSize + (1-likelihood)*histoSize*75/100 + classNameSize, histoWidth, likelihood*histoSize*75/100)
            ctx.lineWidth = 3
            ctx.stroke()
          }
        }

        //si on affiche pas la valeure on doit le mettre dans le tooltipHM
        if(res.trainingSet.phrases.length>20){

            tooltipHisto.push([(i)*(800-50)/(res.model.models.length) +50 + histoWidth/3/2,
                               histoSize*16/100 + index*histoSize + (1-likelihood)*histoSize*75/100 + classNameSize,
                               histoWidth,
                               likelihood*histoSize*75/100,
                               likelihood])
        }


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

        ctx.fillRect((i)*(800-50)/(res.model.models.length) +50 + histoWidth/3/2, histoSize*16/100 + index*histoSize + (1-likelihood)*histoSize*75/100 + classNameSize, histoWidth, likelihood*histoSize*75/100)




        rectList.push({x:(i)*(800-50)/(res.model.models.length) +50 + histoWidth/3/2,
                       y:histoSize*16/100 + index*histoSize + classNameSize,
                       w:histoWidth,
                       h:histoSize*75/100,
                       class:ph.label,
                       model:classLabel
                     })

        if(selectedRectHisto  ){

          if((selectedRectHisto.class == ph.label && selectedRectHisto.model == classLabel) || (selectedRectHisto.model == ph.label && selectedRectHisto.class == classLabel) ){
              ctx.beginPath();
             ctx.strokeStyle="rgb(0,100,50)"
             ctx.rect((i)*(800-50)/(res.model.models.length) +50 + histoWidth/3/2, histoSize*16/100 + index*histoSize + (1-likelihood)*histoSize*75/100 + classNameSize, histoWidth, likelihood*histoSize*75/100)
             ctx.lineWidth = 3
             ctx.stroke()
           }
        }





        ctx.fillRect((i)*(800-50)/(res.model.models.length) +50 +  histoWidth/3/2,
                      histoSize*16/100 + index*histoSize + (1-likelihood)*histoSize*75/100 + classNameSize,
                      histoWidth,
                      likelihood*histoSize*75/100)

        //si on affiche pas la valeure on doit le mettre dans le tooltipHM

        if(res.trainingSet.phrases.length>20){

            tooltipHisto.push([(i)*(800-50)/(res.model.models.length) +50 + histoWidth/3/2,
                               histoSize*16/100 + index*histoSize + (1-likelihood)*histoSize*75/100 + classNameSize,
                               histoWidth,
                               likelihood*histoSize*75/100,
                               likelihood])
        }




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
  return rectList;
}
