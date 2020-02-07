const canvas = document.getElementById('timeCanvas');
const ctx = canvas.getContext("2d");
let start = null;
let animatePositions = [];
let numberPositions = [];

const pointDistance = 12;
const margin = 40;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const circleFill = 'rgba(255,255,255,0.4)';
const circleFillActive = 'rgba(255,255,255,1)';
const minCircleSize = 0.1;
const maxCircleSize = 4;
const minCircleSizeActive = 4;
const maxCircleSizeActive = 4;
const numberOfPointsX = Math.floor(((canvasWidth  - (margin * 2)) / pointDistance));
const numberOfPointsY = Math.floor(((canvasHeight  - (margin * 2)) / pointDistance));
const itemWidth = 8;
const itemSpacing = 1;
const growSpeed = 50;
const startingSpeed = 150;

function rnd(start, end) {
    if (typeof end === 'undefined') { end = start; start = 0; }
    if(end === start){ return end; }
    return parseFloat(((Math.random() * end) + start).toFixed(2));
}

const numbers = [[
    [0,0,0,1,1,0,0,0],
    [0,0,1,1,1,0,0,0],
    [0,0,1,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,0]],
    [
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [0,0,0,0,0,1,1,0],
    [0,0,0,0,1,1,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,1,1,1,0,0,0],
    [0,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,0]],
    [
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [0,0,0,0,0,1,1,0],
    [0,0,0,1,1,1,1,0],
    [0,0,0,1,1,1,1,0],
    [0,0,0,0,0,1,1,0],
    [0,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,0]]
];

const currentTime = '121213';

function init() {
    clear();
    canvas.width = 1000;
    canvas.height = 380;
    setGridPositions();
    setTimeToVisual(currentTime);
    window.cancelAnimationFrame(update);
    window.requestAnimationFrame(update);
    initDots();
    initNumbers();
}
init();

function setGridPositions() {
    let currentX = margin;
    let currentY = margin;
    for(let y = 0; y < numberOfPointsY; y++) {
        for (let x = 0; x < numberOfPointsX; x++) {
            animatePositions.push({xPos: currentX, yPos: currentY});
            currentX += pointDistance;
        }
        currentY += pointDistance;
        currentX = margin;
    }
}

function setNumberPositions(number, startPos) {
    let currentAnimatePosition = animatePositions[startPos];
    let iteratePos = startPos;
    for(let nrLocation = 0; nrLocation < numbers[number].length; nrLocation++) {
        let numberRow = numbers[number][nrLocation];
        for(let i = 0; i < numberRow.length; i++) {
            let nr = numberRow[i];
            currentAnimatePosition = animatePositions[iteratePos];
            if(nr === 1) {
                numberPositions.push({xPos: currentAnimatePosition.xPos, yPos: currentAnimatePosition.yPos});
            }
            iteratePos++;
        }
       iteratePos += numberOfPointsX - 8;
    }
}

function setTimeToVisual(time) {
    const timeArray = Array.from(time);
    const timeArrayLength = timeArray.length;
    const timeWidth = (timeArrayLength * itemWidth) + ((timeArrayLength - 1) * itemSpacing);
    let xPosition = Math.ceil((numberOfPointsX - timeWidth) / 2);
    for(let i = 0; i < timeArray.length; i++) {
        let timeChar = timeArray[i];
        setNumberPositions(timeChar - 1, numberOfPointsX * 8 + xPosition);
        xPosition += itemSpacing + itemWidth;
    }
}

function animate() {
    clear();
    drawDots();
    drawNumbers();
}

function Dot(drawer,type,x,y,minsize,maxsize,color) {
    this.init = function() {
        this.x = x;
        this.y = y;
        this.currentX = this.x;
        this.currentY = this.y;
        this.size = rnd(0, maxsize);
        this.type = type;
        this.maxSize = rnd(minsize, maxsize);
        this.color = color;
        this.counter = 0;
        this.startOffset = rnd(0,startingSpeed);
        this.growing = true;
        this.angle = 0;
        this.angleSpeed = rnd(1,3);
    };

    this.draw = function() {

        this.currentX = 0.04 * Math.cos(this.angle * (Math.PI/180)) + this.currentX;
        this.currentY = 0.04 * Math.cos(this.angle * (Math.PI/180)) + this.currentY;
        this.angle += this.angleSpeed;

        if(this.growing) {
            this.size += (this.maxSize / growSpeed);
        } else if(this.type === 1) {
            this.size -= (this.maxSize / growSpeed);
        }
        if(this.size > this.maxSize) {
            this.growing = false;
        }
        if(this.size < 1 && this.type === 1) {
            this.growing = true;
        }

        if(this.counter > this.startOffset) {
            drawer.beginPath();
            drawer.arc(this.currentX, this.currentY, this.size, 0, 2 * Math.PI);
            drawer.fillStyle = this.color;
            drawer.fill();
            drawer.closePath();
        }

        this.counter++;
    };
}

function initDots() {
    for(let dot = 0; dot < animatePositions.length; dot++) {
        let sp = animatePositions[dot];
        animatePositions[dot] = new Dot(ctx, 1, sp.xPos, sp.yPos, minCircleSize, maxCircleSize,  circleFill);
        animatePositions[dot].init();
    }
}

function initNumbers() {
    for(let n = 0; n < numberPositions.length; n++) {
        let sp = numberPositions[n];
        numberPositions[n] = new Dot(ctx, 2, sp.xPos, sp.yPos, minCircleSizeActive, maxCircleSizeActive, circleFillActive);
        numberPositions[n].init();
    }
}

function drawDots() {
    for(let dotdraw = 0; dotdraw < animatePositions.length; dotdraw++) {
        animatePositions[dotdraw].draw();
    }
}

function drawNumbers() {
    for(let ndraw = 0; ndraw < numberPositions.length; ndraw++) {
        numberPositions[ndraw].draw();
    }
}

function update(timestamp){
    if (!start) start = timestamp;
    progress = timestamp - start;

    animate();
    window.requestAnimationFrame(update);
}

function clear() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}