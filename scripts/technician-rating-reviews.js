$(document).ready(function () {

    $('.comment_rating').barrating({
      theme: 'fontawesome-stars-o',
      initialRating: 5.0,
      onSelect: (value, text) => {
        console.log(value);
      }
    });
    $('.comment_rating2').barrating({
      theme: 'fontawesome-stars-o',
      initialRating: 5.0,
      onSelect: (value, text) => {
        console.log(value);
      }
    });
    $('.comment_rating3').barrating({
      theme: 'fontawesome-stars-o',
      initialRating: 5.0,
      onSelect: (value, text) => {
        console.log(value);
      }
    });
});
