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
    $('.btn-delete').click(function(){
      $.ajax({
        url: "/users/" + $("#userId").val(),
        type: "DELETE",
        contentType: "application/json",
        statusCode: {
          200: function(response){
            // $(".submit-settings").before('</br><p class="result">Internal Error.</p>')
            var currentHref = window.location.href;
            window.location.href = currentHref.replace('settings/' + $("#userId").val(), 'login');
          
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
