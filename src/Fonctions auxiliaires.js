import $ from 'jquery';
import 'jquery-ui-bundle';


// affichage des elements tooltipable dans le can

export function normalizedata(res) {
  for (let i = 0; i < 8; i += 1) {
    let max = Number.MIN_SAFE_INTEGER;
    let min = Number.MAX_SAFE_INTEGER;

    $(res.phrases).forEach((ph) => {
      for (let y = 0; y < ph.length; y += 1) {
        const val = ph.data[i + y * 8];
        if (val < min) {
          min = val;
        }
        if (val > max) {
          max = val;
        }
      }
    });


    for (let nb = 0; nb < res.phrases.length; nb += 1) {
      for (let y = 0; y < res.phrases[nb].length; y += 1) {
        res.phrases[nb].data[i + y * 8] = (res.phrases[nb].data[i + y * 8] - min) / (max - min);
      }
    }
  }

  return res;
}


export function displayTooltipOnCan(tab, e) {
  const x = e.pageX - $('#divMilieu').position().left;
  const y = e.pageY - $('#divMilieu').position().top;
  (tab).forEach((elem) => {
    if (x > elem[0] && x < elem[0] + elem[2] && y > elem[1] && y < elem[1] + elem[3]) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      $('#tooltipCan').css({ top: `${mouseY + 20}px`, left: `${mouseX + 20}px` });
      $('#tooltipCan').css('visibility', 'visible');
      $('#labelCan').text(elem[4]);
    }
  });
}


// parse l'url

export function getAllUrlParams(url) {
  // get query string from url (optional) or window
  let queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  const obj = {};

  // if query string exists
  if (queryString) {
    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    const arr = queryString.split('&');

    for (let i = 0; i < arr.length; i += 1) {
      // separate the keys and the values
      const a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      let paramNum;
      let paramName = a[0].replace(/\[\d*\]/, (v) => {
        paramNum = v.slice(1, -1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      let paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      paramValue = paramValue.toLowerCase();

      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        } else { // if array index number specified...
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      } else { // if param name doesn't exist yet, set it
        obj[paramName] = paramValue;
      }
    }
  }

  return obj;
}

// permet de supprimer les lettres qui vont depasser
// d un string et d'ajouter des "..." a la fin si besoin
export function cuttingString(max, ctx, string) {
  if (ctx.measureText(string).width <= max) {
    return string;
  }

  while (ctx.measureText(string).width > max - ctx.measureText('..').width) {
    string = string.substring(0, string.length - 1);
  }

  return `${string}..`;
}


// temps maximum des phrases , le nombre retourné est celui
// de la valeure de la derniere phrase (0 si la longueur est 1)

export function calculMaxTime(res) {
  let max = 0;
  (res.phrases).forEach((ph) => {
    max = Math.max(max, ph.length);
  });

  return max - 1;
}


export function log(cle, affich) {
  if (window.location.href.includes(cle)) {
    console.log(affich);
  }
}

// synchronise les valeures des sliders
export function synchronizeSlider(value, timeMax) {
  $('.slider').slider('value', value);
  $('.handleTime').text(value);
  $('.handleTime').css('background', `rgb(${0},${(value * 128) / timeMax},${160 + value * 95 / timeMax})`);
}

// set les parametres du deuxieme canvas
export function setCan2Param(can, can2, ctx2) {
  can2.className = 'canvas2';

  can2.width = '800';
  can2.height = '800';


  ctx2.fillStyle = 'rgba(255,128,0,0.2)';
  ctx2.fillRect(0, 0, can2.width, can2.height);

  $('.canvas2').css('left', can.getBoundingClientRect().left + 800 + 200);
}


// uncheck les boutons des in dex (visu1) autres aue celui aui vient d etre selectionné
// function clearButtonInd(i){
//   for(let j of $(".cb")){
//
//     if(j.getAttribute("value")!=i){
//       j.checked = false;
//     }
//   }
// }
