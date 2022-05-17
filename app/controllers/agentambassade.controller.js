//Mia
let express = require('express')
let app = express()
let bodyParser = require('body-parser') //permet de parser les donner envoyer par posts
//let session = require("express-session") //permet d'appeler la session
const validator = require('express-validator');
const { body ,validationResult  } = require('express-validator');
const bcrypt = require("bcryptjs")//permet de hacher le mot de passe
const saltRounds = 10;
var moment = require('moment');
//const cookieParser = require('cookie-parser')

//const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { toLower, isEmpty, isArray, toInteger } = require('lodash');
//nos middelware
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.use(cookieParser());
const Codeactivation = require("../models/code.models.js");
const Admin = require("../models/admin.models.js");
const Pays = require("../models/pays.models.js");
const Lesambassade = require("../models/ambassade.models.js");
const Ambassade = require('../models/ambassade.models.js');
const Consulat = require("../models/consulat.models.js");
const Agentambassade = require("../models/agentambassade.models.js");
const LesComptess = require("../models/lescompte.js"); 
const Ecriture = require("../models/ecriture.models.js")
const Mvt = require("../models/mouvement.models.js");
const Mouvement = require('../models/mouvement.models.js');
const { isSet } = require('util/types');
//Inscription d'un administrateur

//Connection  
exports.Connection =  [
    /*
  ce middelware permet de creer un compte
    */
   // verifie si le matricule est un nombre.
   body('matricule').isLength({ min: 3}).withMessage('Veuilez bien saisir un nom long').trim(),
   body('motdepasse', 'Veuillez saisir un mot de passe de plus de quatre caractere').isLength({ min: 4 }).trim(),
  async (req, res, next) => {
  
     // Extract the validation errors from a request.
     const errors = validator.validationResult(req);
     //les erreurs 
     // Create a genre object with escaped and trimmed data
     if (!errors.isEmpty()) {
       // There are errors. Render the form again with sanitized values/error messages.
       var erreur = errors.array();
       res.render('user/inscription', { erreur: erreur});
       
       return;
     }
     else {
      
      var matricule = req.body.matricule
      var motdepasse = req.body.motdepasse
      
      try {  
        
  
        var connect = await Agentambassade.recupereunagent(matricule);

       console.log(connect[0])
      
        if (connect !== "" && !isEmpty(connect) ) {
        var vrai = bcrypt.compareSync(req.body.motdepasse, connect[0]['motdepasse']);
        console.log(vrai) 
        if (vrai == true) {
          console.log('mioiooi')
          
  res.cookie('agentnom', connect[0]['nom']);
  
  res.cookie('agentprenom', connect[0]['prenom']);

  res.cookie('agentmatricule', connect[0]['matricule']);
  res.cookie('agentpays', connect[0]['pays']); 
  res.cookie('agentambassadeid', connect[0]['ambassadeid']);
  res.cookie('agentambassadetaux', connect[0]['taux']);
  
  res.send( {success: "Activer "})
        }else{
        res.send( {erreurnumero: "Votre Matricule  ne correspond pas"})
        
        } 
       
      }else{
        res.send( {erreurmotpasse: "Votre mot de passe ne correspond pas"})
          
        }
       
         } catch(e) {
             console.log(e);
             res.sendStatus(500);
         }
      //verifier si le matricule existe dans la base de donner
  
   
     } 
   }
  ]
  //Acceuil
  exports.Acceuil  =  [
    async (req, res) => {
  
     try {  
       var nom = req.cookies.agentnom;
       var prenom = req.cookies.agentprenom
       var matricule = req.cookies.agentmatricule;
       var pays = req.cookies.agentpays;
      console.log(req.cookies.admintelephone)
      res.render('Agent ambassade/acceuil', {nom: nom, prenom: prenom, matricule: matricule, pays: pays})
       } catch(e) {
           console.log(e);
           res.sendStatus(500);
       }
   
       }
   ]
   //La Page de  saisie comptables 
   exports.Comptables  =  [
    async (req, res) => {
  
     try {  
       var nom = req.cookies.agentnom;
       var prenom = req.cookies.agentprenom
       var matricule = req.cookies.agentmatricule;
       var pays = req.cookies.agentpays;
       var lescomptes = await LesComptess.selectcomptes();
      console.log(lescomptes)
      res.render('Agent ambassade/comptabilite', {nom: nom, lescomptes: lescomptes, prenom: prenom, matricule: matricule, pays: pays})
       } catch(e) {
           console.log(e);
           res.sendStatus(500);
       }
   
       }
   ]
   //Ajout d'une operation d'ecriture 
   exports.Operation  =  [
    async (req, res) => {
  
     try {  
       
      var libecriture = req.body.libecriture;
      var datecriture = req.body.datecriture;
      var numcpte = req.body.numcpte;
      var debit = req.body.debit;
      var credit = req.body.credit;
      var reference = req.body.reference;
      var lesdebit = 0;
      var lescredit = 0;
      var nb = 0;
      if (!isEmpty(debit) && isArray(credit) &&  isArray(debit) && !isEmpty(credit) && !isEmpty(numcpte)) {
       debit.forEach(element => {
         nb += 1;
       var el =  toInteger(element)
         lesdebit +=  el;
       });
       credit.forEach(ele => {
        var cr =  toInteger(ele)
        lescredit += cr;
       });
       if (lesdebit !== lescredit) {
        res.send( {erreurdeoperation: "Votre Operation ne peut pas etre effectuer"})
        
       }
       if (lesdebit == lescredit ) {
         //insertion des ecritures 

         const newecrit = new Ecriture({
          datecr:  new Date(),
          libecr: libecriture,
          ambassade : 1,
          reference: reference
        })
 var idecritt =   await Ecriture.ajoutecrit(newecrit);
      console.log(idecritt);
   
    
      for (var  i = 0; i < nb ; i++) {
        var  crd = credit[i];
        var dbit = debit[i];
       
//On recuperer l'id du numero de compte 
  var bd =  await LesComptess.uncompte(numcpte[i])
  var idcpt = bd[0].idcompte;
  //On creer les mvt 
  const newmvt = new Mvt({
    ecriture:  idecritt,
    compteid: idcpt,
    debit : dbit,
    credit : crd,
    taux :   req.cookies.agentambassadetaux

  })
  //Ajout de mvt 
  await Mvt.ajoutmvt(newmvt);
  
      }
  //Operation reussi
  res.send( {sucessoperation: "Votre Operation  a effectuer avec success"})
    
      }
      }
     
      } catch(e) {
           console.log(e);
           res.sendStatus(500);
       }
   
       }
   ] 
     //La Pour les etats Financiers 
     exports.Etatsfinancier  =  [
      async (req, res) => {
    
       try {  
         var nom = req.cookies.agentnom;
         var prenom = req.cookies.agentprenom
         var matricule = req.cookies.agentmatricule;
         var pays = req.cookies.agentpays;
         var lescomptes = await LesComptess.selectcomptes();
      
        if (isEmpty(lescomptes) && lescomptes == " ") {
          res.render('Agent ambassade/etats', {nom: nom, erreuretat: "veuillez bien rensigner le compte", prenom: prenom, matricule: matricule, pays: pays})
         console.log("NUKK")
          
        }else{
          res.render('Agent ambassade/etats', {nom: nom, lescomptes: lescomptes, prenom: prenom, matricule: matricule, pays: pays})
        
        }
         } catch(e) {
             console.log(e);
             res.sendStatus(500);
         }
     
         }
     ]
     //Rechercher l 'Etat de compte 
     exports.Etatcompte  =  [
      async (req, res, next) => {
      var datedebut = req.body.datedebut; 
      var datefin = req.body.datefin;
      var numdecompte = req.body.numdecompte;
     var agentambassadeid = req.cookies.agentambassadeid;
       try {  
      var letat = await Mouvement.uncompteetat(datedebut, datefin, numdecompte, 1)
      console.log(letat) 
      if(letat == ""){
        console.log("Veuillez inserer un etat")
        res.send({erreurdeoperation: "veuillez bien saisir les operations "})
      }else{
      
        res.send({letat: letat, datedebut: datedebut, datefin: datefin})  
      }
        } catch(e) {
             console.log(e);
             res.sendStatus(500);
         }
     
         }
     ]
     //Page d'Affichage des etats de compte a date
     exports.Etatsdecompteadate  =  [
      async (req, res) => {
    
       try {  
         var nom = req.cookies.agentnom;
         var prenom = req.cookies.agentprenom
         var matricule = req.cookies.agentmatricule;
         var pays = req.cookies.agentpays;
         var lescomptes = await LesComptess.selectcomptes();
      
        if (isEmpty(lescomptes) && lescomptes == " ") {
          res.render('Agent ambassade/etatsadate', {nom: nom, erreuretat: "veuillez bien rensigner le compte", prenom: prenom, matricule: matricule, pays: pays})
         console.log("NUKK")
          
        }else{
          res.render('Agent ambassade/etatsadate', {nom: nom, lescomptes: lescomptes, prenom: prenom, matricule: matricule, pays: pays})
        
        }
         } catch(e) {
             console.log(e);
             res.sendStatus(500);
         }
     
         }
     ]


     //Selection d'un compte etat a date 
     exports.Etatcompteadaterecherche  =  [
      async (req, res, next) => {
      var date = req.body.date;
      var numdecompte = req.body.numdecompte;
     var agentambassadeid = req.cookies.agentambassadeid;
       try {  
      var letat = await Mouvement.uncompteadate(date, numdecompte, 1)
      
      if(letat == ""){
        console.log("Veuillez inserer un etat")
        res.send({erreurdeoperation: "veuillez bien saisir les operations "})
      }else{
      
        res.send({letat: letat, datedebut: date})  
      }
        } catch(e) {
          
          console.log(e);
             res.sendStatus(500);
         }
         }
     ]
     //Page pour afficher la modification d'une ecriture 
     exports.EcritureModifier  =  [
      async (req, res) => {
    
       try {  
         var nom = req.cookies.agentnom;
         var prenom = req.cookies.agentprenom
         var matricule = req.cookies.agentmatricule;
         var pays = req.cookies.agentpays;
         var lescomptes = await LesComptess.selectcomptes();
      
        if (isEmpty(lescomptes) && lescomptes == " ") {
          res.render('Agent ambassade/modifierecriture', {nom: nom, erreuretat: "veuillez bien rensigner le compte", prenom: prenom, matricule: matricule, pays: pays})
         console.log("NUKK")
          
        }else{
          res.render('Agent ambassade/modifierecriture', {nom: nom, lescomptes: lescomptes, prenom: prenom, matricule: matricule, pays: pays})
        
        }
         } catch(e) {
             console.log(e);
             res.sendStatus(500);
         }
     
         }
     ]
     //Modification d'une ecriture 
     exports.ModifierEcriture  =  [
      async (req, res, next) => {
        var numecrit = req.body.numecrit;  
         try {  
       var unereference = await Ecriture.unereference(numecrit); 
     
       var lescomptes = await LesComptess.selectcomptes();
      
       if(unereference == ""){
          console.log("Veuillez inserer un etat")
          res.send({erreureference: "veuillez bien saisir les refernce "})
        }else{
          var idecrit  = unereference[0].idec;
          var lesmvt = await Mouvement.lesmvts(idecrit);
       
          
        res.send({lescomptes: lescomptes, lesmvt: lesmvt, unereference: unereference[0]})  
        }
          } catch(e) {
            
            console.log(e);
               res.sendStatus(500);
           }
           }
     ]

     
     //Operation de modification des informations d'une ecriture une ecriture 
     exports.ModifiecationEcriture  =  [
      async (req, res, next) => {

        var libelecrit = req.body.libelecrit;
        var datecriture = req.body.datecriture;
        var ecritureid = req.body.ecritureid;
        var refpiece = req.body.refpiece;
        var idmvt = req.body.idmvt;
        var credit = req.body.credit;
        var debit = req.body.debit;
        var numcpte = req.body.numcpte;
        var datedif = req.body.datedif;
        var mocredit = req.body.mocredit;
        var modebit = req.body.modebit;
        var monumcpte = req.body.monumcpte;
     

         try {  
       
        if (datedif <= 90) {
   //la modification  peut  s'effectuer
 
//Modification des mvt 
var lesdebit = 0;
var lescredit = 0;
var nb = 0;//Le nombre d'incrementation des elements credits 
var tn = 0; //le nombre d incrementation des elements de modifcredit
//verifions dabord l existance des variables
var lesmodifcredit = null;
var lesmodifdebit = null;
var lesmodifnumcpte = null;
if (typeof modebit !== "undefined") {

if(typeof(mocredit) == "string"){
  /**
   * On verifie d abord si les mouvement a etre rajouter son pas des string
   * si son en string on convertie en array  en suite on parcourt le tableau en ajoute tout les nouveau elements 
   */
  lesmodifcredit = new Array(mocredit);
  lesmodifdebit = new Array(modebit);
  lesmodifnumcpte = new Array(monumcpte);
console.log(lesmodifcredit);
}else{
  lesmodifcredit = mocredit;
  lesmodifdebit = modebit;
  lesmodifnumcpte = monumcpte;
}

}

if (  !isEmpty(debit)  && isArray(credit) &&  isArray(debit) && !isEmpty(credit) && !isEmpty(numcpte)) {
 debit.forEach(element => {
   nb += 1;
 var el =  toInteger(element)
   lesdebit +=  el;
 });
 credit.forEach(ele => {
  var cr =  toInteger(ele)
  lescredit += cr;
 });
 if (typeof modebit !== "undefined") {

  lesmodifcredit.forEach(elecr => {
    var cr =  toInteger(elecr)
    lescredit += cr;
   });

   lesmodifdebit.forEach(eledb => {
    tn += 1;
    var cr =  toInteger(eledb)
    lesdebit += cr;
   });


 }
 

 
 console.log(lescredit)
 console.log(lesdebit)
 if (lesdebit !== lescredit) {
  res.send( {erreurbalance: "La somme des Debits ne corresponds pas la somme des credits "})
  
 }
 if (lesdebit == lescredit ) {
   console.log("I love you")
   //insertion des ecritures 

   var verifier = null;
   var erreurcompte = null;


for (var  i = 0; i < nb ; i++) {
  var  crd = credit[i];
  var dbit = debit[i];
 
//On recuperer l'id du numero de compte 
var bd =  await LesComptess.uncompte(numcpte[i])
 
//Verifions si le numero de compte existes 
if (!isEmpty(bd) ) {
  verifier = "Yes i did it";
  console.log("Elle existe ")
  console.log(bd[0].idcompte)
  await Ecriture.modifierecrit(datecriture, ecritureid, libelecrit, refpiece, 1 );
  await Mouvement.modifiermvt(idmvt[i], crd, dbit, bd[0].idcompte) 
//Opeation reussi
}else{
 //si un numero de compte ne correspond pas envoyer un message d'erreur 
 erreurcompte = "Veuillez bien selectionner le numero de compte"

}

}

if (typeof modebit !== "undefined") {
//Ajout d un nouveau mouvement 
for (var  j = 0; j < tn ; j++) {
  //On creer les mvt 
  var  crd =  lesmodifcredit[j];
  var dbit = lesmodifdebit[j];
 
 //On recuperer l'id du numero de compte 
 var bds =  await LesComptess.uncompte(lesmodifnumcpte[j])
 
 var idcpt = bds[0].idcompte;
 //On creer les mvt 
 const newmvt = new Mvt({
 ecriture:  ecritureid,
 compteid: idcpt,
 debit : dbit,
 credit : crd,
 taux : 3000
 })
 //Ajout de mvt 
 await Mvt.ajoutmvt(newmvt);
 }
}
if (!isEmpty(verifier)) {
  res.send( {sucessoperation: "Votre Operation  a effectuer avec success"})

}
if (!isEmpty(erreurcompte) ) {
  res.send( {erreurcompte: erreurcompte})

}

}
} 
  }else{
         //La modification ne peut pas s'effectuer
         res.send({dateinvalide: "Vous pouvez pas modifier"})  
      
        }
          } catch(e) {
            
            console.log(e);
               res.sendStatus(500);
           }
           }
     ]
