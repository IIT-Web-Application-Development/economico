// $.noConflict();

(function($) {

  var userId = $('.wrapper').attr('data-userid');

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

    var expenses = [];
    $('.is-chart').addClass('disable');
    $('#table-expenses tbody tr:not(#no-data-found)').each(function() {
      var amount = $(this).find('.amount').html()
      if (typeof amount != "undefined") {
        amount = amount.replace('$', '');
      }
      var expense = {
        _id: $(this).attr('id'),
        title: $(this).find('.title').html(),
        description: $(this).find('.description').html(),
        category: $(this).find('.category span').html(),
        amount: amount,
        date: $(this).find('.date').html(),
        createdAt: $(this).find('.createdAt').html()
      }
      expenses.push(expense);
    });
    console.log(expenses);
    if (expenses.length > 0) {
      $('.is-chart').removeClass('disable');
    }

    //Assign categories color class
    $('td.category .label').each(function() {
      var name = $(this).html();
      var color = $('.categories-list #' + name).attr('data-color');
      $(this).css({
        'background-color': color
      });
    });

    //--------------REGISTER---------------//
    $('#register-form').on('submit', function(e) {
      $('#register-form .result').remove();
      $('#register-form .label-warning').remove();
      e.preventDefault();
      $('.register-box-body .result').remove();
      var data = objectifyForm($(this));
      if (data['password'] === data['retype-password']) {

        console.log("Form submitted! Let's get the info for", username);
        $.ajax({
          url: "/users/",
          type: "POST",
          data: JSON.stringify(data),
          contentType: "application/json",
          success: function(data, status) {
            $('#register-form .label-warning').remove();
            var currentHref = window.location.href;
            // wondow.location.href = currentHref.replace('register', 'login');
            $('#register-form input').val('');
            $('.invalidnumber').remove();
            $('.login-btn').before('</br><p class="result">You\'ve been successfully registered.</p>');
            $('.login-btn').html('Login here.');
            console.log(data);
            setCookie('ec_username', data.user._id, 360);
          },
          error: function(error) {
            console.log(error);
            if (error.responseJSON.exists) {
              $('.login-btn').before('</br><p class="result">Username already exists. Choose another username.</p>');
            }
          }
        });
      } else {
        $('#register-form').after("</br><p label label-warning>Passwords don't match!</p>");
      }
    });

    //-------------CRUD-----------------//
    //Add expense
    $('#add-expense-form').on('submit', function(e) {
      console.log("TEST");
      e.preventDefault();
      $('.register-box-body .result').remove();
      var data = objectifyForm($(this));
      var x = data.amount;
      $('.invalidnumber').remove();
      if (isNaN(x)) {
        $('#add-expense-form input[name="amount"]').closest('.form-group').append('<p class="invalidnumber">Input should be number!</p>');
        return false;
      }
      var d = new Date();
      data.createdAt = d.toISOString();
      d = new Date(data.date);
      data.date = d.toISOString();
      $.ajax({
        url: "/users/" + userId + "/costs/",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(data, status) {
          var total = data.total;
          data = data.expense;
          var createdAt = new Date(data.createdAt);
          var date = new Date(data.date);
          var currentHref = window.location.href;

          //get color
          var name = data.category;
          var color = $('.categories-list #' + name).attr('data-color');

          // wondow.location.href = currentHref.replace('register', 'login');
          var $tableRow = '<tr id="' + data._id + '"><td class="title">' +
            data.title + '</td><td class="description">' + data.description +
            '</td><td class="category"><span class="label" style="background-color:' + color + '">' + data.category +
            '</span></td><td class="amount">$' +
            data.amount + '</td>  <td class="date">.' + date + '</td><td><div class="tools"><a data-toggle="modal" data-target="#modal-Doughnutpense" class="fa fa-edit Doughnutpense"></a>  <a data-toggle="modal" data-target="#modal-trash-expense" class="fa fa-trash-o ask-trash-expense"></a></div></td></tr>';
          $('#expenses-list tbody').prepend($tableRow);
          $('#total').html('$' + total);

          $('#add-expense-form input,#add-expense-form textarea,#add-expense-form select').val('');
          // $('#modal-add-expense').modal('toggle');

          $('.is-chart').removeClass('disable');

          //UPDATE var expenses[]
          var newExpense = data;
          expenses.push(data);
          categories.forEach(function(category) {
            if (category.name === data.category) {
              category.total = parseFloat(category.total) + parseFloat(data.amount);
            }
          });
          updateCategoryBoxes(categories);

          //Since both categories and expenses contain now new data
          //Add js-generate class to chart tabs, so the charts will be regenerated
          $('.is-chart').addClass('js-generate');
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
      var x = data.amount;
      $('.invalidnumber').remove();
      if (isNaN(x)) {
        $('#edit-expense-form input[name="amount"]').closest('.form-group').append('<p class="invalidnumber">Input should be number!</p>');
        return false;
      }
      var url = $(this).attr('action');
      console.log(url);
      $.ajax({
        url: url,
        type: "PUT",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(data, status) {
          console.log(data);
          var total = data.total;
          data = data.expense;

          var currentHref = window.location.href;
          var date = new Date(data.date);
          //get colour
          var name = data.category;
          var color = $('.categories-list #' + name).attr('data-color')

          var $tableRowHtml = '<td class="title">' +
            data.title + '</td><td class="description">' + data.description +
            '</td><td class="category"><span class="label" style="background-color:' + color + '">' + data.category +
            '</span></td><td class="amount">$' + data.amount +
            '</td><td class="date">.' + date + '</td><td><div class="tools"><a data-toggle="modal" data-target="#modal-edit-expense" class="fa fa-edit edit-expense"></a>  <a data-toggle="modal" data-target="#modal-trash-expense" class="fa fa-trash-o ask-trash-expense"></a></div></td>';
          $('#' + data._id).html($tableRowHtml);
          $('#total').html('$' + total);
          $('#modal-edit-expense').modal('toggle');

          //UPDATE var expenses[]
          expenses.forEach(function(expense, index, expenses) {
            if (expense._id == data._id) {
              //UPDATE var categories[]
              categories.forEach(function(category) {
                if (expense.category === category.name) {
                  console.log('test');
                  category.total = (parseFloat(category.total) - parseFloat(expense.amount)) + parseFloat(data.amount);
                }
              });
              expense.title = data.title;
              expense.description = data.description;
              expense.date = data.date;
              expense.amount = data.amount;
              expense.category = data.category;
              expense.createdAt = data.createdAt;
            }
          });

          updateCategoryBoxes(categories);

          //Since both categories and expenses contain now new data
          //Add js-generate class to chart tabs, so the charts will be regenerated
          $('.is-chart').addClass('js-generate');
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
      $.ajax({
        url: '/users/' + userId + '/costs/' + expenseId,
        type: 'DELETE',
        success: function(result) {
          $('#' + expenseId).remove();
          $('#modal-trash-expense').modal('toggle');
          console.log(result);
          $('#total').html('$' + result.total);

          //UPDATE var expenses[]
          expenses.forEach(function(expense, index, expenses) {
            if (expense._id === expenseId) {
              //UPDATE var categories[]
              categories.forEach(function(category) {
                if (expense.category === category.name) {
                  category.total -= expense.amount;
                }
              });
              expenses.splice(index, 1);
            }
          });
          if (expenses.length == 0) {
            $('.is-chart').addClass('disable');
          }

          updateCategoryBoxes(categories);

          //Since both categories and expenses contain now new data
          //Add js-generate class to chart tabs, so the charts will be regenerated
          $('.is-chart').addClass('js-generate');
        }
      });
    });
    //Delete all expensea
    $(document).on('click', '.trash-all-expenses', function(e) {
      e.preventDefault();
      $.ajax({
        url: '/users/' + userId + '/costs/',
        type: 'DELETE',
        success: function(result) {
          $('#modal-trash-all-expenses').modal('toggle');
          console.log(result);
          $('#total').html('$' + result.total);
          var $tableRowHtml = '<tr id="no-data-found"><td colspan="5">' + result.message + '</td>';
          $('#table-expenses tbody').html($tableRowHtml);

          //UPDATE var expenses[]
          expenses = [];
          $('.is-chart').addClass('disable');
          //UPDATE var categories[]
          categories.forEach(function(category) {
            category.total = 0;
          });
          updateCategoryBoxes(categories);

          //Since both categories and expenses contain now new data
          //Add js-generate class to chart tabs, so the charts will be regenerated
          $('.is-chart').addClass('js-generate');
        }
      });
    });

    //Get expenses in expenses
    $('#get-expenses-form').on('submit', function(e) {
      e.preventDefault();
      var data = objectifyForm($(this));
      var from = new Date(data.from);
      console.log(data.from);
      data.from = from.getTime();
      var to = new Date(data.to);
      data.to = to.getTime();
      var url = $(this).attr('action');

      if (data.from && data.to) {
        url += '?from=' + data.from + '&to=' + data.to;
      } else if (data.from) {
        url += '?from=' + data.from;
      } else if (data.to) {
        url += '?to=' + data.to;
      }

      $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json",
        success: function(dataArray, status) {
          if (dataArray.length > 0) {
            //RESET categories totals
            categories.forEach(function(category) {
              category.total = 0;
            });
            //RESET expenses
            expenses = [];
            //RESET total
            var total = 0;
            //RESET table
            $('#table-expenses tbody').html('');
            dataArray.forEach(function(data) {
              //Change date format
              var date = new Date(data.date);
              //get colour from ul categories color attribute
              var color = $('.categories-list #' + data.category).attr('data-color')
              total += parseFloat(data.amount);
              //UPDATE table row
              var $tableRowHtml = '<tr id="' + data._id + '"><td class="title">' +
                data.title + '</td><td class="description">' + data.description +
                '</td><td class="category"><span class="label" style="background-color:' + color + '">' + data.category +
                '</span></td><td class="amount">$' + data.amount +
                '</td><td class="date">.' + date + '</td><td><div class="tools"><a data-toggle="modal" data-target="#modal-edit-expense" class="fa fa-edit edit-expense"></a>  <a data-toggle="modal" data-target="#modal-trash-expense" class="fa fa-trash-o ask-trash-expense"></a></div></td></tr>';
              $('#table-expenses tbody').append($tableRowHtml);
              //UPDATE var categories[] totals
              categories.forEach(function(category) {
                if (category.name == data.category) {
                  category.total += data.amount;
                }
              });
              //UPDATE var expenses[]
              var expense = {
                _id: data._id,
                title: data.title,
                description: data.title,
                category: data.category,
                amount: data.amount,
                date: data.date,
                createdAt: data.createdAt,
              }
              expenses.push(expense);
            });

            //Update categoryBoxes
            updateCategoryBoxes(categories);

            //Since both categories and expenses contain now new data
            //Add js-generate class to chart tabs, so the charts will be regenerated
            $('.is-chart').addClass('js-generate');
            //Regenerate chart on expanded chart tab
            if ($('.is-chart[aria-expanded="true"]').length) {
              $('.is-chart[aria-expanded="true"]')[0].click();
            }
            $('#no-data-found').remove();
            $('#total').html('$' + total);
            $('.is-chart').removeClass('disable');
          } else {
            var $tableRowHtml = '<tr id="no-data-found"><td colspan="5">' + dataArray.message + '</td>';
            $('#table-expenses tbody').html($tableRowHtml);
            $('.is-chart').addClass('disable');
          }

        },
        error: function(error) {
          console.log(error);
          var $tableRowHtml = '<tr id="no-data-found"><td colspan="5">' + error.message + '</td>';
          $('#table-expenses tbody').html($tableRowHtml);
          $('.is-chart').addClass('disable');
        }
      });
    });

    //-------------FILTER--------------------//
    //Date range picker
    $('#from-date').datepicker({
      onSelect: function(date, inst) {
        console.log(date);
      },
      selectWeek: true,
      inline: true,
      startDate: '01/01/2000',
      maxDate: new Date(),
      firstDay: 1
    });
    $('#to-date').datepicker({
      onSelect: function(date, inst) {
        console.log(date);
      },
      selectWeek: true,
      inline: true,
      startDate: '01/01/2000',
      maxDate: new Date(),
      firstDay: 1
    });
    $('.datepicker').datepicker({
      onSelect: function(date, inst) {
        console.log(date);
      },
      selectWeek: true,
      inline: true,
      startDate: '01/01/2000',
      maxDate: new Date(),
      firstDay: 1
    });



    //--------------MODALS-------------------//
    //Edit expense
    $('.edit-expense').on('click', function() {
      var expenseId = $(this).closest('tr').attr('id');
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
      var title = $(this).closest('tr').find('.title').html();
      $('#modal-trash-expense').find('.modal-title').html(title);
      $('#modal-trash-expense').attr({
        'data-userid': userId,
        'data-expenseId': expenseId
      });
    });

    //Trash all expenses
    $(document).on('click', '.ask-trash-all-expenses', function(e) {
      e.preventDefault();
      var expenseId = $(this).closest('tr').attr('id');
      var userId = $(this).closest('table').attr('data-userId');
      var title = $(this).closest('tr').find('.title').html();
      $('#modal-trash-all-expenses').attr({
        'data-userid': userId
      });
    });

    //--------------CHARTS------------------//
    $('.is-chart').on('click', function() {
      var href = $(this).attr('href');
      if ($(this).hasClass('js-generate')) {
        generateChart(href, categories, expenses);
        $(this).removeClass('js-generate');
      }
    });

    function generateChart(href, categories, expenses) {
      $(href).addClass('active');

      if (href == "#expenses-doughnut-chart") {
        //-------------
        //- PIE CHART -
        //-------------

        //Reset canvas
        $('#doughnutChart').remove();
        $('#expenses-doughnut-chart .box-body').append('<canvas id="doughnutChart"><canvas>');

        var doughnutChartCanvas = $('#doughnutChart').get(0).getContext('2d');
        var doughnutChart = new Chart(doughnutChartCanvas);
        var DoughnutData = [];

        categories.forEach(function(category) {
          var dataItem = {
            value: category.total,
            color: category.color,
            highlight: category.color,
            label: category.name
          }
          DoughnutData.push(dataItem);
        });
        console.log(DoughnutData);

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
          legends: true,
          //String - A legend template
          legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
        }
        //Create doughnut or douhnut chart
        // You can switch between doughnut and douhnut using the method below.
        doughnutChart.Doughnut(DoughnutData, doughnutOptions);
        // $('#doughnutLegend').html(doughnutChart.generateLegend());

      } else if (href == "#expenses-bar-chart") {
        //-------------
        //- BAR CHART -
        //-------------
        //Reset canvas
        $('#barChart').remove();
        $('#expenses-bar-chart .box-body').append('<canvas id="barChart"><canvas>');

        var barChartCanvas = $('#barChart').get(0).getContext('2d');
        var barChart = new Chart(barChartCanvas);
        var barChartData = generateBarChartData(expenses, categories);
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

        barChart.Bar(barChartData, barChartOptions);
      }
    }

    //----------------DATA TABLES----------------//
    $(function() {
      $('#table-expenses').DataTable({
        'paging': true,
        'lengthChange': true,
        'searching': true,
        'ordering': false,
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

  //--------------LOGIN FORM---------------//
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
          var currentHref = window.location.href;
          window.location.href = currentHref.replace('login', 'dashboard/' + response.userId).replace('?error', '');
        },
        401: function(response) {
          $('p.result').detach();
          $('.register').before('</br><p class="result">Username/Password wrong.</p>');

        },
        500: function(response) {
          console.log(response);
        }
      }
    });
  });

  //--------------EDIT USER SETTINGS---------------//
  $('#settings-form').on('submit', function(e) {
    console.log("TEST");
    e.preventDefault();
    var data = objectifyForm($(this));
    $.ajax({
      url: "/settings/" + $("#_id").val(),
      type: "PUT",
      data: JSON.stringify(data),
      contentType: "application/json",
      statusCode: {
        204: function(response) {
          console.log("User updated");
          $(".submit-settings").before('</br><p class="result">User updated.</p>')
        },
        500: function(response) {
          console.log(response);
          $(".submit-settings").before('</br><p class="result">Internal Error.</p>')
        }
      }
    });
  });

  //--------------EDIT USER PASSWORD---------------//
  $('#edit-password-form').on('submit', function(e) {
    console.log("TEST");
    e.preventDefault();
    var data = objectifyForm($(this));
    // console.log("Form submitted! Let's get the info for", username);
    $.ajax({
      url: "/settings/" + $("#userId").val() + "/changePassword",
      type: "PUT",
      data: JSON.stringify(data),
      contentType: "application/json",
      statusCode: {
        204: function(response) {
          $(".submit-settings-modal").before('</br><p class="result">Password Changed</p>');
        },
        401: function(response) {
          $(".submit-settings-modal").before('</br><p class="result">Old Password wrong!</p>');
        },
        500: function(response) {
          $(".submit-settings-modal").before('</br><p class="result">Internal Error!</p>');
        }
      }
    });
  });

  //--------------DELETE USER---------------//
  $('.btn-delete').click(function() {
    $.ajax({
      url: "/users/" + $("#userId").val(),
      type: "DELETE",
      contentType: "application/json",
      statusCode: {
        200: function(response) { // $(".submit-settings").before('</br><p class="result">Internal Error.</p>')
          var currentHref = window.location.href;
          window.location.href = currentHref.replace('settings/' + $("#userId").val(), 'login');

        }
      }
    });
  });

  //------------FUNCTIONS-----------------------//

  function updateCategoryBoxes(categories) {
    var $categoryBoxHtml = $('#categories-totals .small-box').html();
    $('#categories-totals .small-box h3').html('$' + 0);
    categories.forEach(function(category) {
      $('#box-' + category.name + ' h3').html('$' + parseFloat(category.total).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
    });
  }

  function generateBarChartData(expenses, categories) {

    var selectedYear = (new Date()).getFullYear();
    var barChartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: []
    }

    categories.forEach(function(category, index) {
      var dataset = {
        label: category.name,
        fillColor: category.color,
        strokeColor: category.color,
        pointColor: category.color,
        pointStrokeColor: category.color,
        pointHighlightFill: '#fff',
        pointHighlightStroke: category.color,
        data: []
      };

      barChartData.labels.forEach(function(label, labelIndex, labels) {
        dataset.data[labelIndex] = 0;
      });
      expenses.forEach(function(expense) {
        var expenseDate = new Date(expense.date);
        var month = expenseDate.getMonth();
        var year = expenseDate.getFullYear();
        if ((expense.category === category.name) && year == selectedYear) {
          console.log(expense.category);
          dataset.data[month] += parseFloat(expense.amount);
        }
      });

      barChartData.datasets.push(dataset);
    });

    return barChartData;
  }

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
