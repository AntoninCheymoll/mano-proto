import  $ from 'jquery';
import jquery from 'jquery';
import 'jquery-ui-bundle';


export default function drawClassNameList(can,ctx,res,numVis){
  let height = can.height/res.trainingSet.phrases.length;

  if (numVis==1) {



    let i=0;
    for(let ph of res.trainingSet.phrases){


  $("#divMilieu").append($('<svg style="left:800px;top:'+ i*height +'px;position:absolute"><polygon points="50,'+(height/10 )+
                                                                                          ' 150,'+(height/10 )+
                                                                                          ' 150,'+(height*30/100 )+

                                                                                          ' 155,'+(height*30/100 )+
                                                                                          ' 160,'+(height*50/100 )+
                                                                                          ' 155,'+(height*70/100 )+
                                                                                          ' 150,'+(height*70/100 )+
                                                                                          ' 150,'+(height*90/100 )+
                                                                                          ' 50,'+(height*90/100 )+

                                                                                          ' 50,'+(height*75/100 )+
                                                                                          ' 40,'+(height*75/100 )+
                                                                                          ' 40,'+(height*55/100 )+
                                                                                          ' 50,'+(height*55/100 )+

                                                                                          ' 50,'+(height*45/100 )+
                                                                                          ' 40,'+(height*45/100 )+
                                                                                          ' 40,'+(height*25/100 )+
                                                                                          ' 50,'+(height*25/100 )+
                                                                                          '" style="fill:black;" /></svg>'))

  //console.log('<label style="color:red;left:860px;top:'+ (i*height + height/2)+'px;position:absolute">text</label>');
  let x;
  x= $('<label style="color:yellow;left:865px;top:'+ (i*height + height/2 -8)+'px;position:absolute">'+ph.label+'</label>')
  // console.log(x[0].clientWidth,ph.label);
  // console.log(x[0].left);
  //if(x.clientWidth>85){console.log(ph.label);}
  $("#divMilieu").append(x)

  i++;
}


//$("#divMilieu").append($('<svg style="left:800px;top:120px;position:absolute;" height="30" width="500"><polygon points="-0,0 30,0 0,25 25, 28" style="fill:lime;stroke:purple;stroke-width:1" /></svg>'))
//$("#divMilieu").append($('<label style="left:800px;top:60px;position:absolute;">Antonin</label>'))
//$("#divMilieu").append($('<label style="left:800px;top:120px;position:absolute;">Fred</label>'))
  //  let i=0;
  //  for(let ph of res.trainingSet.phrases){
  //
  //   let textZone = document.createElement('div');
  //   $(textZone).append($('<svg height="210" width="500"><polygon points="-100,0 100,0 80,120" style="fill:lime;stroke:purple;stroke-width:1" /></svg>'))
  //   i++
  // }
  //
    //
    // textZone.className = "drawingClassName"
    // document.body.appendChild(textZone);
    //
    //
    // textZone.style.width = (height*80/100*2).toString() + "px"
    // textZone.style.height = (height*80/100).toString() + "px"
    //
    // textZone.style.left = can.getBoundingClientRect().left + 800 + 50 + "px"
    // textZone.style.top = can.getBoundingClientRect().top + height/10+ heightN*i  +"px"
    //
    //   //deux carrés a l arriere
    //
    //
    // let backSquare1 = document.createElement('div');
    // let backSquare2 = document.createElement('div');
    //
    //
    // backSquare1.className = "drawingClassName"
    // document.body.appendChild(backSquare1);
    //
    // backSquare2.className = "drawingClassName"
    // document.body.appendChild(backSquare2);
    //
    // backSquare1.style.width = height*80/100/5 + "px"
    // backSquare1.style.height = height*80/100/5 + "px"
    // backSquare2.style.width = height*80/100/5 + "px"
    // backSquare2.style.height = height*80/100/5 + "px"
    //
    // backSquare1.style.left = can.getBoundingClientRect().left + 800 + 50 - height*80/100/5 + "px"
    // backSquare1.style.top = can.getBoundingClientRect().top + height/10 + height*80/100/5+ heightN*i + "px"
    // backSquare2.style.left = can.getBoundingClientRect().left + 800 + 50 - height*80/100/5 + "px"
    // backSquare2.style.top = can.getBoundingClientRect().top + height/10 + 3*height*80/100/5+ heightN*i + "px"
    //
    //
    //   // rectangle a l avant
    //
    //   let rigthRect = document.createElement('div');
    //
    //
    //  rigthRect.className = "drawingClassName"
    //  document.body.appendChild(rigthRect);
    //
    //
    //  rigthRect.style.width = height*10/100 + "px"
    //  rigthRect.style.height = height*80/100/2 + "px"
    //
    //   rigthRect.style.left = can.getBoundingClientRect().left + 800 + 50 + height*80/100*2 + "px"
    //   rigthRect.style.top = can.getBoundingClientRect().top + height/10 + height*80/100/4+ heightN*i + "px"
    //
    //
    //
    //   //nom de la classe
    //
    //   let label = document.createElement("LABEL");
    //
    //   label.className = "drawingClassName"
    //   document.body.appendChild(label);
    //
    //   label.style.left = can.getBoundingClientRect().left + 800 + 50 + 10 + "px"
    //   label.style.top = can.getBoundingClientRect().top + height/10 + 10+ heightN*i + "px"
    //
    //
    //   label.textContent = ph.label
    //   label.id = "label"+i;
    //   label.style.innerHTML = "test"
    //   label.style.color = "yellow"
    //
    //   // console.log(label.style);
    //
    //   i++
    //
    // }

    //var rigthRect = document.createElement('label');








    //triangle

    // var triangle = document.createElement('div');
    //
    // triangle.id = "triangle"
    // triangle.className = "drawingClassName"
    // triangle.className = "triangle"
    //
    // document.body.appendChild(triangle);
    //
    //  $("#triangle").css("left", can.getBoundingClientRect().left + 800 + 50 + height*80/100*2 + height*10/100)
    //  $("#triangle").css("top", can.getBoundingClientRect().top + height/10 )


//   width:200px;
// height:100px;
// background:blue;
  }
}
