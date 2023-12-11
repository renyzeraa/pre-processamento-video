export default class VideoProcessor {
  #mp4Demuxer
  #webMWriter
  #buffers = []
  /**
   *
   * @param {object} options
   * @param {import('./mp4Demuxer.js').default} options.mp4Demuxer
   * @param {import('./../deps/webm-writer2.js').default} options.webMWriter
   */
  constructor({ mp4Demuxer, webMWriter }) {
    this.#mp4Demuxer = mp4Demuxer
    this.#webMWriter = webMWriter
  }
  /** @returns {ReadableStream} */
  mp4Decoder(stream) {
    return new ReadableStream({
      start: async controller => {
        const decoder = new VideoDecoder({
          /** @param {VideoFrame} frame */
          output(frame) {
            controller.enqueue(frame)
          },
          error(e) {
            console.error('error at mp4Decoder', e)
            controller.error(e)
          }
        })

        return this.#mp4Demuxer.run(stream, {
          async onConfig(config) {
            const { supported } = await VideoDecoder.isConfigSupported(config)
            if (!supported) {
              console.error(
                'mp4Demuxer VideoDecoder config is not supported',
                config
              )
              controller.close()
              return
            }
            decoder.configure(config)
          },
          /** @param {EncodedVideoChunk} chunk */
          onChunk(chunk) {
            decoder.decode(chunk)
          }
        })
        // .then(() => {
        //   setTimeout(() => {
        //     controller.close()
        //   }, 3000)
        // })
      }
    })
  }

  enconde144p(encoderConfig) {
    let _encoder
    const readable = new ReadableStream({
      start: async controller => {
        const { supported } = await VideoDecoder.isConfigSupported(
          encoderConfig
        )
        if (!supported) {
          const messageError =
            'enconde144p VideoDecoder config is not supported'
          console.error(messageError, encoderConfig)
          controller.error(messageError)
          return
        }
        _encoder = new VideoEncoder({
          /**
           * @param {EncodedVideoChunk} frame
           * @param {EncodedVideoChunkMetadata} config
           */
          output: (frame, config) => {
            if (config.decoderConfig) {
              const decoderConfig = {
                type: 'config',
                config: config.decoderConfig
              }
              controller.enqueue(decoderConfig)
            }
            controller.enqueue(frame)
          },
          error: err => {
            console.error('VideoEncoder no enconde144p', err)
            controller.error(err)
          }
        })

        await _encoder.configure(encoderConfig)
      }
    })

    const writable = new WritableStream({
      async write(frame) {
        _encoder.encode(frame)
        frame.close()
      }
    })

    return {
      readable,
      writable
    }
  }

  renderDecodedFramesAndGetEncodedChunks(renderFrame) {
    let _decoder
    return new TransformStream({
      start: controller => {
        _decoder = new VideoDecoder({
          output(frame) {
            renderFrame(frame)
          },
          error(e) {
            console.error('Error at renderFrames', e)
            controller.error(e)
          }
        })
      },
      /**
       * @param {EncodedVideoChunk} encodedChunk
       * @param {TransformStreamDefaultController} controller
       */
      async transform(encodedChunk, controller) {
        if (encodedChunk.type === 'config') {
          await _decoder.configure(encodedChunk.config)
          return
        }
        _decoder.decode(encodedChunk)
        // precisa da versão do encoded para usar o WEBM
        controller.enqueue(encodedChunk)
      }
    })
  }

  transformIntoWebM() {
    const writable = new WritableStream({
      write: chunk => {
        this.#webMWriter.addFrame(chunk)
      },
      close() {
        debugger
      }
    })
    return {
      readable: this.#webMWriter.getStream(),
      writable
    }
  }

  async start({ file, encoderConfig, renderFrame, sendMessage }) {
    const stream = file.stream()
    const fileName = file.name.split('/').pop().replace('.mp4', '')
    await this.mp4Decoder(stream)
      .pipeThrough(this.enconde144p(encoderConfig))
      .pipeThrough(this.renderDecodedFramesAndGetEncodedChunks(renderFrame))
      .pipeThrough(this.transformIntoWebM())
      .pipeThrough(
        new TransformStream({
          transform: ({ data, position }, controller) => {
            this.#buffers.push(data)
            controller.enqueue(data)
          },
          flush: () => {
            // sendMessage({
            //   status: 'done',
            //   buffers: this.#buffers,
            //   fileName: fileName.concat('-144p.webm')
            // })
            sendMessage({
              status: 'done'
            })
          }
        })
      )
      .pipeTo(
        new WritableStream({
          write(frame) {
            // debugger
            // renderFrame(frame)
          }
        })
      )
  }
}
