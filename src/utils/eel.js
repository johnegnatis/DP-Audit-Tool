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
async function savePDF(fileName, signature) {
  return await eel.savePDF(fileName, signature, flatten)();
}

eel.expose(makeDegreePlan);
async function makeDegreePlan(studentObject) {
  return await eel.makeDegreePlan(studentObject)();
}

eel.expose(designateClasses);
async function designateClasses(studentObject) {
  return await eel.designateClasses(studentObject)();
}

eel.expose(doAudit);
async function doAudit(studentObject) {
  return await eel.doAudit(studentObject)();
}

eel.expose(getFrontendOptions);
async function getFrontendOptions() {
  return await eel.getFrontendOptions()();
}

eel.expose(getEelPort);
async function getEelPort() {
  return await eel.getEelPort()();
}

eel.expose(getServerPort);
async function getServerPort() {
  return await eel.getServerPort()();
}