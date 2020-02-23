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
const circleFill = 'rgba(0,0,0,1)';
const circleFillActive = 'rgba(255,255,255,1)';
const defaultOpacity = 0.4;
const minCircleSize = 0.01;
const maxCircleSize = 3;
const minCircleSizeActive = 5;
const maxCircleSizeActive = 6;
const numberOfPointsX = Math.floor(((canvasWidth  - (margin * 2)) / pointDistance));
const numberOfPointsY = Math.floor(((canvasHeight  - (margin * 2)) / pointDistance));
const itemWidth = 8;
const itemHeight = 8;
const itemSpacing = 0;
const growSpeed = 120;
const startingSpeed = 100;
const movementArc = 0.07;
const targetDate = new Date(2020, 3, 1, 0, 0, 0, 0);
const totalDigits = 7;
const startColors = 2;
const mouseOffsetMove = 10;

let circleFillFlash = 'rgba(255,31,116,1)';

let secondsPassed = 0;
let currentTime = '';
let digitLocations = [];
let currentTimeArray = [];
let currentDigitDots = [];
let activeDotsList = [];
let flashDotsList = [];
let currentFlashRow = -1;
let currentDigitsActive = [];
let flashCounter = 0;
let flashStartCounter = 0;
let mousePosition = {x: 0, y: 0};

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


    canvas.addEventListener('mousemove', event => {
        mousePosition.x = event.clientX - canvas.offsetLeft;
        mousePosition.y = event.clientY - canvas.offsetTop;
    }, false);

    canvas.addEventListener('click', event => {
        setBackgroundColor();
    }, false);


}
init();

function setBackgroundColor() {
    const randomColors = ['#5b4661','#613C42','#688446','#35845F','#2C8481','#B48F3B','#843CB4'];
    const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
    document.body.style.background = randomColor;
}

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
    let xPosition = Math.ceil((numberOfPointsX - ((totalDigits * itemWidth) + ((totalDigits - 1) * itemSpacing))) / 2) - 1;
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

function getRandomColor() {
    return 'rgba(' + rnd(100,255) + ', ' + rnd(100,255) + ', ' + rnd(100,255) + ', 1)';
}

function setColorBar(color) {
    document.getElementById('top').style.background = color;
    document.getElementById('bottom').style.background = color;
}

function animate(evt) {
    clear();
    drawDots();

    if(secondsPassed > startColors) {
        flashCounter++;
        flashStartCounter++;
        if (flashCounter === 3) {
            currentFlashRow++;
            flashCounter = 0;
            if (currentFlashRow > 23) {
                currentFlashRow = -1;
                secondsPassed = 0;
            }
        }
    }

    let newTime = calculateSeconds();
    if (newTime !== currentTime) {
        secondsPassed++;
        currentDigitDots = [];
        numberDifferences = getTimeDifference(newTime, currentTime);
        setupCurrentTimer();
        if(secondsPassed > startColors) {
            circleFillFlash = getRandomColor();
            setColorBar(circleFillFlash);
        }
    }
}

function getTimeDifference(t,c) {
    let ta = t.split("");
    let tc = c.split("");
    let diff = 0;
    for(let i = 0; i < ta.length; i++) {
        if(ta[i] !== tc[i]) {
            diff++;
        }
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
        this.flashStartCounter = 0;
        this.flashStartOffset = 0;
        this.opacity = defaultOpacity;
        this.defaultOpacity = defaultOpacity;
        this.opacityUp = true;
        this.isTouched = false;
        this.movementArc = movementArc;
        this.increaseMovement = false;
        this.returnMovement = false;
    };

    this.draw = function() {

        if(!this.active) {
            this.currentX =  this.movementArc * Math.cos(this.angle * (Math.PI / 180)) + this.currentX;
            this.currentY =  this.movementArc * Math.cos(this.angle * (Math.PI / 180)) + this.currentY;
            this.angle += this.angleSpeed;
        }

        if(mousePosition.x !== 0 && mousePosition.x > (this.x - mouseOffsetMove) && mousePosition.x < (this.x + mouseOffsetMove) && mousePosition.y !== 0 && mousePosition.y > (this.y - mouseOffsetMove) && mousePosition.y < (this.y + mouseOffsetMove)){
            this.isTouched = true;
            this.size = 10;
        }

        if (this.growing) {
            this.size += (this.maxSize / growSpeed);
        } else {
            this.size -= (this.maxSize / growSpeed);
        }

        if(this.isTouched) {
            if(!this.increaseMovement && !this.returnMovement) {
                this.maxSize = 0.1;
                this.increaseMovement = true;
            }
        }

        if(this.increaseMovement) {
            this.movementArc += 0.01;
            this.isTouched = false;
            if(this.movementArc > 3) {
                this.movementArc = movementArc;
                this.increaseMovement = false;
                this.returnMovement = true;
            }
        }

        if(this.returnMovement) {
            this.movementArc -= 0.1;
            if(this.movementArc < movementArc) {
                this.movementArc = movementArc;
                this.increaseMovement = false;
                this.returnMovement = false;
                this.isTouched = false;
            }
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
            this.maxSize = maxsize;
            if(!this.isFlashing) {
                this.color = circleFill;
                this.opacity = defaultOpacity;
            }
            if (this.size < 1) {
                this.growing = true;
            }
        }

        if(this.isFlashing) {

            this.flashStartCounter++;
            if(this.flashStartCounter > this.flashStartOffset) {

                if (!this.active && !this.isTouched) {
                    this.color = circleFillFlash;
                }
                if (this.flashCounter === 0) {
                    this.opacity = 0;
                    this.opacityUp = true;
                    if (!this.active) {
                        this.size = rnd(maxsize, maxsize + 2);
                    } else {
                        this.size = this.size + 5;
                    }
                }




                this.flashCounter++;

                if (!this.active) {
                    if (this.opacityUp) {
                        this.opacity = this.opacity + 0.05;
                    } else {
                        this.opacity = this.opacity - 0.10;
                    }
                } else {
                    this.opacity = 1;
                }
                if (this.opacity > 0.99) {
                    this.opacityUp = false;
                }

                if (this.size > 1) {
                    this.size -= 0.14;
                } else {
                    this.size = rnd(minsize, maxsize);
                }
                if (this.opacity < this.defaultOpacity && !this.active) {
                    this.opacity = this.defaultOpacity;
                }
                if (this.flashCounter === 10) {
                    this.color = circleFill;
                    this.opacity = defaultOpacity;
                    this.isFlashing = false;
                    this.isTouched = false;
                    this.flashCounter = 0;
                    this.flashStartCounter = 0;
                }
            }
        }

        if(this.isTouched) {
            this.opacity = 1;
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

    this.setFlash = function(r) {
        this.isFlashing = true;
        this.flashStartOffset = r;
    }
}

function setFlashDotsList() {

    for(let d = 0; d < digitLocations.length; d++) {
        let cl = digitLocations[d];
        let currentOffsetStart = cl - (8 * numberOfPointsX) + 2;
        let digitArrayRows = [];
        for(let row = 0; row < numberOfPointsY  + 1; row++) {
            let rowArray = [];
            for (let o = 0; o < 6; o++) {
                rowArray.push(currentOffsetStart + o);
            }
            currentOffsetStart += numberOfPointsX;
            digitArrayRows.push(rowArray);
        }
        flashDotsList.push(digitArrayRows);

    }
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
            for (let row = 0; row < flashDotsList[d][digit].length; row++) {
                if (digit === currentFlashRow) {
                    animatePositions[flashDotsList[d][digit][row]].setFlash(row * 2);
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