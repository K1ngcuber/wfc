class Cell {
  constructor(x, y, options) {
    this.options = options.slice();
    this.collapsed = false;
    this.tile = undefined;
    this.x = x;
    this.y = y;
  }

  pickOption = () => {
    this.tile = random(this.options);
    this.options = [this.tile];

    this.collapsed = true;
    return this.tile;
  };

  draw() {
    if (this.tile) {
      this.tile.draw(this.x, this.y);
    } else {
      // rect(10 * this.x, 10 * this.y, 10, 10);
    }
  }
}
