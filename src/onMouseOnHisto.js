import  $ from 'jquery';
import jquery from 'jquery';
import 'jquery-ui-bundle';

export default function onMouseOnGraph(e, rectList, drawRect){
  let x = e.pageX- $("#divMilieu").position().left;
  let y = e.pageY- $("#divMilieu").position().top;


  for(let rect of rectList){
      if(x>=rect.x && x<=rect.x+rect.w && y>=rect.y && y<=rect.y+rect.h ){

        drawRect(rect.class ,rect.model);
        return rect;

      }
  }
}
