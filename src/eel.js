export const eel = window["eel"];

eel.expose(getPDFData);
async function getPDFData(path) {
  return await eel.getPDFData(path)()
}