// more documentation available at
// https://github.com/tensorflow/tfjs-models/tree/master/speech-commands

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/XLfYcJWj1/";

async function createModel() {
  const checkpointURL = URL + "model.json"; // model topology
  const metadataURL = URL + "metadata.json"; // model metadata

  const recognizer = speechCommands.create(
    "BROWSER_FFT", // fourier transform type, not useful to change
    undefined, // speech commands vocabulary feature, not useful for your models
    checkpointURL,
    metadataURL
  );

  // check that model and metadata are loaded via HTTPS requests.
  await recognizer.ensureModelLoaded();

  return recognizer;
}

initAudio();
async function initAudio() {
  const recognizer = await createModel();

  // listen() takes two arguments:
  // 1. A callback function that is invoked anytime a word is recognized.
  // 2. A configuration object with adjustable fields
  init();
  recognizer.listen(
    (result) => {
      const scores = result.scores;
      switch (scores.indexOf(Math.max(...scores))) {
        case 0:
          break;

        case 1:
          handleKeyCode(40);
          break;

        case 2:
          handleKeyCode(37);
          break;

        case 3:
          handleKeyCode(39);
          break;

        case 4:
          handleKeyCode(38);
          break;
      }
    },
    {
      includeSpectrogram: true, // in case listen should return result.spectrogram
      probabilityThreshold: 0.75,
      invokeCallbackOnNoiseAndUnknown: true,
      overlapFactor: 0.5, // probably want between 0.5 and 0.75. More info in README
    }
  );

  // Stop the recognition in 5 seconds.
  // setTimeout(() => recognizer.stopListening(), 5000);
}
