const wheel = document.getElementById('wheel');
const slices = 70; // Number of slices
const oddColor = '#000'; // Color for odd slices (e.g., orange)
const evenColor = '#0c0c0c'; // Color for even slices (e.g., red)

const multiplierColors = [
    'rgb(2, 150, 195)',
    'rgb(95, 50, 148)',
    'rgb(155, 0, 138)',
]

// Create the pizza slices
for (let i = 0; i < slices; i++) {
    const slice = document.createElement('div');
    slice.classList.add('slice');
    slice.style.transform = `rotate(${(i * 360) / slices}deg)`; // Rotate each slice
    
    // Alternate between odd and even colors
    const color = (i % 2 === 0) ? oddColor : evenColor;
    slice.style.backgroundColor = color;

    // Append the slice to the wheel
    wheel.appendChild(slice);
}
const canvas = document.getElementById('aviatorCanvas');
const ctx = canvas.getContext('2d');
const width = window.innerWidth;
const height = width / 1.42; // Ensure 3:1 aspect ratio

// Set the internal resolution of the canvas
canvas.width = width;
canvas.height = height;

window.addEventListener("resize", ()=>{
    const width = window.innerWidth;
    const height = width / 1.42; // Ensure 3:1 aspect ratio

    canvas.width = width;
    canvas.height = height;
})

const planeImage1 = new Image();
planeImage1.src = 'assets/plane1.svg';
const planeImage2 = new Image();
planeImage2.src = 'assets/plane2.svg';
const planeImage3 = new Image();
planeImage3.src = 'assets/plane3.svg';

const planeImages = [
    planeImage1,
    planeImage2,
    planeImage3,
    planeImage2,
    planeImage1,
];

const planeImage = {
    image: planeImage1,
};

let bladeState = 0;

const animateBlade = () => {
    setInterval(()=>{
        if(bladeState == planeImages.length -1) bladeState = 0
        else bladeState++;
        planeImage.image = planeImages[bladeState]
    }, 100)
}

animateBlade();

const rest = 400;

const padding = 30;

function customBezier(t, start = 0.1, middle = 1.5, end = 0.1) {
    // Control points: (0, 0), (0.5, 2), (1, 0)
    const p0 = start;   // Start point
    const p1 = middle;   // Control point (peak at t=0.5)
    const p2 = end;   // End point

    // Quadratic Bezier formula
    return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
}

function cubicBezier(t, P0, P1, P2, P3) {
    const u = 1 - t;
    return u**3 * P0 + 3 * u**2 * t * P1 + 3 * u * t**2 * P2 + t**3 * P3;
}

// Example usage
function cubicCurve(t) {
    const P0 = 0;   // Start at 0
    const P1 = 0.5; // Control point 1 (customizable)
    const P2 = 0.5; // Control point 2 (customizable)
    const P3 = 1;   // End at 1
    const bezierValue = cubicBezier(t, P0, P1, P2, P3);

    const outputMin = 0.1;
    const outputMax = 0.9;
    return outputMin + bezierValue * (outputMax - outputMin);
}

function quadraticBezier(t, P0, P1, P2) {
    const u = 1 - t;
    return u * u * P0 + 2 * u * t * P1 + t * t * P2;
}

function delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

function nextPoint() {
    plane.t = 0;
    plane.resting = true;

    const currentPoint = plane.lastTarget = plane.target;

    if(plane.target.name === "B"){
        plane.target = points['C'];
    } else if(plane.target.name === "C"){
        plane.target = points['D'];
    } else if(plane.target.name === "D"){
        plane.target = points['C'];
    } else if(plane.target.name === "EXIT"){
        plane.target = points['EXIT'];
    }
    timeOut = setTimeout(() => {
        plane.resting = false;
    }, currentPoint.rest || 0); // Rest for 2 seconds
}

function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(planeImage.image, plane.x - 15, plane.y - 98 / 2, 110, 55);

    if(!plane.gone)drawSlackRope();
}

function drawSlackRope() {

    ctx.beginPath();
    
    // Move to point A (the fixed end of the rope)
    ctx.moveTo(points.A.x , points.A.y );
    
    // Calculate the control point for the curve to simulate the sag
    const controlPointX = (plane.x + points.A.x) * 0.55;
    const controlPointY = Math.max(plane.y, points.A.y) + 0; // Sagging effect

    // Draw the quadratic Bézier curve between point A and the plane's current position
    ctx.quadraticCurveTo(controlPointX, controlPointY, plane.x, plane.y);

    ctx.lineTo(plane.x , canvas.height - padding);
    ctx.lineTo(points.A.x, canvas.height -padding);
    ctx.closePath(); // Close the path to create a filled shape

    ctx.fillStyle = 'rgba(250, 09, 57, 0.5)'; // Blue color with some transparency
    ctx.fill(); // Fill the area under the curve

    ctx.beginPath();

    ctx.strokeStyle = 'rgba(229, 9, 57, 255)';
    ctx.lineWidth = 4;

    ctx.moveTo(points.A.x , points.A.y );

    // Draw the quadratic Bézier curve between point A and the plane's current position
    ctx.quadraticCurveTo(controlPointX, controlPointY, plane.x, plane.y);

    ctx.stroke();


}

