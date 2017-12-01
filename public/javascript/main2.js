(function($) {

  $(document).ready(function() {
    "use strict";

    var locationRef = window.location.href;
    var error = locationRef.split("?")[1];

    console.log(error);

    if (error) {
      $('.register').before('</br><p class="result">Login to access resources.</p>');
    }

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
            var currentHref = window.location.href;
            window.location.href = currentHref.replace('login', 'dashboard/' + response.userId).replace('?error','');
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
