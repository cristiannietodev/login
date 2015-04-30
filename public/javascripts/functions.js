var baseurl = "http://localhost:3000/";//baseurl

//en ie8 no funciona preventDefault
function ie8SafePreventEvent(event)
{
    (event.preventDefault) ? event.preventDefault() : event.returnValue = false;
}

function validateMessage(String message){
  if (confirm(message)) {
      return true;
  } else {
      return false;
  }
}

$(document).ready(function()
{
  //al hacer submit al formulario de registro
  $("#registerForm").on("submit", function(e)
  {
      //prevenimos el comportamiento por defecto
      ie8SafePreventEvent(e);

      //obtenemos los valores que necesitamos para procesar el formulario
      var username = $(".username").val(),
      password = $(".password").val(),
      repassword = $(".repassword").val();

      //sencilla comprobacion para que venga algo de información
      if(username.length < 4 || password.length < 6)
      {
          showModal("Error formulario","Los campos no pueden estar vacios");
          return false;
      }

      //si el password es distinto del confirmar password no dejamos pasar
      if(password !== repassword)
      {
          showModal("Error formulario","Los passwords deben coincidir");
          return false;
      }
      //si todo ha ido bien procesamos la petición con node
      $.ajax({
          method: "POST",//metodo|verbo con el que procesamos la peticion
          url: baseurl + "register",//url a la que hacemos la petición
          data: $(this).serialize(),//datos del formulario
          success: function(data){
              //si se crea el registro
              if(data === "creado")
              {
                  showModal("Registro correcto","Te has registrado correctamente.");
                  $(".username,.password,.repassword").val("");
              }
              //si ya existe
              else
              {
                  showModal("Usuario existente","Usuario ya ocupado en la base de datos.");
                  $(".username").val("");
              }
          },
          error: function(jqXHR, exception){
              showModal("Error formulario","Error procesando la petición");
          }
      });
  });
});

//funcion que recibe como parametros el titulo y el mensaje de la ventana modal
//reaprovechar codigo siempre que se pueda
function showModal(title,message)
{
    $("h2.title-modal").text(title);
    $("p.messageModal").text(message);
    $("#myModal").modal('show');
}

/*function editReporte(idreporte){
  $.ajax({
      method: "POST",//metodo|verbo con el que procesamos la peticion
      url: baseurl + "editreporte",//url a la que hacemos la petición
      data: $(this).serialize(),//datos del formulario
      success: function(data){
          //si los datos de acceso no son correctos
          if(data === "error")
          {
              showModal("Datos incorrectos","Los datos de acceso son incorrectos.");
          }

          $("#div_content").html(data);

      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert('error ' + textStatus + " " + errorThrown);
      }
  });
}*/
