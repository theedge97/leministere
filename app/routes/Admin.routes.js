var express = require('express');
//Application 
const cookieParser = require('cookie-parser');

const bodyParser = require("body-parser");
//setup express app
const app = express()

// let’s you use the cookieParser in your application
app.use(cookieParser());

app.use(bodyParser.json());

module.exports = app => {
    const admin = require("../controllers/admin.controller.js")
  // Create a new Customer 
  app.get("/Superadmin/connection", (req, res) => {
    res.render('Super Admin/login')
  });

  app.get("/Superadmin/Acceuil", admin.Acceuil);
  app.post("/Superadmin/creation", admin.Creation)
  app.post("/Superadmin/connection", admin.Connection)
  app.post("/Superadmin/creation", admin.Creation)
  //Liste des pays 
  app.get("/Superadmin/Lespays", admin.Lespays);
  //ajout d'un pays 
  app.post("/Superadmin/Paysajout", admin.Ajoutpays);
  //Suppression d'un Pays 
  app.get("/Superadmin/PaysSupprimer/:idpays", admin.Supprimerpays)
  //Modidifier le nom  du pays 
  app.post("/Superadmin/Paysmodifier", admin.Modifierpays);
  //Liste des ambassades 
  app.get("/Superadmin/Lesambassade", admin.Lesambassade);
  //Ajout d'un ambassade 
  app.post("/Superadmin/Ambassadeajout", admin.Ajoutambassade);
   //Suppression d'une Ambassade 
   app.get("/Superadmin/AmbassadeSupprimer/:idamb", admin.Supprimerambassade)
 ///Modification d'une ambassade
 app.post("/Superadmin/Ambassademodifier", admin.Modifieramba);
 //LA liste des consulats 
 app.get("/Superadmin/Lesconsules", admin.Lesconsulats);
 //Ajout d'un consulat  
 app.post("/Superadmin/Consuleajout", admin.Ajoutconsule);
 //Suppression d un consulat 
 app.get("/Superadmin/ConsulatSupprimer/:idconsule", admin.Supprimerconsulat)
 //Modification du consulat 
 app.get("/Superadmin/ConsulatModifier/:valeur/:idconsule", admin.Modifierconsulat)
 //Modification de l ambassade de consulat /Superadmin/AmbaModifier/
 app.get("/Superadmin/AmbaModifier/:valeur/:idconsule", admin.ModifierconsulatAmba)
//Liste des Agents 
app.get("/Superadmin/LesAngentAmbassade", admin.Lesagents);
//Suppression d'un Agents 
app.get("/Superadmin/AgentSupprimer/:idagent", admin.Supprimeragent)
 //Ajout d'un Agent 
 app.post("/Superadmin/Ajoutagent", admin.Ajoutagent);
 //Voir Details de l'Agents
 app.get("/Superadmin/Voiragent/:idamba", admin.AgentsVoir);
//Configuration des type de compte 
app.get("/Superadmin/TypeCompte", admin.TypedeCompte);
// Configuration des comptes 
app.get("/Superadmin/LesCompte", admin.LesCompte);
//Ajout d'un compte 
app.post("/Superadmin/Compteajout", admin.Ajoutcompte);
//Suppression de compte 
app.get("/Superadmin/CompteSupprimer/:idcpte", admin.Supprimercompte);
 //Modification du numero de compte 
app.post("/Superadmin/Modifiernumecpte", admin.Modificationnumcpte);
//Modification de l'Intituler de compte 

app.post("/Superadmin/Modifierintitulecpte", admin.Modificationintitulecpte);
///Modification du type de compte 

app.post("/Superadmin/Modifiertypecompte", admin.Modificationtypecpte);
};