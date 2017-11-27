$.noConflict();

(function($) {

  var categories = [{
      name: "Education",
      label: 'grey'
    },
    {
      name: "Groceries",
      label: 'green'
    },
    {
      name: "Clothing",
      label: 'red'
    },
    {
      name: "Bills",
      label: 'orange'
    },
    {
      name: "Travel",
      label: 'aqua'
    }
  ];

  $(document).ready(function() {
    "use strict";

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
        success: function(newUser, status) {
          var currentHref = window.location.href;
          // wondow.location.href = currentHref.replace('register', 'login');
          $('.login-btn').before('</br><p class="result">You\'ve been successfully registered.</p>');
          $('.login-btn').html('Login here.');
        },
        error: function(error) {
          console.log(error);
        }
      });
    });

    //-------------CRUD-----------------//
    $('#add-expense-form').on('submit', function(e) {
      console.log("TEST");
      e.preventDefault();
      $('.register-box-body .result').remove();
      var data = objectifyForm($(this));
      $.ajax({
        url: "/users/" + data.userid + "/costs/",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(data, status) {
          data = data.expense;
          var currentHref = window.location.href;
          // wondow.location.href = currentHref.replace('register', 'login');
          var $tableRow = '<tr id="' + data._id + '"><td>' +
            data.title + '</td><td>' + data.description +
            '</td><td><span class="label label-success">' + data.category +
            '</span></td><td>.' + data.createdAt + '</td><td><div class="tools"><i class="fa fa-edit"> </i><i class="fa fa-trash-o"></i></div></td></tr>';
          $('#expenses-list tbody').append($tableRow);
        },
        error: function(error) {
          console.log(error);
        }
      });
    });

    //--------------CHARTS------------------//
    $('.is-chart').on('click', function() {
      var href = $(this).attr('href');
      generateChart(href);

    });

    function generateChart(href) {
      if (href == "#expenses-donut-chart") {
        $('#expenses-donut-chart').show();
        console.log(href);
        console.log("TEST");
        //-------------
        //- PIE CHART -
        //-------------
        // Get context with jQuery - using jQuery's .get() method.
        var pieChartCanvas = $('#pieChart').get(0).getContext('2d')
        var pieChart = new Chart(pieChartCanvas)
        var PieData = [{
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
        var pieOptions = {
          //Boolean - Whether we should show a stroke on each segment
          segmentShowStroke: true,
          //String - The colour of each segment stroke
          segmentStrokeColor: '#fff',
          //Number - The width of each segment stroke
          segmentStrokeWidth: 2,
          //Number - The percentage of the chart that we cut out of the middle
          percentageInnerCutout: 50, // This is 0 for Pie charts
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
        //Create pie or douhnut chart
        // You can switch between pie and douhnut using the method below.
        pieChart.Doughnut(PieData, pieOptions)
      }
    }

    //-----------------LOGIN---------------------//
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
})(jQuery);
