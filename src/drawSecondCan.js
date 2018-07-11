import  $ from 'jquery';
import jquery from 'jquery';
import 'jquery-ui-bundle';


export function drawSecondCan(ctx, can, res, className, modelName){

    can.width = '800';
    can.height = '800';

    ctx.fillStyle = "rgba(255,128,0,0.2)";
    ctx.fillRect(0, 0 , can.width,can.height);

    ctx.textBaseline='Top'
    ctx.fillStyle = "rgb(0,0,0)";

    //console.log(className,modelName);

    ctx.fillText(className,0,15)
    ctx.fillText(modelName,0,35)



    //pour chaque dimensions du capteur
    // let numdim = 0;
    // for(let dim of res.model.models){
    //
    //
    // }
}
