jQuery(document).ready(function ($) {

  $('#userPhoto').on('input', function () {
    let fileInput = document.getElementById('userPhoto');
    let file = fileInput.files[0];
    let formData = new FormData();
    formData.append('file', file);
    formData.append("formId", formSetting.formId);

    let url = '/api/files/upload-form';
    if (formSetting.filesBelongMe === true) {
      url = '/api/files/upload';
    }

    formData.append('contentType', 'USER_PHOTO');
    jQuery.ajax({
      url: url,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      method: 'POST',
      type: 'POST', // For jQuery < 1.9
      complete: function (xhr) {
        let obj;
        if (xhr.status === 200) {
          obj = JSON.parse(xhr.responseText);
          $('#user_photo_display').attr("src", obj.message);
          $('input[name=userPhotoUrl]').val(obj.message);

        } else {
          try {
            obj = JSON.parse(xhr.responseText);
            let errorMsg = obj.title + " \n";
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

  $("#certified-profession-picker").on("click", ".certificates-file", function () {
    let currentFileInput = $(this)[0];
    let certifiedProfessionSelect = $(currentFileInput).parent().parent().parent().find(".certifiedProfessionSelect")[0];
    if ($(certifiedProfessionSelect).val() == "0") {
      alert("First choose profession");
      return false;
    }
  });

  $('#identity-card').on('input', function () {
    let fileInput = document.getElementById('identity-card');
    let file = fileInput.files[0];
    let formData = new FormData();
    formData.append('file', file);
    formData.append("formId", formSetting.formId);
    let url = '/api/files/upload-form';
    if (formSetting.filesBelongMe === true) {
      url = '/api/files/upload';
    }
    formData.append('contentType', 'IDENTITY_CARD');
    jQuery.ajax({
      url: url,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      method: 'POST',
      type: 'POST', // For jQuery < 1.9
      complete: function (xhr) {
        let obj;
        if (xhr.status === 200) {
          obj = JSON.parse(xhr.responseText);
          $(".identityUrl").attr("href", obj.message);
          $(".identityUrl").css("display", "block");
          $('input[name=identityCard]').val(obj.message);
        } else {
          try {
            obj = JSON.parse(xhr.responseText);
            let errorMsg = obj.title + " \n";
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

  $("#certified-profession-picker").on("input", ".certificates-file", function () {
    let currentFileInput = $(this)[0];
    let file = currentFileInput.files[0];
    let formData = new FormData();
    formData.append('file', file);
    let certifiedProfessionSelect = $(currentFileInput).parent().parent().parent().find(".certifiedProfessionSelect")[0];
    console.log(certifiedProfessionSelect);

    formData.append('professionId', $(certifiedProfessionSelect).val());
    formData.append("formId", formSetting.formId);

    let url = '/api/files/upload-form/certificate';
    if (formSetting.filesBelongMe === true) {
      url = '/api/files/upload/certificate';
    }
    console.log($(certifiedProfessionSelect).val());
    jQuery.ajax({
      url: url,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      method: 'POST',
      type: 'POST', // For jQuery < 1.9
      complete: function (xhr) {
        let obj;
        if (xhr.status === 200) {
          obj = JSON.parse(xhr.responseText);
          let certificateUrlLink = $(currentFileInput).parent().parent().parent().find(".certificateUrl")[0];
          $(certificateUrlLink).attr("href", obj.message);
          $(certificateUrlLink).css("display", "block");

        } else {
          try {
            obj = JSON.parse(xhr.responseText);
            let errorMsg = obj.title + " \n";
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


  $("#certified-profession-picker").on("change", ".certifiedProfessionSelect", function () {
    if ($(this).val() == 0) {
      return;
    }
    let chosenElement = $(this);

    $("select.certifiedProfessionSelect").each(function () {
      if (!$(this).is(chosenElement)) {
        if ($(this).val() == chosenElement.val()) {
          alert("Element already chosen");
          chosenElement.val(0);
          $('.niceSelect').niceSelect('update');
          return false;
        }
      }
    });
  });

  let certifiedProfessionItemHtml = $('.certified-profession-item-template').html();
  $("#certified-profession-picker").on("click", ".delete-certified-profession-item", function () {
    $(this).parent().parent().remove();
  });

  $("#add-certified-profession-item").click(function () {
    $('<ul  class="certified-profession-item row">' + certifiedProfessionItemHtml + '</ul>').insertBefore($("#add-certified-profession-item"), null);
  });

  function findAllCertifiedProfessions() {
    let certifiedProfessions = [];
    let certifiedProfessionItem = $('.certified-profession-item');
    for ( let i = 0; i < certifiedProfessionItem.length; i++) {
      let certifiedProfessionSelect = $(certifiedProfessionItem[i]).find(".certifiedProfessionSelect")[0];
      if ($(certifiedProfessionSelect).val() != 0) {
        let certificateUrl = $(certifiedProfessionItem[i]).find(".certificateUrl")[0];
        if ($(certificateUrl).attr("href") == "#") {
          alert("Choose certificate for '" + $(certifiedProfessionSelect).find("option:selected").text().trim() + "' profession");
          return false;
        }
        certifiedProfessions.push({
          "professionId": parseInt($(certifiedProfessionSelect).val()),
          "certificateUrl": $(certificateUrl).attr("href")
        });
      }
    }
    return certifiedProfessions;
  }

  //----------------------------------------------------SUBMIT-----------
  $('#registrationForm').submit(function (e) {
    e.preventDefault();

    let selectedElements = $("#jstree_div").jstree("get_selected", true);
    for ( let i = 0; i < selectedElements.length; i++) {
      let selectedElement = selectedElements[i];
      if (Number.isInteger(parseInt(selectedElement.id))) {
        selectedZipCodes.push(parseInt(selectedElement.id));
      }
    }
    console.log(selectedZipCodes);
    if (!selectedZipCodes.length) {
      alert("Choose some zip-codes");
      return false;
    }
    if ($('input[name=userPhotoUrl]').val() == "") {
      alert("Upload profile image");
      return false;
    }

    if ($('input[name=identityCard]').val() == "") {
      alert("Upload identity card " +
        "");
      return false;
    }

    let certifiedProfessions = findAllCertifiedProfessions();
    if (certifiedProfessions === false) {
      return false;
    }

    if (!$("#registrationForm").valid()) {
      return false;
    }

    let technician = {
      "firstName": $('input[name=firstName]').val(),
      "lastName": $('input[name=lastName]').val(),
      "email": $('input[name=email]').val(),
      "nonCertifiedProfessionsIds": convertStringArrayToIntArray($('#nonCertifiedProfessionsIds').val()),
      "certifiedProfessions": certifiedProfessions,
      "zipsIds": selectedZipCodes,
      "mobilePhone": $('input[name=mobilePhone]').val(),
      "userPhotoUrl": $('input[name=userPhotoUrl]').val(),
      "identityCard": $('input[name=identityCard]').val(),
      "id": technicianId,
      "prefix": document.querySelector('input[name="prefix"]:checked').value
    };

    if ($("#select-role").length > 0) {
      technician.role = $("#select-role").val();
    }

    console.log(technician);

    $.ajax({
      url: formSetting.sendApiUrl,
      type: formSetting.requestType,
      contentType: 'application/json',
      data: JSON.stringify(technician),
      dataType: 'json',
      complete: function (xhr) {
        if (xhr.status == 200) {
          if (formSetting.successUrl) {
            window.location = formSetting.successUrl;
          } else {
            location.reload();
          }

        } else {

          let obj = null;
          try {
            obj = JSON.parse(xhr.responseText);
          } catch (e) {
            alert(xhr.responseText);
            return false;
          }

          if (obj.hasOwnProperty('fieldErrors')) {
            let errorFields = obj.fieldErrors;
            let errorMsg = "";
            for ( let i = 0; i < errorFields.length; i++) {
              let errorField = errorFields[i];
              errorMsg += "Field: \"" + errorField.field + "\" has problem:" + errorField.message + "\n";
            }
            console.log(errorFields);
            alert(errorMsg);
          } else if (obj.hasOwnProperty('title')) {
            let errorMsg = obj.title + " \n";
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

  function convertStringArrayToIntArray(stringArray) {
    let intArray = [];
    for ( let i = 0; i < stringArray.length; i++) {
      intArray.push(parseInt(stringArray[i]));
    }
    return intArray;
  }


});
