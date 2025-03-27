let numberOfDots;
let diameter = 8;
let accel = 0.01;
let amplitude = 40;
let dotDivisor = 50
let heightDivisor = 2;
let height;
let dotArr;

function init() {
  createCanvas(windowWidth, windowHeight);
  height = windowHeight / heightDivisor;
  numberOfDots = floor(windowWidth / dotDivisor);
  dotArr = createDotArr(numberOfDots, height, diameter);
}

function draw() {
  background(255, 246, 211);

  dots(dotArr);
  wave(dotArr, accel, amplitude);
}

function createDotArr(numberOfDots, height, diameter) {
  let dotArr = [];

  for (let i = 0; i <= numberOfDots; i++) {
    let x = windowWidth / numberOfDots * i;
    dotArr.push({"x" : x, "h" : height, "d" : diameter});
  }

  return dotArr;
}

function dots(dotArr) {
  for (let dot of dotArr) {
    fill("white");
    strokeWeight(2);
    circle(dot.x, dot.h, dot.d);
  }
}

function wave(dotArr, accel, amplitude) {
  for (let i = 0; i < dotArr.length - 1; i++) {
    let dot = dotArr[i];

    // point 1 for line
    let sinValue = sin((frameCount + dot.x) * accel) * amplitude;

    // point 2 for line
    let x1 = windowWidth / numberOfDots * (i + 1);
    let sinValue1 = sin((frameCount + x1) * accel) * amplitude;

    // draw dots
    fill("black");
    strokeWeight(2);
    circle(dot.x, dot.h + sinValue, dot.d);

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