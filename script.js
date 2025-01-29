let cols;
let rows;
const LENGTH = 5; // Size of square
let xoff = 0;
let yoff = 0;
let zoff = 0;
const NOISE_GRADIENT = 0.1; // Gradient of flow change
const BOOST_RADIUS = 40; // Radius of effect
const NOISE_SPEED = 0.0001; // Rate of noise increase
const SQUARE_SIZE_FACTOR = 1.3;
const MOUSE_SENSITIVITY = 0.5;
const DECAY_RATE = 0.95; // Rate at which the trail fades (closer to 1 = slower fade)
let trail; // Stores lingering influence values

function setup() {
  const canvas = createCanvas(800, 400);
  rectMode(CENTER);
  canvas.parent("p5-container");

  cols = width / LENGTH;
  rows = height / LENGTH;

  // Initialize the trail array with zeros
  trail = new Array(cols).fill().map(() => new Array(rows).fill(0));
}

function draw() {
  background(1000);
  xoff = 0;

  for (let i = 0; i < cols; i++) {
    yoff = 0;
    for (let j = 0; j < rows; j++) {
      const centerX = LENGTH / 2 + i * LENGTH;
      const centerY = LENGTH / 2 + j * LENGTH;

      // Calculate distance to mouse
      const d = dist(mouseX, mouseY, centerX, centerY);

      // Calculate boost factor for mouse interaction
      let boost = 0;
      if (d < BOOST_RADIUS) {
        boost = map(d, 0, BOOST_RADIUS, 1, 0);
      }

      // Blend the new boost with previous influence for a smooth trail
      trail[i][j] = max(trail[i][j] * DECAY_RATE, boost);

      const baseSize = map(
        noise(xoff, yoff, zoff),
        0,
        1,
        0,
        LENGTH * SQUARE_SIZE_FACTOR
      );
      const size = baseSize + trail[i][j] * LENGTH * MOUSE_SENSITIVITY;

      // Map size to a color gradient
      const colorValue = map(size, 0, LENGTH * 1.8, 0, 255);
      squareColor = color(colorValue, 50, 255 - colorValue);

      // Draw the square
      fill(squareColor);
      noStroke();
      rect(centerX, centerY, size);

      yoff += NOISE_GRADIENT;
    }
    xoff += NOISE_GRADIENT;
    zoff += NOISE_SPEED;
  }
}
