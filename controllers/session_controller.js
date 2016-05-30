 var userController = require('./user_controller');

var minutoCreacion ;
var segundoCreacion ;
var LogOut

// GET /session -- Formulario de login
exports.new = function(req, res, next) {
res.render('session/new', { redir: req.query.redir || '/' });
};
exports.loginRequired = function (req, res, next) {
if (req.session.user) {
next();
} else {
res.redirect('/session?redir=' + (req.param('redir') || req.url));
}
};
exports.adminOrMyselfRequired = function(req, res, next){

 var isAdmin = req.session.user.isAdmin;
 var userId = req.user.id;
 var loggedUserId = req.session.user.id;

 if (isAdmin || userId === loggedUserId) {
 next();
 } else {
 console.log('Ruta prohibida: no es el usuario logeado, ni un administrador.');
 res.send(403); }
};


exports.adminAndNotMyselfRequired = function(req, res, next){

 var isAdmin = req.session.user.isAdmin;
 var userId = req.user.id;
 var loggedUserId = req.session.user.id;

 if (isAdmin && userId !== loggedUserId) {
 next();
 } else {
 console.log('Ruta prohibida: no es el usuario logeado, ni un administrador.');
 res.send(403); }
};

// POST /session -- Crear la sesion si usuario se autentica
exports.create = function(req, res, next) {
var login = req.body.login;
var password = req.body.password;
var redir = req.body.redir || '/'
userController.autenticar(login, password)
.then(function(user) {
// Crear req.session.user y guardar campos id y username
// La sesión se define por la existencia de: req.session.user


 minutoCreacion = new Date().getMinutes();
 segundoCreacion = new Date().getSeconds();
 //var minOut= minutoCreacion +2;
 req.session.user = {id:user.id, username:user.username, /*min:minOut, sec:segundoCreacion , */isAdmin:user.isAdmin };
 res.redirect(redir); // redirección a la raiz
})
.catch(function(error) {
req.flash('error', 'Se ha producido un error: ' + error);
res.redirect("/session?redir="+redir);
});
};
exports.logout = function(req, res, next) {

 if(!req.session.user){
 next();

 }else{

 if( ((new Date().getMinutes() - req.session.user.min) >0 ) ||
 ( ((new Date().getMinutes() - req.session.user.min)===0) && (req.session.user.sec <= new Date().getSeconds()) ) ){
 //delete req.session.user;

 next();

 }else{

 req.session.user.sec = new Date().getSeconds();
 req.session.user.min = new Date().getMinutes();

 next();

 }
 }
};

// DELETE /session -- Destruir sesion
exports.destroy = function(req, res, next) {
delete req.session.user;

res.redirect("/session"); // redirect a login
}; 