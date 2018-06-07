var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var xmax = canvas.width; //1366px
var ymax = canvas.height; //768px

function datos_init(){
	this.vidas=4;
	this.score=0;
	this.nivel=1;
	this.nx=6;//5
	this.ny=5;//3
	this.vel_paleta=15;
	this.vel_bola=13;
	this.r_bola=10;
	this.fin=false;
}
function pelota(vel,radio){
	this.vel=vel;
	this.vel_bonus=0;
	this.vel_base=vel;
	this.angulo=45;
	this.x=xmax/2;
	this.y=5*ymax/6;
	this.r=radio;
	this.r_base=10;
	this.xvel=this.vel*Math.cos(this.angulo*Math.PI/180);
	this.yvel=-this.vel*Math.sin(this.angulo*Math.PI/180);
	this.color="#555555"
	this.atravesar=false;

} /**/
function palet(vel){
	this.vel=vel;
	this.h=10;
	this.b=xmax/6;
	this.y=ymax-this.h-3;
	this.x=(xmax-this.b)/2;
	this.dcha=false;
	this.izqda=false;
	this.arma=false;


}
 function ladrillos(x,y){
 	this.nx=x;
	this.ny=y;
	this.restantes=x*y;
	this.margenx = 2;
	this.margeny = 2;
	this.margen_up = 10;
	this.margen_lados = 50;
	this.b= (xmax-2*this.margen_lados-this.nx*this.margenx)/(this.nx+0.5);
	this.h = this.b/4;
	this.matriz=crea_matriz(this.nx,this.ny,this.b,this.h,this.margenx,this.margeny,this.margen_lados,this.margen_up);
 }

function tipo_ladrillo(){
	var tipos=["bola_grande","bola_pequeña","rapido", "lento","paleta_grande","paleta_pequeña", "atraviesa", "vida"];
	var porcentajes=[4,		  3,			 3,		  3,	   4,			    3,				 1,			  2];
	var porc=Math.random()*100;
	var porc_acum=0;
	for(t=0;t<tipos.length;t++){
		porc_acum+=porcentajes[t];
		if(porc<=porc_acum){ return tipos[t];}
	}
	return "normal"
}

function accion_bonus(type){
	if(type=="bola_grande"){
		bola.r+=4;
		datos.score+=2;
	}
	if(type=="bola_pequeña"){
		datos.score+=5;
		bola.r-=4;
	}
	if(type=="rapido"){
		datos.score+=5;
		if(bola.vel_bonus<2){
			bola.vel_bonus+=1;
			bola.vel=bola.vel_base+bola.vel_base*bola.vel_bonus/4;

		}
	}
	if(type=="lento"){
		datos.score+=3;
		if(bola.vel_bonus>-2){
			bola.vel_bonus-=1;
			bola.vel=bola.vel_base+bola.vel_base*bola.vel_bonus/4;
		}
	}
	if(type=="paleta_grande"){
		datos.score+=2;
		if(paleta.b<=xmax-xmax/15){
			paleta.b+=xmax/15;
			paleta.x-=xmax/30;
		}
	}
	if(type=="paleta_pequeña"){
		datos.score+=6;
		if(paleta.b>=xmax/29){
			paleta.b-=xmax/15;
			paleta.x+=xmax/30;
		}
	}
 
	if(type=="atraviesa"){
	datos.score+=2;
	bola.atravesar=true;	
	}
	if(type=="vida"){
	datos.score+=2;
	datos.vidas+=1;
	}
}

