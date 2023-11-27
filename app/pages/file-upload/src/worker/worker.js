import VideoProcessor from './videoProcessor.js';
import Mp4Demuxer from './mp4Demuxer.js';
import CanvasRenderer from './canvasRenderer.js';

const qvgaConstraints = {
  width: 320,
  height: 240 
};

const vgaConstraints = {
  width: 640,
  height: 480 
};

const hdConstraints = {
  width: 1280,
  height: 720
};

const encoderConfig = {
  ...qvgaConstraints,
  bitrate: 10e6,
  //webm
  codec: 'vp09.00.10.08',
  pt: 4,
  hardwareAcceleration: 'prefer-software',
  
  //mp4
  // codec: 'avc1.42002A',
  // pt: 1,
  // hardwareAcceleration: 'hardware',

  // avc: {
  //   format: 'annexb'
  // }
}

const mp4Demuxer = new Mp4Demuxer()
const videoProcessor = new VideoProcessor({
  mp4Demuxer
});

onmessage = async ({data}) => {
  const renderFrame = CanvasRenderer.getRenderer(data.canvas);
  await videoProcessor.start({
      file: data.file,
      renderFrame,
      encoderConfig,
      sendMessage(message){
        self.postMessage(message)
      }
  });
}