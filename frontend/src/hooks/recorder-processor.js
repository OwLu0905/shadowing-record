class RecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.recordingState = "inactive";
    this.bufferSize = 4096;
    this.recordedData = [];

    this.port.onmessage = (event) => {
      const { type } = event.data;
      switch (type) {
        case "startRecording":
          this.startRecording();
          break;
        case "stopRecording":
          this.stopRecording();
          break;
        case "pauseRecording":
          this.pauseRecording();
          break;
        case "resumeRecording":
          this.resumeRecording();
          break;
        default:
          break;
      }
    };
  }

  startRecording() {
    this.recordingState = "recording";
    this.recordedData = [];
  }

  stopRecording() {
    this.recordingState = "inactive";
    this.port.postMessage({
      type: "recordingFinished",
      audioData: this.recordedData,
    });
    this.recordedData = [];
  }

  pauseRecording() {
    this.recordingState = "paused";
  }

  resumeRecording() {
    this.recordingState = "recording";
  }

  process(inputs, outputs, parameters) {
    console.log(this.recordingState, "vbbbb");
    if (this.recordingState === "recording") {
      const inputData = inputs[0][0];
      this.recordedData.push(new Float32Array(inputData));
    }
    return true;
  }
}

registerProcessor("recorder-processor", RecorderProcessor);
