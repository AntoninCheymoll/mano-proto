import 'jquery-ui-bundle';

import { synchronizeSlider } from './Fonctions auxiliaires';


export function newValue(value, momentMemory, currentMoment) {
  momentMemory = momentMemory.slice(0, currentMoment + 1);
  momentMemory.push(value);
  currentMoment = momentMemory.length - 1;

  ('.prevButton').forEach((bt) => {
    bt.disabled = false;
  });

  return [momentMemory, currentMoment];
}

export function prevPressed(momentMemory, currentMoment, timeMax) {
  if (momentMemory.length > 0) {
    ('.nextButton').forEach((bt) => {
      bt.disabled = false;
    });
  }

  if (currentMoment > 0) {
    currentMoment -= 1;
    if (currentMoment === 0) {
      ('.prevButton').forEach((bt) => {
        bt.disabled = true;
      });
    }
  }
  synchronizeSlider(momentMemory[currentMoment], timeMax);

  return [momentMemory, currentMoment, momentMemory[currentMoment]];
}

export function nextPressed(momentMemory, currentMoment, timeMax) {
  if (momentMemory.length - 1 > currentMoment) {
    currentMoment += 1;
  }
  if (currentMoment === momentMemory.length - 1) {
    ('.nextButton').forEach((bt) => {
      bt.disabled = true;
    });
  }


  synchronizeSlider(momentMemory[currentMoment], timeMax);


  return [momentMemory, currentMoment, momentMemory[currentMoment]];
}
