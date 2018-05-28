var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var xmax = canvas.width; //1366px
var ymax = canvas.height; //768px
var inicio=true;
var pausa=false;

function datos(){
	this.vidas=5;
	this.score=0;
	this.nivel=1;
}
function pelota(){
	this.x=xmax/2;
	this.y=5*ymax/6;
	this.r=10;
	this.xvel=3;
	this.yvel=-3;
	this.color="green"
} /**/
function palet(){
	this.vel=15;
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
	
	this.margenx = 2;
	this.margeny = 2;
	this.margen_up = 10;
	this.margen_lados = 50;
	this.b= (xmax-2*this.margen_lados-this.nx*this.margenx)/(this.nx+0.5);
	this.h = this.b/4;
	this.matriz=crea_matriz(this.nx,this.ny,this.b,this.h,this.margenx,this.margeny,this.margen_lados,this.margen_up);
 }

function crea_matriz(nx,ny,b,h,margenx,margeny,margen_lados,margen_up){
	var bricks = [];
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
    	
        bricks[i][j] = { x: xval, y: yval, valor:true,col:colo};
    	}
	}
return bricks;
}
//EMPIEZA EL PROGRAMA

var bola= new pelota();
var paleta= new palet();
var muro=new ladrillos(20,20);
animacion();
inicio=false;

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
		bola.yvel=-bola.yvel;
		}
		else{

    			document.location.reload();
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
					bola.xvel=-bola.xvel;
					//alert(i + "   " + j + "   choque en X");
					i=muro.nx;
					j=muro.ny;
					

				}
				if(bola.y-bola.r<=y+muro.h && bola.y+bola.r>=y && x<=bola.x && x+muro.b>=bola.x){
					muro.matriz[i][j].valor=false;
					bola.yvel=-bola.yvel;
					//alert(i + "   " + j + "   choque en Y");
					i=muro.nx;
					j=muro.ny;
					
				}

			}
		}
	}
}
function dibuja(){
	/*a partir de aqui se dibuja*/
	/*PELOTA*/
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();	
	ctx.arc(bola.x, bola.y, bola.r, 0, Math.PI*2);
	ctx.fillStyle = bola.color;
	ctx.fill();
	ctx.closePath()
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
        }
    }
    /*TEXTO*/
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(bola.x, 8, 25);
    ctx.fillText(bola.y, 8, 50);
}
function animacion(){
	if(inicio &&  !pausa){
	mover_bola();
	mover_paleta();
	colisiones();
	dibuja();
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
 	else if(e.keyCode == 80) {
    	pausa=!pausa;
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
    	inicio=true;
    	//alert(paleta.dcha + "   " +paleta.izqda);
    	
    }

  
  //alert(paleta.dcha + "   " +paleta.izqda);
}
document.addEventListener("keydown", pulsar);
document.addEventListener("keyup", soltar);
setInterval(animacion,5);		