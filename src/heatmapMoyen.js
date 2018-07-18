
// variable de la visu4
// var val4  = 0;

export default function heatmapMoyen(can, res, ctx, val4) {
  can.width = 800;
  can.height = 800;

  // calcul de la taille d un carre de la heatmap (en fct du nombre de classe)
  const squaresizeH = 800 / (res.model.models.length + 1);

  const grd = ctx.createLinearGradient(0, 0, 800 * 3 / 4, 800 * 3 / 4);
  grd.addColorStop(0, 'rgb(255,230,150,0.4)');
  grd.addColorStop(1, 'rgb(255,125,0,0.4)');


  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, can.width, can.height);


  let i = 0;

  $(res.model.models).forEach((model) => {
    ctx.fillStyle = 'rgb(255,200,150)';
    ctx.fillRect(i * squaresizeH + squaresizeH, 0, squaresizeH, squaresizeH);
    ctx.fillRect(0, i * squaresizeH + squaresizeH, squaresizeH, squaresizeH);

    ctx.fillRect(0, 0, squaresizeH, squaresizeH);
    ctx.beginPath();
    ctx.moveTo(squaresizeH + i * squaresizeH, 0);
    ctx.lineTo(squaresizeH + i * squaresizeH, can.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, squaresizeH + i * squaresizeH);
    ctx.lineTo(can.width, squaresizeH + i * squaresizeH);
    ctx.stroke();

    ctx.fillStyle = 'rgb(0,0,0)';

    // let s = "";
    // let snum = 0;
    // for(let x = 0; x<model.label.length; x++){
    //   //if(model.label[i]==/ /g){
    //       console.log("qqqqqqqqaaaaaaaaaaqqqq" + "/g" + "aaaaaaaaa");
    // //  }
    //   s.concat(model.label.charAt(i));
    // }

    const labelList = model.label.split(' ');

    let labelWordNum = 0;

    ctx.font = '15px Arial';
    $(labelList).forEach((mot) => {
      ctx.fillText(mot, squaresizeH / 10, 17 * labelWordNum + squaresizeH + i * squaresizeH + squaresizeH / 2);
      ctx.fillText(mot, squaresizeH + i * squaresizeH + squaresizeH / 10, 17 * labelWordNum + squaresizeH / 2);
      labelWordNum++;
    });


    i++;
  });

  let numligne = 0;
  for (const model1 of res.model.models) { // ligne
    numligne++;
    let phrase;
    for (const ph of res.phrases) {
      if (ph.label == model1.label) {
        phrase = ph;
        break;
      }
    }

    // console.log('phrase: '+phrase.label);

    let numcol = 0;
    for (const model2 of res.model.models) { // colonne
      numcol++;
      let valMod1Mod2 = 0;
      // console.log('model2:'+model2.label);
      for (let i = 0; i < phrase.length; i++) {
        valMod1Mod2 += phrase.likelihoods[i][model2.label];
      }
      valMod1Mod2 /= phrase.length;
      // console.log('mean '+valMod1Mod2);

      if (valMod1Mod2 * 100 > val4) {
        ctx.fillStyle = `rgb(${255 - valMod1Mod2 * 255},${255 - valMod1Mod2 * 255},${255 - valMod1Mod2 * 255})`;
        // console.log(255 - valMod1Mod2*255);
        ctx.fillRect(numcol * squaresizeH, numligne * squaresizeH, squaresizeH, squaresizeH);
        if (valMod1Mod2 > 0.5) {
          ctx.fillStyle = 'rgb(255,255,255)';
        } else {
          ctx.fillStyle = 'rgb(0,0,0)';
        }
        valMod1Mod2 *= 100;
        valMod1Mod2 = Math.round(valMod1Mod2);
        valMod1Mod2 /= 100;

        if (res.model.models.length < 20) {
          ctx.font = '15px Arial';
        } else {
          ctx.font = '10px Arial';
        }


        ctx.fillText(valMod1Mod2, numcol * squaresizeH - 10 + squaresizeH / 2, numligne * squaresizeH + squaresizeH / 2);
      }
      // else{
      //
      //   var grd=ctx.createLinearGradient(numcol*squaresizeH, numligne*squaresizeH,numcol*squaresizeH + squaresizeH*3/4 , numligne*squaresizeH + squaresizeH*3/4);
      //   grd.addColorStop(0,"rgb(255,255,255,0)");
      //   grd.addColorStop(1,"rgb(255,125,0,0.4)");
      //
      //
      //   ctx.fillStyle = grd;
      //   ctx.fillRect(numcol*squaresizeH, numligne*squaresizeH,squaresizeH , squaresizeH)
      //
      // }
    }
  }
}
