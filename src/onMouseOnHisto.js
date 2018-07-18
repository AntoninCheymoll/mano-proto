import $ from 'jquery';
import 'jquery-ui-bundle';

export default function onMouseOnGraph(e, rectList, drawRect) {
  const x = e.pageX - $('#divMilieu').position().left;
  const y = e.pageY - $('#divMilieu').position().top;

  (rectList).forEach((rect) => {
    if (x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h) {
      drawRect(rect.class, rect.model);
      return rect;
    }
    return null;
  });
  return null;
}
