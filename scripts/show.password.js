$(document).ready(function () {
  $("#eye-password").click(function () {

    var x = document.getElementById("password");
    if (x.type === "password") {
      $(this).css('fill', '#2D3D4C');
      x.type = "text";
    } else {
      $(this).css('fill', '#DADADA');

      x.type = "password";
    }
  });
});

