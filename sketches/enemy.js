let enemy = {
  makeEnemy: function (x, y, speed, size) {
    this.position = createVector(x, y);
    this.speed = speed;
    this.color = 'red';
    this.size = size;
  },
  render: function () {
    noStroke();
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.size, this.size);
  },
  update: function () {
    this.position.x -= this.speed;
  },
};