function dibuja_bonus(type,x,y){
	

	if(type=="bola_grande"){
		var rad=6;
		ctx.beginPath();
            ctx.arc(x,y,rad-2, 0, Math.PI*2);
			ctx.fillStyle = "#888888";
			ctx.fill();
            ctx.closePath();

            ctx.beginPath();
		    ctx.strokeStyle="green";
		    ctx.lineWidth=1;
		    ctx.moveTo(x-rad,y);
		    ctx.lineTo(x+rad,y);
		    ctx.stroke();
		    ctx.moveTo(x,y+rad);
		    ctx.lineTo(x,y-rad);
		    ctx.stroke();
		    ctx.closePath();

			ctx.beginPath();
		    ctx.arc(x,y,rad,0,Math.PI*2);
		    ctx.stroke();
		    ctx.closePath();
	}
	if(type=="bola_pequeña"){
		var rad=6;
		ctx.beginPath();
            ctx.arc(x,y,rad-1, 0, Math.PI*2);
			ctx.fillStyle = "#000000";
			ctx.fill();
            ctx.closePath();

            ctx.beginPath();
		    ctx.strokeStyle="red";
		    ctx.lineWidth=1;
		    ctx.moveTo(x-rad,y);
		    ctx.lineTo(x+rad,y);
		    ctx.stroke();
		    ctx.closePath();
		    
			ctx.beginPath();
			ctx.lineWidth=1;
		    ctx.arc(x,y,rad,0,Math.PI*2);
		    ctx.stroke();
		    ctx.closePath();
	}
	if(type=="rapido"){
			ctx.beginPath();
		    ctx.strokeStyle="#0e3691";
		    ctx.lineWidth=2;
		    ctx.moveTo(x-5,y);
		    ctx.lineTo(x,y-7);
		    ctx.lineTo(x+5,y);
		    ctx.stroke();
		    ctx.closePath();	

		    ctx.beginPath();
		    ctx.moveTo(x-5,y+7);
		    ctx.lineTo(x,y);
		    ctx.lineTo(x+5,y+7);
		    ctx.stroke();
		    ctx.closePath();	
	}
	if(type=="lento"){
			ctx.beginPath();
		    ctx.strokeStyle="red";
		    ctx.lineWidth=2;
		    ctx.moveTo(x-5,y-7);
		    ctx.lineTo(x,y);
		    ctx.lineTo(x+5,y-7);
		    ctx.stroke();
		    ctx.closePath();	

		    ctx.beginPath();
		    ctx.moveTo(x-5,y);
		    ctx.lineTo(x,y+7);
		    ctx.lineTo(x+5,y);
		    ctx.stroke();
		    ctx.closePath();	
	}
	if(type=="paleta_grande"){
 			 ctx.strokeStyle="green";	
 			 ctx.lineWidth=5;
		    ctx.beginPath();
		    ctx.moveTo(x-7,y);
		    ctx.lineTo(x+7,y);
		    ctx.closePath(); 
			ctx.stroke();
			ctx.lineWidth=2;

			ctx.beginPath();
		    ctx.moveTo(x+7,y-4);
		    ctx.lineTo(x+10,y);
		    ctx.lineTo(x+7,y+4);
		    ctx.closePath(); 
			ctx.stroke();

		    ctx.beginPath();
		    ctx.moveTo(x-7,y-4);
		    ctx.lineTo(x-10,y);
		    ctx.lineTo(x-7,y+4);
		    ctx.closePath();
		    ctx.stroke();
	}
	if(type=="paleta_pequeña"){
		 	ctx.strokeStyle="red";	
 			ctx.lineWidth=3;
		    ctx.beginPath();
		    ctx.moveTo(x-4,y);
		    ctx.lineTo(x+4,y);
		    ctx.closePath(); 
			ctx.stroke();
			ctx.lineWidth=3;

			ctx.beginPath();
		    ctx.moveTo(x+9,y-5);
		    ctx.lineTo(x+4,y);
		    ctx.lineTo(x+9,y+5);
			ctx.stroke();

		    ctx.beginPath();
		    ctx.moveTo(x-9,y-5);
		    ctx.lineTo(x-4,y);
		    ctx.lineTo(x-9,y+5);
		    ctx.stroke();
	}
	if(type=="atraviesa"){
		ctx.beginPath();
		ctx.arc(x,y,7, 0, Math.PI*2);
			ctx.fillStyle = "red";
			ctx.fill();
			ctx.closePath();
			ctx.beginPath();
			 ctx.arc(x,y,5, 0, Math.PI*2);
			ctx.fillStyle = "orange";
			ctx.fill();
			ctx.closePath();
			ctx.beginPath();
		    ctx.arc(x,y,3, 0, Math.PI*2);
			ctx.fillStyle = "yellow";
		    ctx.fill();
            ctx.closePath();
	}
	if(type=="vida"){

		ctx.beginPath();
	    ctx.moveTo(x+8,y+2);
	    ctx.lineTo(x-8,y+2);
	    ctx.lineTo(x,y+10);
	    ctx.fillStyle = "red";
	    ctx.fill();
		ctx.beginPath();	
		ctx.arc(x+4, y, 4, 0, Math.PI*2);
		ctx.fillStyle = "red";
		ctx.fill();
		ctx.closePath();
		ctx.arc(x-4, y, 4, 0, Math.PI*2);
		ctx.fillStyle = "red";
		ctx.fill();
		ctx.closePath();
	}
}
function crea_matriz(nx,ny,b,h,margenx,margeny,margen_lados,margen_up){
	var bricks = [];
	tipo_ladrillo();
	 
	for(i=0; i<nx; i++) {
    bricks[i] = [];
    for(j=0; j<ny; j++) {
    	var x_extra=0;	
    	if (j%2==1){
    		x_extra=b/2;
    	}
   //definición de colores
    	if ((j+i)%5==0){colo="#FF5533";}
    	if ((j+i)%5==1){colo="#FF9633";}
    	if ((j+i)%5==2){colo="#6278E4";}
    	if ((j+i)%5==3){colo="#57EC69";}
		if ((j+i)%5==4){colo="#995478";}


    	var xval=(b+margenx)*i+margen_lados+x_extra;
    	var yval=(h+margeny)*j+margen_up;
    	
        bricks[i][j] = { x: xval, y: yval, valor:true,col:colo,tipo: 
        			   tipo_ladrillo(),x_bonus: xval+b/2, y_bonus: yval+h/2, tipo_caida:false};
    	}
	}
return bricks;
}


