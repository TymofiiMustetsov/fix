$(document).ready(function(){
  $('.owl-carousel').owlCarousel({
    loop:true,
    margin: 20,
    nav:true,
    items : 1, // THIS IS IMPORTANT
    responsive : {
      480 : { items : 1 , dotsEach: 3 }, // from zero to 480 screen width 4 items
      768 : { items : 2, dotsEach: 3  }, // from 480 screen widthto 768 6 items
      1024 : { items : 3 , dotsEach: 3},  // from 768 screen width to 1024 8 items
      1650 : { items : 4 , dotsEach: 4}  // from 768 screen width to 1024 8 items3
    }
  });
});
