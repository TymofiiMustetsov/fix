$(document).ready(function () {
  const percent = $('.progress-wrap').data('progress-percent');
  const max = $('.progress-wrap').data('progress-max');
  const step = $('.progress-wrap').data('progress-step');

  moveProgressBar();
  insertSteps();
// on browser resize...
  let width = $(window).width();
  $(window).resize(function () {
    if ($(this).width() != width) {
      width = $(this).width();
      moveProgressBar();
      //removeSteps();
      //insertSteps();
    }
  });

  $('#sidebarCollapse').click(() => {
    setTimeout(() => {
      moveProgressBar();
    }, 1000);

  });

// SIGNATURE PROGRESS

  function insertSteps() {
    for (let i = 0.5; i <= max; i = i + step) {
      if (i <= percent) {
        $('#steps-holder').append('<div class="step active"><span class="step-circle "><span class="step-name">' + i + '%</span></span></div>');
      } else {
        $('#steps-holder').append('<div class="step"><span class="step-circle "><span class="step-name">' + i + '%</span></span></div>');
      }

      $('#steps-holder2').append('<div class="step"><span class="step-circle "><span class="step-name">' + i + '%</span></span></div>');
    }

  }

  function removeSteps() {
    $('#steps-holder').empty();
    $('#steps-holder2').empty();
  }


  function moveProgressBar() {
    console.log("moveProgressBar");

    var getPercent = percent / max;
    var getProgressWrapWidth = $('.progress-wrap').width();
    var progressTotal = getPercent * getProgressWrapWidth;
    var animationLength = 2500;
    // on page load, animate percentage bar to data percentage length
    // .stop() used to prevent animation queueing
    $('.progress-bar').stop().animate({
      left: progressTotal
    }, animationLength);
  }
});