//EMPIEZA EL PROGRAMA
	function sube_nivel(){
		datos.nivel+=1;
		if (datos.nivel>2 && datos.nivel<=5){ datos.vidas+=1;}
		if (datos.nivel>5){ datos.vidas+=2;}
		if (datos.nivel<=8){ bola.vel_base+=1; paleta.vel+=1;} 
		if (datos.nivel<8){ datos.ny+=1;} 
		datos.nx+=1;

	}
	function fin_nivel(){
		if(muro.restantes==0){
			stop_drops();
			sube_nivel();
			start();
			ctx.font = "oblique bold 20px Verdana";
    		ctx.fillStyle = "orange";
    		ctx.fillText("NIVEL "+ datos.nivel+" ALCANZADO " , xmax/2-80, 500);
		}

	}
    var angulo=0;
    datos= new datos_init();
	start();
	ctx.font = "oblique bold 22px Verdana";
	ctx.fillStyle = "#003366";
	ctx.textAlign="center";
	ctx.fillText("Bienvenido/a:" , xmax/2, 400);
	ctx.fillText("Para iniciar el movimiento de la bola, pulse la barra espaciadora" , xmax/2, 400+50);
	ctx.fillText("Puedes pausar/despausar el juego pulsando 'P'" , xmax/2, 400+100);

	ctx.fillStyle = "#ee9933";
	ctx.textAlign="center";
	ctx.fillText("BUENA SUERTE",xmax/2, 600+100);
	ctx.textAlign="right";


function dibuja_vidas(){
	var y_separ=30;
	var x_offs=8;
	var y_offs=20;
	for(i=0;i<datos.vidas;i++){
		ctx.beginPath();
	    ctx.moveTo(x_offs+12, y_separ*i+y_offs);
	    ctx.lineTo(x_offs+28, y_separ*i+y_offs);
	    ctx.lineTo(x_offs+20, y_separ*i+12+y_offs);
	    ctx.fillStyle = "red";
	    ctx.fill();
		ctx.beginPath();	
		ctx.arc(x_offs+16, y_separ*i-1+y_offs, 4, 0, Math.PI*2);
		ctx.fillStyle = "red";
		ctx.fill();
		ctx.closePath();
		ctx.arc(x_offs+24, y_separ*i-1+y_offs, 4, 0, Math.PI*2);
		ctx.fillStyle = "red";
		ctx.fill();
		ctx.closePath();
}	}

	function start(){
	 anim_ms=25;
	 inicio=true;
	 pausa=false;
	 if (datos.nivel==1){
		 
		 bola= new pelota(datos.vel_bola,datos.r_bola,false);
		 paleta= new palet(datos.vel_paleta);
		 muro=new ladrillos(datos.nx ,datos.ny);
	 }
	 else{
	 	 bola= new pelota(bola.vel_base,bola.r,bola.atravesar);
		 paleta= new palet(paleta.vel);
		 muro=new ladrillos(datos.nx ,datos.ny);
	 }
	 animacion();
	 inicio=false;

}

