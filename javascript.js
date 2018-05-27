var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var xmax = canvas.width; //1366px
var ymax = canvas.height; //768px

function pelota(){
	this.x=xmax/2;
	this.y=ymax/2;
	this.r=25;
	this.xvel=5;
	this.yvel=5;
	this.color="green"
}
function palet(){
	this.vel=15;
	this.h=10;
	this.b=xmax/6;
	this.y=ymax-this.h;
	this.x=(xmax-this.b)/2;
	this.dcha=false;
	this.izqda=false;

}

var bola= new pelota();
var paleta= new palet();

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
	ctx.fillStyle = "#FF0000";
	ctx.strokeStyle = "rgba(0, 0, 0, 1)";
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
}

function animacion(){
	mover_bola();
	mover_paleta();
	dibuja();
	//alert(paleta.dcha + "   " +paleta.izqda+ "   " +paleta.x);
}

function pulsar(e) {
    if(e.keyCode == 39) {
    	paleta.dcha=true;
    	

    }
    else if(e.keyCode == 37) {
    	paleta.izqda=true;
    	//alert(paleta.dcha + "   " +paleta.izqda);
    	
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
  //alert(paleta.dcha + "   " +paleta.izqda);
}
document.addEventListener("keydown", pulsar);
document.addEventListener("keyup", soltar);
setInterval(animacion,10);	