const updateFrame = () => {
    draw();
}

const animate = setInterval(updateFrame, 16);

points = {
    A: {
        name: 'A',
        x: 0 + padding,
        y: canvas.height - padding,
        curve: true,
        rest: 0,
        timingFunction: {start: 0.5}
    }, 
    B: {
        name: 'B',
        x: canvas.width * 0.6,
        y: canvas.height * 0.2,
        rest: 300,
    },
    C: {
        name: 'C',
        x: canvas.width * 0.6,
        y: canvas.height * 0.2,
        rest: 300,
        // timingFunction: {min: 0.1, max: 1.5},
    },
    D: {
        name: 'D',
        x: canvas.width * 0.7,
        y: canvas.height * 0.6,
        rest: 300,
        timingFunction: {min: 0.1, max: 1.5},
    },
    EXIT: {
        name: 'EXIT',
        x: canvas.width + 30,
        y: -30
    } // Point D (100%, top-right)
}

const plane = {
    baseX: 0 + padding,
    baseY: 0 + canvas.height - padding,
    x: 0 + padding,
    y: canvas.height - padding,
    lastTarget: points.A,
    target: points.B,
    speed: 16,
    steps: 1,
    curverSpeed: 0.005,
    t: 0,
}

let interval;

const moveToNewPoint = async () => {
    const totalDx = plane.target.x - plane.lastTarget.x;
    const totalDy = plane.target.y - plane.lastTarget.y;

    const totalDistance= Math.sqrt(totalDx * totalDx + totalDy * totalDy);

    // const step = totalDistance/plane.steps
    
    console.log(plane.lastTarget, plane.target, totalDistance, plane.x, plane.y);

    let linearDistanceCovered = 0;

    const controlPoint = {
        x: (plane.target.x + plane.lastTarget.x) / 2,      // Midway between P0 and P2 on the X-axis
        y: Math.max(plane.lastTarget.y, plane.target.y) // Higher than both points for an arc
    };

    if(plane.lastTarget.rest){
        await delay(plane.target.rest);
    }


    const thisInterval = interval = setInterval(() => {

        const dx = plane.lastTarget.x - plane.baseX;
        const dy = plane.lastTarget.y - plane.baseY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        const distanceRatio = distance/totalDistance;

        const factor = customBezier(distanceRatio, plane.lastTarget.timingFunction?.start);

        if(distance >= totalDistance){
            clearInterval(thisInterval);
            if(!plane.gone){
                setNextPoint();
            }
            console.log({x: plane.x, y: plane.y })

            return;

        }

        const changeX = (totalDx/totalDistance || 0) * factor * plane.steps //* (curveFactorX);
        const changeY = (totalDy/totalDistance || 0) * factor * plane.steps //* (curveFactorY);
        plane.baseX += changeX;
        plane.baseY += changeY;

        
        if(!plane.lastTarget.curve){
            plane.x = plane.baseX;
            plane.y = plane.baseY;
        } else{
            const curveFactor = cubicCurve(distance/totalDistance);

            // console.log(distanceRatio, factor, linearDistanceCovered/totalDistance);


            plane.x = quadraticBezier(distanceRatio, plane.lastTarget.x, controlPoint.x, plane.target.x);
            plane.y = quadraticBezier(distanceRatio, plane.lastTarget.y, controlPoint.y, plane.target.y);

            // console.log(curveFactor);
        }

        linearDistanceCovered += plane.steps;
        // console.log()
    }, plane.speed)


}

const setNextPoint = (target) => {

    plane.baseX = plane.x;
    plane.baseY = plane.y;
    plane.lastTarget = {...plane.target, ...{x: plane.x, y: plane.y}};
    console.log('At Set point: ', plane.lastTarget)
    // plane.lastTarget = plane.target;
    
    if(target){
        plane.target = target;
    } else{
        if(plane.target.name === "A"){
            plane.target = points.B
        }
        if(plane.target.name === "B"){
            plane.target = points.D
        } else if(plane.target.name === "C"){
            plane.target = points.D
        } else if(plane.target.name === "D"){
            plane.target = points.B
        }
    }

    moveToNewPoint();
}

function flyPlane(){
    moveToNewPoint();
}

// flyPlane();


function flyAway(){
    clearInterval(interval);
    console.log(plane.x, plane.y);
    plane.steps = 50;
    plane.gone = true;
    setNextPoint(points.EXIT);
}

function resetPlane(){
    plane.x = 0 + padding;
    plane.y = canvas.height - padding;
    plane.baseX = 0 + padding;
    plane.baseY = canvas.height - padding;
    plane.lastTarget = points.A;
    plane.target = points.B;
    plane.gone = false;
    plane.steps = 1;
    // moveToNewPoint();
}