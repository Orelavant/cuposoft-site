let numberOfDots;
let diameter = 5;
let waveAccel = 0.01;
let amplitude = 50;
let smallAmplitude = 10;
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
let boatTopOffset = -50;
let boatYSinOffset;
let flagNoiseXOff;
let flagNoiseYOff;
let height;
let dotArr;
let releasedBoats = [];
let boatBoats = [];
let gravity = 0.2;
let beige;

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
// Todo cleanup code (make boat drawing more modular)
// Todo make the small boat rotate in the y direction as well
// Todo make it easier to give speed for boats (based on dt instead of frames)
// Todo make boat mantain the rotation it had when you sent it
// Todo make the boats travel a lot more slowly in the water
// Todo if released in the water, the boats should float to the top
// Todo make boat accelerate towards mouse instead of sticking on mouse
// Todo make the boats that collide with big boat shrink even more, and bob along a wave that's inside the cup
// Todo small boats should calculate their own small sin rotate norm so that they rotate independent of the big waves
// Todo replace the cursor with wind particles
// Todo make a progress bar that connects between the wave dots based off of how far the small boat traveled before landing in the big boat - once it fills up, a game icon pops out of the boat, that links to an itch.io game
// Todo make clouds or wind pass by that you the small boats can also land on
// Todo improve the rotation and xOffset of the small boats inside the big boat
// Todo improve the transition between released boat and boat boat so it's more smooth (lerp to target position)
// Todo make boats not lie on top of each other when in big boat
// Todo make the sin motion of the small boats inside the big boat more wave like
function init() {
  createCanvas(windowWidth, windowHeight);
  height = windowHeight / heightDivisor;
  numberOfDots = floor(windowWidth / dotDivisor);
  dotArr = createDotArr(numberOfDots, height, diameter);
  flagNoiseXOff = random(10000);
  flagNoiseYOff = random(10000);
  beige = color(255, 246, 211);
}

function draw() {
  background(beige);

  // Draw wave
  wave(dotArr, waveAccel, amplitude);

  // Manage boat x to wrap
  boatX = boatX + boatSpeed;
  if (boatX >= windowWidth + boatEndOffset) {
    boatX = -boatStartOffset;
  }

  boatYSinOffset = sin((frameCount + boatX) * waveAccel) * amplitude;

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
      drawSmallBoat(boatWidth, boatHeight, 0.25);
    pop();
  }

  // Draw big boat
  let sinRotate = sin(((frameCount + boatX) * waveAccel) + PI / 2);
  drawBigBoat(boatX, height, boatWidth, boatHeight, sinRotate);

  // Draw boats that have been released
  drawReleasedBoats();

}

function drawReleasedBoats() {
  // Draw released small boats
  for (let i = 0; i < releasedBoats.length; i++) {
    let smallBoat = releasedBoats[i];

    // Update speed with gravity
    smallBoat.ySpeed += gravity;
  
    // Update position
    smallBoat.x += smallBoat.xSpeed;
    smallBoat.y += smallBoat.ySpeed;

    // Draw the small boat
    push();
      translate(smallBoat.x, smallBoat.y);
      rotate(smallBoat.rotation);
      drawSmallBoat(boatWidth, boatHeight, 0.25);
    pop();

    // Remove small boat if it goes off screen
    if (smallBoat.x > windowWidth + boatEndOffset || smallBoat.y > windowHeight + boatEndOffset) {
      releasedBoats.splice(i, 1);
      i--;
    }

    // If small boat collides with big boat, the small boat should then move alongside the big boat
    if (
      smallBoat.x + ((boatWidth * smallBoatScalar) / 2) > boatX - (boatWidth / 2) 
      && smallBoat.x - ((boatWidth * smallBoatScalar) / 2) < boatX + (boatWidth / 2) 
      && smallBoat.y > height + boatYSinOffset + boatTopOffset + -30
      && smallBoat.y < height + boatYSinOffset + boatTopOffset + 30
    ) {
      smallBoat.xSpeed = boatSpeed;
      smallBoat.ySpeed = 0;
      
      // Add to boat boats
      boatBoats.push(smallBoat);

      // Remove from released boats
      releasedBoats.splice(i, 1);
      i--;
    }
  }
}

