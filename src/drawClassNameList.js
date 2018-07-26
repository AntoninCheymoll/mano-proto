import $ from 'jquery';
import 'jquery-ui-bundle';


export default function drawClassNameList(can, ctx, res, numVis) {
  let nbmodel = 0;
  Object.keys(res.model.classes).forEach(() => {
    nbmodel += 1;
  });

  if (numVis === 1) {
    $('.classname').remove();
    const height = can.height / res.phrases.length;
    let i = 0;

    $(res.phrases).each((_, ph) => {
      $('#divMilieu').append($(`<svg class ='classname' style="left:800px;top:${i * height}px;position:absolute"><ellipse cx="100" cy="${height / 2}" rx="75" ry="${height * 3 / 8}"
      style="fill:#0D7;stroke:black;stroke-width:2" /></svg>`));

      $('#divMilieu').append($(`<svg class ='classname' style="left:800px;top:${i * height}px;position:absolute"><ellipse cx="40" cy="${height * 3 / 4}" rx="25" ry="${height * 3 / 24}"
      style="fill:#0D7;stroke:black;stroke-width:2" /></svg>`));

      const x = $(`<label id=test${i} class ='classname' style="color:#05D;left:865px;top:${i * height + height / 2 - 8}px;position:absolute">${ph.label}</label>`);
      $('#divMilieu').append(x);

      let charDeleted = 0;
      while ($(`#test${i}`).width() > 80) {
        charDeleted += 1;

        x.empty();
        x.append(`${ph.label.substring(0, ph.label.length - charDeleted)}...`);
      }

      i += 1;
    });
  } else if (numVis === 2) {
    $('.classname').remove();
    const height = (can.height - 30) / res.phrases.length;
    let i = 0;

    $(res.phrases).each((_, ph) => {
      $('#divMilieu').append($(`<svg class ='classname' style="left:800px;top:${i * height}px;position:absolute"><ellipse cx="100" cy="${height / 2}" rx="75" ry="${height * 3 / 8}"
      style="fill:#0D7;stroke:black;stroke-width:2" /></svg>`));

      $('#divMilieu').append($(`<svg class ='classname' style="left:800px;top:${i * height}px;position:absolute"><ellipse cx="40" cy="${height * 3 / 4}" rx="25" ry="${height * 3 / 24}"
      style="fill:#0D7;stroke:black;stroke-width:2" /></svg>`));

      const x = $(`<label id=test${i} class ='classname' style="color:#05D;left:865px;top:${i * height + height / 2 - 8}px;position:absolute">${ph.label}</label>`);
      $('#divMilieu').append(x);

      let charDeleted = 0;
      while ($(`#test${i}`).width() > 80) {
        charDeleted += 1;

        x.empty();
        x.append(`${ph.label.substring(0, ph.label.length - charDeleted)}...`);
      }


      i += 1;
    });
  } else if (numVis === 3) {
    $('.classname').remove();
    const height = can.height / (res.phrases.length + 1);
    let i = 0;

    $(res.phrases).each((_, ph) => {
      $('#divMilieu').append($(`<svg class ='classname' style="left:800px;top:${i * height}px;position:absolute"><ellipse cx="100" cy="${height / 2}" rx="75" ry="${height * 3 / 8}"
      style="fill:#0D7;stroke:black;stroke-width:2" /></svg>`));

      $('#divMilieu').append($(`<svg class ='classname' style="left:800px;top:${(i) * height}px;position:absolute"><ellipse cx="40" cy="${height * 3 / 4}" rx="25" ry="${height * 3 / 24}"
      style="fill:#0D7;stroke:black;stroke-width:2" /></svg>`));

      const x = $(`<label id=test${i} class ='classname' style="color:#05D;left:865px;top:${(i) * height + height / 2 - 8}px;position:absolute">${ph.label}</label>`);
      $('#divMilieu').append(x);

      let charDeleted = 0;
      while ($(`#test${i}`).width() > 80) {
        charDeleted += 1;

        x.empty();
        x.append(`${ph.label.substring(0, ph.label.length - charDeleted)}...`);
      }

      i += 1;
    });
  }


  const tabs = document.getElementById('tabs').getBoundingClientRect();

  const modelSize = 800 / nbmodel;
  Object.keys(res.model.classes).forEach((mod, i) => {
    $(document.body).append($(`<svg class ='classname' style="height:30; width:${modelSize};left:${(i) * modelSize}px;top:${tabs.top + window.scrollY + tabs.height}px;position:absolute"><polygon points="${
      modelSize * 10 / 100},5 ${

      modelSize * 23 / 100},5 ${
      modelSize * 23 / 100} 2 ${
      modelSize * 30 / 100} 2 ${
      modelSize * 30 / 100},5 ${

      modelSize * 35 / 100},5 ${
      modelSize * 35 / 100} 2 ${
      modelSize * 42 / 100} 2 ${
      modelSize * 42 / 100},5 ${

      modelSize * 90 / 100},5 ${

      // modelSize * 90 / 100},10 ${
      // modelSize * 95 / 100},10 ${
      modelSize},17 ${
      // modelSize * 95 / 100},25 ${
      // modelSize * 90 / 100},25 ${

      modelSize * 90 / 100},30 ${
      modelSize * 10 / 100},30 ${

      modelSize * 10 / 100},26 ${
      modelSize * 7 / 100} 26 ${
      modelSize * 7 / 100} 19 ${
      modelSize * 10 / 100},19 ${

      modelSize * 10 / 100},16 ${
      modelSize * 7 / 100} 16 ${
      modelSize * 7 / 100} 9 ${
      modelSize * 10 / 100},9



    " style="fill:black;" /></svg>`));


    let txt = `<select class ='classname' id=test2${i} style="color:white; border-color:black; background-color:black;left:${(i + 0.2) * modelSize}px;top:${tabs.top + window.scrollY + tabs.height + 10}px;position:absolute">`;
    txt += `<option selected>${mod}</option>`;

    $(res.phrases).each((_, ph) => {
      const underscorePos = ph.label.indexOf('_');
      // console.log(ph.label.substring(0, underscorePos));
      if (!ph.active && mod === ph.label.substring(0, underscorePos)) {
        txt += `<option >${ph.label}</option>`;
      }
    });
    txt += '</select>';
    const x = $(txt);

    x.on('change', function () {
      console.log(`le modele ${$(this).find(':selected').text()} à été séléctionné`);
    });


    $(document.body).append(x);
  });
}
