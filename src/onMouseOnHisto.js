import  $ from 'jquery';
import jquery from 'jquery';
import 'jquery-ui-bundle';

import {drawSecondCan} from './drawSecondCan.js';

export default function onMouseOnGraph(e,can,ctx,rectList,res,can2,ctx2){
  let x = event.pageX- $("#divMilieu").position().left;
  let y = event.pageY- $("#divMilieu").position().top;


  for(let rect of rectList){
      if(x>=rect.x && x<=rect.x+rect.w && y>=rect.y && y<=rect.y+rect.h ){

        drawSecondCan(ctx2, can2, res, rect.class ,rect.model )
        return rect;

      }
  }
}
