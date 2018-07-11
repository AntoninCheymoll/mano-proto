import  $ from 'jquery';
import jquery from 'jquery';
import 'jquery-ui-bundle';


//affichage des elements tooltipable dans le can

export function displayTooltipOnCan(tab,e){

  let x = event.pageX- $("#divMilieu").position().left;
  let y = event.pageY- $("#divMilieu").position().top;

  for(let elem of tab){


    if(x>elem[0] && x<elem[0]+elem[2] && y>elem[1] && y<elem[1]+elem[3]){
      var mouseX = e.clientX,
          mouseY = e.clientY;

      $("#tooltipCan").css( {top: (mouseY + 20) + 'px', left: (mouseX + 20) + 'px'});
      $("#tooltipCan").css('visibility', 'visible');
      $("#labelCan").text(elem[4])
    }
  }
}


//parse l'url

export function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i=0; i<arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];

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
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }

  return obj;
}

//permet de supprimer les lettres qui vont depasser d un string et d'ajouter des "..." a la fin si besoin
export  function cuttingString(max, ctx, string){
  if(ctx.measureText(string).width<=max){
      return string;
  }

  while(ctx.measureText(string).width>max -ctx.measureText("..").width ){
     string = string.substring(0,string.length-1)
   }

 return string + "..";
}


//temps maximum des phrases , le nombre retourné est celui de la valeure de la derniere phrase (0 si la longueur est 1)

export function calculMaxTime(res){
  let max = 0;
  for(let ph of res.trainingSet.phrases){
      max = Math.max(max,ph.length);
  }

  return max-1;
}


export function log(cle, affich){
  if(window.location.href.includes(cle)){
    console.log(affich)
  }
}

//synchronise les valeures des sliders
export function synchronizeSlider(value,timeMax){
  $( ".slider" ).slider( "value", value );
  $(".handleTime").text(value)
  $(".handleTime").css("background","rgb(" + 0 + "," + (value*128)/timeMax +"," + (160+ value*95/timeMax) +")");
}

// set les parametres du deuxieme canvas
export function setCan2Param(can,can2,ctx2){
  can2.className = "canvas2"

  can2.width = '800';
  can2.height = '800';


  ctx2.fillStyle = "rgba(255,128,0,0.2)";
  ctx2.fillRect(0, 0 , can2.width,can2.height);

  $(".canvas2").css("left",can.getBoundingClientRect().left +800 + 200)

}


//uncheck les boutons des in dex (visu1) autres aue celui aui vient d etre selectionné
// function clearButtonInd(i){
//   for(let j of $(".cb")){
//
//     if(j.getAttribute("value")!=i){
//       j.checked = false;
//     }
//   }
// }
