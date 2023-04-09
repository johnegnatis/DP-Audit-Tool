export const { eel } = window;

eel.expose(getDataFromTranscript);
async function getDataFromTranscript() {
  return await eel.getDataFromTranscript()();
}

eel.expose(getFilePaths);
async function getFilePaths(filePath) {
  return await eel.getFilePaths(filePath)();
}

eel.expose(getPDF);
async function getPDF() {
  return await eel.getPDF()();
}

eel.expose(makeDegreePlan);
async function makeDegreePlan(studentObject) {
  return await eel.makeDegreePlan(studentObject)();
}
