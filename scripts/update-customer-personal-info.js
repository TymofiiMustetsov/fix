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

  $('#zip-code').on('input', function () {
    if ($('#zip-code').val().length == 5) {
      $.ajax({
        type: "GET",
        url: "/api/cities/zipcode/" + $('#zip-code').val(),
        async: true,
        complete: function (xhr) {
          var obj;
          if (xhr.status === 200) {
            obj = JSON.parse(xhr.responseText);
            $('input[name=city]').val(obj.name);
            $('input[name=validZip]').val(true);
            return;
          } else if (xhr.status == 404) {
            alert("zip code is not found");
          } else {
            alert("error with zip request, error:" + xhr.responseText);
          }
          $('input[name=validZip]').val(false);
        }

      });
    }
  });

  $('#userPhoto').on('input', function () {
    var fileInput = document.getElementById('userPhoto');
    var file = fileInput.files[0];
    var formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', 'USER_PHOTO');
    jQuery.ajax({
      url: '/api/files/upload',
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      method: 'POST',
      type: 'POST', // For jQuery < 1.9
      complete: function (xhr) {
        var obj;
        if (xhr.status === 200) {
          obj = JSON.parse(xhr.responseText);
          $('#user_photo_display').attr("src", obj.message);
          $('input[name=userPhotoUrl]').val(obj.message);

        } else {
          try {
            obj = JSON.parse(xhr.responseText);
            var errorMsg = obj.title + " \n";
            if (obj.hasOwnProperty('detail')) {
              errorMsg += obj.detail;
            }
            alert(errorMsg);
          } catch (e) {
            alert(xhr.responseText);
          }
        }
      }
    });
  });

  $('#updateCustomerInformation').submit(function (e) {
    e.preventDefault();
    var customerObj = $(this).serializeFormJSON();

    $.ajax({
      url: '/api/customer/profile-info',
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(customerObj),
      dataType: 'json',
      complete: function (xhr) {
        if (xhr.status == 200) {
          location.reload();
          return false;
        } else {

          var obj = null;
          try {
            obj = JSON.parse(xhr.responseText);
          } catch (e) {
            alert(xhr.responseText);
            return false;
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
          } else {
            var errorMsg = obj.title + " \n";
            if (obj.hasOwnProperty('detail')) {
              errorMsg += obj.detail;
            }
            alert(errorMsg);
            return false;
          }

        }
      }
    });
  });
});


