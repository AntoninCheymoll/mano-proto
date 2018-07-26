import $ from 'jquery';
import 'jquery-ui-bundle';

export default function onMouseOnHisto(e, rectList) {
  const x = e.pageX - $('#divMilieu').position().left;
  const y = e.pageY - $('#divMilieu').position().top;

  let result = null;
  (rectList).forEach((rect) => {
    if (x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h) {
      result = rect;
    }
  });

  return result;
}
