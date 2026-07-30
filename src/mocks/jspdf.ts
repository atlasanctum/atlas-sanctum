
// Temporary mock for jspdf to avoid installation issues
class MockJsPDF {
  private doc: any;

  constructor() {
    this.doc = {};
  }

  setFontSize(size: number) {
    return this;
  }

  setTextColor(r: number, g: number, b: number) {
    return this;
  }

  text(text: string, x: number, y: number) {
    return this;
  }

  setFillColor(r: number, g: number, b: number) {
    return this;
  }

  rect(x: number, y: number, width: number, height: number, style: string) {
    return this;
  }

  setDrawColor(r: number, g: number, b: number) {
    return this;
  }

  line(x1: number, y1: number, x2: number, y2: number) {
    return this;
  }

  save(filename: string) {
    // Mock save functionality
    console.log(`Saving PDF: ${filename}`);
  }
}

export default MockJsPDF;
