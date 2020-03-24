
$(document).ready(function () {
    $('input[name="datetimes"]').daterangepicker({
      timePicker: true,
      timePicker24Hour: true,
      startDate: moment().startOf('minute'),
      endDate: moment().startOf('hour').add(5, 'hour'),
      minDate: moment().startOf('minute'),
      locale: {
        format: 'M/DD/YY hh:mm A',
        firstDay: 1
      },
      showWeekNumbers: true,
      drops: 'up'
    }, function(startHere, endHere, label) {

      var time;
      var duration = endHere.diff(startHere);
      var fullMinutes;
      if (moment.duration(duration).asDays() < 1) {
        time = moment.utc(duration).format('HH:mm');
        fullMinutes = moment.duration(duration).asSeconds();
      } else {
        var hours = moment.duration(duration).asHours().toFixed();
        fullMinutes = moment.duration(duration).asSeconds();
        var minutes = moment.utc(duration).format('mm');
        time = hours + ':' + minutes;
      }
      startHere = startHere.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
      $('input[name=duration]').val(time);
      $('input[name=from]').val(startHere);
      $('input[name=minutesDuration]').val(fullMinutes);
    });

  $('input[name="datetimes2"]').daterangepicker({
    timePicker: true,
    timePicker24Hour: true,
    startDate: moment().startOf('hour'),
    endDate: moment().startOf('hour').add(5, 'hour'),
    minDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes(), 0, 0),
    locale: {
      format: 'M/DD/YY hh:mm A',
      firstDay: 1
    },
    showWeekNumbers: true,
    drops: 'up'
  }, function(startHere, endHere, label) {
    var time;
    var duration = endHere.diff(startHere);
    var fullMinutes;
    if (moment.duration(duration).asDays() < 1) {
      time = moment.utc(duration).format('HH:mm');
      fullMinutes = moment.duration(duration).asSeconds();
    } else {
      var hours = moment.duration(duration).asHours().toFixed();
      fullMinutes = moment.duration(duration).asSeconds();
      var minutes = moment.utc(duration).format('mm');
      time = hours + ':' + minutes;
    }
    startHere = startHere.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    $('#editEvent input[name=duration2]').val(time);
    $('#editEvent input[name=from2]').val(startHere);
    $('#editEvent input[name=minutesDuration2]').val(fullMinutes);
  });
});
