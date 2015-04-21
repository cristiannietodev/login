/**
* Sencillo script con nodejs trabajando con sqlite3,
* bootstrap de twitter y el motor de plantillas jade
*/

var sqlite3 = require('sqlite3').verbose(),//necesario para utilizar sqlite3
db = new sqlite3.Database('acontar.db'),//creamos la base de datos llamada blogNode si no existe
UserModel = {};//objeto para exportar y manejar la información del modelo

db.serialize(function() {

  db.run("CREATE TABLE if not exists usuarios (idusuario INTEGER PRIMARY KEY ASC,nombre TEXT,apellidos TEXT,correo TEXT,username TEXT,password TEXT)");
	db.run("CREATE TABLE if not exists reportes (idreporte INTEGER PRIMARY KEY ASC,nombre TEXT,detalle TEXT,cantidadregistros INTEGER,usuariocrea TEXT)");
	db.run("CREATE TABLE if not exists usuarios_reportes (idusuario INTEGER,idreporte INTEGER)");

	/*var stmt = db.prepare("INSERT INTO usuarios VALUES (?,?,?,?,?,?)");
	stmt.run(1,"Cristian","Nieto","xx@xxx.com","cristiannieto","123456");
	stmt.run(2,"Gabriela","Nieto","xxa@xxx.com","gabrielanieto","123456");

	var stmt2 = db.prepare("INSERT INTO reportes VALUES (?,?)");
	stmt2.run(1,"Balance general");
	stmt2.run(2,"Balance de prueba");

	var stmt3 = db.prepare("INSERT INTO usuarios_reportes VALUES (?,?)");
	stmt3.run(1,1);
	stmt3.run(2,2);*/


  /*var stmt = db.prepare("INSERT INTO user_info VALUES (?)");
	for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();

  db.each("SELECT rowid AS id, info FROM user_info", function(err, row) {
      console.log(row.id + ": " + row.info);
  });*/

});


//hacemos login al usuario si existe en la tabla usuarios
UserModel.loginUser = function(userData, callback)
{
	console.log("Username"+userData.username)
	//consultamos si existe el usuario y sus credenciales son correctas, así escapamos los datos
	stmt = db.prepare("SELECT * FROM usuarios WHERE username = ? AND password = ?");
	//pasamos el nombre del usuario y el password a la consulta
    stmt.bind(userData.username, userData.password);
    //usamos get para obtener una fila, así podemos devolver los datos del usuario
    stmt.get(function(error, row)
    {
        if(error)
        {
            throw err;
        }
        else
        {
            if(row)
            {
                //console.log('Usuario db'+row);
                callback({msg:"logueado",data:row});
            }
            else
            {
            	callback({msg:"error",data:""});
            }
        }
    });
}


//hacemos login al usuario si existe en la tabla usuarios
UserModel.insertarReporte = function(reportData, callback)
{
  var stmt = db.prepare("INSERT INTO reportes(nombre,detalle,cantidadregistros,usuariocrea) VALUES (?,?,?,?)");

  //pasamos los parametros para insertar un re
  stmt.bind(reportData.nombrereporte,reportData.detalle,reportData.cantidadregistros,reportData.usuariocrea);

  stmt.run(function(error){
    if(error)
    {
        throw err;
    }
    else
    {
      var stmt = db.prepare("INSERT INTO usuarios_reportes (idusuario,idreporte) VALUES (?,?)");
      stmt.bind(reportData.idusuario,this.lastID);

      stmt.run(function(error){
        if(error)
        {
            throw err;
        }
        else
        {
          callback({msg:"reportecreado"});
        }
      });
        //console.log(this.lastID);
        //callback({msg:"reportes",data:row});
    }
  });

  stmt.finalize();
}


//hacemos login al usuario si existe en la tabla usuarios
UserModel.actualizarReporte = function(reportData, callback)
{
  var stmt = db.prepare("UPDATE reportes set nombre=?,detalle=?,cantidadregistros=?,usuariocrea=? WHERE idreporte=?");

  //pasamos los parametros para insertar un re
  stmt.bind(reportData.nombrereporte,reportData.detalle,reportData.cantidadregistros,reportData.usuariocrea,reportData.idreporte);

  stmt.run(function(error){
    if(error)
    {
        throw err;
    }
    else
    {
      callback({msg:"reporteactualizado"});
      //console.log(this.lastID);
      //callback({msg:"reportes",data:row});
    }
  });

  stmt.finalize();
}



//Consultamos los reportes por usuario
UserModel.getReportesIdusuario = function(userData, callback)
{
  console.log("idusuario : "+userData.idusuario);
	//consultamos si existe el usuario y sus credenciales son correctas, así escapamos los datos
	stmt = db.prepare("SELECT r.* FROM usuarios as u INNER JOIN usuarios_reportes ur ON ur.idusuario=u.idusuario INNER JOIN reportes r ON r.idreporte=ur.idreporte WHERE u.idusuario=?");
	//pasamos el nombre del usuario y el password a la consulta
  stmt.bind(userData.idusuario);
  //usamos get para obtener una fila, así podemos devolver los datos del usuario
  stmt.all(function(error, row)
  {
    if(error)
    {
        throw err;
    }
    else
    {
        if(row)
        {
            callback({msg:"reportes",data:row});
        }
        else
        {
        	callback({msg:"error",data:""});
        }
    }
  });
}

UserModel.getReportesIdreporte = function(reportData, callback)
{
  console.log("idreporte : "+reportData.idreporte);
	//consultamos si existe el usuario y sus credenciales son correctas, así escapamos los datos
	stmt = db.prepare("SELECT r.* FROM reportes r WHERE r.idreporte=?");
	//pasamos el nombre del usuario y el password a la consulta
  stmt.bind(reportData.idreporte);
  //usamos get para obtener una fila, así podemos devolver los datos del usuario
  stmt.get(function(error, row)
  {
    if(error)
    {
        throw err;
    }
    else
    {
        if(row)
        {
            callback({msg:"reportes",data:row});
        }
        else
        {
        	callback({msg:"error",data:""});
        }
    }
  });
}

//Consultamos los perfiles por usuario
UserModel.deleteReporte = function(userData)
{
  console.log("idreporte : "+userData.idreporte);
	//consultamos si existe el usuario y sus credenciales son correctas, así escapamos los datos
	stmt = db.prepare("DELETE FROM reportes WHERE idreporte=?");
	//pasamos el nombre del usuario y el password a la consulta
  stmt.bind(userData.idreporte);
  //usamos get para obtener una fila, así podemos devolver los datos del usuario
  stmt.run();

  stmt.finalize();

}

//debemos escribir esta linea para poder utilizar el modelo
module.exports = UserModel;
