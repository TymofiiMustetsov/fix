function selectAutocompliteValue(val) {

  $("#search-box-fixario").val(val);
  $("#suggesstion-box").hide();
  $("#autocomplete-list").niceScroll().remove();
}

function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
    textbox.addEventListener(event, function () {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }
    });
  });
}

$('#jobPhotoTool').on('input', function () {
  let fileInput = document.getElementById('jobPhoto');
  let file = fileInput.files[0];
  let formData = new FormData();
  formData.append('file', file);
  formData.append('contentType', 'JOB_IMAGE');
  jQuery.ajax({
    url: '/api/files/upload',
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

        addJobImg(obj.message);
        searchObject.jobImages.push(obj.message);

        if (searchObject.jobImages.length > 4) {
          document.getElementById("jobPhoto").disabled = true;
        }
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
      document.getElementById('jobPhoto').value = null;
    }
  });
});


$("#jobPhotoTool ul li.viewer > span > span.deleteBtn").click(function () {

  let index = searchObject.jobImages.indexOf($(this).parent().find("img").attr("src"));
  if (index !== -1) searchObject.jobImages.splice(index, 1);
  $(this).parent().hide();
  if (searchObject.jobImages.length < 5) {
    document.getElementById("jobPhoto").disabled = false;
  }


});

function addJobImg(jobImg) {
  let imageSlots = $("#jobPhotoTool ul li.viewer  span.img-slot");
  for (let i = 0; i < imageSlots.length; i++) {
    let imageSlot = imageSlots[i];
    if ($(imageSlot).is(":hidden")) {
      $(imageSlot).find("img").attr("src", jobImg);
      $(imageSlot).show();
      return;
    }
  }

  alert("Error! You can upload only 5 images");
}


let searchObject = {
  "from": "",
  "professionId": 1,
  "streetName": "",
  "houseNumber": "",
  "flatNumber": "",
  "zip": "",
  "description": "",
  "jobImages": [],
  "customerPayForDetails": false
};

let technicalObj = null;



