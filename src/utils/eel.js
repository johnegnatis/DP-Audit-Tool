export const { eel } = window;

eel.expose(getDataFromTranscript);
async function getDataFromTranscript() {
  return await eel.getDataFromTranscript()();
}

eel.expose(getFilePaths);
async function getFilePaths() {
  return await eel.getFilePaths()();
}
