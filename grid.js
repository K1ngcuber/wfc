class Grid {
  constructor(dimensions, options) {
    this.cells = [];
    this.tiles = options;
    this.dimensions = dimensions;
    for (let i = 0; i < dimensions * dimensions; i++) {
      this.cells.push(
        new Cell(i % dimensions, Math.floor(i / dimensions), options)
      );
    }
  }

  getNext() {
    let grid = this.cells.slice().filter((x) => !x.collapsed);

    grid.sort((a, b) => a.options.length - b.options.length);

    const length = grid[0]?.options.length;
    grid = grid.filter((x) => x.options.length === length);

    return random(grid);
  }

  getNeighbors(x, y) {
    let above, below, left, right;

    if (y > 0) {
      above = this.cells[x + (y - 1) * this.dimensions];
    }
    if (y < this.dimensions - 1) {
      below = this.cells[x + (y + 1) * this.dimensions];
    }
    if (x > 0) {
      left = this.cells[x - 1 + y * this.dimensions];
    }
    if (x < this.dimensions - 1) {
      right = this.cells[x + 1 + y * this.dimensions];
    }

    return { above, below, left, right };
  }

  evaluate() {
    const cells = this.cells.filter((x) => !x.collapsed).slice();

    cells.forEach((cell) => {
      const { above, below, left, right } = this.getNeighbors(cell.x, cell.y);

      const valid = this.tiles.slice();

      if (above) {
        let validOptions = [];
        for (let option of above.options) {
          let valid = option.validDown;
          validOptions = validOptions.concat(valid);
        }
        this.checkValid(valid, validOptions);
      }
      if (below) {
        let validOptions = [];
        for (let option of below.options) {
          let valid = option.validUp;
          validOptions = validOptions.concat(valid);
        }
        this.checkValid(valid, validOptions);
      }
      if (left) {
        let validOptions = [];
        for (let option of left.options) {
          let valid = option.validRight;
          validOptions = validOptions.concat(valid);
        }
        this.checkValid(valid, validOptions);
      }
      if (right) {
        let validOptions = [];
        for (let option of right.options) {
          let valid = option.validLeft;
          validOptions = validOptions.concat(valid);
        }
        this.checkValid(valid, validOptions);
      }

      cell.options = valid;
      if (cell.options == 1) {
        cell.pickOption();
      }
    });
  }

  checkValid(arr, valid) {
    for (let i = arr.length - 1; i >= 0; i--) {
      let element = arr[i];
      if (!valid.includes(element)) {
        arr.splice(i, 1);
      }
    }
  }

  rewind() {
    const stuckCells = this.cells.filter((x) => x.options.length === 0);
    stuckCells.map((cell) => {
      this.resetCells(cell, true);
    });
  }

  resetCells(cell, ripple) {
    //get neighbors
    const neighbors = this.getNeighbors(cell.x, cell.y);

    //reset cell
    cell.options = this.tiles;
    cell.collapsed = false;
    cell.tile = undefined;

    //reset neighbors
    Object.keys(neighbors).forEach((key) => {
      if (neighbors[key]) {
        neighbors[key].options = this.tiles;
        neighbors[key].collapsed = false;
        neighbors[key].tile = undefined;
        if (ripple) {
          this.resetCells(neighbors[key]);
        }
      }
    });
  }
}
