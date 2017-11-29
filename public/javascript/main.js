// $.noConflict();

(function($) {

  $(document).ready(function() {
    "use strict";

    //-----------------UI------------------//
    //Create categories array from categories List
    var categories = [];
    $('.categories-list li').each(function() {
      var category = {
        name: $(this).attr('id'),
        color: $(this).attr('data-color'),
        total: $(this).attr('data-total')
      }
      // categories[$(this).attr('id')] = category;
      categories.push(category);
    });

    //Assign categories color class
    $('td.category .label').each(function() {
      var name = $(this).html();
      var color = $('.categories-list #' + name).attr('data-color');
      $(this).addClass('label-' + color + '');
    });

    //--------------REGISTER---------------//
    $('#register-form').on('submit', function(e) {
      console.log("TEST");
      e.preventDefault();
      $('.register-box-body .result').remove();
      var data = objectifyForm($(this));
      console.log("Form submitted! Let's get the info for", username);
      $.ajax({
        url: "/users/",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(data, status) {
          var currentHref = window.location.href;
          // wondow.location.href = currentHref.replace('register', 'login');
          $('#register-form input').val('');
          $('.login-btn').before('</br><p class="result">You\'ve been successfully registered.</p>');
          $('.login-btn').html('Login here.');
          console.log(data);
          setCookie('ec_username', data.user._id, 360);
        },
        error: function(error) {
          console.log(error);
        }
      });
    });

    //--------------LOGIN---------------//
    $('#login-form').on('submit', function(e) {
      console.log("TEST");
      e.preventDefault();
      var data = objectifyForm($(this));
      // console.log("Form submitted! Let's get the info for", username);
      $.ajax({
        url: "/login",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        statusCode: {
          200: function(response) {
            console.log("You are logged in");
          },
          404: function(response) {
            console.log("Username or password wrong");
          },
          500: function(response) {
            console.log(response);
          }
        }
        /*success: function(theData, status) {
          if(status === 'success'){
            console.log("Username or password wrong");
          }else if(status === 200){
            console.log("successfuly login");
          }
          var currentHref = window.location.href;
          // wondow.location.href = currentHref.replace('register', 'login');
          // console.log("You have been successfully logged in");
        },
        error: function(error) {
          console.log(error);
        }*/
      });
    });








    //-------------CRUD-----------------//
    //Add expense
    $('#add-expense-form').on('submit', function(e) {
      console.log("TEST");
      e.preventDefault();
      $('.register-box-body .result').remove();
      var data = objectifyForm($(this));
      var d = new Date();
      var n = d.toISOString();
      data.createdAt = n;
      $.ajax({
        url: "/users/" + data.userid + "/costs/",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(data, status) {
          data = data.expense;
          var createdAt = new Date(data.createdAt);
          var currentHref = window.location.href;
          // wondow.location.href = currentHref.replace('register', 'login');
          var $tableRow = '<tr id="' + data._id + '"><td>' +
            data.title + '</td><td>' + data.description +
            '</td><td><span class="label label-success">' + data.category +
            '</span></td><td>.' + data.createdAt + '</td><td><div class="tools"><i class="fa fa-edit"> </i><i class="fa fa-trash-o"></i></div></td></tr>';
          $('#expenses-list tbody').prepend($tableRow);
          $('#modal-add-expense').modal('toggle');
        },
        error: function(error) {
          console.log(error);
        }
      });
    });

    //Edit expense
    $('#edit-expense-form').on('submit', function(e) {
      e.preventDefault();
      var data = objectifyForm($(this));
      var d = new Date();
      var n = d.toISOString();
      data.createdAt = n;
      var url = $(this).attr('action');
      console.log(url);
      $.ajax({
        url: url,
        type: "PUT",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(data, status) {
          data = data.expense;
          console.log(data);
          var currentHref = window.location.href;
          var $tableRowHtml = '<td>' +
            data.title + '</td><td>' + data.description +
            '</td><td><span class="label label-success">' + data.category +
            '</span></td><td>.' + data.createdAt + '</td><td><div class="tools"><i class="fa fa-edit"> </i><i class="fa fa-trash-o"></i></div></td>';
          $('#' + data._id).html($tableRowHtml);
          $('#modal-edit-expense').modal('toggle');
        },
        error: function(error) {
          console.log(error);
        }
      });
    });

    //Delete expense
    $(document).on('click', '.trash-expense', function(e) {
      e.preventDefault();
      var expenseId = $('#modal-trash-expense').attr("data-expenseId");
      var userId = $('#modal-trash-expense').attr("data-userid");
      $.ajax({
        url: '/users/' + userId + '/costs/' + expenseId,
        type: 'DELETE',
        success: function(result) {
          $('#' + expenseId).remove();
          $('#modal-hide-expense').modal('toggle');
        }
      });
    });


    //--------------MODALS-------------------//
    //Edit expense
    $('.edit-expense').on('click', function() {
      var expenseId = $(this).closest('tr').attr('id');
      var userId = $(this).closest('table').attr('data-userId');
      var title = $(this).closest('tr').find('.title').html();
      var description = $(this).closest('tr').find('.description').html();
      var category = $(this).closest('tr').find('.category span').html();
      var amount = $(this).closest('tr').find('.amount').html().replace('$', '');

      $('#modal-edit-expense form').attr({
        'action': '/users/' + userId + '/costs/' + expenseId
      });
      $('#modal-edit-expense').find('input[name="title"]').val(title);
      $('#modal-edit-expense').find('input[name="description"]').val(description);
      $('#modal-edit-expense').find('select[name="category"]').val(category);
      $('#modal-edit-expense').find('input[name="amount"]').val(amount);
    });
    //Trash expense
    $(document).on('click', '.ask-trash-expense', function(e) {
      e.preventDefault();
      var expenseId = $(this).closest('tr').attr('id');
      var userId = $(this).closest('table').attr('data-userId');
      var title = $(this).closest('tr').find('.title').html();
      $('#modal-trash-expense').find('.modal-title').html(title);
      $('#modal-trash-expense').attr({
        'data-userid': userId,
        'data-expenseId': expenseId
      });
    });

    //--------------CHARTS------------------//
    $('.is-chart').on('click', function() {
      var href = $(this).attr('href');
      generateChart(href);

    });

    function generateChart(href) {
      $(href).addClass('active');
      if (href == "#expenses-doughnut-chart" && !$(href).hasClass('generated')) {
        $(href).addClass('generated')
        console.log(href);
        console.log("TEST");
        //-------------
        //- PIE CHART -
        //-------------
        // Get context with jQuery - using jQuery's .get() method.
        var doughnutChartCanvas = $('#doughnutChart').get(0).getContext('2d')
        var doughnutChart = new Chart(doughnutChartCanvas)
        var DoughnutData = [{
            value: 405,
            color: '#f56954',
            highlight: '#f56954',
            label: 'Travel($)'
          },
          {
            value: 11000,
            color: '#00a65a',
            highlight: '#00a65a',
            label: 'Education($)'
          },
          {
            value: 560,
            color: '#f39c12',
            highlight: '#f39c12',
            label: 'Bills($)'
          },
          {
            value: 160,
            color: '#00c0ef',
            highlight: '#00c0ef',
            label: 'Groceries($)'
          }
        ]
        var doughnutOptions = {
          //Boolean - Whether we should show a stroke on each segment
          segmentShowStroke: true,
          //String - The colour of each segment stroke
          segmentStrokeColor: '#fff',
          //Number - The width of each segment stroke
          segmentStrokeWidth: 2,
          //Number - The percentage of the chart that we cut out of the middle
          percentageInnerCutout: 50, // This is 0 for Doughnut charts
          //Number - Amount of animation steps
          animationSteps: 100,
          //String - Animation easing effect
          animationEasing: 'easeOutBounce',
          //Boolean - Whether we animate the rotation of the Doughnut
          animateRotate: true,
          //Boolean - Whether we animate scaling the Doughnut from the centre
          animateScale: false,
          //Boolean - whether to make the chart responsive to window resizing
          responsive: true,
          // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
          maintainAspectRatio: true,
          //String - A legend template
          legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'
        }
        //Create doughnut or douhnut chart
        // You can switch between doughnut and douhnut using the method below.
        doughnutChart.Doughnut(DoughnutData, doughnutOptions)
      } else if (href == "#expenses-bar-chart" && !$(href).hasClass('generated')) {
        $(href).addClass('generated');
        //-------------
        //- BAR CHART -
        //-------------
        var barChartCanvas = $('#barChart').get(0).getContext('2d')
        var barChart = new Chart(barChartCanvas)
        var barChartData = {
          labels: ['June', 'July', 'August', 'September', 'October', 'November', 'December'],
          datasets: [{
              label: 'Education',
              fillColor: 'rgba(210, 214, 222, 1)',
              strokeColor: 'rgba(210, 214, 222, 1)',
              pointColor: 'rgba(210, 214, 222, 1)',
              pointStrokeColor: '#c1c7d1',
              pointHighlightFill: '#fff',
              pointHighlightStroke: 'rgba(220,220,220,1)',
              data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
              label: 'Groceries',
              fillColor: 'rgba(60,141,188,0.9)',
              strokeColor: 'rgba(60,141,188,0.8)',
              pointColor: '#3b8bba',
              pointStrokeColor: 'rgba(60,141,188,1)',
              pointHighlightFill: '#fff',
              pointHighlightStroke: 'rgba(60,141,188,1)',
              data: [28, 48, 40, 19, 86, 27, 90]
            }
          ]
        }

        var barChartOptions = {
          //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
          scaleBeginAtZero: true,
          //Boolean - Whether grid lines are shown across the chart
          scaleShowGridLines: true,
          //String - Colour of the grid lines
          scaleGridLineColor: 'rgba(0,0,0,.05)',
          //Number - Width of the grid lines
          scaleGridLineWidth: 1,
          //Boolean - Whether to show horizontal lines (except X axis)
          scaleShowHorizontalLines: true,
          //Boolean - Whether to show vertical lines (except Y axis)
          scaleShowVerticalLines: true,
          //Boolean - If there is a stroke on each bar
          barShowStroke: true,
          //Number - Pixel width of the bar stroke
          barStrokeWidth: 2,
          //Number - Spacing between each of the X value sets
          barValueSpacing: 5,
          //Number - Spacing between data sets within X values
          barDatasetSpacing: 1,
          //String - A legend template
          legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
          //Boolean - whether to make the chart responsive
          responsive: true,
          maintainAspectRatio: true
        }

        barChartData.datasets[1].fillColor = '#00a65a'
        barChartData.datasets[1].strokeColor = '#00a65a'
        barChartData.datasets[1].pointColor = '#00a65a'
        barChartOptions.datasetFill = false
        barChart.Bar(barChartData, barChartOptions)
      }
    }

    //----------------DATA TABLES----------------//
    $(function() {
      $('#table-expenses').DataTable({
        'paging': true,
        'lengthChange': true,
        'searching': true,
        'ordering': true,
        'info': true,
        'autoWidth': true
      })
    })

    //-----------------LOGIN---------------------//
    if ($('.login-page').length) {
      var userName = getCookie('ec_username');
      $('input[name="username"]').val(userName);
      $('input[name="email"]').val(userName);
    }
    $('.icheck input').iCheck({
      checkboxClass: 'icheckbox_square-blue',
      radioClass: 'iradio_square-blue',
      increaseArea: '20%' // optional
    });
  });

  //------------FUNCTIONS-----------------------//

  //serialize data function
  function objectifyForm($form) {
    var formData = $form.serializeArray();
    var returnArray = {};
    for (var i = 0; i < formData.length; i++) {
      returnArray[formData[i]['name']] = formData[i]['value'];
    }
    return returnArray;
  }

  //Set cookie, w3s version
  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  //Get cookie, w3s version
  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  //Shuffles an array
  function shuffle(array) {
    var j, temp, i;
    for (i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[i];
      array[i] = array[j];
      a[j] = temp;
    }
  }
})(jQuery);
