const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = document.getElementById("canvasWrapper").offsetWidth;
console.log(document.getElementById("canvasWrapper").offsetWidth);
canvas.height = document.getElementById("canvasWrapper").offsetHeight; 
console.log(document.getElementById("canvasWrapper").offsetHeight);
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight; 
// console.log(window.innerWidth, window.innerHeight);          Did not work in my case
let particlesArray;

//Mouse radius
let mouseRadius = 5;

//get mouse position 
let mouse = {
    x : null,
    y: null,
    radius: (canvas.height/100) * (canvas.width/100)
}

window.addEventListener('mousemove',
    function(event){
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

//create particle
class Particle  {
    constructor (x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    //method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
    //check particle position, check mouse position, move the particle, draw the particle
    update() {
        //check if partile s still within canvas
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        //check collision detection - mouse position / particle position 
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * mouseRadius){
                this.x += mouseRadius;
            }
            if (mouse.x > this.x  && this.x > this.size * mouseRadius){
                this.x -= mouseRadius;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * mouseRadius){
                this.y += mouseRadius;
            }
            if (mouse.y > this.y  && this.y > this.size * mouseRadius){
                this.y -= mouseRadius;
            }
        }
        //move particle 
        this.x += this.directionX;
        this.y += this.directionY;
        //draw particle 
        this.draw();
    }
}

//create particle array
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.width * canvas.height)/ 9000;
    //HERE you can change number of particles HERE
    for (let i =0 ; i < numberOfParticles * 1; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((document.getElementById("canvasWrapper").offsetWidth - size * 2) - (size *2)) + size * 2);
        let y = (Math.random() * ((document.getElementById("canvasWrapper").offsetHeight- size * 2) - (size *2)) + size * 2);
        let directionX = (Math.random() * 5) -2.5;
        let directionY = (Math.random() * 5) -2.5;
        let color = 'white';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

//check if particles are close enough to draw a line between them
function connect () {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++){
        for (let b = a; b < particlesArray.length; b++){
            let distance = 
            ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) 
            + ((particlesArray[a].y - particlesArray[b].y) *(particlesArray[a].y - particlesArray[b].y));
            
            if (distance < (canvas.height/7) * (canvas.height/7)){
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle = 'rgba(255, 255, 255, ' + opacityValue + ')';
                ctx.Width = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

//particles spee
var speed = 30;

//animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, document.getElementById("canvasWrapper").offsetWidth, document.getElementById("canvasWrapper").offsetHeight);

    for (let i = 0; i < particlesArray.length; i++){
        particlesArray[i].update();
    }
    connect();
}

//resize event 
window.addEventListener('resize', 
    function(){
        canvas.width = document.getElementById("canvasWrapper").offsetWidth;
        canvas.height = document.getElementById("canvasWrapper").offsetHeight;
        mouse.radius = ((canvas.height/80) * (canvas.width/80));
        init();
    }
);

//mouse out event 
window.addEventListener('mouseout',
    function (){
        mouse.x = undefined;
        mouse.y = undefined;
    }
) 

init();
animate();
