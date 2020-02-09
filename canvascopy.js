// helpers

function rnd(start, end) {
    if (typeof end === 'undefined') { end = start; start = 0; }
    if(end === start){ return end; }
    return parseFloat(((Math.random() * end) + start).toFixed(2));
}

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

// canvas
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
const itemSpacing = 0;
const growSpeed = 120;
const startingSpeed = 150;
const movementArc = 0.04
const targetDate = new Date(2020,2,9,11,0,0,0);
const totalDigits = 8;

let digitLocations = [];
let currentTimeArray = [];
let currentDigitDots = [];
let activeDotsList = [];

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
    [0,1,1,1,1,1,1,0]],
    [
    [0,0,0,0,0,1,1,0],
    [0,0,0,0,1,1,1,0],
    [0,0,0,1,1,0,0,0],
    [0,0,1,1,0,0,0,0],
    [0,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,0],
    [0,0,0,0,1,1,0,0],
    [0,0,0,0,1,1,0,0]],
    [
    [0,0,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,0],
    [0,1,1,0,0,0,0,0],
    [0,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,0],
    [0,0,0,0,0,1,1,0],
    [0,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,0]],
    [
    [0,0,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,0],
    [0,1,1,0,0,0,0,0],
    [0,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,0],
    [0,1,1,0,0,1,1,0],
    [0,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,0]],
    [
    [0,0,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,0],
    [0,0,0,0,0,1,1,0],
    [0,0,0,0,0,1,1,0],
    [0,0,0,0,1,1,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,1,1,0,0,0,0],
    [0,1,1,0,0,0,0,0]],
    [
    [0,0,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,0],
    [0,1,1,0,0,1,1,0],
    [0,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,0],
    [0,1,1,0,0,1,1,0],
    [0,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,0,0]],
    [
    [0,0,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,0],
    [0,1,1,0,0,1,1,0],
    [0,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,0],
    [0,0,0,0,0,1,1,0],
    [0,0,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,0]],
    [
    [0,0,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,0],
    [0,1,1,0,0,1,1,0],
    [0,1,1,0,0,1,1,0],
    [0,1,1,0,0,1,1,0],
    [0,1,1,0,0,1,1,0],
    [0,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,0,0]],
];

function calculateSeconds() {
    return (Math.round((new Date().getTime() - targetDate.getTime()) / 1000) * -1).toString();
}

function init() {
    clear();
    canvas.width = 1000;
    canvas.height = 380;
    setGridPositions();
    setDigitLocations();
    window.cancelAnimationFrame(update);
    window.requestAnimationFrame(update);
    initDots();
    generateDigits();
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

function setDigitLocations() {
    let xPosition = Math.ceil((numberOfPointsX - ((8 * itemWidth) + (7 * itemSpacing))) / 2);
    for(let i = 0; i < totalDigits; i++) {
        digitLocations.push(numberOfPointsX * 8 + xPosition);
        xPosition += itemSpacing + itemWidth;
    }
}

function getTimeArray(time) {
    const timeArray = Array.from(time);
    if(timeArray.length < totalDigits) {
        let nzeroes = totalDigits - timeArray.length;
        for(let i = 0; i < nzeroes; i++) {
            timeArray.unshift(0);
        }
    }
    return timeArray;
}

function generateDigit(digit, loc) {
    if(digit === -1){ digit = 9; }
    let numberArray = numbers[digit];
    let iteratePos = loc;
    let currentDigitDots = [];
    for(let i = 0; i < numberArray.length; i++) {
        currentAnimatePosition = animatePositions[iteratePos];
        let nr = numberArray[i];
        let currentDot;
        for(let s = 0; s < nr.length; s++) {
            if (s === 1) {
                currentDot = new Dot(ctx, 2, currentAnimatePosition.xPos, currentAnimatePosition.yPos, minCircleSizeActive, maxCircleSizeActive, circleFillActive);
                currentDigitDots.push(currentDot);
            }
            iteratePos++;
        }
        iteratePos += numberOfPointsX - 8;
    }
    return currentDigitDots;
}

function generateDigits() {
    newTime = calculateSeconds();

    if(typeof currentTime === 'undefined') {
        timeArray = getTimeArray(newTime);
        currentTime = newTime;
        for(let digit = 0; digit < timeArray.length; digit++) {
            dotslist = generateDigit(timeArray[digit], digitLocations[digit]);
            activeDotsList.push(dotslist);
        }
        for(t = 0; t < activeDotsList.length; t++) {
            for(tt = 0; t < activeDotsList[t]; t++) {
                activeDotsList[t][tt].init();
            }
        }
    } else {
        if (newTime !== currentTime) {
            newTimeArray = getTimeArray(newTime);
            currentTime = newTime;
            let differences = 0;
            for(t = 0; t < timeArray.length; t++) {
                if(newTimeArray[t] !== timeArray[t]) {
                    differences++;
                }
            }
            timeArray = newTimeArray;
        }
    }
}

function animate() {
    clear();
    // drawDots();
    generateDigits();
    drawDigits();
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
        this.startOffset = rnd(0,type === 2 ? startingSpeed : startingSpeed * 4);
        this.growing = true;
        this.angle = 0;
        this.angleSpeed = rnd(0.5,3);

        console.log(this.type);

        // temp
        this.size = 4;
        this.startOffset = 0;
    };

    this.draw = function() {

        if(this.type === 1) {
            this.currentX = movementArc * Math.cos(this.angle * (Math.PI / 180)) + this.currentX;
            this.currentY = movementArc * Math.cos(this.angle * (Math.PI / 180)) + this.currentY;
            this.angle += this.angleSpeed;
        }

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
    // for(let dot = 0; dot < animatePositions.length; dot++) {
    //     let sp = animatePositions[dot];
    //     animatePositions[dot] = new Dot(ctx, 1, sp.xPos, sp.yPos, minCircleSize, maxCircleSize,  circleFill);
    //     animatePositions[dot].init();
    // }
}

function drawDots() {
    for(let dotdraw = 0; dotdraw < animatePositions.length; dotdraw++) {
        // animatePositions[dotdraw].draw();
    }
}

function drawDigits() {
    // for(let d = 0; d < currentDigits.length; d++) {
    //     currentDigits[d].draw();
    // }
    for(let d = 0; d < activeDotsList.length; d++) {
        for(let dot = 0; dot < activeDotsList[d]; dot++) {
            activeDotsList[d][dot].draw();
        }
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