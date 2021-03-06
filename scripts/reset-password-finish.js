(function ($) {
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
})(jQuery);


jQuery(document).ready(function ($) {

  $('#resetPasswordFinish').submit(function (e) {
    e.preventDefault();
    var customerObj = $(this).serializeFormJSON();

    $.ajax({
      url: '/api/account/reset-password/finish',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(customerObj),
      dataType: 'json',
      complete: function (xhr) {
        if (xhr.status == 200) {
          $('.main-content').html('<h2 style="position: absolute; top: calc(30%); font-size: 24px; text-align: center; width: 100%;padding: 4rem 1rem;margin: 0;">Your password has been successfully changed,<br>please login!<br>(you will be redirect after 5 seconds to login page)</h2>');
          // Your application has indicated there's an error
          window.setTimeout(function () {
            // Move to a new location or you can do something else
            window.location.href = "/signin";
          }, 5000);
        } else {
          try {
            var obj = JSON.parse(xhr.responseText);
            var errorMsg = obj.title + " \n";
            if (obj.hasOwnProperty('detail')) {
              errorMsg += obj.detail;
            }
            alert(errorMsg);
            return false;
          } catch (e) {
            alert(xhr.responseText);
            return false;
          }
        }
      }
    });
  });
});
