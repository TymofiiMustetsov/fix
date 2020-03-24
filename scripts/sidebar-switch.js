
  $(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
      $('#sidebarCollapse').toggleClass('active');
      $('#sidebar').toggleClass('active');
      $('.sidebar-wrapper').toggleClass('active');
    });
  });
