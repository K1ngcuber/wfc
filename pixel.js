class Pixel {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  //override equals
  equals(other) {
    return this.colourDistance(other) < 50;
  }

  colourDistance(other) {
    const rmean = (this.r + other.r) / 2;
    const r = this.r - other.r;
    const g = this.g - other.g;
    const b = this.b - other.b;
    return Math.sqrt(
      (((512 + rmean) * r * r) >> 8) +
        4 * g * g +
        (((767 - rmean) * b * b) >> 8)
    );
  }
}
