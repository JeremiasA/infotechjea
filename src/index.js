const express = require('express'),
    mongoose = require('mongoose'),
    path = require('path'),
    routes = require('./routes/index.routes'),
    session = require('express-session'),
    MongoStore = require('connect-mongo');
    

const app = express();

//config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

// middlewares
app.use(express.static(path.join(__dirname, './public')));
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'jhb%&/%&$/(VBBTVUI',
    resave: false,
    saveUninitialized:true,
    store: MongoStore.create({
    mongoUrl: 'mongodb://localhost/infotech',
    ttl: 7 * 24 * 60 * 60} // = 14 days. Defaul
)
}))

// db connection
try {
    mongoose.connect('mongodb://localhost/infotech', { useNewUrlParser: true, useUnifiedTopology: true });
} catch (error) {
    console.log(error)    
}

//routes
app.use(routes);

//conexion
//servidor
app.listen(3000, () =>{
    console.log('Esperando conexiones');
});