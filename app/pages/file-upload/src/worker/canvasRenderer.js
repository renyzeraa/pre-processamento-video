export default class CanvasRenderer {
  #canvas
  #ctx
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas){
    this.#canvas = canvas;
    this.#ctx = canvas.getContext("2d");
  }

  /** @param {VideoFrame} frame */
  draw(frame) {
    const {displayHeight, displayWidth } = frame;
    this.#canvas.width = displayWidth;
    this.#canvas.height = displayHeight;
    this.#ctx.drawImage(
      frame,
      0,
      0,
      displayWidth,
      displayHeight
    )
    frame.close();
  }

  getRenderer() {
    const renderer = this;
    let pendingFrame = null;

    return frame => {
      const renderAnimationFrame = () => {
        renderer.draw(pendingFrame);
        pendingFrame = null;
      }
      if(!pendingFrame){
        requestAnimationFrame(renderAnimationFrame);
      }
      else {
        pendingFrame.close();  
      }

      pendingFrame = frame;
    }
  }
}