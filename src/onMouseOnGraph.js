import $ from 'jquery';
import 'jquery-ui-bundle';


export default function onMouseOnGraph(e, can, res, drawRect) {
  const x = e.pageX - $('#divMilieu').position().left;
  let y = e.pageY - $('#divMilieu').position().top;

  const graphSize = 800 / res.phrases.length;


  // calcul du graph concerné
  const numPhrase = Math.trunc(y / graphSize);
  const phrase = res.phrases[numPhrase];


  y -= numPhrase * graphSize;


  // calcul du pas de temps du curseur de la souris
  let maxTime = 0;
  (res.phrases).forEach((ph) => {
    maxTime = Math.max(maxTime, ph.length);
  });

  // la duree du graph concerné par rapport a celle du plus grand graph
  const tpsGraphProp = phrase.length / maxTime;

  // si on se trouve sur le graph et pas a coté
  if (x >= 10 && x <= 10 + (can.width - 10) * tpsGraphProp) {
    // la taille en pixel du graph concerné
    const graphSizeW = (800 - 10) * tpsGraphProp;

    // le temps du curseur par rapport à celui du graph
    const tpsCursProp = (x - 10) / graphSizeW;

    // le pas de temps que pointe le curseur de la souris
    const tpsSouris = Math.round((phrase.length - 1) * tpsCursProp);


    // calcul de la valeure de likelihood aue pointe la Souris
    // le graph commence à 15% de la taille aui lui est consacrée et fini à 97%
    // console.log(graphSize, y );
    // console.log(graphSize -y);


    // initialisation du tableau de distance
    const dict = [];

    (res.model.classes).forEach((label) => {
      dict[label] = 100;
    });


    // recherche de la courbe la plus proche

    for (let i = Math.max(0, tpsSouris - 2);
      i <= Math.min(phrase.length - 1, tpsSouris + 2); i += 1) {
      (res.model.classes).forEach((label) => {
        if (dict[label] > Math.sqrt((tpsSouris - i) * graphSizeW / phrase.length
         * (tpsSouris - i) * graphSizeW / phrase.length + (y - (graphSize * 97 / 100
            - phrase.instantNormalizedLikelihoods[i][label] * graphSize * 82 / 100))
             * (y - (graphSize * 97 / 100 - phrase.instantNormalizedLikelihoods[tpsSouris][label]
              * graphSize * 82 / 100)))) {
          dict[label] = Math.sqrt((tpsSouris - i) * graphSizeW / phrase.length
          * (tpsSouris - i) * graphSizeW / phrase.length + (y - (graphSize * 97 / 100
            - phrase.instantNormalizedLikelihoods[i][label] * graphSize * 82 / 100))
            * (y - (graphSize * 97 / 100 - phrase.instantNormalizedLikelihoods[tpsSouris][label]
              * graphSize * 82 / 100)));
        }


        if (i + 1 < phrase.length) {
          if (dict[label] > Math.sqrt((tpsSouris - i + 1 / 3) * graphSizeW / phrase.length
          * (tpsSouris - i + 1 / 3) * graphSizeW / phrase.length
                    + (((y - (graphSize * 97 / 100 - phrase.instantNormalizedLikelihoods[i][label]
                      * graphSize * 82 / 100)) * 2 / 3 + ((y - (graphSize * 97 / 100
                        - phrase.instantNormalizedLikelihoods[i + 1][label]
                        * graphSize * 82 / 100)) * 1 / 3))
                    * (((y - (graphSize * 97 / 100 - phrase.instantNormalizedLikelihoods[i][label]
                      * graphSize * 82 / 100)) * 2 / 3 + ((y - (graphSize * 97 / 100
                        - phrase.instantNormalizedLikelihoods[i + 1][label]
                        * graphSize * 82 / 100)) * 1 / 3)))))) {
            dict[label] = Math.sqrt((tpsSouris - i + 1 / 3) * graphSizeW
            / phrase.length * (tpsSouris - i + 1 / 3) * graphSizeW / phrase.length
                   + (((y - (graphSize * 97 / 100 - phrase.instantNormalizedLikelihoods[i][label]
                     * graphSize * 82 / 100)) * 2 / 3 + ((y - (graphSize * 97 / 100
                       - phrase.instantNormalizedLikelihoods[i + 1][label]
                       * graphSize * 82 / 100)) * 1 / 3))
                   * (((y - (graphSize * 97 / 100 - phrase.instantNormalizedLikelihoods[i][label]
                     * graphSize * 82 / 100)) * 2 / 3 + ((y - (graphSize * 97 / 100
                       - phrase.instantNormalizedLikelihoods[i + 1][label]
                       * graphSize * 82 / 100)) * 1 / 3)))));
          }


          if (dict[label] > Math.sqrt((tpsSouris - i + 2 / 3)
          * graphSizeW / phrase.length * (tpsSouris - i + 2 / 3) * graphSizeW / phrase.length
               + (((y - (graphSize * 97 / 100 - phrase.instantNormalizedLikelihoods[i][label]
                 * graphSize * 82 / 100)) * 1 / 3 + ((y - (graphSize * 97 / 100
                   - phrase.instantNormalizedLikelihoods[i + 1][label]
                   * graphSize * 82 / 100)) * 2 / 3))
               * (((y - (graphSize * 97 / 100 - phrase.instantNormalizedLikelihoods[i][label]
                 * graphSize * 82 / 100)) * 1 / 3 + ((y - (graphSize * 97 / 100
                   - phrase.instantNormalizedLikelihoods[i + 1][label]
                   * graphSize * 82 / 100)) * 2 / 3)))))) {
            dict[label] = Math.sqrt((tpsSouris - i + 2 / 3)
            * graphSizeW / phrase.length * (tpsSouris - i + 2 / 3) * graphSizeW / phrase.length
                   + (((y - (graphSize * 97 / 100 - phrase.instantNormalizedLikelihoods[i][label]
                     * graphSize * 82 / 100)) * 1 / 3 + ((y - (graphSize * 97 / 100
                       - phrase.instantNormalizedLikelihoods[i + 1][label]
                       * graphSize * 82 / 100)) * 2 / 3))
                   * (((y - (graphSize * 97 / 100 - phrase.instantNormalizedLikelihoods[i][label]
                     * graphSize * 82 / 100)) * 1 / 3 + ((y - (graphSize * 97 / 100
                       - phrase.instantNormalizedLikelihoods[i + 1][label]
                       * graphSize * 82 / 100)) * 2 / 3)))));
          }
        }
      });
    }

    // on cherche la courbe ayant la distance au curseur la plus faible


    let min = 16;
    let labelMin = null;
    (res.model.classes).forEach((label) => {
      if (min > dict[label]) {
        min = dict[label];
        labelMin = label;
      }
    });


    // console.log(min);
    if (min <= 15) {
      $('#tooltipCan').css({ top: `${e.clientY + 20}px`, left: `${e.clientX + 20}px` });
      $('#tooltipCan').css('visibility', 'visible');
      $('#labelCan').text(`Modèle: ${labelMin}; Valeur: ${(Math.round((phrase.instantNormalizedLikelihoods[tpsSouris][labelMin]) * 100)) / 100}`);


      drawRect(phrase.label, labelMin);
      return [phrase.label, labelMin];
    }
  }

  return null;
  // on affiche la courbe en gras uniquement si la distance au curseur est assez faible
}