function cambio_direccion(){
	bola.yvel=-bola.yvel;
	

		//alert(paleta.dcha + "   " + paleta.izqda);
	if (paleta.dcha==true){
		
	angulo=10+70*(bola.x-paleta.x)/paleta.b;	
	bola.yvel=-bola.vel*Math.cos(angulo*Math.PI/180);
	bola.xvel= +bola.vel*Math.sin(angulo*Math.PI/180);
	}
	if (paleta.izqda==true){
	angulo=10+70*(-bola.x+paleta.x+paleta.b)/paleta.b;	
	bola.yvel=-bola.vel*Math.cos(angulo*Math.PI/180);
	bola.xvel= -bola.vel*Math.sin(angulo*Math.PI/180);
	}
}
//alert("x=:"+muro.matriz[1][0].x+ ", y:"+ muro.matriz[1][0].y);
function mover_bola(){
	bola.x+=bola.xvel;
	bola.y+=bola.yvel;
	if(bola.x-bola.r<=0){
		bola.x=bola.r;
		bola.xvel=-bola.xvel;
	}
	if(bola.x+bola.r>=xmax){
		bola.x=xmax-bola.r;
		bola.xvel= -bola.xvel;
	}
	if(bola.y-bola.r<=0){
		bola.y=bola.r;
		bola.yvel=-bola.yvel;
	}
	if(bola.y+bola.r>=ymax){
		if(bola.x>=paleta.x && bola.x<= paleta.x+paleta.b){
		bola.y=ymax-bola.r;
		//bola.yvel=-bola.yvel;
		cambio_direccion();
		}
		else{

				if(datos.vidas>0){
					inicio=false;
					datos.vidas-=1;
					//pelota.pos_inicio();
					stop_drops();
					bola= new pelota(bola.vel_base,bola.r_base,false);
				}
				else{
						datos.vidas-=1;
						inicio=false;
						datos.fin=false;
					    ctx.font = "oblique bold 20px Verdana";
			    		ctx.fillStyle = "#003366";
			    		ctx.textAlign="center";
			    		ctx.fillText("FIN DEL JUEGO    Puntuacion:" +datos.score , xmax/2, 500);
			    		ctx.fillText("Pulsa la barra espaciadora para reniciar" , xmax/2, 500+50);
			    		ctx.textAlign="right";
					    ClearInterval(t);
				}


    			//document.location.reload();
		}
	}
}
function mover_paleta(){
	if(paleta.dcha==true && paleta.x+paleta.b<xmax){
		paleta.x+=paleta.vel;
	}
	if(paleta.izqda==true && paleta.x>0){
		paleta.x-=paleta.vel;
	}
}

