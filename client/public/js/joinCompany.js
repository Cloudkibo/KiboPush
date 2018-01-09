/**
 * Created by sojharo on 08/01/2018.
 */
var token = window.location.pathname.split('/')[4]
console.log(token)

$(document).ready(function() {
  $("#applyBtn").click(function () {
    var name = $("#name").val()
    var email = $("#email").val()
    var password = $("#password").val()
    var rpassword = $("#rpassword").val()

    if (password !== rpassword) {
      return alert("Passwords are not same")
    }

    $.ajax({
      url : '/api/users/joinCompany',
      type : 'POST',
      data : {
        'name' : 10
      },
      dataType:'json',
      success : function(data) {
        console.log('Data: '+data);
      },
      error : function(request,error)
      {
        console.log("Request: "+JSON.stringify(request));
      }
    });
  })
})
