$(document).ready(function () {
  $(".gender-item.yes").click(function () {
    if (!$("#telephone-switch").prop("checked")) {
      $("#telephone-switch").prop("checked", true);
    }

  });

  $(".gender-item.no").click(function () {
    if ($("#telephone-switch").prop("checked")) {
      $("#telephone-switch").prop("checked", false);
    }
  });

});

