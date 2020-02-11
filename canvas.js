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

const pointDistance = 15;
const margin = 40;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const circleFill = 'rgba(255,255,255,1)';
const circleFillActive = 'rgba(255,255,255,1)';
const minCircleSize = 0.01;
const maxCircleSize = 3;
const minCircleSizeActive = 3;
const maxCircleSizeActive = 6;
const numberOfPointsX = Math.floor(((canvasWidth  - (margin * 2)) / pointDistance));
const numberOfPointsY = Math.floor(((canvasHeight  - (margin * 2)) / pointDistance));
const itemWidth = 8;
const itemHeight = 8;
const itemSpacing = 0;
const growSpeed = 120;
const startingSpeed = 150;
const movementArc = 0.03;
const targetDate = new Date(2020, 3, 1, 0, 0, 0, 0);
const totalDigits = 8;

let currentTime = '';
let digitLocations = [];
let currentTimeArray = [];
let currentDigitDots = [];
let activeDotsList = [];
let flashDotsList = [];
let currentFlashRow = 0;
let flashCounter = 0;

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
     let seconds = (Math.round((new Date().getTime() - targetDate.getTime()) / 1000) * -1).toString();
    return seconds;
}

function init() {
    clear();
    canvas.width = 1100;
    canvas.height = 450;
    setGridPositions();
    window.cancelAnimationFrame(update);
    window.requestAnimationFrame(update);
    digitLocations = setDigitLocations();
    flashDotsList = setFlashDotsList();

    setupCurrentTimer();
    initDots();
}
init();

function setupCurrentTimer() {
    currentTime = calculateSeconds();
    currentTimeArray = getTimeArray(currentTime);
    for (let t = 0; t < currentTimeArray.length; t++) {
        let positionsForDigit = getDotPositionsForDigits(currentTimeArray[t] - 1, digitLocations[t]);
        for (let t = 0; t < positionsForDigit.length; t++) {
            currentDigitDots.push(positionsForDigit[t]);
        }
    }
}

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
    let xPosition = Math.ceil((numberOfPointsX - ((8 * itemWidth) + (7 * itemSpacing))) / 2) - 1;
    for(let i = 0; i < totalDigits; i++) {
        digitLocations.push(numberOfPointsX * ((numberOfPointsY - itemWidth) / 2) + xPosition);
        xPosition += itemSpacing + itemWidth;
    }
    return digitLocations;
}

