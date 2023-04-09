export const { eel } = window;

eel.expose(getDataFromTranscript);
async function getDataFromTranscript() {
  return await eel.getDataFromTranscript()();
}

eel.expose(getFilePaths);
async function getFilePaths(filePath) {
  return await eel.getFilePaths(filePath)();
}

eel.expose(savePDF);
async function savePDF(fileName) {
  return await eel.savePDF(fileName)();
}

eel.expose(makeDegreePlan);
async function makeDegreePlan(studentObject) {
  return await eel.makeDegreePlan(studentObject)();
}

eel.expose(designateClasses);
async function designateClasses(studentObject) {
  return await eel.designateClasses(studentObject)();
}