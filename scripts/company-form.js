jQuery(document).ready(function ($) {


  $('#logofile').on('input', function () {
    var fileInput = document.getElementById('logofile');
    var file = fileInput.files[0];
    var formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', 'COMPANY_LOGO');
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
          $('#logofile_display').attr("src", obj.message);
          $('input[name=companyLogoUrl]').val(obj.message);

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

  $('#registration-document').on('input', function () {
    var fileInput = document.getElementById('registration-document');
    var file = fileInput.files[0];
    var formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', 'REGISTRATION_DOCUMENT');
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
          $('#registrationDocumentViewer').attr("href", obj.message);
          $('#registrationDocumentViewer').show();
          $('input[name=registrationDocument]').val(obj.message);

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

  if ($('input[name=liabilityInsuranceProvider]').val().trim() == "") {
    $("#insurance-switch").prop("checked", false);
    $('input[name=liabilityInsuranceProvider]').hide();
    //console.log("ruuun");
  }

  $(".gender-item.yes").click(function () {
    if (!$("#insurance-switch").prop("checked")) {
      $("#insurance-switch").prop("checked", true);
    }
    $('input[name=liabilityInsuranceProvider]').show();
  });

  $(".gender-item.no").click(function () {
    if ($("#insurance-switch").prop("checked")) {
      $("#insurance-switch").prop("checked", false);
    }
    $('input[name=liabilityInsuranceProvider]').hide();
    $('input[name=liabilityInsuranceProvider]').val("");
  });


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


  $('#registrationForm').submit(function (e) {

    if (!$("#registrationForm").valid()) {
      return false;
    }
    if ($('input[name=companyLogoUrl]').val() == "") {
      alert("Upload company logo");
      return false;
    }
    if ($('input[name=registrationDocument]').val() == "") {
      alert("Upload company registration document");
      return false;
    }
    if ($('input[name=validZip]').val() !== "true") {
      alert("Enter valid zip code");
      return false;
    }

    e.preventDefault();
    var address = {
      "country": $('input[name=country]').val(),
      "city": $('input[name=city]').val(),
      "zip": $('input[name=zip]').val(),
      "streetName": $('input[name=streetName]').val(),
      "houseNumber": $('input[name=houseNumber]').val()
    };
    var company = {
      "companyName": $('input[name=companyName]').val(),
      "registrationNumber": $('input[name=registrationNumber]').val(),
      "taxIdNumber": $('input[name=taxIdNumber]').val(),
      "legalForm": $('input[name=legalForm]').val(),
      "liabilityInsuranceProvider": $('input[name=liabilityInsuranceProvider]').val(),
      "faxNumber": $('input[name=faxNumber]').val(),
      "phone": $('input[name=phone]').val(),
      "email": $('input[name=email]').val(),
      "companyLogoUrl": $('input[name=companyLogoUrl]').val(),
      "registrationDocument": $('input[name=registrationDocument]').val(),
      "address": address
    };

    $.ajax({
      url: formSetting.sendApiUrl,
      type: formSetting.requestType,
      contentType: 'application/json',
      data: JSON.stringify(company),
      dataType: 'json',
      complete: function (xhr) {
        if (xhr.status == 200) {
          if (formSetting.successUrl) {
            window.location = formSetting.successUrl;
          } else {
            location.reload();
          }

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
              errorMsg += "Field: \"" + errorField.field + "\" has problem:" + errorField.message + "\n";
            }
            console.log(errorFields);
            alert(errorMsg);
          } else if (obj.hasOwnProperty('title')) {
            var errorMsg = obj.title + " \n";
            if (obj.hasOwnProperty('detail')) {
              errorMsg += obj.detail;
            }
            alert(errorMsg);
            return false;
          } else {
            alert(xhr.responseText);
          }

        }
      }
    });

  });

});