function drawBoatBoats() {
  for (let i = 0; i < boatBoats.length; i++) {
    let smallBoat = boatBoats[i];

    // Update rotation
    let sinOffset = sin((frameCount + smallBoat.x) * 0.02) * smallAmplitude;
    let xSinOffset = map(sinOffset, -1, 1, 7, 12);
    let ySinOffset = sin((frameCount + smallBoat.x) * 0.02) * smallAmplitude;
    let sinRotate = sin(((frameCount + smallBoat.x) * 0.02) + PI / 2);
    let sinRotateNorm = map(sinRotate, -1, 1, boatMinPitch, boatMaxPitch);
    smallBoat.rotation = sinRotateNorm;

    // Draw the small boat
    push();
      // Update position
      translate(xSinOffset, ySinOffset + boatTopOffset - 20);

      rotate(smallBoat.rotation);

      drawSmallBoat(boatWidth, boatHeight, sinRotate);
    pop();
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
  releasedBoats.push(boat);
}


function drawSmallBoat(width, height, sinRotate) {
  push();
    // Offset from mouse so that the mouse is at the flag point
    scale(smallBoatScalar);
    translate(-50, 60);

    // Set pencil
    fill(beige);
    strokeWeight(4);
    stroke(0);

    // Draw the flag pole
    // Far pole
    line(width / 2, -50, width / 2, 0);
    // Near pole
    line(width / 2 - 5, -50 + map(sinRotate, -1, 1, 0, -5), width / 2 - 5, 0);

    // Draw the cup hull
    arc(0, 0, width, height, 0, PI);
    // Top lip
    arc(0, 0, width, (height / 8) + sinRotate * 15, PI, 0);
    // Bottom lip
    arc(0, 0, width, (height / 8) + sinRotate * 15, 0, PI);

    // Draw the flag
    push();
      translate(width / 2, -35);
      fill(beige);

      // Back flag
      line(-35, -20, 0, -25);
      // Front flag
      triangle(0, 0, 0, -25, -35,  -15);
      // Connecting line
      line(-35, -20, -36, -15);
    pop();
  pop();
}

function drawBigBoat(x, y, width, height, sinRotate) { 
  // Rotation
  let sinRotateNorm = map(sinRotate, -1, 1, boatMinPitch, boatMaxPitch);
  if (sinRotateNorm < 0) {
    boatSpeed = max(0.2, boatSpeed - waveAccel * 1.5);
  } else if (sinRotateNorm > 0) {  
    boatSpeed = min(2, boatSpeed + waveAccel * 1.4);
  };

  push();
    // Translate the origin to the center of the semicircle
    translate(x, y + boatYSinOffset);

    // Rotate boat
    rotate(sinRotateNorm);

    // Set pencil
    fill(beige);
    stroke(0);
    strokeWeight(2);

    // Draw the flag pole
    // Far pole
    line(width / 2, -50, width / 2, -80);
    // Near pole
    line(width / 2 - 5, -50 + map(sinRotate, -1, 1, 0, -5), width / 2 - 5, -100);

    // Draw the cup hull
    noFill();

    // Top lip
    arc(0, boatTopOffset, width, (height / 8) + sinRotate * 15, PI, 0);

    // Draw boats inside this boat here
    drawBoatBoats();

    // Fill space between hull bottom and bottom lip
    drawFilledArcSpace(0, boatTopOffset, width, height, (height / 8) + sinRotate * 15, 0, PI, beige);
    // Hull bottom
    arc(0, boatTopOffset, width, height, 0, PI);
    // Bottom lip
    arc(0, boatTopOffset, width, (height / 8) + sinRotate * 15, 0, PI);

    fill(beige);

    // Draw the flag
    push();
      translate(width / 2, -80);
      flagNoiseXOff += 0.01;
      flagNoiseYOff += 0.01;
      fill(beige);

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

function drawFilledArcSpace(x, y, width, height, innerHeight, startAngle, endAngle, color) {
  push();
    translate(x, y);

    // Begin custom shape
    beginShape();
    noStroke();
    fill(color); // Example fill color

    // Add vertices for the outer arc
    for (let angle = startAngle; angle <= endAngle; angle += 0.1) {
      let outerX = cos(angle) * (width / 2);
      let outerY = sin(angle) * (height / 2);
      vertex(outerX, outerY);
    }

    // Add vertices for the inner arc (in reverse order)
    for (let angle = endAngle; angle >= startAngle; angle -= 0.1) {
      let innerX = cos(angle) * (width / 2);
      let innerY = sin(angle) * (innerHeight / 2);
      vertex(innerX, innerY);
    }

    endShape(CLOSE); // Close the shape
  pop();
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