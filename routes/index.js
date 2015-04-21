var express = require('express');
var UserModel = require('../models/user');
var router = express.Router();

//para acceder aquí escribiremos http://localhost:3000/
//req es un objeto que contiene información sobre la solicitud HTTP que provocó el evento.
//En respuesta a req, res se utiliza para devolver la respuesta HTTP que necesitemos.
router.get("/", function(req, res)
    {
        //si ha iniciado sesión no puede volver al login
        if(req.session.username)
        {
            res.redirect("/home");
        }
        //en este caso le decimos que queremos renderizar la vista views/index.jade con algunos datos
        res.render('index', {
            title: 'Formularios en node con Jade y Twitter Bootstrap'
    });
});


//recibimos la interaccion de cuando el usuario envia el formulario de login
router.post("/login", function(req,res)
    {
    	UserModel.loginUser({username:req.body.username,password:req.body.password}, function(data)
    	{
    		if(data)
    		{
          //si los datos no son correctos mandamos error como respuesta
          //a ajax,´así sabe que no ha sido correcto el login
          if(data.msg === "error")
	    		{
            res.render('index',{msg_error: 'Datos ingresados incorrectos'});
	    		}
                //en otro caso creamos la sesión y mandamos logueado,
                //con lo que ajax redirigira a la home al usuario con
                //la sesión iniciada
	    		else
	    		{
            req.session.username = req.body.username;
            req.session.idusuario = data.data.idusuario;
            res.redirect("/reportes");
              //req.session.username = req.body.username;
              //res.send("logueado", 200);
          }
      }
  });
});

//recibimos la interaccion de cuando el usuario envia el formulario de login
router.get("/eliminarreporte", function(req,res)
{
      var idreporte=req.query.idreporte;
      UserModel.deleteReporte({idreporte:idreporte});
      res.redirect("/reportes");
});

router.get("/rededitreporte",function(req,res)
{
  var idreporte=req.query.idreporte;
  UserModel.getReportesIdreporte({idreporte:idreporte},function(data)
  {
      //console.log(data[0]);
      if(data)
      {
        if(data.msg === "error")
        {
          res.render('index',{msg_error: 'Datos ingresados incorrectos'});
        }
        else
        {
          res.render('editarreporte',{title: 'Actualizar reporte',reporte:data.data});
          //res.send('Whee');
          //return res.render('reportes',{title: 'Lista de reportes',reportes:data});
        }
      }else{
        res.send("error", 400);
      }
  });

});

router.post("/editarreporte",function(req,res)
{
  var reporte={nombrereporte:req.body.nombrereporte,detalle:req.body.detallereporte,cantidadregistros:req.body.cantidadregistros,usuariocrea:req.body.usuariocrea,idreporte:req.body.idreporte};
  console.log(reporte);
  UserModel.actualizarReporte(reporte,function(data)
  {
    if(data)
    {
          if(data.msg === "error")
          {
            res.render('index',{msg_error: 'Datos ingresados incorrectos'});
          }
          else
          {
            res.redirect("/reportes");
            //console.log('Exitoso');
            //res.render('reportes',{title: 'Lista de reportes',reportes:data.data});
            //res.send('Whee');
            //return res.render('reportes',{title: 'Lista de reportes',reportes:data});
          }
    }else{
        res.send("error", 400);
    }
  });

});

//mostramos la vista views/home.jade solo si el usuario ha iniciado sesion
router.get("/home", function(req, res)
{
    //si no existe la sesion del usuario redirigimos al login
    if(!req.session.username)
    {
        res.redirect("/");
    }
    //en otro caso mostramos el formulario
    else
    {
        res.render('home', {
            title: 'Bienvenido a nuestra aplicación',
            username: req.session.username//asi accedemos a la sesion del usuario
        });
    }
});

//mostramos la vista views/home.jade solo si el usuario ha iniciado sesion
router.get("/reportes", function(req, res)
{
    //si no existe la sesion del usuario redirigimos al login
    if(!req.session.username)
    {
        res.redirect("/");
    }
    //en otro caso mostramos el formulario
    else
    {
      UserModel.getReportesIdusuario({idusuario:req.session.idusuario},function(data)
      {
          //console.log(data[0]);
          if(data)
          {
            if(data.msg === "error")
            {
              res.render('index',{msg_error: 'Datos ingresados incorrectos'});
            }
            else
            {
              res.render('reportes',{title: 'Lista de reportes',reportes:data.data});
              //res.send('Whee');
              //return res.render('reportes',{title: 'Lista de reportes',reportes:data});
            }
          }else{
            res.send("error", 400);
          }
      });

    }
});

//mostramos la vista views/home.jade solo si el usuario ha iniciado sesion
router.get("/nuevoreporte", function(req, res)
{
    //si no existe la sesion del usuario redirigimos al login
    if(!req.session.username)
    {
        res.redirect("/");
    }
    //en otro caso mostramos el formulario
    else
    {
        res.render('nuevoreporte', {
            title: 'Crear un nuevo reporte'
        });
    }
});


//recibimos la interaccion de cuando el usuario envia el formulario de creacion de reporte
router.post("/crearreportes", function(req,res)
{
  var reporte={nombrereporte:req.body.nombrereporte,detalle:req.body.detallereporte,cantidadregistros:req.body.cantidadregistros,usuariocrea:req.body.usuariocrea,idusuario:req.session.idusuario};
  console.log(reporte);
  UserModel.insertarReporte(reporte,function(data)
  {
    if(data)
    {
          if(data.msg === "error")
          {
            res.render('index',{msg_error: 'Datos ingresados incorrectos'});
          }
          else
          {
            res.redirect("/reportes");
            //console.log('Exitoso');
            //res.render('reportes',{title: 'Lista de reportes',reportes:data.data});
            //res.send('Whee');
            //return res.render('reportes',{title: 'Lista de reportes',reportes:data});
          }
    }else{
        res.send("error", 400);
    }
  });
});


//cerramos la sesión del usuario y redirigimos al formulario de login
router.get("/logout", function(req,res)
{
	req.session.destroy();
	res.redirect("/");
});

module.exports = router;
