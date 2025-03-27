function setup() {
  //creates a canvas 600 pixels wide
  //and 400 pixels high
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255, 246, 211);

  // params
  let numberOfDots = 100;
  let height = windowHeight / 2;
  let diameter = 5;
  let accel = 0.01;
  let amplitude = 40;
  textSize(32);

  // draw dots
  for (let i = 0; i <= numberOfDots; i++) {
    // point 1 for line
    let x = windowWidth / numberOfDots * i;
    let sinValue = sin((frameCount + x) * accel) * amplitude;

    // point 2 for line
    let x1 = windowWidth / numberOfDots * (i + 1);
    let sinValue1 = sin((frameCount + x1) * accel) * amplitude;

    // draw wave
    // draw dots
    fill("black");
    strokeWeight(3);
    circle(x, height + sinValue, diameter);

    // draw line
    // strokeWeight(6);
    // line(x, height + sinValue, x1, height + sinValue1);
  }
}