import  $ from 'jquery';
import jquery from 'jquery';
import 'jquery-ui-bundle';

export default function onMouseOnGraph(e,can,ctx,rectList){
  let x = event.pageX- $("canvas").position().left;
  let y = event.pageY- $("canvas").position().top;


  for(let rect of rectList){
      if(x>=rect.x && x<=rect.x+rect.w && y>=rect.y && y<=rect.y+rect.h ){
        return rect;

      }
  }
}
