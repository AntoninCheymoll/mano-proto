import  $ from 'jquery';
import jquery from 'jquery';
import 'jquery-ui-bundle';

import {  synchronizeSlider} from './Fonctions auxiliaires.js';


export function newValue(value, momentMemory,currentMoment){
  momentMemory = momentMemory.slice(0,currentMoment+1)
  momentMemory.push(value)
  currentMoment = momentMemory.length-1

  for(let bt of $(".prevButton")){
    bt.disabled=false;
  }

  return[momentMemory,currentMoment]
}

export function prevPressed(momentMemory, currentMoment , timeMax){

  if(momentMemory.length>0){
    for(let bt of $(".nextButton")){
      bt.disabled=false;
    }
  }

  if(currentMoment>0){
    currentMoment--
    if(currentMoment==0){

      for(let bt of $(".prevButton")){
        bt.disabled=true;
      }

    }

  }
  synchronizeSlider(momentMemory[currentMoment],timeMax)

  return[momentMemory,currentMoment,momentMemory[currentMoment]]
}

export function nextPressed(momentMemory, currentMoment , timeMax){

  

  if(momentMemory.length-1 > currentMoment){
    currentMoment++;
  }
  if(currentMoment==momentMemory.length-1){
    for(let bt of $(".nextButton")){
      bt.disabled=true;
    }
  }


  synchronizeSlider(momentMemory[currentMoment],timeMax)


  return[momentMemory,currentMoment,momentMemory[currentMoment]]
}
