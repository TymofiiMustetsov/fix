function aboutScrollText() {
  window.widndow_width = $(window).outerWidth();
  if(!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) && widndow_width > 1200){
    $("#autocomplete-list").niceScroll({
      cursorwidth: 4,
      cursorcolor: 'rgb(1, 149, 255)',
      background:"rgba(224,227,235,1)",
      cursorborderradius: 2,
      autohidemode:false,
      horizrailenabled: false,
      cursorborder: 'none',
    });
  }
};

