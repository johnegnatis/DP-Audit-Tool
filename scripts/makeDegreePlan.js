
//function makeDegreePlanMethod(studentObject){
  //var mydata = JSON.parse(studentObjectcopy);
  //const jsonFile = require('./studentObjectcopy')
 // const myObj = JSON.parse(jsonFile);

 const myJSON = '{"name": "Taylor Swift", "id": "2222", "concentration": "Data Science"}';
 const stuObj  = JSON.parse(myJSON);

  //console.log(jsonFile)

 const { PDFDocument } = require('pdf-lib');
 const { readFile, writeFile } = require('fs/promises');

 async function createPdf(input, output) {
  try {
    const pdfDoc = await PDFDocument.load(await readFile(input));

    // Modify doc, fill out the form...
    const fieldNames = pdfDoc
      .getForm()
      .getFields()
      .map((f) => f.getName());      //for every field get the name of it
    console.log({ fieldNames });     //print out field name

    const form = pdfDoc.getForm();
   /*
    const fields = form.getFields()
        fields.forEach(field => {
            const type = field.constructor.name
            const name = field.getName()
            if(type == 'PDFCheckBox') {
                console.log(`${type}: ${name}`)
                field.check()
            } else {
                field.setText(name)
            }
        })
        */
/*
    const possibleFields = Array.from({ length: 1000 }, (_, i) => i);
    possibleFields.forEach((possibleField) => {
      try {
        form
          .getTextField(`CS 6327.${possibleField}`)
          .setText(possibleField.toString());
      } catch (error) {
        //console.error(error);
      }
    });
    */
     form.getTextField('Name of Student').setText(stuObj.name);
     form.getTextField('Student ID Number').setText(stuObj["id"]); // can get data from object this way as well

      //form.getTextField('Name of Student').setText('Taylor Swift');
     //form.getTextField('CS 6327.1.0.0.5').setText('Tay');
    /* form.getTextField('1').setText('Thsjkbacjbc');
     form.getTextField('CS 6360.1.1').setText('Th');
     form.getTextField('CS 6360.1.0').setText('The');
     form.getTextField('CS 5333').setText('Theeee');
     form.getCheckBox('Check Box1.0.0').check();
   */

    const pdfBytes = await pdfDoc.save();

    await writeFile(output, pdfBytes);
    console.log('PDF created!');
  } catch (err) {
    console.log(err);
  }
}

//an easier way?
if(stuObj.concentration == "Data Science"){
  createPdf('DP-DataScience.pdf', 'output.pdf');
}
//figure out what to do bc different degree plans have diff fieldnames!
else if(stuObj.concentration == "Cyber Security"){ 
  createPdf('DP-CyberSecurity.pdf', 'output.pdf');
}
else if(stuObj.concentration == "systems"){ 
  createPdf('DP-Systems.pdf', 'output.pdf');
}
else if(stuObj.concentration == "traditional"){ 
  createPdf('DP-Traditional.pdf', 'output.pdf');
}
//}
