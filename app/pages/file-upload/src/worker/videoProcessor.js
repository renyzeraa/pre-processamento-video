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
    const decoder = new VideoDecoder({
      output(frame){
        debugger;
      },
      error(e){
        console.error('error at mp4Decoder', e);
      }
    })    

    this.#mp4Demuxer.run(stream, {
        onConfig(config) {
          decoder.configure(config);
        },
        /** @param {EncodedVideoChunk} chunk */
        onChunk(chunk){
          debugger
          decoder.decode(chunk);
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