export default class VideoProcessor {
  #mp4Demuxer;
  /**
   * 
   * @param {object} options
   * @param {import('./mp4Demuxer.js').default} options.mp4Demuxer
   */
  constructor({mp4Demuxer}){
    this.#mp4Demuxer = mp4Demuxer;
  }

  async mp4Decoder(encoderConfig, stream){
    this.#mp4Demuxer.run(stream, {
        onConfig(config) {
          debugger;
        },
        onChunk(chunk){
          debugger;
        }
      });
  } 

  async start({file, encoderConfig, sendMessage}){
    const stream =  file.stream();
    const fileName = file.name.split('/').pop().replace('.mp4', '');
    await this.mp4Decoder(encoderConfig, stream);
    // debugger
  }
}