const tiles = [];
const tileSet = [];
const DIM = 30;
let grid = {};

function preload() {
  //load all tiles
  for (let i = 0; i < 13; i++) {
    tiles[i] = loadImage(`tiles/circuit/${i}.png`);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  //Create tileset with processed edges

  tiles.map((tileImage) => {
    const tile = new Tile(tileImage);
    tileSet.push(tile);
    for (let i = 1; i < 4; i++) {
      const t = tile.rotate(i);

      if (t) {
        tileSet.push(t);
      }
    }
  });

  tileSet.map((tile) => tile.analyze(tileSet));

  grid = new Grid(DIM, tileSet.slice());
}

function draw() {
  translate(
    width / 2 - (DIM * IMAGESIZE) / 2,
    height / 2 - (DIM * IMAGESIZE) / 2
  );

  let cell = grid.getNext();

  let tile = undefined;
  //finished
  if (cell === undefined) {
    noLoop();
    return;
  }

  if (cell.options.length === 0) {
    //backtrack
    console.log("rewind");
    grid.rewind();
  } else {
    tile = cell.pickOption();
  }

  grid.cells.map((cell) => cell.draw());
  grid.evaluate();

  //noLoop();
}

function mouseClicked() {
  redraw();
}