function colisiones(){

	for(i=0;i<muro.nx;i++){
		for(j=0;j<muro.ny;j++){
			if (muro.matriz[i][j].valor==true){
				var x=muro.matriz[i][j].x
				var y=muro.matriz[i][j].y

				/*if(bola.y+bola.r>=y&& x<=bola.x && x+muro.b>=bola.x){
					muro.matriz[i][j].valor=false;
					bola.yvel=-bola.yvel;
				}*/	
				if(bola.x-bola.r<=x+muro.b && bola.x+bola.r>=x && y<=bola.y && y+muro.h>=bola.y){
					muro.matriz[i][j].valor=false;
					if(muro.matriz[i][j].tipo!="normal"){muro.matriz[i][j].tipo_caida=true;}
					if(bola.atravesar==false){bola.xvel=-bola.xvel;}
					//alert(i + "   " + j + "   choque en X");
					i=muro.nx;
					j=muro.ny;
					datos.score+=1;
					muro.restantes-=1;


				}
				if(bola.y-bola.r<=y+muro.h && bola.y+bola.r>=y && x<=bola.x && x+muro.b>=bola.x){
					muro.matriz[i][j].valor=false;
					if(muro.matriz[i][j].tipo!="normal"){muro.matriz[i][j].tipo_caida=true;}
					if(bola.atravesar==false){bola.yvel=-bola.yvel;}
					//alert(i + "   " + j + "   choque en Y");
					i=muro.nx;
					j=muro.ny;
					datos.score+=1;
					muro.restantes-=1;

				}

			}
			//movimiento y colisiones de los bonus
			if(muro.matriz[i][j].tipo_caida==true){
				muro.matriz[i][j].y_bonus+=bola.vel/3;
				//COGER EL BONUS
				if (ymax-muro.matriz[i][j].y_bonus-paleta.h<0) { 
					muro.matriz[i][j].tipo_caida=false; 
					if(muro.matriz[i][j].x_bonus>=paleta.x && muro.matriz[i][j].x_bonus<= paleta.x+paleta.b){
						accion_bonus(muro.matriz[i][j].tipo); 

					}

				}
			
			}
		}
	}
}
function stop_drops(){
	for(i=0;i<muro.nx;i++){
		for(j=0;j<muro.ny;j++){
			muro.matriz[i][j].tipo_caida=false;
		}
	}
}
function dibuja(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	/*a partir de aqui se dibuja*/
	/*PELOTA*/
	if(bola.atravesar==false){
		ctx.beginPath();	
		ctx.arc(bola.x, bola.y, bola.r, 0, Math.PI*2);
		ctx.fillStyle = bola.color;
		ctx.fill();
		ctx.closePath();
	}
	else{
			ctx.beginPath();
			ctx.arc(bola.x,bola.y,bola.r, 0, Math.PI*2);
			ctx.fillStyle = "red";
			ctx.fill();
			ctx.closePath();
			ctx.beginPath();
			 ctx.arc(bola.x,bola.y,2*bola.r/3, 0, Math.PI*2);
			ctx.fillStyle = "orange";
			ctx.fill();
			ctx.closePath();
			ctx.beginPath();
		    ctx.arc(bola.x,bola.y,bola.r/3, 0, Math.PI*2);
			ctx.fillStyle = "yellow";
		    ctx.fill();
            ctx.closePath();
	}
	/*PALETA*/
	ctx.beginPath();
	ctx.rect(paleta.x,paleta.y,paleta.b,paleta.h);
	ctx.fillStyle = "#101E2C";
	ctx.strokeStyle = "rgba(0, 0, 0, 1)";
	ctx.stroke();
	ctx.fill();
	ctx.closePath();

	/*LADRILLOS*/
    for(i=0; i<muro.nx; i++) {
        for(j=0; j<muro.ny; j++) {
            ctx.beginPath();
            if(muro.matriz[i][j].valor==true){
            ctx.rect(muro.matriz[i][j].x, muro.matriz[i][j].y, muro.b, muro.h);
            ctx.fillStyle = muro.matriz[i][j].col;
            ctx.fill();
            ctx.closePath();
        }

     //DROPS DE BONUS
            if(muro.matriz[i][j].tipo_caida==true){
            	dibuja_bonus(muro.matriz[i][j].tipo,muro.matriz[i][j].x_bonus,muro.matriz[i][j].y_bonus);
        		}
        }
    }
    /*VIDAS*/
    //ctx.drawImage(img, 5, 5,20,20);
    dibuja_vidas();
    //ctx.drawImage(img, 5, 35,20,20);
    /*TEXTO*/
    //SCORE
    ctx.font = "20px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(datos.score, 1320, 30);

    ctx.font = "14px Arial";
    ctx.fillStyle = "black";
	ctx.fillText("Nivel " + datos.nivel, 1300, ymax-25);

    //ctx.fillText("a", 700, 560);
}
function animacion(){
	if(inicio &&  !pausa){
	mover_bola();
	mover_paleta();
	colisiones();
	dibuja();
	fin_nivel();
	}
	//alert(paleta.dcha + "   " +paleta.izqda+ "   " +paleta.x);
}
 
function pulsar(e) {
    if(e.keyCode == 39) {
    	paleta.dcha=true;
    	

    }
    else if(e.keyCode == 37) {
    	paleta.izqda=true;
    	
    }    
 	else if(e.keyCode == 80 && inicio==true) {
    	pausa=!pausa;
    	if(pausa){
	ctx.font = "oblique bold 22px Verdana";
	ctx.fillStyle = "#003366";
	ctx.textAlign="center";
	ctx.fillText("PAUSA" , xmax/2, 5*ymax/6);
	ctx.fillText("Pulsa 'P' para reanudar" , xmax/2, 5*ymax/6+50);
    	}
    }   
   
}
function soltar(e) {
    if(e.keyCode == 39) {
        paleta.dcha=false;
        paleta.izqda=false;

    }
    else if(e.keyCode == 37) {
        paleta.izqda=false;
        paleta.dcha=false;
  }
	else if(e.keyCode == 32) {
		/*if(datos.fin==false){
			var angulo=0;
    		datos= new datos_init();
    		start();
    	}*/
    	if(datos.vidas>=0){inicio=true;}
    	else{
    		if(datos.fin==false){
    			datos= new datos_init();
    			//var t=setInterval(animacion,anim_ms);
    		}
    		start();

    	}
    	//alert(paleta.dcha + "   " +paleta.izqda);
    	
    }

  
  //alert(paleta.dcha + "   " +paleta.izqda);
}
document.addEventListener("keydown", pulsar);
document.addEventListener("keyup", soltar);
var t=setInterval(animacion,anim_ms);		