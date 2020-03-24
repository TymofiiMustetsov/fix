gup('status', window.location.href);

function gup(name, url) {
  if (!url) url = location.href;
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(url);
  if (results == null || results.length < 2) {
    return;
  }
  if (results[1] == "STARTED") {
    return alert("Start job was confirmed!")
  }
  if (results[1] == "FINISHED") {
    return alert("Finish job was confirmed!")
  }
  if (results[1] === "error") {
    return alert("Error! Wrong data!")
  }
}
