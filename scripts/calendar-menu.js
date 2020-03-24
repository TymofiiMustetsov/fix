var calendarDates;
var calendarInterval;

$(document).ready(function () {
  const yearToday = new Date().getFullYear();
  const pastYear =  new Date(yearToday - 1, 0);
  const nextYear =  new Date(yearToday + 1, 11, 31, 23,59,59,999);
  const thisYear = new Date(new Date().getFullYear(), 0, 1);
  const nextYearStart = new Date(nextYear.getFullYear(), 0, 1);

  const morning = new Date(0, 0, 0, 0,  0,  0,  0);
  const evening = new Date(0, 0, 0, 23, 59, 59, 0);

  $('.checkbox-label').on('click', function() {
    $('#autoAcceptConfirmModal').modal();
  });

  $('label.checkbox').on('click', function(e) {
    e.preventDefault();
    $('#autoAcceptConfirmModal').modal();
  });

  $('#confirm-activate').click(()=> {
    $('#autoConfirm').attr("checked", true);
    $.modal.close();
  });

  $('#cancel-activate').click(()=> {
    $('#autoConfirm').attr("checked", false);
    $.modal.close();
  });




  var dateSlider = document.getElementById('range');
  if (!dateSlider) {
    return
  }
  function timestamp(str) {
    return new Date(str).getTime();
  }
  noUiSlider.create(dateSlider, {
// Create two timestamps to define a range.
    range: {
      min: timestamp(pastYear),
      max: timestamp(nextYear)
    },
    connect: true,
    behaviour: 'drag',
    keyboard: true,
    pips: {
      mode: 'values',
      values: [+pastYear, +thisYear, +nextYear, +nextYearStart],
      density: 4,
      format: {
        to: function(a){
          return moment(new Date(a)).format('D MMM, YYYY');
        }
      }
    },
    tooltips: [true, true],
    format: { to: formatDate, from: Number },
// Steps of one week
    step: 7 * 24 * 60 * 60 * 1000,
// Two more timestamps indicate the handle starting positions.
    start: [timestamp(pastYear), timestamp(nextYear)],
  });
  dateSlider.noUiSlider.on('change', function (values, handle) {
    let start = moment(values[0],'Do MMM YYYY').format('YYYY-MM-DD');
    let end = moment(values[1],'Do MMM YYYY').format('YYYY-MM-DD');
    calendar.setOption('validRange', {
      start: start,
      end: end
    });
    const min = new Date(moment(values[0],'Do MMM YYYY').valueOf());
    const max = new Date(moment(values[1],'Do MMM YYYY').valueOf());
    const now = new Date();
    if ( now >= min && now <= max) {
      calendar.gotoDate(new Date());
    } else {
      calendar.gotoDate(min);
    }
  });
// Create a string representation of the date.
  function formatDate(date) {
    return  moment(date).format('Do MMM YYYY');
  }

  var timeSlider = document.getElementById('range2');
  noUiSlider.create(timeSlider, {
// Create two timestamps to define a range.
    range: {
      min: timestamp(morning),
      max: timestamp(evening)
    },
    connect: true,
    behaviour: 'drag',
    keyboard: true,
    pips: {
      mode: 'values',
      values: [+morning, +evening],
      format: {
        to: function(a){
          return moment(new Date(a)).format('HH:mm');
        }
      }
    },
    tooltips: [true, true],
    format: { to: formatTime, from: Number },
// Steps of one week
    step: 30 * 60 * 1000,
// Two more timestamps indicate the handle starting positions.
    start: [timestamp(morning), timestamp(evening)],
  });
  timeSlider.noUiSlider.on('change', function (values, handle) {
    let start = moment(values[0],'HH:mm').format('HH:mm');
    let end = moment(values[1],'HH:mm').format('HH:mm');
    calendar.destroy();
    calendarChangedOption.views.resourceTimeGridFourDay.minTime = start;
    if ( end.split(':')[0] === '00' && end.split(':')[1] === '00' || end.split(':')[0] === '00' && end.split(':')[1] === '01' ) {
      end = '24:01'
    }
    calendarChangedOption.views.resourceTimeGridFourDay.maxTime =  end;
    calendar = new FullCalendar.Calendar(calendarEl,  calendarChangedOption);
    calendar.render();
  });
  function formatTime(date) {
    return  moment(date).format('HH:mm');
  }

  if (document.querySelector('#wrapper1')) {
    document.querySelector('#wrapper1').addEventListener('click', function () {
      this.querySelector('.custom-select').classList.toggle('open');
    });

    for (const option of document.querySelectorAll("#wrapper1 .custom-option")) {
      if (option.classList.contains('selected')) {
        calendarDates = option.textContent;
      //  console.log("'showRequests' variable value: " + calendarDates);
      }
      option.addEventListener('click', function () {
        if (!this.classList.contains('selected')) {
          this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
          this.classList.add('selected');
          this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.textContent;
          calendarDates = option.textContent;
          console.log("'calendarDates' variable value: " + calendarDates);
          calendar.destroy();
            calendarChangedOption.views.resourceTimeGridFourDay.duration.days = +calendarDates;
            calendar = new FullCalendar.Calendar(calendarEl,  calendarChangedOption);
            calendar.render();
          //calendar.gotoDate(new Date(1999, 11, 30));

        }
      })
    }
  }
  if (document.querySelector('#wrapper3')) {
    document.querySelector('#wrapper3').addEventListener('click', function () {
      this.querySelector('.custom-select').classList.toggle('open');
    });

    for (const option of document.querySelectorAll("#wrapper3 .custom-option")) {
      if (option.classList.contains('selected')) {
        calendarInterval = option.textContent;
        //console.log("'showRequests' variable value: " + calendarInterval);
      }
      option.addEventListener('click', function () {
        if (!this.classList.contains('selected')) {
          this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
          this.classList.add('selected');
          this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.textContent;
          calendarInterval = option.textContent;
          console.log("'calendarInterval' variable value: " + calendarInterval);

           calendar.destroy();
           let interval;
           let intervalValue = calendarInterval.split(' ');
           if (intervalValue[1] === 'min') {
             if (+intervalValue[0] < 10) {
               interval = '00:0' + intervalValue[0] + ':00';
             } else {
               interval = '00:' + intervalValue[0] + ':00';
             }
           } else if (intervalValue[1] === 'hour') {
             if (+intervalValue[0] < 10) {
               interval = '0' + intervalValue[0] +':00:00';
             } else {
               interval = intervalValue[0] +':00:00';
             }
           }
          calendarChangedOption.views.resourceTimeGridFourDay.slotLabelInterval = interval;
          calendarChangedOption.views.resourceTimeGridFourDay.slotDuration =  interval;
          calendar = new FullCalendar.Calendar(calendarEl,  calendarChangedOption);
          calendar.render();
        }
      })
    }
  }
});
