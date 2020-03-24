var showRequests;
$(document).ready(function () {
  if (document.querySelector('.custom-select-wrapper')) {
  document.querySelector('.custom-select-wrapper').addEventListener('click', function () {
    this.querySelector('.custom-select').classList.toggle('open');
  });

  for (const option of document.querySelectorAll(".custom-option")) {
    if (option.classList.contains('selected')) {
      showRequests = option.textContent;
      console.log("'showRequests' variable value: " + showRequests);
    }
    option.addEventListener('click', function() {
      if (!this.classList.contains('selected')) {
        this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
        this.classList.add('selected');
        this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.textContent;
        showRequests = option.textContent;
        console.log("'showRequests' variable value: " + showRequests);
      }
    })
  }
  }
});