function getDotPositionsForDigits(digit, loc) {
    if(digit === -1){ digit = 9; }
    let numberArray = numbers[digit];
    let iteratePos = loc;
    let currentDigitDots = [];
    for(let i = 0; i < numberArray.length; i++) {
        let nr = numberArray[i];
        for(let s = 0; s < nr.length; s++) {
            iteratePos++;
            if(nr[s] === 1) {
                currentDigitDots.push(iteratePos);
            }
        }
        iteratePos += numberOfPointsX - 8;
    }
    return currentDigitDots;
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

function animate() {
    clear();
    drawDots();

    flashCounter++;
    if(flashCounter === 15) {
        currentFlashRow++;
        flashCounter = 0;
        if(currentFlashRow > 15) {
            currentFlashRow = 0;
        }
    }

    let newTime = calculateSeconds();
    if (newTime !== currentTime) {
        currentDigitDots = [];
        setupCurrentTimer();
    }
}

function setDotColor(color, opacity) {
    let colorArray = color.split(',');
    let newColor = colorArray[0]+','+colorArray[1]+','+colorArray[2]+','+opacity+')'.toString();
    return newColor;
}

function Dot(drawer,type,x,y,minsize,maxsize,color) {
    this.init = function() {
        this.x = x;
        this.y = y;
        this.currentX = this.x;
        this.currentY = this.y;
        this.size = rnd(0, maxsize);
        this.type = type;
        this.minSize = minsize;
        this.maxSize = rnd(minsize, maxsize);
        this.color = color;
        this.counter = 0;
        this.startOffset = rnd(0,startingSpeed);
        this.growing = true;
        this.angle = 0;
        this.angleSpeed = rnd(0.5,3);
        this.active = false;
        this.isFlashing = false;
        this.flashCounter = 0;
        this.opacity = 0.2;
    };

    this.draw = function() {

        if(!this.active) {
            this.currentX = movementArc * Math.cos(this.angle * (Math.PI / 180)) + this.currentX;
            this.currentY = movementArc * Math.cos(this.angle * (Math.PI / 180)) + this.currentY;
            this.angle += this.angleSpeed;
        }


        if (this.growing) {
            this.size += (this.maxSize / growSpeed);
        } else {
            this.size -= (this.maxSize / growSpeed);
        }


        if(this.size > this.maxSize) {
            this.growing = false;
        }

        if(this.active) {
            this.color = circleFillActive;
            this.opacity = 1;
            this.maxSize = rnd(minCircleSizeActive, maxCircleSizeActive);
            this.minSize = minCircleSizeActive;
            if (this.size < this.minSize) {
                this.growing = true;
            }
        } else {
            if(!this.isFlashing) {
                this.color = circleFill;
                this.opacity = 0.2;
            }
            if (this.size < 1) {
                this.growing = true;
            }
        }

        if(this.isFlashing) {
            this.opacity = 1;
            this.flashCounter++;
            this.opacity = this.opacity - 0.1;
            if(this.flashCounter === 40) {
                this.color = circleFill;
                this.opacity = 0;
                this.isFlashing = false;
                this.flashCounter = 0;
            }
        }



        if(this.counter > this.startOffset) {
            drawer.beginPath();
            drawer.arc(this.currentX, this.currentY, this.size, 0, 2 * Math.PI);
            drawer.fillStyle = setDotColor(this.color, this.opacity);
            drawer.fill();
            drawer.closePath();
        }

        this.counter++;
    };

    this.setActive = function() {
        this.active = true;
    };

    this.setInActive = function() {
        this.active = false;
    }

    this.setFlash = function() {
        this.isFlashing = true;
    }
}

function setFlashDotsList() {

    for(let d = 0; d < digitLocations.length; d++) {
        let cl = digitLocations[d];
        let currentOffsetStart = cl - (8 * numberOfPointsX) + 2;
        let digitArrayRows = [];
        for(let row = 0; row < numberOfPointsY - itemHeight + 1; row++) {
            let rowArray = [];
            for (let o = 0; o < 6; o++) {
                rowArray.push(currentOffsetStart + o);
            }
            currentOffsetStart += numberOfPointsX;
            if(row === 7) {
                currentOffsetStart += numberOfPointsX * 8;
            }
            digitArrayRows.push(rowArray);
        }
        flashDotsList.push(digitArrayRows);

    }
    // for(let d = 0; d < flashDotsList.length; d++) {
    //     for(let digit = 0; digit < flashDotsList[d].length; digit++) {
    //         for(let row = 0; row < flashDotsList[d][digit].length; row++) {
    //             console.log(flashDotsList[d][digit]);
    //         }
    //     }
    //
    // }
    console.log(flashDotsList);
    return flashDotsList;
}

function initDots() {
    for(let dot = 0; dot < animatePositions.length; dot++) {
        let sp = animatePositions[dot];
        animatePositions[dot] = new Dot(ctx, 1, sp.xPos, sp.yPos, minCircleSize, maxCircleSize,  circleFill);
        animatePositions[dot].init();
    }
}

function drawDots() {
    for(let d = 0; d < flashDotsList.length; d++) {
        for(let digit = 0; digit < flashDotsList[d].length; digit++) {
            for(let row = 0; row < flashDotsList[d][digit].length; row++) {
                if(digit === currentFlashRow) {
                    animatePositions[flashDotsList[d][digit][row]].setFlash();
                }
            }
        }

    }
    for(let dotdraw = 0; dotdraw < animatePositions.length; dotdraw++) {
        animatePositions[dotdraw].draw();
        if(currentDigitDots.includes(dotdraw)) {
            animatePositions[dotdraw].setActive();
        } else {
            animatePositions[dotdraw].setInActive();
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