//Afficher le Taux d'Echanges 
exports.TauxEchanges  =  [
  async (req, res) => {

   try {  
     var nom = req.cookies.agentnom;
     var prenom = req.cookies.agentprenom
     var matricule = req.cookies.agentmatricule;
     var pays = req.cookies.agentpays;
     var idamba = req.cookies.agentambassadeid;
     var agentambassadetaux = req.cookies.agentambassadetaux;

  var taux = await Ambassade.selectaux(idamba);
  var letaux = taux[0].taux;
 
      res.render('Agent ambassade/tauxechange', {nom: nom, letaux: letaux,  prenom: prenom, matricule: matricule, pays: pays})
    
      
   
     } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ]

 // Operation de Modification des Taux Echanges 
 exports.ModificationTaux  =  [
  async (req, res, next) => {
    var taux = req.body.taux;  
     try {  
      var nom = req.cookies.agentnom;
      var prenom = req.cookies.agentprenom
      var matricule = req.cookies.agentmatricule;
      var pays = req.cookies.agentpays;
      var idamba = req.cookies.agentambassadeid;
      await Ambassade.modifiertaux(taux, idamba);
      res.cookie('agentambassadetaux', taux);
      res.send({success: "Modification avec success "})
     
      } catch(e) {
        
        console.log(e);
           res.sendStatus(500);
       }
       }
 ]
//Affichages Des Comptes 
exports.Compte  =  [
  async (req, res) => {

   try {  
     var nom = req.cookies.agentnom;
     var prenom = req.cookies.agentprenom
     var matricule = req.cookies.agentmatricule;
     var pays = req.cookies.agentpays;
     var idamba = req.cookies.agentambassadeid;
     var agentambassadetaux = req.cookies.agentambassadetaux;
     
     var unagent = await Agentambassade.recupereunagent(matricule);

 
      res.render('Agent ambassade/compte', {nom: nom,  prenom: prenom, matricule: matricule, pays: pays, unagent: unagent[0]})
    
      
   
     } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ]
 //Modification du mot de passe de L'agent 
 exports.ModificationMotpasse  =  [
  async (req, res, next) => {
    var motdepasse = req.body.motdepasse;  
    
    var matricule = req.cookies.agentmatricule;
     try {  
        
  var hasher =  await  bcrypt.hashSync(motdepasse, 10, (err, hash) => {
    if (err) {
      console.error(err)
      return
    }
  })
  await Agentambassade.modifiermotdepasse(matricule , hasher);

      res.send({success: "Modification avec success "})
     
      } catch(e) {
        
        console.log(e);
           res.sendStatus(500);
       }
       }
 ]
 //Affichage des comptes des resultats 
 exports.CompteResultat  =  [
  async (req, res) => {

   try {  
     var nom = req.cookies.agentnom;
     var prenom = req.cookies.agentprenom
     var matricule = req.cookies.agentmatricule;
     var pays = req.cookies.agentpays;
     var idamba = req.cookies.agentambassadeid;
     var agentambassadetaux = req.cookies.agentambassadetaux;
     var lescharges = await Mouvement.lescomptechargestoto(idamba);
     var lesproduits = await Mouvement.lescompteproduitstoto(idamba);
   
     console.log(lescharges);

      res.render('Agent ambassade/compteresultats', {nom: nom, lescharges: lescharges, lesproduits: lesproduits,    prenom: prenom, matricule: matricule, pays: pays})
  
     } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ]
 //Bilan
 exports.Bilan  =  [
  async (req, res) => {

   try {  
     var nom = req.cookies.agentnom;
     var prenom = req.cookies.agentprenom
     var matricule = req.cookies.agentmatricule;
     var pays = req.cookies.agentpays;
     var idamba = req.cookies.agentambassadeid;
     var agentambassadetaux = req.cookies.agentambassadetaux;
     var lesactifs = await Mouvement.lescompteactifstoto(idamba);
     var lespassifs = await Mouvement.lescomptepassiftoto(idamba);
   
    

      res.render('Agent ambassade/bilan', {nom: nom, lesactifs: lesactifs, lespassifs: lespassifs,    prenom: prenom, matricule: matricule, pays: pays})
  
     } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ]
 //Balance a Date 
 exports.BalanceaDate  =  [
  async (req, res) => {

   try {  
     var nom = req.cookies.agentnom;
     var prenom = req.cookies.agentprenom
     var matricule = req.cookies.agentmatricule;
     var pays = req.cookies.agentpays;
     var idamba = req.cookies.agentambassadeid;
     var balanceadate  = await Mouvement.balanceadate(idamba)
    

      res.render('Agent ambassade/balanceadate', {nom: nom,  balanceadate:  balanceadate,  prenom: prenom, matricule: matricule, pays: pays})
  
     } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ]
 //Affichage de la page   balence Periodique 
 exports.BalancePeriodique  =  [
  async (req, res) => {

   try {  
     var nom = req.cookies.agentnom;
     var prenom = req.cookies.agentprenom
     var matricule = req.cookies.agentmatricule;
     var pays = req.cookies.agentpays;
     var idamba = req.cookies.agentambassadeid;
    

      res.render('Agent ambassade/balanceperiodique', {nom: nom,  prenom: prenom, matricule: matricule, pays: pays})
  
     } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ]
 //Rechercher la balance Periodique 
 exports.BalancePeriodiqueRecherche  =  [
  async (req, res, next) => {
    var datedebut = req.body.datedebut;  
    var idamba = req.cookies.agentambassadeid;
    
    var datefin = req.body.datefin;
     try { 

       var balance = await Mouvement.balanceperiodique(idamba, datedebut, datefin);
        console.log(balance)
        res.send({balance: balance, datedebut: datedebut, datefin: datefin})

    } catch(e) {
        
        console.log(e);
           res.sendStatus(500);
       }
       }
 ]
 //Recherhce Balance A date 
 exports.BalanceAdateRecherche  =  [
  async (req, res, next) => {
    var datedebut = req.body.datedebut;  
    var idamba = req.cookies.agentambassadeid;
    
     try { 

       var balance = await Mouvement.balanceadate(idamba, datedebut);
        console.log(balance)
        res.send({balance: balance, datedebut: datedebut })

    } catch(e) {
        
        console.log(e);
           res.sendStatus(500);
       }
       }
 ]