jQuery(document).ready(function ($) {

  $("#step-1-fixario").show();
  

  if (!$('#useProfileAddress').is(':checked')) {
    $(".addressInfo input").attr("readonly", false);
  }

  $('#useProfileAddress').change(function () {
    if ($('#useProfileAddress').is(':checked')) {
      $(".addressInfo input").attr("readonly", true);
    } else {
      $(".addressInfo input").attr("readonly", false);
    }
  });

  setInputFilter(document.getElementById("search-box-fixario"), function (value) {
    return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp
  });

  let oldValue = '';
  let cancelSearch = false;

  $("#search-box-fixario").keyup(function () {
    $("div#step-1-fixario div.postCodeError").hide();
    if ($(this).val().length === 0) {
      $("#suggesstion-box").hide();

      $("#autocomplete-list").niceScroll().remove();
    }

    if ($(this).val().length < 3 || $(this).val().length === 10) {
      return false;
    }
    if (oldValue !== $(this).val()) {
      oldValue = $(this).val();
    } else {
      return;
    }

    let paramName = "city";
    let url = '/api/zipcodes/search-by-city';
    if (Number.isInteger(parseInt($(this).val()))) {
      url = "/api/zipcodes/search-by-zipcode";
      paramName = "code";
    }

    $.ajax({
      type: "GET",
      url: url,
      data: paramName + '=' + $(this).val(),
      beforeSend: function () {
        $("#search-box-fixario").css("background", "#FFF url(img/LoaderIcon.gif) no-repeat 250px");
      },
      success: function (data) {
        let htmlBlock = '<ul id="autocomplete-list">';
        for (let i = 0; i < data.length; i++) {
          let element = data[i];
          htmlBlock += '<li onClick="selectAutocompliteValue(' + element.zipcode + ')">Zip: <b>' + element.zipcode + '</b>  City: <b>' + element.city.name + '</b></li>';
          searchObject.zip = element.zipcode;
        }
        htmlBlock += '</ul>';

        searchObject.professionId = parseInt($("#profession-fixario").val());
        $("#suggesstion-box").show();
        $("#suggesstion-box").html(htmlBlock);
        $("#search-box-fixario").css("background", "#FFF");
        aboutScrollText();
      }
    });
  });

  $("#category-fixario").change(function () {
    if (this.value == 0) {
      if ($(".nice-select-group").length > 0) {
        $("#profession-fixario").parent().remove();
        return false;
      }
    }

    jQuery.get("/api/professions/category/" + this.value + "?sort=professionName,asc", function (categories) {

      if ($("#profession-fixario").length) {
        $("#pick-profession-tool-fixario .right-element div").remove();

      }
      var professionSelecter = "<div class=\"nice-select-group\"><select id=\"profession-fixario\" class=\"wide profession-control\">";
      for (var i = 0; i < categories.length; i++) {
        var profession = categories[i];
        professionSelecter += '<option value="' + profession.id + '">' + profession.professionName + '</option>';

      }
      professionSelecter += "</select></div>";
      $('#pick-profession-tool-fixario .right-element').append(professionSelecter);
      $("div#step-1-fixario div.jobError").hide();
      $('#profession-fixario').niceSelect();
    });
  });




  $("#step-1-fixario button.search-tech-next-btn").click(function () {
    if (!$("#profession-fixario").length) {
      $("div#step-1-fixario div.jobError").text('Please, select Category and Profession');
      $("div#step-1-fixario div.jobError").show();
      return;
    }

    if (!$("div#step-1-fixario #streetName")[0].value) {
      $("div#step-1-fixario div.streetNameError").text("Type your street name");
      $("div#step-1-fixario div.streetNameError").show();
      return;
    }

    if (!$("div#step-1-fixario #houseNumber")[0].value) {
      $("div#step-1-fixario div.houseNumberError").text("Type your house number");
      $("div#step-1-fixario div.houseNumberError").show();
      return;
    }

    if (!validateZip($("#search-box-fixario").val())) {
      if (!$("div#step-1-fixario #search-box-fixario")[0].value) {
        $("div#step-1-fixario div.postCodeError").text("Type your postal code");
      } else {
        $("div#step-1-fixario div.postCodeError").text("Postal code: " + $("#search-box-fixario").val() + " is incorrect");
      }
      $("div#step-1-fixario div.postCodeError").show();
      return;
    }
    $("#step-1-fixario").hide();
    $("#step-2-fixario").show();
  });


  let insideInterval;




  $("#cancelModal #back-to-start").click(function () {
    removeTimes();
    $("#step-4-fixario").hide();
    $("#step-1-fixario").show();
    window.location = "/tech-search";

  });

  $("#noTechnicansModal #back-to-start").click(function () {
    clearAndBack();
  });




  function clearAndBack() {
    removeTimes();
    $("#step-2-fixario").hide();
    $("#step-1-fixario").show();
  }


  function removeTimes() {
    clearInterval(waitInterval);
    clearTimeout(insideInterval);
    setTimeout(() => {
      $.modal.close();
    }, 300);
    setTimeout(() => {
      removeFilled();
    }, 1000);
  }

  function removeFilled() {
    $("#waitingModal .animate-0-25-b").css("transform", "rotate(-90deg)");
    $("#waitingModal .animate-25-50-b").css("transform", "rotate(-90deg)");
    $("#waitingModal .animate-50-75-b").css("transform", "rotate(-90deg)");
    $("#waitingModal .animate-75-100-b").css("transform", "rotate(-90deg)");
    $(".loader-bg .text").text('40');
  }



  $("#requestAcceptedModal #ok").click(function () {
    $.modal.close();
    $("#step-2-fixario").hide();
    window.location.href = "/dashboard/my-search-requests";
    return false;
  });


  $("#step-2-fixario button.button-back").click(function () {
    $("#step-2-fixario").hide();
    $("#step-1-fixario").show();
  });


  $("#step-2-fixario button.search-tech-next-btn").click(function () {
    if (!$("#datepicker").val()) {
      alert("Please fill date");
      return false;
    }
    if (!$("#timepicker").val()) {
      alert("Please fill time");
      return false;
    }

    let datetimepicker = $("#datepicker").data("datetimepicker").getDate();
    let timepicker = $("#timepicker").data("datetimepicker").getDate();

    let jobStartDate = dateFormat(datetimepicker, "yyyy-mm-dd") + "T" + dateFormat(timepicker, "HH:MM") + ":00Z";
    cancelSearch = false;
    searchObject.from = jobStartDate;
    searchObject.zip = $("#search-box-fixario").val();
    searchObject.streetName = $("#streetName").val();
    searchObject.houseNumber = $("#houseNumber").val();
    searchObject.flatNumber = $("#flatNumber").val();
    let customer_pay_for_details = ($('input[name="customer_pay_for_details"]:checked').val() === 'true');
    searchObject.customerPayForDetails = customer_pay_for_details;
    searchObject.professionId = parseInt($("#profession-fixario").val());

    //------------------------------- send to Api

    $('#waitingModal').modal();
    new Circlebar({
      element: "#circle-1",
      startValue: 0,
      maxValue: 40,
      fontSize: "22px",
      fontColor: "#0195FF",
      triggerPercentage: true,
      counter: 1000,
      dialWidth: '12px',
      size: '130px',
      type: "timer"
    });

    $.ajax({
      url: "/api/user-infos/search-technicians",
      type: "POST",
      contentType: 'application/json',
      data: JSON.stringify(searchObject),
      dataType: 'json',
      complete: function (xhr) {
        if (xhr.status == 200) {
          let technician = {};
          try {
            technician = JSON.parse(xhr.responseText);
            if (technician.message) {
              console.log(technician.message);
              removeTimes();
            }

          } catch (e) {
            //alert(xhr.responseText);
            console.log(xhr);
            console.log(e);
            console.log(xhr.responseText);
            removeTimes();
            return false;
          }
          if (cancelSearch) {
            return;
          }
          if (technician.success === false) {
            clearInterval(waitInterval);
            clearTimeout(insideInterval);
            setTimeout(() => {
              $.modal.close();
            }, 300);
            setTimeout(() => {
              removeFilled();
              $('#requestAcceptedModal').modal();
            }, 1000);
            return;
          }
          removeTimes();
          if (technician.message) {
            console.log(technician.message);
          }

          technicalObj = technician;
          let newCompanyName = [];
          let companyNameAr = technicalObj.companyName.split('');
          let newDateFormat = moment(jobStartDate).format('ddd, MMM DD, HH:mm a');
          for (let i = 0; i < companyNameAr.length; i++) {
            if (i === 0) {
              newCompanyName.push(companyNameAr[i]);
            } else if (i === companyNameAr.length - 1) {
              newCompanyName.push(companyNameAr[i]);
            } else {
              newCompanyName.push('*');
            }
          }
          newCompanyName = newCompanyName.join('');
          let overalratin = ((technicalObj.ratingFriendly + technicalObj.ratingPunctuality + technicalObj.ratingQuality) / 3).toFixed(1);
          $("#step-4-fixario #amount").html(`<img src="/img/requests/good-face.svg"><span>${overalratin}</span><span class="position">(${technicalObj.ratingCount})</span>`);
          $("#step-4-fixario .step-description").html(`A technicians company ${newCompanyName} has accepted your query and is ready to arrive on your location on <span class="date-of-work">${newDateFormat}</span>`);
          $("#step-4-fixario div.name-block span.tech-name").text(technician.firstName + " " + technician.lastName);
          $("#step-4-fixario div.avatar-block img").attr("src", technician.profileUrl);




          $("#step-2-fixario").hide();
          $("#step-4-fixario").show();

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
            for (let i = 0; i < errorFields.length; i++) {
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


  $("#waitingModal #cancel-searching").click(function () {
    $.ajax({
      url: "/api/user-infos/search-technicians/cancel",
      type: "POST",
      contentType: 'application/json',
      data: JSON.stringify(searchObject),
      dataType: 'json',
      complete: function (xhr) {
        if (xhr.status == 200) {
          let technician = null;
          try {
            technician = JSON.parse(xhr.responseText);
            removeTimes();
            console.log('ok remove');
            cancelSearch = true;
          } catch (e) {
            //alert(xhr.responseText);
            console.log(xhr);
            console.log(e);
            console.log(xhr.responseText);
            removeTimes();
            return false;
          }
          removeTimes();

          $("#step-2-fixario").hide();
          $("#step-1-fixario").show();

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
            for (let i = 0; i < errorFields.length; i++) {
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

  /*$("#step-3-fixario button.button-back").click(function () {
    $("#step-3-fixario").hide();
    $("#step-2-fixario").show();
  });*/

  $("#step-4-fixario button#next-step").click(function () {
    $.ajax({
      type: "GET",
      url: "/api/contracts/customer?contractId=" + technicalObj.contractId + "&technicianId=" + technicalObj.technicianId + "&accept=" + true,
      success: function (data) {
        window.location = "/dashboard/jobs";
      }
    });


  });

  $("#step-4-fixario button#abort").click(function () {

    $.ajax({
      type: "GET",
      url: "/api/contracts/customer?contractId=" + technicalObj.contractId + "&technicianId=" + technicalObj.technicianId + "&accept=" + false,
      success: function (data) {
        $("#cancelModal").modal();
      }
    });
  });


  $("#confirm-activate").click(function () {
    $.modal.close();
    $("#step-4-fixario").hide();
    $("#step-2-fixario").show();
    $('#waitingModal').modal();
    new Circlebar({
      element: "#circle-1",
      startValue: 0,
      maxValue: 40,
      fontSize: "22px",
      fontColor: "#0195FF",
      triggerPercentage: true,
      counter: 1000,
      dialWidth: '12px',
      size: '130px',
      type: "timer"
    });


    $.ajax({
      url: "/api/user-infos/search-technicians",
      type: "POST",
      contentType: 'application/json',
      data: JSON.stringify(searchObject),
      dataType: 'json',
      complete: function (xhr) {

        if (xhr.status == 200) {
          let technician = {};
          try {
            technician = JSON.parse(xhr.responseText);
            if (technician.message) {
              console.log(technician.message);
            }
            removeTimes();
          } catch (e) {
            //alert(xhr.responseText);
            console.log(xhr);
            console.log(e);
            console.log(xhr.responseText);
            removeTimes();
            return false;
          }
          if (cancelSearch) {
            return;
          }
          if (technician.success === false) {
            clearInterval(waitInterval);
            clearTimeout(insideInterval);
            setTimeout(() => {
              $.modal.close();
            }, 300);
            setTimeout(() => {
              removeFilled();
              $('#requestAcceptedModal').modal();
            }, 1000);
            return;
          }
          removeTimes();
          if (technician.message) {
            console.log(technician.message);
          }

          technicalObj = technician;
          let newCompanyName = [];
          let companyNameAr = technicalObj.companyName.split('');
          console.log(companyNameAr);
          let newDateFormat = moment(jobStartDate).format('ddd, MMM DD, HH:mm a');


          for (let i = 0; i < companyNameAr.length; i++) {
            if (i === 0) {
              newCompanyName.push(companyNameAr[i]);
            } else if (i === companyNameAr.length - 1) {
              newCompanyName.push(companyNameAr[i]);
            } else {
              newCompanyName.push('*');
            }
          }
          newCompanyName = newCompanyName.join('');
          let overalratin = ((technicalObj.ratingFriendly + technicalObj.ratingPunctuality + technicalObj.ratingQuality) / 3).toFixed(1);
          $("#step-4-fixario #amount").html(`<img src="/img/requests/good-face.svg"><span>${overalratin}</span><span class="position">(${technicalObj.ratingCount})</span>`);
          $("#step-4-fixario .step-description").html(`A technicians company ${newCompanyName} has accepted your query and is ready to arrive on your location on <span class="date-of-work">${newDateFormat}</span>`);
          $("#step-4-fixario div.name-block span.tech-name").text(technician.firstName + " " + technician.lastName);
          $("#step-4-fixario div.avatar-block img").attr("src", technician.profileUrl);


          $("#step-2-fixario").hide();
          $("#step-4-fixario").show();

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
            for (let i = 0; i < errorFields.length; i++) {
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



});

function validateZip(zip) {
  var zipRGEX = /^(?!01000|99999)(0[1-9]\d{3}|[1-9]\d{4})$/;
  return zipRGEX.test(zip);
}
