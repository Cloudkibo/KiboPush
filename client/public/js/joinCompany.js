/**
 * Created by sojharo on 08/01/2018.
 */
var token = window.location.pathname.split('/')[4]
console.log(token)

$(document).ready(function() {
  var emailString = readCookie("email").split('%40');
  emailString = emailString[0] + '@' + emailString[1];
  $("#email").val(emailString)
  $("#applyBtn").click(function () {
    document.getElementById("alertMsg").innerHTML = ""
    var name = $("#name").val()
    var email = $("#email").val()
    var password = $("#password").val()
    var rpassword = $("#rpassword").val()

    if (password !== rpassword) {
      return document.getElementById("alertMsg").innerHTML = "Passwords don't match."
    } else if (password.length <= 6) {
      return document.getElementById(
        "alertMsg").innerHTML = "Length of password should be greater than 6 "
    }

    $.ajax({
      url : '/api/users/joinCompany',
      type : 'POST',
      data : {
        'name': name,
        'email': email,
        'password': password,
        'token': token
      },
      dataType:'json',
      success : function(data) {
        console.log('Data: '+data);
        window.location = '/';
      },
      error : function(request,error)
      {
        console.log("Request: "+JSON.stringify(request));
      }
    });
  })
})

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
