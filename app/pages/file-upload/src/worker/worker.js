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

onmessage = ({data}) => {
  setTimeout(() =>{
    self.postMessage({
      status: 'done'
    });
  }, 2000)
}