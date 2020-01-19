export default function printDocument(title,html){
  var win = window.open("","PRINT","height=600,width=800");
  win.document.write("<html><head><title>"+title+"</title></head><body>"+html+"</body></html>");
  console.log("<html><head><title>"+title+"</title></head><body>"+html+"</body></html>");
  win.document.close();
  win.focus();
  win.print();
  win.close();
}