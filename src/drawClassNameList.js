import $ from 'jquery';
import 'jquery-ui-bundle';


export default function drawClassNameList(can, ctx, res, numVis) {
  if (numVis === 1) {
    $('.classname').remove();
    const height = can.height / res.phrases.length;
    let i = 0;

    $(res.phrases).each((_, ph) => {
      $('#divMilieu').append($(`<svg class ='classname' style="left:800px;top:${i * height}px;position:absolute"><polygon points="50,${height / 10
      } 150,${height / 10
      } 150,${height * 30 / 100

      } 155,${height * 30 / 100
      } 160,${height * 50 / 100
      } 155,${height * 70 / 100
      } 150,${height * 70 / 100
      } 150,${height * 90 / 100
      } 50,${height * 90 / 100

      } 50,${height * 75 / 100
      } 40,${height * 75 / 100
      } 40,${height * 55 / 100
      } 50,${height * 55 / 100

      } 50,${height * 45 / 100
      } 40,${height * 45 / 100
      } 40,${height * 25 / 100
      } 50,${height * 25 / 100
      }" style="fill:black;" /></svg>`));


      const x = $(`<label id=test${i} class ='classname' style="color:yellow;left:865px;top:${i * height + height / 2 - 8}px;position:absolute">${ph.label}</label>`);
      $('#divMilieu').append(x);

      let charDeleted = 0;
      while ($(`#test${i}`).width() > 70) {
        charDeleted += 1;

        x.empty();
        x.append(ph.label.substring(0, ph.label.length - charDeleted));
      }

      i += 1;
    });
  } else if (numVis === 2) {
    $('.classname').remove();
    const height = (can.height - 30) / res.phrases.length;
    let i = 0;

    $(res.phrases).each((_, ph) => {
      $('#divMilieu').append($(`<svg class ='classname' style="left:800px;top:${i * height + 30}px;position:absolute"><polygon points="50,${height / 10
      } 150,${height / 10
      } 150,${height * 30 / 100

      } 155,${height * 30 / 100
      } 160,${height * 50 / 100
      } 155,${height * 70 / 100
      } 150,${height * 70 / 100
      } 150,${height * 90 / 100
      } 50,${height * 90 / 100

      } 50,${height * 75 / 100
      } 40,${height * 75 / 100
      } 40,${height * 55 / 100
      } 50,${height * 55 / 100

      } 50,${height * 45 / 100
      } 40,${height * 45 / 100
      } 40,${height * 25 / 100
      } 50,${height * 25 / 100
      }" style="fill:black;" /></svg>`));

      const x = $(`<label id=test${i} class ='classname' style="color:yellow;left:865px;top:${i * height + height / 2 - 8 + 30}px;position:absolute">${ph.label}</label>`);
      // console.log(x.width());
      $('#divMilieu').append(x);

      let charDeleted = 0;
      while ($(`#test${i}`).width() > 70) {
        charDeleted += 1;

        x.empty();
        x.append(ph.label.substring(0, ph.label.length - charDeleted));
      }


      i += 1;
    });
  } else if (numVis === 3) {
    $('.classname1').remove();
    $('.classname2').remove();
  }
}
