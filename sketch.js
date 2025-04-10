let numberOfDots;
let diameter = 5;
let waveAccel = 0.01;
let amplitude = 50;
let dotDivisor = 25;
let heightDivisor = 1.5;
let boatWidth = 100;
let boatHeight = 100;
let boatSpeed = 1;
let boatStartOffset = boatWidth / 2 + 30;
let boatEndOffset = (boatWidth / 2) + 15;
let boatX = -boatStartOffset;
let boatMinPitch = -0.55;
let boatMaxPitch = 0.55;
let height;
let dotArr;

// Todo make the wave interactible?
// Todo make the rotation of the boat dependent on the nearest set of points?
// Todo make the amplitude vary over time, which means you need to track the amplitude of individual dots
// Todo make the boat accel and decel based of a wave instead of linear
// Todo add delta time
// Todo transition isn't very smooth at start of screen when screen size is smaller
// Todo add purple cupo at bottom of boat
// Todo make flag flap around in the wind
// Todo Make a little wave inside the cup that you can only see when the boat is at a certain angle (on the way down)
// Todo make it interactible by trying to send little particles to land inside the cup, and you get more points based on the distance traveled
function init() {
  createCanvas(windowWidth, windowHeight);
  height = windowHeight / heightDivisor;
  numberOfDots = floor(windowWidth / dotDivisor);
  dotArr = createDotArr(numberOfDots, height, diameter);
}

function draw() {
  background(255, 246, 211);

  // dots(dotArr);

  // Manage boat x to wrap
  boatX = boatX + boatSpeed;
  if (boatX >= windowWidth + boatEndOffset) {
    boatX = -boatStartOffset;
  }

  wave(dotArr, waveAccel, amplitude);
  boat(boatX, height, boatWidth, boatHeight, waveAccel, amplitude);
}

function boat(x, y, width, height, waveAccel, amplitude) { 
  // vars
  let sinHeight = sin((frameCount + x) * waveAccel) * amplitude;
  let localHeight = -50;
  let sinRotate = sin(((frameCount + x) * waveAccel) + PI / 2);
  let sinRotateNorm = map(sinRotate, -1, 1, boatMinPitch, boatMaxPitch);
  if (sinRotateNorm < 0) {
    boatSpeed = max(0.4, boatSpeed - waveAccel * 1.4);
  } else if (sinRotateNorm > 0) {  
    boatSpeed = min(2, boatSpeed + waveAccel * 1.4);
  };

  push();
    // Translate the origin to the center of the semicircle
    translate(x, y + sinHeight);

    // Rotate boat
    rotate(sinRotateNorm);

    // Set pencil
    fill(255, 246, 211);
    stroke(0);
    strokeWeight(2);

    // Draw the flag pole
    // Far pole
    line(width / 2, -50, width / 2, -80);
    // Near pole
    line(width / 2 - 5, -50 + map(sinRotate, -1, 1, 0, -5), width / 2 - 5, -100);

    // Draw the cup hull
    arc(0, localHeight, width, height, 0, PI);
    // Top lip
    arc(0, localHeight, width, (height / 8) + sinRotate * 15, PI, 0);
    // Bottom lip
    noFill()
    arc(0, localHeight, width, (height / 8) + sinRotate * 15, 0, PI);

    // Draw the flag
    translate(width / 2, -80);
    fill(255, 246, 211);
    // Back flag
    line(-35, -20, 0, -25);
    // Front flag
    triangle(0, 0, 0, -25, -35, -15);
    // Connecting line
    line(-35, -20, -35, -15);

    // Attempt at waving flag
    // triangle(0, 0, 0, -25, -35 + map(noise(frameCount * 0.015), 0, 1, -20, 20), -15 + map(noise(frameCount * 0.015), 0, 1, -20, 20));
  pop();
}

function createDotArr(numberOfDots, y, diameter) {
  let dotArr = [];

  for (let i = 0; i <= numberOfDots + 1; i++) {
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