var express = require('express');

const cookieParser = require('cookie-parser');

const bodyParser = require("body-parser");
//setup express app
const app = express()

// let’s you use the cookieParser in your application
app.use(cookieParser());

app.use(bodyParser.json());
//Les routes cote super admin 
module.exports = app => {
    const superadmin = require("../controllers/superadmin.controller.js");
  // Create a new Customer 
  app.get("/Superadmin/connection", (req, res) => {
    res.render('Super admin/connection')
  });
  app.get("/Superadmin/creation", (req, res)=>{
    res.render('Super admin/creation')
  })

  app.get("/Superadmin/espaceadmin", superadmin.Lesentreprise)
  app.get("/Superadmin/entreprisedetails/:identreprise", superadmin.Entreprisedetails)
  //Les manager des entreprises
  app.get("/Superadmin/lesmanagerentreprise/:identreprise", superadmin.ManagerEntreprise)
  //Les distributeurs de l'entreprise
  app.get("/Superadmin/lesdistributeurentreprise/:identreprise", superadmin.DistributeurEntreprise)
  //les clients de l'entreprise
  app.get("/Superadmin/lesclientsentreprise/:identreprise", superadmin.ClientEntreprise)
  //Compte de L'entreprise
  app.get("/Superadmin/entreprisecompte/:identreprise", superadmin.CompteEntreprise)
  
//page de connection /Superadmin/entreprisecompte/ ///Superadmin/entreprisedetails/:identreprise /Superadmin/lesclientsentreprise/ /Superadmin/lesdistributeurentreprise/:identreprise
  app.post("/Superadmin/connection", superadmin.Connection);
};
