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
    const agent = require("../controllers/agentambassade.controller.js");
  // Create a new Customer 
  app.get("/AgentAmbassade/connection", (req, res) => {
    res.render('Agent ambassade/login')
  });
  //Connection a la page 
  app.post("/AgentAmbassade/connexion", agent.Connection);
   //Page d Acceuil  
  app.get("/AgentAmbassade/Acceuil", agent.Acceuil);
  //Page de saissie des ecritures comptables 
  app.get("/AgentAmbassade/Saissiecomptables", agent.Comptables);
  //Effectuer une operation de mouvement et ecriture 
  app.post("/AgentAmbassade/Operation", agent.Operation);
  //Page pour les etats financier 
  app.get("/AgentAmbassade/Lesetatsfinancier", agent.Etatsfinancier);
  //Rechercher l'etats de  compte 
  app.post("/AgentAmbassade/Etatcompte", agent.Etatcompte);
  //Page pour les etats de compte a date
  app.get("/AgentAmbassade/Lesetatsdecompteadate", agent.Etatsdecompteadate);
 //Rechercher les etats de compte a date 
 app.post("/AgentAmbassade/Etatcompteadaterech", agent.Etatcompteadaterecherche);
 //Modifier une ecriture 
 app.get("/AgentAmbassade/Modifierecriture", agent.EcritureModifier);
 //MOdification d ecriture 
 app.post("/AgentAmbassade/Ecrituresmodifier", agent.ModifierEcriture);
//Operation de modification d'une ecriture 
 app.post("/AgentAmbassade/ModificationEcriture", agent.ModifiecationEcriture);
 //Modification des taux d 'echanges 
 app.get("/AgentAmbassade/Tauxdechanges", agent.TauxEchanges);
 //Operation de Modification des taux d'Echanges 
 app.post("/AgentAmbassade/EchangeTaux", agent.ModificationTaux);
 //Affichage du compte  
 app.get("/AgentAmbassade/Comptes", agent.Compte);
 //Modification du mot de passe de l Agent 
 app.post("/AgentAmbassade/Modifiermotdepasse", agent.ModificationMotpasse);
//Afficher les comptes des resulta produits - charge 
app.get("/AgentAmbassade/Compteresultat", agent.CompteResultat);
//Afficher les bilan Actif - Passif /AgentAmbassade/Bilan
app.get("/AgentAmbassade/Bilan", agent.Bilan);
//Afficher la balance a date 
app.get("/AgentAmbassade/BalanceDate", agent.BalanceaDate);
//Afficher la page de Balance Periodique /AgentAmbassade/BalanceDate
app.get("/AgentAmbassade/BalancePeriodique", agent.BalancePeriodique);
//Recherche Balance Periodique 
app.post("/AgentAmbassade/BalancePeriodiqueRecherche", agent.BalancePeriodiqueRecherche);
//Recherhe  Balance a Date 
app.post("/AgentAmbassade/BalanceDate", agent.BalanceAdateRecherche);

 
};