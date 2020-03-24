$(document).ready(function () { 
  $('#my-schedule').click(()=> {
    $('#scheduleModal').modal();
    
    

    const week = {
      "Monday": [{"from":"8:00", "until":"20:00"}],
      "Tuesday": [{"from":"8:00", "until":"20:00"}]
      };
    let addButton = '<div class="day add-block col-4"><div class="add"><button><img src="img/calendar/add-button.png"></button></div></div>';

  //
    let periods;
      periods = $.map(week.Monday, function(period) {
      console.log(period);
      return $('<div class=\"day col-4\"><div class="period"><span class=\"time-from\">' + period.from + '</span>&nbsp;-&nbsp;<span class="time-to">' + period.until + '</span></div></div>')
    });
    $('.one .days-holder .add-block').remove();
    $('.one .days-holder').append(periods);
    $('.one .days-holder').append(addButton);
      periods = $.map(week.Tuesday, function(period) {
      console.log(period);
      console.log('Test now');
      return $('<div class=\"day col-4\"><div class="period"><span class=\"time-from\">' + period.from + '</span>&nbsp;-&nbsp;<span class="time-to">' + period.until + '</span></div></div>')
    });
    $('.two .days-holder .add-block').remove();
    $('.two .days-holder').append(periods);
    $('.two .days-holder').append(addButton);


  })

});

/*
{
  "Friday": [
  {
    "from": "8:00",
    "until": "20:00"
  }
],
  "Monday": [{"from":"8:00", "until":"20:00"}],
  "Sunday": [{"from":"8:00", "until":"20:00"}],
  "Tuesday": [{"from":"8:00", "until":"20:00"}],
  "Saturday": [{"from":"8:00", "until":"20:00"}],
  "Thursday": [{"from":"8:00", "until":"20:00"}],
  "Wednesday": [{"from":"8:00", "until":"20:00"}]
}*/
