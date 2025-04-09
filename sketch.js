let numberOfDots;
let diameter = 5;
let waveAccel = 0.01;
let amplitude = 50;
let dotDivisor = 25;
let heightDivisor = 2;
let boatAccel = 0.5;
let boatMinPitch = -0.5;
let boatMaxPitch = 0.5;
let height;
let dotArr;

// Todo make the wave interactible?
// Todo make the rotation of the boat dependent on the nearest set of points?
// Todo make the amplitude vary over time, which means you need to track the amplitude of individual dots
// Todo make the boat transition more seamless
// Todo make the boat slow down over humps and accelerate down the slope
function init() {
  createCanvas(windowWidth, windowHeight);
  height = windowHeight / heightDivisor;
  numberOfDots = floor(windowWidth / dotDivisor);
  dotArr = createDotArr(numberOfDots, height, diameter);
}

function draw() {
  background(255, 246, 211);

  // dots(dotArr);

  let x = frameCount * boatAccel;
  wave(dotArr, waveAccel, amplitude);
  boat(x, height, 100, 100, waveAccel, amplitude);
}

function flag() {
  // A triangle flag pointing to the left hanging on the top of a pole
  fill(255, 246, 211);
  stroke(0);
  strokeWeight(2);
  triangle(windowWidth / 2 - 50, windowHeight / 2 - 25, windowWidth / 2 - 50, windowHeight / 2 + 25, windowWidth / 2 - 100, windowHeight / 2);
}

function boat(x, y, width, height, waveAccel, amplitude) { 
  // vars
  let sinHeight = sin((frameCount + x) * waveAccel) * amplitude;
  let localHeight = -50;
  let sinRotate = sin(((frameCount + x)* waveAccel) + PI / 2);
  let sinRotateNorm = map(sinRotate, -1, 1, boatMinPitch, boatMaxPitch);

  push();
    // Translate the origin to the center of the semicircle
    translate(x, y + sinHeight);

    // Rotate boat
    rotate(sinRotateNorm);

    // Draw the hull
    fill(255, 246, 211);
    stroke(0);
    strokeWeight(2);
    arc(0, localHeight, width, height, 0, PI);
    line(-width / 2, localHeight, width / 2, localHeight);

    // Draw the flag pole

    // Draw the flag
  pop();
}

function createDotArr(numberOfDots, y, diameter) {
  let dotArr = [];

  for (let i = 0; i <= numberOfDots; i++) {
    let x = windowWidth / numberOfDots * i;
    dotArr.push({"x" : x, "y" : y, "d" : diameter});
  }

  return dotArr;
}

function dots(dotArr) {
  for (let dot of dotArr) {
    let c = color(0, 0, 0, 25);
    fill(c);
    noStroke();
    strokeWeight(2);
    circle(dot.x, dot.y, dot.d);
  }
}

function wave(dotArr, waveAccel, amplitude) {
  for (let i = 0; i < dotArr.length - 1; i++) {
    let dot = dotArr[i];

    // point 1 for line
    let sinValue = sin((frameCount + dot.x) * waveAccel) * amplitude;

    // point 2 for line
    let x1 = windowWidth / numberOfDots * (i + 1);
    let sinValue1 = sin((frameCount + x1) * waveAccel) * amplitude;

    // draw dots
    fill("black");
    noStroke();
    strokeWeight(2);
    circle(dot.x, dot.y + sinValue, dot.d);

    // draw line
    // strokeWeight(6);
    // line(x, height + sinValue, x1, height + sinValue1);
  }
}

function setup() {
  init();
}

function windowResized() {
  init();
}