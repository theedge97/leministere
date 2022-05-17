const express = require('express')
const cookieParser = require('cookie-parser')

const bodyParser = require("body-parser");
//setup express app
const app = express()

// let’s you use the cookieParser in your application
app.use(cookieParser());
//set a simple for homepage route
var router = express.Router();
//nos moteur de templates 
app.set('view engine', 'ejs')
// parse requests of content-type - application/json
//nos middleware
app.use('/assets', express.static('public')) //le dossier servant a distribuer les css
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(2005, () => console.log('The server is running port 2005...'));

app.get("/", (req, res) => {
  
  res.render('Super admin/register')
});

//require("./app/routes/Superadmin.routes")(app);
require("./app/routes/Admin.routes")(app);
require("./app/routes/Agents.routes")(app);