$(document).ready(function () {
  $('#datepicker').datetimepicker({
    pickerPosition: 'bottom-right',
    pickTime: false,
    minView: 2,
    maxView: 4,
    format: 'dd/mm/yyyy',
    autoclose: true,
    weekStart: 1
  });
//  $('#datepicker').datetimepicker("setDate", new Date());



  $("#timepicker").datetimepicker({
    pickDate: false,
    minuteStep: 5,
    pickerPosition: 'bottom-right',
    format: 'hh:ii p',
    autoclose: true,
    showMeridian: true,
    startView: 1,
    maxView: 1,

  });
  // $('#timepicker').datetimepicker("setDate", new Date());

  $(".datetimepicker").next().find('thead th').remove();
  $(".datetimepicker").next().find('thead').append($('<th class="switch">').text('Pick Time'));
  $('.switch').css('width','190px');

});

