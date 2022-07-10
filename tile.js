class Tile {
  constructor(img, tiles) {
    this.img = img;
    this.width = this.img.width;
    this.height = this.img.height;

    this.validUp = [];
    this.validDown = [];
    this.validLeft = [];
    this.validRight = [];

    this.edges = [];

    this.processTile();
  }

  edgesMatch(other, direction) {
    let matches = true;
    this.edges[direction].map((point, index) => {
      if (!other.edges[(direction + 2) % 4][index].equals(point)) {
        matches = false;
        return;
      }
    });

    return matches;
  }

  analyze(otherTiles) {
    otherTiles.map((otherTile) => {
      if (this.edgesMatch(otherTile, UP)) {
        this.validUp.push(otherTile);
      }
      if (this.edgesMatch(otherTile, DOWN)) {
        this.validDown.push(otherTile);
      }
      if (this.edgesMatch(otherTile, LEFT)) {
        this.validLeft.push(otherTile);
      }
      if (this.edgesMatch(otherTile, RIGHT)) {
        this.validRight.push(otherTile);
      }
    });
  }

  processTile() {
    this.img.loadPixels();

    const edges = [[], [], [], []];

    for (var y = 0; y < this.height; y += PIXELSKIP) {
      edges[LEFT].push(this.getPixel(0, y));
      edges[RIGHT].push(this.getPixel(this.width - 1, y));
    }

    for (var x = 0; x < this.width; x += PIXELSKIP) {
      edges[UP].push(this.getPixel(x, 0));
      edges[DOWN].push(this.getPixel(x, this.height - 1));
    }

    this.edges = edges;
  }

  getPixel(x, y) {
    const index = (x + y * this.width) * 4;
    const r = this.img.pixels[index];
    const g = this.img.pixels[index + 1];
    const b = this.img.pixels[index + 2];
    return new Pixel(r, g, b);
  }

  rotate(amount) {
    const newImg = createGraphics(this.width, this.height);
    newImg.imageMode(CENTER);
    newImg.pixelDensity(1);
    newImg.translate(this.width / 2, this.height / 2);
    newImg.rotate(HALF_PI * amount);
    newImg.image(this.img, 0, 0);
    newImg.loadPixels();

    if (this.img.pixels.toString() === newImg.pixels.toString()) {
      return false;
    }

    return new Tile(newImg);
  }

  draw(x, y) {
    image(this.img, x * IMAGESIZE, y * IMAGESIZE, IMAGESIZE, IMAGESIZE);
  }
}
