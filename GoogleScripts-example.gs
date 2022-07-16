// Exemplo de código do Google Scripts para enviar dados ao Google Sheets a partir do NodeMCU/ESP8266
// Mais detalhes e guia em português:
// https://github.com/carolinex/Google-Sheets-Logging-MQ135
// Inicialmente criado por StorageB (StorageUnitB@gmail.com)
// Adaptado por Carol X. (carolinex@gmail.com)

// Adicione o ID da sua planilha aqui
var SS = SpreadsheetApp.openById('1PUruN8YWo-CzBW9lJvt4FRE3-PSvb06xQhwhdAy3jHI');
var str = "";

function doPost(e) {
  var parsedData;
  var result = {};
  
  try { 
    parsedData = JSON.parse(e.postData.contents);
  } 
  catch(f){
    return ContentService.createTextOutput("Error in parsing request body: " + f.message);
  }
   
  if (parsedData !== undefined){
    var flag = parsedData.format;
    if (flag === undefined){
      flag = 0;
    }
    
    var sheet = SS.getSheetByName(parsedData.sheet_name); // sheet name to publish data to is specified in Arduino code
    var dataArr = parsedData.values.split(","); // creates an array of the values to publish 
         
    var date_now = Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy"); // gets the current date
    var time_now = Utilities.formatDate(new Date(), "America/Sao_Paulo", "hh:mm:ss a"); // gets the current time
    
    var value = dataArr [0]; // value0 from Arduino code
    var place = dataArr [1]; // value1 from Arduino code
    
    
    // read and execute command from the "payload_base" string specified in Arduino code
    switch (parsedData.command) {
      
      case "insert_row":
         
         sheet.insertRows(2); // insert full row directly below header text
         
         //var range = sheet.getRange("A2:D2");              // use this to insert cells just above the existing data instead of inserting an entire row
         //range.insertCells(SpreadsheetApp.Dimension.ROWS); // use this to insert cells just above the existing data instead of inserting an entire row
         
         sheet.getRange('A2').setValue(date_now); // publish current date to cell A2
         sheet.getRange('B2').setValue(time_now); // publish current time to cell B2
         sheet.getRange('C2').setValue(value);   // publish value0 from Arduino code to cell C2
         sheet.getRange('D2').setValue(place);   // publish value1 from Arduino code to cell D2
         
         str = "Success"; // string to return back to Arduino serial console
         SpreadsheetApp.flush();
         break;
         
      case "append_row":
         
         var publish_array = new Array(); // create a new array
         
         publish_array [0] = date_now; // add current date to position 0 in publish_array
         publish_array [1] = time_now; // add current time to position 1 in publish_array
         publish_array [2] = value0;   // add value0 from Arduino code to position 2 in publish_array
         publish_array [3] = value1;   // add value1 from Arduino code to position 3 in publish_array
         publish_array [4] = value2;   // add value2 from Arduino code to position 4 in publish_array
         
         sheet.appendRow(publish_array); // publish data in publish_array after the last row of data in the sheet
         
         str = "Success"; // string to return back to Arduino serial console
         SpreadsheetApp.flush();
         break;     
 
    }
    
    return ContentService.createTextOutput(str);
    // endif (parsedData !== undefined)
  }else {
    return ContentService.createTextOutput("Error! Request body empty or in incorrect format.");
  }
}
Footer
