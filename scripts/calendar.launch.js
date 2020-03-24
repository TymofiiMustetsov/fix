var calendarEl;
var calendar;
const yearToday = new Date().getFullYear();
const pastYear =  new Date(yearToday - 1, 0);
const nextYear =  new Date(yearToday + 1, 11, 31, 23,59,59,999);
var start = moment(pastYear,'Do MMM YYYY').format('YYYY-MM-DD');
var end = moment(nextYear ,'Do MMM YYYY').format('YYYY-MM-DD');
var eventEditable;




var calendarDefaultOption = {
  defaultDate: new Date(),
  plugins: [ 'interaction', 'dayGrid', 'timeGrid', 'bootstrap'],
  themeSystem: 'bootstrap',
  defaultView: 'resourceTimeGridFourDay',
  weekNumbers: true,
  weekNumbersWithinDays: true,
  locale: 'en',
  firstDay: 1,
  header: {
    left: 'prev,next, today',
    center: 'title',
    right: 'dayGridMonth,resourceTimeGridFourDay'
  },
  validRange: {
    start: start,
    end: end,
  },
  visibleRange: {
    start: start,
    end: end,
  },


  /*weekends: false,*/
  views: {
    resourceTimeGridFourDay: {
      type: 'timeGrid',
      duration: { days: 7 },
      buttonText: 'Week',
      /*allDaySlot: false,*/
      nowIndicator: true,
      slotDuration: '00:30:00',
      slotLabelInterval: '00:30:00',
      slotLabelFormat:
        {
          hour: 'numeric',
          minute: '2-digit',
          omitZeroMinute: false,
          meridiem: 'short',
          hour12: false
        },
      titleFormat: { // will produce something like "Tuesday, September 18, 2018"
        month: 'short',
        year: 'numeric',
        day: 'numeric'
      },
      visibleRange: {
        start: start,
        end: end
      },
      columnHeaderFormat:
        function(mom) {
          return  moment(mom.date.marker).format('D')  + ' ' +  moment(mom.date.marker).format('dd');
        },
      weekNumbers: true,
      minTime: '00:00:00',
      maxTime: '23:59:59'
    }
  },
  slotLabelFormat: [
    { month: 'long', year: 'numeric' }, // top level of text
    { weekday: 'short' } // lower level of text
  ],
  events: [
  /*  {
      "title": "Repeating Event",
      "start": "2019-12-21T16:00:00+00:00",
      "end": "2019-12-21T12:30:00+00:00",
      color: '#FFE6D7'
    },
    {
      "start": "2019-12-20T10:30:00+00:00",
      "end": "2019-12-20T12:30:00+00:00",
      color: '#FFE6D7'

    },
    {
      "title": "Lunch",
      "start": "2019-12-20T12:00:00+00:00",
      "end": "2019-12-20T13:00:00+00:00",
      color: '#E0F3FF'
    },
    {
      "title": "Birthday Party",
      "start": "2019-12-20T07:00:00+00:00",
      "end": "2019-12-20T09:15:00+00:00",
      color: '#E0F3FF'
    }*/
  ],
  eventTimeFormat: { // like '14:30:00'
    hour: '2-digit',
    minute: '2-digit',
    meridiem: false,
    hour12: false
  },
  eventRender: function(info) {
    if (info.event.backgroundColor === '#FFE6D7') {
      $(info.el).find(".fc-content").append("<a class='closeon' ><img id='edit' src='/img/calendar/pencil-edit-red-calendar.svg'> </a>");
    } else {
      $(info.el).find(".fc-content").append("<a class='closeon'><img  id='edit' src='/img/calendar/pencil-edit-blue-calendar.svg'> </a>");
    }

  },
  eventClick: function(info) {
      const allDays = false;
      if (allDays) {

      } else {
        let end = moment(info.event.end);
        let now = moment(new Date());
        let dure = end.diff(now);
        if (dure > 0) {
          $('#editEventModal').modal();
          var drp = $('input#edit[name="datetimes2"]').data('daterangepicker');
          drp.setStartDate(moment(info.event.start).format('M/DD/YY hh:mm A'));
          drp.setEndDate(moment(info.event.end).format('M/DD/YY hh:mm A'));
          let startHere = moment(info.event.start).startOf('minute').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
          var time;
          var duration = end.diff(startHere);
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
          $('#editEvent input[name=description2]').val(info.event.title);
          $('#editEvent input[name=duration2]').val(time);
          $('#editEvent input[name=from2]').val(startHere);
          $('#editEvent input[name=minutesDuration2]').val(fullMinutes);
          $('#editEvent input[name=id]').val(info.event.id);
        }
      }
  }
};


var calendarChangedOption = {...calendarDefaultOption};


document.addEventListener('DOMContentLoaded', function() {

  $.ajax({
    type: 'GET',
    url: '/api/events',
    success: function (data) {
     let newData = data.map(event => {
       const time = new Date(event.from);
       let oneOrZero = (Math.random()>0.5)? 1 : 0;
       let color;
       let textColor;
       let className;
       if (oneOrZero) {
         color = '#E0F3FF';
         textColor = 'rgba(62, 95, 125, 0.28);';
         className = 'blue';
       } else {
         color = '#FFE6D7';
         textColor = '#F0A87E';
         className = 'red';
       }

       const till = new Date(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours(), time.getMinutes(), time.getSeconds() + event.duration);

        return {
          title: event.description,
          start: time,
          end: till,
          color: color,
          textColor: textColor,
          className: className,
          id: event.id
        }

      });
      calendarChangedOption.events = newData;
      calendarEl = document.getElementById('calendar');
      calendar = new FullCalendar.Calendar(calendarEl,  calendarChangedOption);
      calendar.render();
    }
  });



});

