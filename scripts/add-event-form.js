  $.fn.serializeFormJSON = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
      if (o[this.name]) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };

$(document).ready(function () {

   /**Checkbox***************************************/
    $("#addEventModal #all-day-switch").prop("checked", true);
    $('#addEventModal div.dateTime').hide();
    $('#addEventModal div.duration').hide();
   /* setTimeout(function() {
      $('input[name=duration]').val("");
      $('input[name=datetimes]').val("");
      $('input[name=from]').val("");
    }, 0);*/


  $("#addEventModal .gender-item.yes").click(function () {
    if (!$("#all-day-switch").prop("checked")) {
      $("#all-day-switch").prop("checked", true);
    }
    $('#addEventModal div.dateTime').hide();
    $('#addEventModal div.duration').hide();

   /* $('input[name=duration]').val("");
    $('input[name=datetimes]').val("");
    $('input[name=from]').val("");*/
  });

  $("#addEventModal .gender-item.no").click(function () {
    if ($("#all-day-switch").prop("checked")) {
      $("#all-day-switch").prop("checked", false);
    }
    $('#addEventModal div.dateTime').show();
    $('#addEventModal div.duration').show();
    const startHere = moment().startOf('minute');
    const endHere = moment().startOf('hour').add(5, 'hour');
    let time;
    let duration = endHere.diff(startHere);
    let fullMinutes;
    if (moment.duration(duration).asDays() < 1) {
      time = moment.utc(duration).format('HH:mm');
      fullMinutes = moment.duration(duration).asSeconds();
    } else {
      let hours = moment.duration(duration).asHours().toFixed();
      fullMinutes = moment.duration(duration).asSeconds();
      let minutes = moment.utc(duration).format('mm');
      time = hours + ':' + minutes;
    }
    $('input[name=duration]').val(time);
    $('input[name=from]').val(startHere);
    $('input[name=minutesDuration]').val(fullMinutes);
  });
  /**Checkbox****End***********************************/
  /**Checkbox***************************************/
  $("#editEventModal #all-day-switch2").prop("checked", false);
  $('#editEventModal div.dateTime2').show();
  $('#editEventModal div.duration2').show();





  $("#editEventModal .gender-item.yes").click(function () {
    if (!$("#all-day-switch2").prop("checked")) {
      $("#all-day-switch2").prop("checked", true);
    }
    $('#editEventModal div.dateTime2').hide();
    $('#editEventModal div.duration2').hide();
  });

  $("#editEventModal .gender-item.no").click(function () {
    if ($("#all-day-switch2").prop("checked")) {
      $("#all-day-switch2").prop("checked", false);
    }
    $('#editEventModal div.dateTime2').show();
    $('#editEventModal div.duration2').show();

  });

  /**Checkbox****End***********************************/



  $('#addEvent').submit(function (e) {
    e.preventDefault();
    let newObj;
    let customerObj = $(this).serializeFormJSON();
    if (customerObj.allDay) {
      newObj = {
        "description": customerObj.description,
        "from": new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes(), 0, 0),
        "duration": 300,
        "jobId": null,
        "name": "string",
        "type": "WORKING",
        "userInfoId": 14
      }
    } else {
      newObj = {
        "description": customerObj.description,
        "duration": customerObj.minutesDuration,
        "from": customerObj.from,
        "jobId": null,
        "name": "string",
        "type": "WORKING",
        "userInfoId": 14
      };
    }
    $.ajax({
      url: '/api/events',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(newObj),
      dataType: 'json',
      complete: function (xhr) {
        if (xhr.status === 200 ) {
          return false;
        } else  if (xhr.status === 201 ) {
          console.log('add ok');
          var event = null;
          try {
            event = JSON.parse(xhr.responseText);
            const time = moment(event.from).toDate();
            const till = moment(time).add(event.duration, 'seconds').toDate();
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
            const newEvent = {
               title: event.description,
               start: time,
               end: till,
               color: color,
               textColor: textColor,
               className: className,
               id: event.id
            };
            calendarChangedOption.events.push(newEvent);
            $.modal.close();
            calendar.addEvent(newEvent);
          } catch (e) {
           // console.log(e);
            alert(xhr.responseText);
            return false;
          }
        } else {
          event = JSON.parse(xhr.responseText);
          console.log(event);
        }
      }
    });
  });

  $('#editEvent').submit(function (e) {
    e.preventDefault();
    let newObj;
    let customerObj = $(this).serializeFormJSON();
    newObj = {
      "description": customerObj.description2,
      "duration": customerObj.minutesDuration2,
      "from": customerObj.from2,
      "jobId": null,
      "name": "string",
      "type": "WORKING",
      "userInfoId": 14,
      "id": +customerObj.id
    };
    $.ajax({
      url: '/api/events',
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(newObj),
      dataType: 'json',
      complete: function (xhr) {
      if (xhr.status === 200 || xhr.status === 201 ) {
        console.log('update ok');
          var event = null;
          try {
            event = JSON.parse(xhr.responseText);
            const time = moment(event.from).toDate();
            const till = moment(time).add(event.duration, 'seconds').toDate();
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
            const newEvent = {
              title: event.description,
              start: time,
              end: till,
              color: color,
              textColor: textColor,
              className: className
            };
            let index = calendarChangedOption.events.findIndex(item => item.id === newEvent.id);
            calendarChangedOption.events.splice(index, 1, newEvent);
            calendar.removeAllEvents();
            calendar.addEventSource(calendarChangedOption.events);
            $.modal.close();
          } catch (e) {
            // console.log(e);
            alert(xhr.responseText);
            return false;
          }
        } else {
          event = JSON.parse(xhr.responseText);
          console.log(event);
        }
      }
    });
  });

  $('#confirm-delete').click(()=> {
    const customObj = $($('#editEvent')).serializeFormJSON();
    const id = customObj.id;
    $.ajax({
      url: '/api/events/' + id,
      type: 'DELETE',
      dataType: 'json',
      complete: function (xhr) {
        let event;
        if (xhr.status === 200 || xhr.status === 201 || xhr.status === 204 ) {
           console.log('delete ok');
           calendarChangedOption.events = calendarChangedOption.events.filter((item) => {
            return item.id !== +id;
          });
          calendar.removeAllEvents();
          calendar.addEventSource(calendarChangedOption.events);
          $.modal.close();
        } else {
          event = JSON.parse(xhr.responseText);
          console.log(event);
        }
      }
    });
  });

  $('#cancel-delete').click(()=> {
    $('#deleteEventModal').find('#event-info').text('');
    $.modal.close();
  });

  $('#deleteEvent').click((e)=> {
    const customObj = $($('#editEvent')).serializeFormJSON();
    $('#deleteEventModal').find('#event-info').text(customObj.datetimes2);
  })








});
