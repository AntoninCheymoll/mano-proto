import  $ from 'jquery';
import jquery from 'jquery';
import 'jquery-ui-bundle';

export function drawSecondCan(ctx, can, res,tps3, className, modelName, colorSliderGraphs){


    can.width = '800';
    can.height = '800';

    let dictProp = {};

    for(let ph of res.trainingSet.phrases){
      if(ph.label==className || ph.label == modelName){
        dictProp[ph.label]=ph.length
      }

    }



    let maxSize = dictProp[modelName]
    if(dictProp[className]>maxSize){maxSize = dictProp[className]}
      console.log(maxSize);


    dictProp[className] = dictProp[className]/maxSize
    if(modelName != className){  dictProp[modelName] = dictProp[modelName]/maxSize}



    //taille d un graphe unique
    let graphSize = 800/8;


    ctx.fillStyle = "rgba(255,128,0,0.2)";
    ctx.fillRect(0, 0 , can.width,can.height);

    ctx.textBaseline='Top'
    ctx.fillStyle = "rgb(0,0,0)";

    //console.log(className,modelName);

    //ctx.fillText(className,0,15)
    //ctx.fillText(modelName,0,35)



    // pour chaque dimensions du capteur
    for(let i=0; i<8; i++){

      ctx.strokeStyle ="rgb(0,0,0)"

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


      ctx.lineWidth=2;
      ctx.strokeStyle = colorSliderGraphs

      ctx.beginPath();


      ctx.moveTo(10 + 790*tps3/(maxSize-1),graphSize*15/100+ i*graphSize);
      ctx.lineTo(10 + 790*tps3/(maxSize-1), graphSize +  i*graphSize);

      ctx.stroke();

      let max = 0;
      let min = 0;


      //console.log(data);
      let premier = true;
      let isfilled = false;
      let stckdata = {}



      for(let ph of res.trainingSet.phrases){

        if((ph.label==className) || (ph.label == modelName)){

          if(ph.label==className){


            ctx.strokeStyle="rgb(150,0,0)"

          }else{
            ctx.strokeStyle="rgb(0,160,80   )"


          }

          let data = []

          //recuperation dans un tableau des valeurs correspondantes
          for(let x=0; x<ph.length;x++){
            data.push(ph.data[x*8 + i]);

          }

          ctx.beginPath();
          ctx.moveTo(10, i*graphSize + graphSize*97/100 - data[0]*graphSize*82/100);

          for (let j=1; j<data.length; j++){
            ctx.lineTo(10+j*((790*dictProp[ph.label]/(data.length-1))),  i*graphSize + graphSize*97/100 - data[j]*graphSize*82/100);

            if(!premier && !isfilled && (j==data.length-1|| j==stckdata.lgth-1  || j == tps3 )){


               ctx.stroke()

            //ctx.arc(10+(j)*((790*stckdata.prop/(stckdata.lgth-1))),  i*graphSize + graphSize*97/100 - stckdata.data[j]*graphSize*82/100,10,0,2*Math.PI);

               ctx.lineTo(10+j*((790*dictProp[ph.label]/(data.length-1))),  i*graphSize + graphSize*97/100 - stckdata.data[j]*graphSize*82/100);

              for (let cpt=j-1; cpt>=0; cpt--){

               ctx.lineTo(10+cpt*((790*stckdata.prop/(stckdata.lgth-1))),  i*graphSize + graphSize*97/100 - stckdata.data[cpt]*graphSize*82/100);
            }


            ctx.closePath()
            ctx.fillStyle="rgba(150,0,0,0.3)"
            ctx.fill()

             isfilled = true

             ctx.beginPath();
             ctx.moveTo(10+j*((790*dictProp[ph.label]/(data.length-1))),  i*graphSize + graphSize*97/100 - data[j]*graphSize*82/100);

          }


        }

          ctx.stroke()
          ctx.closePath()


          if(premier){
            stckdata.data=data
            stckdata.lgth=ph.length
            stckdata.prop = dictProp[ph.label]
          }

          premier = false
        }

      }


    }


}