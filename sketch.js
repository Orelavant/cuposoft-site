let numberOfDots;
let diameter = 5;
let waveAccel = 0.01;
let amplitude = 50;
let dotDivisor = 25;
let heightDivisor = 1.5;
let boatWidth = 100;
let boatHeight = 100;
let boatSpeed = 1;
let boatStartOffset = (boatWidth / 2) + 15;
let boatEndOffset = (boatWidth / 2) + 15;
let boatX = -boatStartOffset;
let boatMinPitch = -0.55;
let boatMaxPitch = 0.55;
let smallBoatScalar = 0.3;
let currentRotation = 0;
let flagNoiseXOff;
let flagNoiseYOff;
let height;
let dotArr;
let smallBoatArr = [];
let gravity = 0.2;
// let friction;
// let frictionRate = 10;

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
// Todo the particles could stay inside and splash around inside the cup
// The particles you throw could be minuature boats, and if they don't make it inside the cup, they sink down and dissapear offscreen
// Todo the start and end of the screen for the wave should smoothly transition into one another
// Todo cleanup code (make boat drawing 1 function)
// Todo make the small boat rotate in the y direction as well
// Todo make it easier to give speed for boats (based on dt instead of frames)
// Todo make boat mantain the rotation it had when you sent it
// Todo make the boats travel a lot more slowly in the water
function init() {
  createCanvas(windowWidth, windowHeight);
  height = windowHeight / heightDivisor;
  numberOfDots = floor(windowWidth / dotDivisor);
  dotArr = createDotArr(numberOfDots, height, diameter);
  flagNoiseXOff = random(10000);
  flagNoiseYOff = random(10000);
}

function draw() {
  background(255, 246, 211);

  // Draw wave
  wave(dotArr, waveAccel, amplitude);

  // Manage boat x to wrap
  boatX = boatX + boatSpeed;
  if (boatX >= windowWidth + boatEndOffset) {
    boatX = -boatStartOffset;
  }

  // Draw big boat
  boat(boatX, height, boatWidth, boatHeight, waveAccel, amplitude);

  // Angle of small boat based on the diff between x positions
  let xDiff = mouseX - pmouseX
  let targetRotation = map(xDiff, -25, 25, -PI / 2, PI / 2)
  targetRotation = constrain(targetRotation, -PI / 2, PI / 2);

  // Draw small boat at cursor
  if (mouseIsPressed) {
    push();
      // Accelerate towards mouse position with defined speed
      translate(mouseX, mouseY);
      currentRotation = currentRotation + (targetRotation - currentRotation) * 0.1
      rotate(currentRotation);

      // Draw boat
      drawSmallBoat(boatWidth, boatHeight);
    pop();
  }

  // Draw released small boats
  for (let i = 0; i < smallBoatArr.length; i++) {
    let smallBoat = smallBoatArr[i];

    // Update speed with gravity
    smallBoat.ySpeed += gravity;
  
    // Update position
    smallBoat.x += smallBoat.xSpeed;
    smallBoat.y += smallBoat.ySpeed;

    // Debugging output
    print(`xSpeed: ${smallBoat.xSpeed}, ySpeed: ${smallBoat.ySpeed}, x: ${smallBoat.x}, y: ${smallBoat.y}`);
  
    // Draw the small boat
    push();
      translate(smallBoat.x, smallBoat.y);
      rotate(smallBoat.rotation);
      drawSmallBoat(boatWidth, boatHeight);
    pop();

    // Remove small boat if it goes off screen
    if (smallBoat.x > windowWidth + boatEndOffset || smallBoat.y > windowHeight + boatEndOffset) {
      smallBoatArr.splice(i, 1);
      i--;
    }

    // Remove small boat if it collides with the big boat
    if (smallBoat.x > boatX - boatStartOffset && smallBoat.x < boatX + boatWidth + boatEndOffset && smallBoat.y > height - boatHeight) {
      smallBoatArr.splice(i, 1);
      i--;
    }
  }
}

function mouseReleased() {
  // Send smallBoat flying based on the movement of the mouse
  let xDiff = mouseX - pmouseX
  let yDiff = mouseY - pmouseY
  let posDiff = sqrt(xDiff ** 2 + yDiff ** 2);
  let smallBoatSpeed = posDiff / 2;
  smallBoatSpeed = constrain(smallBoatSpeed, 0, 10);
  let angle = atan2(yDiff, xDiff);
  let xSpeed = cos(angle) * smallBoatSpeed;
  let ySpeed = sin(angle) * smallBoatSpeed;
  let rotation = 0;


  // Add small boat to array
  let boat = {"x": mouseX, "y": mouseY, "xSpeed": xSpeed, "ySpeed": ySpeed, "rotation": rotation};
  smallBoatArr.push(boat);
}


function drawSmallBoat(width, height) {
  push();
    // Offset from mouse so that the mouse is at the flag point
    scale(smallBoatScalar);
    translate(-50, 60);

    // Set pencil
    fill(255, 246, 211);
    strokeWeight(4);
    stroke(0);

    // Draw the flag pole
    // Far pole
    line(width / 2, -50, width / 2, 0);
    // Near pole
    line(width / 2 - 5, -50, width / 2 - 5, 0);

    // Draw the cup hull
    arc(0, 0, width, height, 0, PI);
    // Top lip
    arc(0, 0, width, (height / 8), PI, 0);
    // Bottom lip
    arc(0, 0, width, (height / 8), 0, PI);

    // Draw the flag
    push();
      translate(width / 2, -35);
      fill(255, 246, 211);

      // Back flag
      line(-35, -20, 0, -25);
      // Front flag
      triangle(0, 0, 0, -25, -35,  -15);
      // Connecting line
      line(-35, -20, -36, -15);
    pop();
  pop();
}

function boat(x, y, width, height, waveAccel, amplitude) { 
  // vars
  let sinHeight = sin((frameCount + x) * waveAccel) * amplitude;
  let localHeight = -50;
  let sinRotate = sin(((frameCount + x) * waveAccel) + PI / 2);
  let sinRotateNorm = map(sinRotate, -1, 1, boatMinPitch, boatMaxPitch);
  let flagXOff = map(noise(flagNoiseXOff), 0, 1, -3, 3); 
  let flagYOff = map(noise(flagNoiseYOff), 0, 1, -3, 3);
  if (sinRotateNorm < 0) {
    boatSpeed = max(0.2, boatSpeed - waveAccel * 1.5);
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
    arc(0, localHeight, width, (height / 8) + sinRotate * 15, 0, PI);

    // Draw the flag
    push();
      translate(width / 2, -80);
      flagNoiseXOff += 0.01;
      flagNoiseYOff += 0.01;
      fill(255, 246, 211);

      // Waving implementation
      // Back flag
      // line(-35 + flagXOff, -20 + flagYOff, 0, -25);
      // Front flag
      // triangle(0, 0, 0, -25, -35 + flagXOff, -15 + flagYOff);
      // Connecting line
      // line(-35 + flagXOff, -20 + flagYOff, -36 + flagXOff, -15 + flagYOff);

      // Back flag
      line(-35, -20, 0, -25);
      // Front flag
      triangle(0, 0, 0, -25, -35,  -15);
      // Connecting line
      line(-35, -20, -36, -15);
    pop();
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