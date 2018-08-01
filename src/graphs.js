import $ from 'jquery';
import 'jquery-ui-bundle';
// import { log } from './Fonctions auxiliaires.js';

export default function graphs(can, res, ctx, tps3, selectedGraph, colorSliderGraphs, isDraging) {
  // calcul du nombre de phrase active
  let nbactifs = 0;
  res.phrases.forEach((ph) => {
    if (ph.active) {
      nbactifs += 1;
    }
  });

  // recherche du nom de la classe correspondant aux classes de test
  if (selectedGraph && selectedGraph[0]) {
    const underscorePos2 = selectedGraph[0].indexOf('_');

    if (underscorePos2 > 0) {
      selectedGraph.phequivalent = selectedGraph[0].substring(0, underscorePos2);
    }
  }

  // taille d un graphe unique
  const graphSize = 800 / res.phrases.length;
  let recoMean = 0;

  can.width = '800';
  can.height = '800';

  ctx.fillStyle = 'rgba(255,128,0,0.2)';
  ctx.fillRect(0, 0, can.width, (nbactifs / res.phrases.length) * can.height);

  ctx.fillStyle = 'rgba(128,128,128,0.2)';
  ctx.fillRect(0, graphSize * 7 / 100 + (nbactifs / res.phrases.length) * can.height, can.width,
    (res.phrases.length - nbactifs / res.phrases.length) * can.height);

  ctx.textBaseline = 'Top';
  ctx.fillStyle = 'rgb(0,0,0)';

  let i = 0; // numéro de la classe étudiée

  // recherche de la phrase la plus longue pour les proportions
  const dictProp = {};
  let maxTime = 0;
  res.phrases.forEach((ph, num) => {
    dictProp[num] = ph.length;
    maxTime = Math.max(maxTime, ph.length);
  });


  // assignation a chaque phrases leur longueur par rapport a la longueur max
  res.phrases.forEach((ph, num) => {
    dictProp[num] /= maxTime;
  });


  // pour chaque classe
  res.phrases.forEach((classe, num) => {
    // assignation du nom de la classe et recuperation de la proportion de
    // la classe etudiee
    const classeName = classe.label;
    const proportion = dictProp[num];

    ctx.font = '15px Arial';
    ctx.fillStyle = 'rgb(0,0,100)';

    ctx.strokeStyle = 'rgb(0,0,0)';

    // ligne verticale
    ctx.beginPath();
    ctx.moveTo(10, graphSize * 15 / 100 + i * graphSize);
    ctx.lineTo(10, graphSize + i * graphSize);
    ctx.stroke();

    // ligne horizontale de temps
    ctx.beginPath();
    ctx.moveTo(0, i * graphSize + graphSize * 97 / 100);
    ctx.lineTo(can.width, graphSize * 97 / 100 + i * graphSize);
    ctx.stroke();

    // battons de temps
    ctx.lineWidth = 3;
    for (let j = 0; j < 10; j += 1) {
      ctx.strokeStyle = `rgb(0,${128 * j / 9},${160 + 95 * j / 9})`;
      ctx.beginPath();
      ctx.moveTo(10 + j * (790 / 9), i * graphSize + graphSize * 97 / 100 - graphSize * 8 / 100);
      ctx.lineTo(10 + j * (790 / 9), graphSize * 97 / 100 + i * graphSize + graphSize * 8 / 100);
      ctx.stroke();
    }

    // ligne horizontale blanche de separation
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255,255,255)';
    ctx.lineWidth = graphSize * 8 / 100;
    ctx.moveTo(0, graphSize * 7 / 100 + (i + 1) * graphSize);
    ctx.lineTo(can.width, graphSize * 7 / 100 + (i + 1) * graphSize);
    ctx.stroke();

    // tracé de la ligne indiquant le temps etudie

    // si le slider est en drag and drop alors on affiche un "halo" autour de la barre
    if (isDraging) {
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgb(0,200,255)';

      ctx.beginPath();

      ctx.moveTo(10 + 790 * tps3 / (maxTime - 1), graphSize * 15 / 100 + i * graphSize);
      ctx.lineTo(10 + 790 * tps3 / (maxTime - 1), graphSize + i * graphSize);

      ctx.stroke();
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = colorSliderGraphs;

    ctx.beginPath();

    ctx.moveTo(10 + 790 * tps3 / (maxTime - 1), graphSize * 15 / 100 + i * graphSize);
    ctx.lineTo(10 + 790 * tps3 / (maxTime - 1), graphSize + i * graphSize);

    ctx.stroke();


    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgb(0,0,0)';

    if (tps3 < classe.length && classe.active) {
      // calcul utile au calcul de la reconnaissance Moyenne

      recoMean += classe.instantNormalizedLikelihoods[tps3][classeName];
    }


    let stckClassSym;
    let stckClassParall;


    // parcour de chaque classe dans le graphe
    Object.keys(res.model.classes).forEach((classe2) => {
      // si on a afaire a la classe correspondante a celle
      // du graphe on la dessinera plus tard en rouge

      // recherche si la phrase est sensée etre associée à une autre (et donc reconnu)
      // c'est le cas si elle est suivi d'un underscore


      if (classe2 === classeName) {
        // l affichage de la classe symetriaue se fera apres dans une autre couleur
        // et a la fin pour que le trait soit au dessus des autres
        stckClassSym = classe2;
      } else if (selectedGraph && selectedGraph[1] === classe.label
         && (selectedGraph[0] === classe2 || selectedGraph.phequivalent === classe2)) {
        // si c est la ligne symetriaue de celle sur laquelle
        // est la souris on la trace a la fin pour la faire ressortir
        stckClassParall = classe2;
      } else {
        if (tps3 < classe.length) {
          ctx.strokeStyle = 'rgb(0,0,0)';
        } else {
          ctx.strokeStyle = 'rgb(70,70,70)';
        }


        const data = [];

        // recuperation dans un tableau des valeurs correspondantes
        for (let x = 0; x < classe.length; x += 1) {
          data.push(classe.instantNormalizedLikelihoods[x][classe2]);
        }


        // log("", classe)
        // console.log('taille' + data.length);
        // console.log(data);

        // trace de la courbe


        ctx.beginPath();
        ctx.moveTo(10, i * graphSize + graphSize * 97 / 100 - data[0] * graphSize * 82 / 100);

        // si c est la ligne  sur laquelle est la souris
        if (selectedGraph && selectedGraph[0] === classe.label && selectedGraph[1] === classe2) {
          ctx.lineWidth = 2;

          if (tps3 < classe.length) {
            ctx.fillStyle = 'rgba(0,160,80,0.3)';
            ctx.strokeStyle = 'rgb(0,160,80)';
          } else {
            ctx.strokeStyle = 'rgb(0,100,50)';
            ctx.fillStyle = 'rgba(0,100,50,0.3)';
          }

          // si le graphe est selectionné l affichage est different
          let isclosed;
          if (tps3 !== 0) { isclosed = false; } else { isclosed = true; }
          for (let j = 1; j < data.length; j += 1) {
            ctx.lineTo(10 + j * (((can.width - 10) * proportion) / (data.length - 1)),
              i * graphSize + graphSize * 97 / 100 - data[j] * graphSize * 82 / 100);

            // si on atteint le curseur de temps ou la fin on rempli la forme
            if (!isclosed && (tps3 === j || j === data.length - 1)) {
              // on trace la forme a partir ducurseur de temps
              ctx.lineTo(10 + j * (((can.width - 10) * proportion) / (data.length - 1)),
                i * graphSize + graphSize * 97 / 100);
              ctx.lineTo(10, i * graphSize + graphSize * 97 / 100);
              ctx.closePath();
              ctx.stroke();


              ctx.fill();

              // on recmmence le tracé d une nouvelle ligne
              ctx.beginPath();
              ctx.moveTo(10 + j * (((can.width - 10) * proportion) / (data.length - 1)),
                i * graphSize + graphSize * 97 / 100 - data[j] * graphSize * 82 / 100);

              isclosed = true;
            }
          }
        } else {
          for (let j = 1; j < data.length; j += 1) {
            ctx.lineTo(10 + j * (((can.width - 10) * proportion) / (data.length - 1)),
              i * graphSize + graphSize * 97 / 100 - data[j] * graphSize * 82 / 100);

            // ctx.arc(100,75,50,0,2*Math.PI);
          }
        }


        // console.log(ctx.strokeStyle);
        ctx.stroke();
        ctx.lineWidth = 1;
      }
    });


    if (stckClassParall) {
      if (tps3 < classe.length) {
        ctx.strokeStyle = 'rgb(0,160,80)';
      } else {
        ctx.strokeStyle = 'rgb(0,100,50)';
      }

      // meme code aue precedemment
      const data = [];

      for (let x = 0; x < classe.length; x += 1) {
        data.push(classe.instantNormalizedLikelihoods[x][stckClassParall]);
      }


      ctx.beginPath();
      ctx.moveTo(10, i * graphSize + graphSize * 97 / 100 - data[0] * graphSize * 82 / 100);

      ctx.lineWidth = 3;


      for (let j = 1; j < data.length; j += 1) {
        ctx.lineTo(10 + j * (((can.width - 10) * proportion) / (data.length - 1)),
          i * graphSize + graphSize * 97 / 100 - data[j] * graphSize * 82 / 100);
      }


      ctx.stroke();
      ctx.lineWidth = 1;
    }

    // dessin de la ligne rouge en dernier pour la faire ressortir

    if (tps3 < classe.length) {
      ctx.strokeStyle = 'rgb(150,0,0)';
      ctx.fillStyle = 'rgba(150,0,0,0.3)';
    } else {
      ctx.fillStyle = 'rgba(150,80,80,0.3)';
      ctx.strokeStyle = 'rgb(150,80,80)';
    }

    // meme code aue precedemment
    const data = [];

    for (let x = 0; x < classe.length; x += 1) {
      data.push(classe.instantNormalizedLikelihoods[x][stckClassSym]);
    }


    ctx.beginPath();
    ctx.moveTo(10, i * graphSize + graphSize * 97 / 100 - data[0] * graphSize * 82 / 100);

    // si c est la ligne sur laquelle est la souris


    if (selectedGraph && selectedGraph[1] === stckClassSym && selectedGraph[0] === classe.label) {
      ctx.lineWidth = 3;

      // si le graphe est selectionné l affichage est different
      let isclosed;
      if (tps3 !== 0) { isclosed = false; } else { isclosed = true; }

      for (let j = 1; j < data.length; j += 1) {
        ctx.lineTo(10 + j * (((can.width - 10) * proportion) / (data.length - 1)),
          i * graphSize + graphSize * 97 / 100 - data[j] * graphSize * 82 / 100);

        // si on atteint le curseur de temps ou la fin on rempli la forme
        if (!isclosed && (tps3 === j || j === data.length - 1)) {
          // on trace la forme a partir ducurseur de temps
          ctx.lineTo(10 + j * (((can.width - 10) * proportion) / (data.length - 1)),
            i * graphSize + graphSize * 97 / 100);
          ctx.lineTo(10, i * graphSize + graphSize * 97 / 100);
          ctx.closePath();
          ctx.stroke();


          ctx.fill();

          // on recmmence le tracé d une nouvelle ligne
          ctx.beginPath();
          ctx.moveTo(10 + j * (((can.width - 10) * proportion) / (data.length - 1)),
            i * graphSize + graphSize * 97 / 100 - data[j] * graphSize * 82 / 100);

          isclosed = true;
        }
      }
    } else {
      for (let j = 1; j < data.length; j += 1) {
        ctx.lineTo(10 + j * (((can.width - 10) * proportion) / (data.length - 1)),
          i * graphSize + graphSize * 97 / 100 - data[j] * graphSize * 82 / 100);
      }
    }

    // console.log(ctx.strokeStyle);
    ctx.stroke();
    ctx.lineWidth = 1;

    i += 1;
  });

  // calcul de la reconnaissance moyenne
  // troncature de la reconnaissance moyenne
  // console.log("recomean: " + recoMean);
  recoMean /= Object.keys(res.model.classes).length;
  recoMean *= 100;
  recoMean = Math.round(recoMean);
  recoMean /= 100;

  $('#recoMean').text(recoMean);
}
