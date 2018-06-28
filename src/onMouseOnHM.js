import  $ from 'jquery';
import jquery from 'jquery';
import 'jquery-ui-bundle';





export default function onMouseOnHM(e,can,numVis,res) {



        let x = event.pageX- $("canvas").position().left;
        let y = event.pageY- $("canvas").position().top;

        let rectW = can.width/(res.model.models.length+1);
        let rectH = can.height/(res.trainingSet.phrases.length+1);


        //si le curseur n est pas sur les noms
        if(x>rectW && y>rectH){

          return [Math.trunc((x)/(rectW)), Math.trunc((y)/(rectH))]
        }else{
          return [-1,-1]
        }


}


// export default function eventCanvas(e,numVis,can,res,numColClickedHM,numLinClickedHM) {
//
//     if(numVis == 3){
//       let tampCol = numColClickedHM;
//       let tampLin = numLinClickedHM;
//
//       var x = event.pageX;
//       var y = event.pageY;
//
//       let rectW = can.width/(res.model.models.length+1);
//       numColClickedHM = Math.trunc((x- $("canvas").position().left)/rectW) ;
//
//
//       let rectH = can.height/(res.trainingSet.phrases.length+1);
//       numLinClickedHM = Math.trunc((y- $("canvas").position().top)/rectH) ;
//
//       if(tampLin == numLinClickedHM && tampCol == numColClickedHM){
//
//         numLinClickedHM =-1;
//         numColClickedHM =-1;
//
//       }
//
//
//     }
//
//     return [numLinClickedHM,numColClickedHM];
// }
