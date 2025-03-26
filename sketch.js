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
  let dotSize = 5;

  // draw dots
  for (let i = 0; i <= numberOfDots; i++) {
    let x = windowWidth / numberOfDots * i;
    fill("black");
    circle(x, height, dotSize);
  }
}