
export default function visu2(can, res,ctx) {
      let r=0
      let g=128
      let b=0

      // let can = document.createElement('canvas');
      can.width = '800';
      can.height = '400';




      ctx.fillStyle = "rgba(255,128,0,0.2)";
      ctx.fillRect(0, 0 , can.width,can.height);
      // document.body.appendChild(can);

      // let ctx = can.getContext("2d")


      for(let ph of res.trainingSet.phrases){
        for(let labelNum of res.model.models){
          let classeName= labelNum.label
        //  console.log(classeName);




          let data =  []

          for(let i=0; i<ph.likelihoods.length;i++){
            data.push(ph.likelihoods[i][classeName]);

          }

          //console.log(data);


          ctx.strokeStyle="rgb("+ r + "," + g +"," + b +")"
          ctx.beginPath();
          ctx.moveTo(10, (can.height-10)-data[0]*(can.height-20));
            for (let i=1; i<data.length; i++)
              ctx.lineTo(10+i*((can.width-10)/(data.length-1)), can.height -10 -data[i]*(can.height-20));



          ctx.stroke();


          }

          b= b + 255/(res.trainingSet.phrases.length-1);
      }



      ctx.moveTo(10,0);
      ctx.lineTo(10, can.height);
      ctx.stroke();

      ctx.moveTo(0, can.height-10);
      ctx.lineTo(can.width, can.height-10)

      ctx.stroke();
}
