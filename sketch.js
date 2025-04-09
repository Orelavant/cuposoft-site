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

  // dots(dotArr);
  var x = dotArr[floor(dotArr.length / 2)].x;
  var y = dotArr[floor(dotArr.length / 2)].y;
  semicircle(x, y, 100, 100, accel, amplitude);
  wave(dotArr, accel, amplitude);
}

function flag() {
  // A triangle flag pointing to the left hanging on the top of a pole
  fill(255, 246, 211);
  stroke(0);
  strokeWeight(2);
  triangle(windowWidth / 2 - 50, windowHeight / 2 - 25, windowWidth / 2 - 50, windowHeight / 2 + 25, windowWidth / 2 - 100, windowHeight / 2);
}

function semicircle(x, y, width, height, accel, amplitude) { 
  fill(255, 246, 211);
  stroke(0);
  strokeWeight(2);
  push();
    // Translate the origin to the center of the semicircle
    translate(x, y);

    // Apply rotation
    rotate(sin(frameCount * accel)) * amplitude;

    // Draw the semicircle and line relative to the new origin
    arc(0, 0, width, height, 0, PI);
    line(-width / 2, 0, width / 2, 0);
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