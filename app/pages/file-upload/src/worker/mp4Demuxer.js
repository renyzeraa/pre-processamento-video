import { createFile } from '../deps/mp4box.0.5.2.js'

export default class Mp4Demuxer {
  #onConfig;
  #onChunk;
  #file
 /**
   * @param {ReadableStream} stream 
   * @param {object} options
   * @param {(config: object) => void} options.onConfig
   * 
   * @returns {Promise<void>}
   */
  async run(stream, { onConfig, onChunk}){
    this.#onConfig = onConfig;
    this.#onChunk  = onChunk;

    this.#file     = createFile();
    this.#file.onReady = (args) => {
      debugger
    }

    this.#file.onError = (error) => {
      console.log('deu ruim Mp4Demuxer', error);
    }

    return this.#init(stream);
  }

  /**
   * @param {ReadableStream} stream 
   * @returns Promise<void>
   */
  #init(stream) {
    const consumeFile = new WritableStream({
      /** @param {Uint8Array} chunk */
      write: (chunk) => {
        debugger;
      },
      close: () => {
        debugger;
      }
    })
    return stream.pipeTo(consumeFile);
  }
}