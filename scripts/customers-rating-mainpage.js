$(document).ready(function () {

   /* $('#comment_rating').barrating({
      theme: 'fontawesome-stars',
      initialRating: 0.2,
      onSelect: (value, text) => {

      }
    });*/


    $('.comment_rating').barrating({
      theme: 'fontawesome-stars-o',
      readonly: true,
      initialRating: 4.5
    });

});
