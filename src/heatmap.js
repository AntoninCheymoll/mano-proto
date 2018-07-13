

import  $ from 'jquery';
import jquery from 'jquery';
import 'jquery-ui-bundle';
import { getAllUrlParams, calculMaxTime, log, cuttingString } from './Fonctions auxiliaires.js';
import {drawSecondCan} from './drawSecondCan.js';

export default function heatmap(can, res,ctx,val6,tps6,numLinClicked,numColClicked,tooltipHM,ctx2,can2,colorSliderGraphs,timeMax) {
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
  //let squaresizeH = 800/(phrases.length+1);
  let squaresizeH = 800/(res.trainingSet.phrases.length+1)
  let squaresizeW = 800/(res.model.models.length+1)



  let i = 0;//numero de la classe etudiee
  ctx.fillStyle = "rgb(255,200,150)"

  ctx.fillRect(0, 0, squaresizeH, squaresizeW);


  for(let model of res.trainingSet.phrases){


    //dessin de la grille et des carrés

    ctx.beginPath()
    ctx.moveTo(squaresizeW + i*squaresizeW, 0)
    ctx.lineTo(squaresizeW + i*squaresizeW, can.height)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, squaresizeH + i*squaresizeH)
    ctx.lineTo(can.width, squaresizeH + i*squaresizeH)
    ctx.stroke()

    ctx.fillStyle = "rgb(255,200,150)"

    //carre pour chaque classe et modele

    // let grd=ctx.createLinearGradient(squaresizeW*i + squaresizeW, 0, squaresizeW, squaresizeH);
    // grd.addColorStop(0,"rgb(255,230,150,0.4)");
    // grd.addColorStop(1,"rgb(255,125,0,0.4)");
    // ctx.fillStyle = grd;

    ctx.fillRect(squaresizeW*i + squaresizeW, 0, squaresizeW, squaresizeH);


    // grd=ctx.createLinearGradient(0,squaresizeH*i + squaresizeH , squaresizeW, squaresizeH);
    // grd.addColorStop(0,"rgb(255,230,150,0.4)");
    // grd.addColorStop(1,"rgb(255,125,0,0.4)");
    // ctx.fillStyle = grd;

    ctx.fillRect(0,squaresizeH*i + squaresizeH , squaresizeW, squaresizeH);

    ctx.fillStyle = "rgb(0,0,0)"

    // let s = "";
    // let snum = 0;
    // for(let x = 0; x<model.label.length; x++){
    //   //if(model.label[i]==/ /g){
    //       console.log("qqqqqqqqaaaaaaaaaaqqqq" + "/g" + "aaaaaaaaa");
    // //  }
    //   s.concat(model.label.charAt(i));
    // }
    i++;

  }



  //ecriture des noms des classes haut

  let cptModel = 0;
  for(let mod of res.model.models ){

    cptModel++;

    //decoupage du label a chaque espace
    var labelList = mod.label.split(" ");


    //calcul taille texte
    let textSize2, gapSize2



    if (squaresizeH > 17*2){
      textSize2 = 15;
      gapSize2 = 2;
    }else if (squaresizeH > 13*2){
      textSize2 = 12;
      gapSize2 = 1;
    }else {
      textSize2 = squaresizeH -1;
      gapSize2 = 1
    }



    let labelWordNum =0;
    let fullText = true;
    ctx.fillStyle = "rgb(0,0,0)"

    for(let mot of labelList){


      ctx.font = Math.round(textSize2) + "px Arial";
      labelWordNum++


      //si il reste de la place pour ecrire un mot
      if(squaresizeH - (textSize2 + gapSize2)*labelWordNum >0){



        //on ecrit le prochain mot
        ctx.fillText(cuttingString(squaresizeW*90/100, ctx, mot),  (cptModel)*squaresizeW + squaresizeW/10 , (textSize2 + gapSize2)*labelWordNum,squaresizeH - squaresizeH/10)

        if(!(cuttingString(squaresizeW*90/100, ctx, mot) == mot)){
           fullText = false;
        }

      }else{
        fullText = false;
        ctx.fillText("...",  (cptModel)*squaresizeW + squaresizeW/10 , squaresizeH/2 ,squaresizeH - squaresizeH/10);
      }
    }

    //si le label n'a pas été affiché entierrement on ajoute un tooltip a la liste
    if(!fullText){

          // ctx.strokeStyle = "rgba(255,0,0,0.3)"
          // ctx.rect(1,squaresizeH*numligne +1,squaresizeW-2, squaresizeH-2)
          // ctx.stroke()

          tooltipHM.push([squaresizeW*cptModel, 0, squaresizeW, squaresizeH,mod.label])
    }

  }









  //numero de la ligne concernee
  let numligne = 0;
  for(let phrase of res.trainingSet.phrases){ //ligne


    numligne++;


    //classes finies grisées
    if (!phrases.includes(phrase)) {
      ctx.fillStyle = "rgba(0,128,255,0.5)"
        ctx.fillRect(0, numligne*squaresizeH,squaresizeW, squaresizeH)
    }


    let isNotFinished = (phrases.includes(phrase));


    // let phrase;
    // for(let ph of res.trainingSet.phrases){
    //     if (ph.label == model1.label){
    //       phrase = ph;
    //       break;
    //     }
    // }

    //console.log('phrase: '+phrase.label);

    let placeRestante = squaresizeH; //place qui restera dans le carré apres dessin de la "jauge" pour 2crire le nom des classes

    //cqs ou il y a tres peu de classe (plus de place dans les carres)
    if(res.trainingSet.phrases.length<=10){

      placeRestante -= squaresizeH*11/100 + 5 //5 = l espace entre le nom de classe et la jauge

      ctx.beginPath();

      //partie fixe du curseur de temps

      ctx.moveTo( squaresizeW*10/100, squaresizeH*numligne + squaresizeH*89/100 );
      ctx.lineTo( squaresizeW*10/100, squaresizeH*numligne + squaresizeH*95/100);


       ctx.moveTo(squaresizeW*10/100, squaresizeH*numligne + squaresizeH*92/100 );
       ctx.lineTo(squaresizeW*90/100, squaresizeH*numligne + squaresizeH*92/100);

       ctx.moveTo(squaresizeW*90/100, squaresizeH*numligne + squaresizeH*89/100 );
       ctx.lineTo(squaresizeW*90/100,squaresizeH*numligne +  squaresizeH*95/100);

      ctx.stroke();

      ctx.font ="10px Arial";

      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillText(0 ,squaresizeW*10/100-3 ,squaresizeH*numligne + squaresizeH*89/100-2);
      ctx.fillText(phrase.length-1, squaresizeW*90/100 - 3*(JSON.stringify(phrase.length)).length, squaresizeH*numligne + squaresizeH*89/100-2);


      //partie rouge mobile du curseur


      ctx.beginPath();

      ctx.strokeStyle = "rgb(200,0,0)";

      ctx.lineWidth=2;

      if(isNotFinished){
        ctx.moveTo(squaresizeW*10/100 + squaresizeW*80/100*tps6/(phrase.length-1),squaresizeH*numligne +  squaresizeH*89/100 );
        ctx.lineTo(squaresizeW*10/100 + squaresizeW*80/100*tps6/(phrase.length-1),squaresizeH*numligne +  squaresizeH*95/100 );
      }else{
        ctx.moveTo(squaresizeW*90/100, squaresizeH*numligne + squaresizeH*89/100 );
        ctx.lineTo(squaresizeW*90/100, squaresizeH*numligne + squaresizeH*95/100);
      }


      ctx.stroke();

    //cas ou il y a beaucoup de valeurs
    }else if(res.trainingSet.phrases.length>20){

        placeRestante -= 12 + 1 //1 = l espace entre le nom de classe et la jauge

        ctx.font ="10px Arial";
        if(isNotFinished){ctx.fillStyle = "rgb(0,0,0)"}else{ctx.fillStyle = "rgb(100,100,100)"}
        let phSize = phrase.length-1;
        ctx.fillText('/' + phSize ,2 , squaresizeH*numligne +squaresizeH -2);

        //cas intermédiauire
    }else{

      placeRestante -= 20 +2; //2 = l espace entre le nom de classe et la jauge

      ctx.font ="15px Arial";
      if(isNotFinished){ctx.fillStyle = "rgb(0,0,0)"}else{ctx.fillStyle = "rgb(90,90,90)"}
      let phSize = phrase.length-1;
      ctx.fillText('/' + phSize ,5 , squaresizeH*numligne +squaresizeH -5);
    }

    ctx.lineWidth=1;
    ctx.strokeStyle = "rgb(0,0,0)";


    //ecriture des noms de classe



    //calcul de la taille de texte adaptée à la place restante

    let gapSize, textSize

    //calcul pour le carré contenant la "jauge"
    if (placeRestante > 17*2){
      textSize = 15;
      gapSize = 2;
    }else if (placeRestante> 13*2){
      textSize = 12;
      gapSize = 1;
    }else {
      textSize = placeRestante -1;
      gapSize = 1

    }


    //decoupage du label a chaque espace
    var labelList = phrase.label.split(" ");

    let labelWordNum =0;


    //affichage chaque partie a une hauteur differente
    ctx.fillStyle = "rgb(0,0,0)"
    let fullText = true;

    for(let mot of labelList){
      labelWordNum++;

      ctx.font = textSize + "px Arial";

      if(placeRestante - (textSize + gapSize)*labelWordNum >=0){
        ctx.fillText(cuttingString(squaresizeW*90/100, ctx, mot), squaresizeW/10, (textSize + gapSize)*labelWordNum  + squaresizeH + (numligne-1)*squaresizeH , squaresizeH*90/100)

        if(!(cuttingString(squaresizeW*90/100, ctx, mot) == mot)){
            fullText = false;
        }
      }else{
        fullText = false;

      }

    }
    //si le label n'a pas été affiché entierrement on ajoute un tooltip a la liste
    if(!fullText){

          // ctx.strokeStyle = "rgba(255,0,0,0.3)"
          // ctx.rect(1,squaresizeH*numligne +1,squaresizeW-2, squaresizeH-2)
          // ctx.stroke()

          tooltipHM.push([0,squaresizeH*numligne  , squaresizeW, squaresizeH, phrase.label])
    }




    //num de la colonne concernee
    let numcol =0;

    for(let model2 of res.model.models){ //colonne
          numcol++;
          let valMod1Mod2
          if(isNotFinished){

            valMod1Mod2 = phrase.likelihoods[tps6][model2.label];
          }else{

            valMod1Mod2 = phrase.likelihoods[phrase.length-1][model2.label];

          }

          // console.log('model2:'+model2.label);
          // for(let i =0; i<phrase.length;i++){
          //     meanMod1Mod2 += phrase.likelihoods[i][model2.label]
          // }
          // meanMod1Mod2 = meanMod1Mod2/phrase.length;
          // console.log('mean '+meanMod1Mod2);


          //affichage de la heatmap seuleument si sa valeur n est pas en dessous du seuil a ignorer

          if((valMod1Mod2*100>val6 && phrase.label != model2.label) || (valMod1Mod2*100<=(100-val6) && phrase.label == model2.label)){


            //calcul de la couleur du carré, rouge ou noir, plus ou moins clair
            if(phrase.label == model2.label){
              // ctx.fillStyle = "rgb(105,0,0)"
              //ctx.fillStyle = "rgb(255,220,220)"
              ctx.fillStyle = "rgb("+ (105 + valMod1Mod2*(255-105))+"," + (valMod1Mod2*(220))+ "," +  ( valMod1Mod2*(220))  +")";
              // ctx.fillStyle = "rgb(80,0,0)";
            }else{
              ctx.fillStyle = "rgb("+ (255 - valMod1Mod2*255)+"," + (255 - valMod1Mod2*255)+ ","+ (255 - valMod1Mod2*255) +")";
            }

            //dessin du carre


            ctx.fillRect(numcol*squaresizeW, numligne*squaresizeH ,squaresizeW, squaresizeH)


            //la couleur du texte depend de la couleur dessous pour etre la plus lisibl possible
            //si on est sur fond rouge le texte est toujours clair
            if(phrase.label==model2.label){
                if(isNotFinished){ctx.fillStyle = "rgb(255,255,255)";}else{ctx.fillStyle = "rgb(155,155,155)";}
            }else{
              if(valMod1Mod2>0.5){
                if(isNotFinished){ctx.fillStyle = "rgb(255,255,255)";}else{ctx.fillStyle = "rgb(155,155,155)";}
              }else{
                if(isNotFinished){ctx.fillStyle = "rgb(0,0,0)";}else{ctx.fillStyle = "rgb(100,100,100)";}
              }
            }

            //affichage de la valeur apres troncature
            valMod1Mod2 *= 100;
            valMod1Mod2 = Math.round(valMod1Mod2);
            valMod1Mod2 /=100


            if(res.model.models.length<20){
              ctx.font ="15px Arial";
            }else{
              ctx.font ="10px Arial";
            }

            ctx.textAlign="center"
            ctx.fillText(valMod1Mod2, numcol*squaresizeW  + squaresizeW/2,  numligne*squaresizeH +squaresizeH/2);
            ctx.textAlign="start"

           }
          //si on ne doit pas afficher la heatmap on affiche un degradé
          //else{
          //
          //   var grd=ctx.createLinearGradient(numcol*squaresizeH, numligne*squaresizeH,numcol*squaresizeH + squaresizeH*3/4 , numligne*squaresizeH + squaresizeH*3/4);
          //   grd.addColorStop(0,"rgb(255,255,255,0)");
          //   grd.addColorStop(1,"rgb(255,125,0,0.4)");
          //
          //
          //   ctx.fillStyle = grd;
          //   ctx.fillRect(numcol*squaresizeH, numligne*squaresizeH,squaresizeH , squaresizeH)

          //}
    }


  }


  if ((numLinClicked != -1)  && (numColClicked !=-1)) {

    ctx.fillStyle = "rgba(128,0,128,0.4)"

    //affiche la ligne et colonne cliquée
    ctx.fillRect(numColClicked*squaresizeW, 0 ,squaresizeW, squaresizeH)
    ctx.fillRect(0, numLinClicked*squaresizeH ,squaresizeW, squaresizeH)

    ctx.strokeStyle = "rgb(0,160,80)"
    ctx.lineWidth = 3;
    ctx.beginPath()
    ctx.rect(numColClicked*squaresizeW, numLinClicked*squaresizeH ,squaresizeW, squaresizeH)
    ctx.rect(numLinClicked*squaresizeW, numColClicked*squaresizeH ,squaresizeW, squaresizeH)
    ctx.stroke();

    drawSecondCan(ctx2, can2, res, tps6, res.trainingSet.phrases[numLinClicked-1].label,res.model.models[numColClicked-1].label,colorSliderGraphs ,timeMax)


  }

}
