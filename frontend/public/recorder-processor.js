class RecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.recordingState = "recording";
    this.bufferSize = 4096;
    this.recordedData = [];

    this.port.onmessage = (event) => {
      console.log(event, "12123123");
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
    console.log("22");
    this.recordingState = "recording";
    this.recordedData = [];
  }

  stopRecording() {
    console.log("33");
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
    console.log(inputs, outputs, parameters, "process");
    console.log(this.recordingState, "aaaaa");
    // if (this.recordingState === "recording") {
    const inputData = inputs[0][0];
    this.recordedData.push(new Float32Array(inputData));
    // }
    return true;
  }
}

console.log("fefe");
console.log("register", RecorderProcessor);
registerProcessor("recorder-processor", RecorderProcessor);
