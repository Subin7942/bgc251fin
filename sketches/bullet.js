let bullet = {
  makeBullet: function (x, y, speed) {
    this.position = createVector(x, y);
    this.speed = speed;
  },
  update: function () {
    this.position.x += this.speed;
  },
  render: function () {
    stroke('white');
    strokeWeight(2);
    fill('yellow');
    ellipse(this.position.x, this.position.y, 10, 10);
  },
};
