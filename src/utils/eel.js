export const { eel } = window;

eel.expose(getDataFromTranscript);
async function getDataFromTranscript(path) {
  return await eel.getDataFromTranscript(path)();
}
