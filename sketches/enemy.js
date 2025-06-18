let enemy = {
  makeEnemy: function (x, y, speed) {
    this.position = createVector(x, y);
    this.speed = speed;
    this.color = 'red';
  },
  render: function () {
    noStroke();
    fill(this.color);
    ellipse(this.position.x, this.position.y, 25);
  },
  update: function () {
    this.position.x -= this.speed;
  },
};
