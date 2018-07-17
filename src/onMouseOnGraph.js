import  $ from 'jquery';
import jquery from 'jquery';
import 'jquery-ui-bundle';

import { drawSecondCan } from './drawSecondCan.js';

export default function onMouseOnGraph(e,can,res,drawRect){
  let x = e.pageX- $("#divMilieu").position().left;
  let y = e.pageY- $("#divMilieu").position().top;

  let graphSize = 800/res.phrases.length;


  //calcul du graph concerné
  let numPhrase = Math.trunc(y/graphSize)
  let phrase = res.phrases[numPhrase]


  y = y - numPhrase*graphSize


  //calcul du pas de temps du curseur de la souris
  let maxTime = 0;
  for( let ph of res.phrases){

        maxTime = Math.max(maxTime, ph.length)
  }

  //la duree du graph concerné par rapport a celle du plus grand graph
  let tpsGraphProp = phrase.length/maxTime

  // si on se trouve sur le graph et pas a coté
  if(10<=x && x<=10 + (can.width-10)*tpsGraphProp){

    //la taille en pixel du graph concerné
    let graphSizeW = (800-10)*tpsGraphProp

    //le temps du curseur par rapport à celui du graph
    let tpsCursProp = (x-10)/graphSizeW;

    //le pas de temps que pointe le curseur de la souris
    let tpsSouris = Math.round((phrase.length-1)*tpsCursProp)



    //calcul de la valeure de likelihood aue pointe la Souris
    //le graph commence à 15% de la taille aui lui est consacrée et fini à 97%
    // console.log(graphSize, y );
    // console.log(graphSize -y);

    let mouseLikelihood = (graphSize - y)*(1+3/82+15/82)/graphSize - 3/82;



    //initialisation du tableau de distance
    let dict = []

    for(let label of Object.keys(res.model.classes)){
      dict[label]=100
    }


    //recherche de la courbe la plus proche

    for(let i = Math.max(0,tpsSouris-2); i<=Math.min(phrase.length-1,tpsSouris+2);i++){
          for(let label of Object.keys(res.model.classes)){


              if(dict[label]> Math.sqrt( (tpsSouris -i)*graphSizeW/phrase.length*(tpsSouris -i)*graphSizeW/phrase.length+  (y-(graphSize*97/100 - phrase.instantNormalizedLikelihoods[i][label]*graphSize*82/100))*(y-(graphSize*97/100 - phrase.instantNormalizedLikelihoods[tpsSouris][label]*graphSize*82/100)))) {
                  dict[label] = Math.sqrt( (tpsSouris -i)*graphSizeW/phrase.length*(tpsSouris -i)*graphSizeW/phrase.length +  (y-(graphSize*97/100 - phrase.instantNormalizedLikelihoods[i][label]*graphSize*82/100))*(y-(graphSize*97/100 - phrase.instantNormalizedLikelihoods[tpsSouris][label]*graphSize*82/100)))
              }


                if(i+1<phrase.length){
                  if(dict[label]> Math.sqrt( (tpsSouris -i + 1/3)*graphSizeW/phrase.length*(tpsSouris -i + 1/3)*graphSizeW/phrase.length+
                    (((y-(graphSize*97/100 - phrase.instantNormalizedLikelihoods[i][label]*graphSize*82/100))*2/3 + ((y-(graphSize*97/100 - phrase.instantNormalizedLikelihoods[i+1][label]*graphSize*82/100))*1/3 ))*
                    (((y-(graphSize*97/100 - phrase.instantNormalizedLikelihoods[i][label]*graphSize*82/100))*2/3 + ((y-(graphSize*97/100 - phrase.instantNormalizedLikelihoods[i+1][label]*graphSize*82/100))*1/3 )))))) {



                      dict[label] = Math.sqrt( (tpsSouris -i + 1/3)*graphSizeW/phrase.length*(tpsSouris -i + 1/3)*graphSizeW/phrase.length+
                   (((y-(graphSize*97/100 - phrase.instantNormalizedLikelihoods[i][label]*graphSize*82/100))*2/3 + ((y-(graphSize*97/100 - phrase.instantNormalizedLikelihoods[i+1][label]*graphSize*82/100))*1/3 ))*
                   (((y-(graphSize*97/100 - phrase.instantNormalizedLikelihoods[i][label]*graphSize*82/100))*2/3 + ((y-(graphSize*97/100 - phrase.instantNormalizedLikelihoods[i+1][label]*graphSize*82/100))*1/3 )))))
              }


              if(dict[label]> Math.sqrt( (tpsSouris -i + 2/3)*graphSizeW/phrase.length*(tpsSouris -i + 2/3)*graphSizeW/phrase.length+
               (((y-(graphSize*97/100 - phrase.instantNormalizedLikelihoods[i][label]*graphSize*82/100))*1/3 + ((y-(graphSize*97/100 - phrase.instantNormalizedLikelihoods[i+1][label]*graphSize*82/100))*2/3 ))*
               (((y-(graphSize*97/100 - phrase.instantNormalizedLikelihoods[i][label]*graphSize*82/100))*1/3 + ((y-(graphSize*97/100 - phrase.instantNormalizedLikelihoods[i+1][label]*graphSize*82/100))*2/3 )))))) {



                  dict[label] = Math.sqrt( (tpsSouris -i + 2/3)*graphSizeW/phrase.length*(tpsSouris -i + 2/3)*graphSizeW/phrase.length+
                   (((y-(graphSize*97/100 - phrase.instantNormalizedLikelihoods[i][label]*graphSize*82/100))*1/3 + ((y-(graphSize*97/100 - phrase.instantNormalizedLikelihoods[i+1][label]*graphSize*82/100))*2/3 ))*
                   (((y-(graphSize*97/100 - phrase.instantNormalizedLikelihoods[i][label]*graphSize*82/100))*1/3 + ((y-(graphSize*97/100 - phrase.instantNormalizedLikelihoods[i+1][label]*graphSize*82/100))*2/3 )))))
              }}


          }
    }

    //on cherche la courbe ayant la distance au curseur la plus faible


    let min = 16
    let labelMin = null

    for(let label of Object.keys(res.model.classes)){
        if(min>dict[label]){
          min = dict[label]
          labelMin = label
        }
    }


    // console.log(min);
    if(min <=15){
      $("#tooltipCan").css( {top: (e.clientY + 20) + 'px', left: (e.clientX + 20) + 'px'});
      $("#tooltipCan").css('visibility', 'visible');
      $("#labelCan").text("Modèle: " + labelMin +"; Valeur: " + (Math.round((phrase.instantNormalizedLikelihoods[tpsSouris][labelMin])*100))/100 )


      drawRect(phrase.label,labelMin)
      return [phrase.label,labelMin]
    }

  }


  //on affiche la courbe en gras uniquement si la distance au curseur est assez faible


}
