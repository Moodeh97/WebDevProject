//This will run the server and be the first file to respond when localhost is reached

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session')
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

app.use(express.urlencoded( { extended: true } ));
app.use(express.static('public'));
app.use(expressLayouts);
app.use(session({secret:'09876hj',resave:false,saveUninitialized:true }));
app.use(cookieParser('DBSecure'));
app.use(session({
  secret: 'DBSecretSession',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(fileUpload());
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

const routes = require('./server/routes/bookRoutes.js')
app.use('/', routes);

app.listen(port, ()=> console.log(`Listening to port ${port}`));