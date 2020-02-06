const canvas = document.getElementById('timeCanvas');
const ctx = canvas.getContext("2d");
let start = null;
let animatePositions = [];
let numberPositions = [];

const pointDistance = 12;
const margin = 40;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const circleFill = 'rgba(152,156,187,1)';
const circleFillActive = 'rgba(255,255,255,1)';
const circleSize = 2;
const circleSizeActive = 3;
const numberOfPointsX = Math.floor(((canvasWidth  - (margin * 2)) / pointDistance));
const numberOfPointsY = Math.floor(((canvasHeight  - (margin * 2)) / pointDistance));

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
    [0,0,1,1,1,1,0,0],
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0]]];

const currentTime = '122121';

function init() {
    clear();
    canvas.width = 1100;
    canvas.height = 380;
    setGridPositions();
    setTimeToVisual(currentTime);
    window.cancelAnimationFrame(update);
    window.requestAnimationFrame(update);
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
    let timeArray = Array.from(time);
    let xPosition = 5;
    for(let i = 0; i < timeArray.length; i++) {
        let timeChar = timeArray[i];
        setNumberPositions(timeChar - 1, numberOfPointsX * 8 + xPosition);
        xPosition += 10;
    }

}

function animate() {
    clear();
    drawDots();
    drawNumbers();
}

function drawDots() {
    for(let a = 0; a < animatePositions.length; a++) {
        let currentPosition = animatePositions[a];

        ctx.beginPath();
        ctx.arc(currentPosition.xPos, currentPosition.yPos, circleSize, 0, 2 * Math.PI);
        ctx.fillStyle = circleFill;
        ctx.fill();
        ctx.closePath();
    }
}

function drawNumbers() {
    for(let a = 0; a < numberPositions.length; a++) {
        let currentPosition = numberPositions[a];

        ctx.beginPath();
        ctx.arc(currentPosition.xPos, currentPosition.yPos, circleSizeActive, 0, 2 * Math.PI);
        ctx.fillStyle = circleFillActive;
        ctx.fill();
        ctx.closePath();
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