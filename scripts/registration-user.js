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

  $('#registrationForm').submit(function (e) {

    if (!$("#registrationForm").valid()) {
      return false;
    }
    if ($('input[name=agreedWithRulesCheckbox]').is(":checked")) {
      $('input[name=agreedWithRules]').val(true);
    } else {
      $('input[name=agreedWithRules]').val(false);
    }
    e.preventDefault();
    var customerObj = $(this).serializeFormJSON();

    $.ajax({
      url: '/api/register/customer',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(customerObj),
      dataType: 'json',
      statusCode: {
        500: function (xhr) {
          alert(xhr.responseText);
        },
        201: function (xhr) {
          $('.main-content').html('<h1 style="position: absolute; top: calc(30%); font-size: 24px; text-align: center; width: 100%;padding: 4rem 1rem;margin: 0;">Account created,<br>check your email<br>(you will be redirect after 5 seconds to homepage)</h1>');
          // Your application has indicated there's an error
          window.setTimeout(function () {
            // Move to a new location or you can do something else
            window.location.href = "/";
          }, 5000);
        },
        400: function (xhr) {
          var obj = null;
          try {
            obj = JSON.parse(xhr.responseText);
          } catch (e) {
            alert(xhr.responseText);
            return;
          }

          if (obj.hasOwnProperty('fieldErrors')) {
            var errorFields = obj.fieldErrors;
            var errorMsg = "";
            for (var i = 0; i < errorFields.length; i++) {
              var errorField = errorFields[i];
              errorMsg += "Field: \"" + errorField.field + "\" has problem:" + errorField.message + "\n ";
            }
            console.log(errorFields);
            alert(errorMsg);
          } else if (obj.hasOwnProperty('errorKey')) {
            alert(obj.title);
          }
        }
      }
    });

  });

});
