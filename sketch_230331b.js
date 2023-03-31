// Adrien Fournier
// Pascal Huynh
// 502-A22-LA WEB AND FX: FROM THEORY TO PRACTICE
// YOU ARE A CLOUD!!!
// https://openprocessing.org/sketch/1884592 
/* (Instruction) 

Basically, you are a cloud. However, you might wonder what a cloud does? 
Well, a cloud simply moves around! Do so by moving your mouse.
Be carefull, pressing the space bar will lower the pressure, making you less and less dense! 
You can also press left clic to express you joy, you will see it's fun!*/

/* (Analysis/artist statement) 

You are a cloud; Having a meaning is pointless, you don't even have any obligations or goals. There is nothing more to it.
You move around and simply live your dumb cloud life. However, don’t worry, it gets kind of fun.*/

let numOfCircles = 300;
let circles = [];
let opacity = 50;

function setup() {
  createCanvas(800, 800);
  for (let i = 0; i < numOfCircles; i++) {
    circles.push(new Circle(random(width), random(height), random(20, 50), i));
  }
}

function draw() {
  background(248, 200, 220);
  for (let i = 0; i < numOfCircles; i++) {
    circles[i].update();
    circles[i].display();
  }
  
  textSize(30);
  textAlign(CENTER, CENTER);
  fill(248, 200, 220);
  text("YOU ARE A CLOUD...                            Nothing more to it...", width/2, height/2);
}  

class Circle {
  constructor(x, y, size, id) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.size = size;
    this.maxSpeed = 10;
    this.maxForce = 0.2;
    this.id = id;
  }

  /* This calculates the steering force needed for the circle to follow the mouse cursor and avoid colliding with other circles, 
  updates its velocity and position accordingly, and resets its acceleration. */
  update() {
    if (!mouseIsPressed || mouseButton !== LEFT) {
      let mouse = createVector(mouseX, mouseY);
      let steering = this.follow(mouse);
      this.acc.add(steering);
    }  
    let mouse = createVector(mouseX, mouseY);
    let steering = this.follow(mouse);
    this.acc.add(steering);
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    for (let i = 0; i < numOfCircles; i++) {
      if (i !== this.id) {
        let otherCircle = circles[i];
        let distance = p5.Vector.dist(this.pos, otherCircle.pos);
        let sumRadii = this.size / 2 + otherCircle.size / 2;
        if (distance < sumRadii) {
          let repulsionForce = p5.Vector.sub(this.pos, otherCircle.pos);
          repulsionForce.setMag(this.maxForce);
          this.acc.add(repulsionForce);
        }
      }
    }
  }

  /* This calculates the desired velocity vector to move towards the target 
  and limits the speed accordingto the distance between the circle and the target. */
  follow(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let distance = desired.mag();
    let speed = this.maxSpeed;
    if (distance < 100) {
      speed = map(distance, 0, 100, 0, this.maxSpeed);
    }
    desired.setMag(speed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  // This draws the circles of the cloud.
  display() {
    noStroke();
    fill(50, 205, 50, opacity);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

function keyPressed() {
  if (keyCode === 32) { // Space bar key
    opacity -= 1;
    if (opacity < 0) {
      opacity = 0;
    }
  }
}
