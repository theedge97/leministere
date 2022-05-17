//Mia
let express = require('express')
let app = express()
let bodyParser = require('body-parser') //permet de parser les donner envoyer par posts
//let session = require("express-session") //permet d'appeler la session
const validator = require('express-validator');
const { body ,validationResult  } = require('express-validator');
const bcrypt = require("bcryptjs")//permet de hacher le mot de passe
const saltRounds = 10;

//const cookieParser = require('cookie-parser')

//const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { toLower, isEmpty } = require('lodash');
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
const TypeCompte = require("../models/typecompte.models.js");
const LesComptess = require("../models/lescompte.js"); 
//Inscription d'un administrateur
 
//Connection de l'admin 
exports.Connection =  [
  /*
ce middelware permet de creer un compte
  */
 // verifie si le matricule est un nombre.
 body('telephone').matches(/^6[1,2,5,6]{1}[0-9]{7}$/).withMessage('Veuilez bien saisir un numero valide').trim(),
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
    
    var telephone = req.body.telephone
    var motdepasse = req.body.motdepasse
    
    try {  
      

      var connect = await Admin.recupereunadmin(telephone)
     
    
      if (connect !== "" && !isEmpty(connect) ) {
      var vrai = bcrypt.compareSync(req.body.motdepasse, connect[0]['motdepasse']);
      console.log(vrai) 
      if (vrai == true) {
        console.log('mioiooi')
        
res.cookie('adminnom', connect[0]['Nom_admin']);

res.cookie('admintelephone', connect[0]['Tel_admin']);

res.send( {success: "Activer "})
      }else{
      res.send( {erreurnumero: "Votre numero ne correspond pas"})
      
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
 //Creation de compte de l'administrateur
 exports.Creation =  [
  /*
ce middelware permet de creer un compte
  */

 body('nom').isLength({ min: 3}).withMessage('Veuilez bien saisir un nom long').trim(),
 body('code').isNumeric().withMessage('Veuilez saisir un code de type nombre').trim(),
 body('telephone').isNumeric().withMessage('Veuilez saisir un numéro téléphone').trim(),
 body('telephone').matches(/^6[1,2,5,6]{1}[0-9]{7}$/).withMessage('Veuilez bien saisir un numéro de téléphone  valide').trim(),
 body('motdepasse', 'Veuillez saisir un mot de passe de plus de quatre caractère').isLength({ min: 4 }).trim(),
 body('motdepasse').custom((value, { req }) => {
  if (value !== req.body.motdepasse1) {
    throw new Error('les mots de passe ne sont pas identique');
  }
  
  // Indicates the success of this synchronous custom validator
  return true;
}),
async (req, res, next) => {

   // Extract the validation errors from a request.
   const errors = validator.validationResult(req);
   //les erreurs 
   var erreurauth = []
   var nomerreur = '';
   var matriculerreur = '';
   // Create a genre object with escaped and trimmed data
   if (!errors.isEmpty()) {
     // There are errors. Render the form again with sanitized values/error messages.
     var erreur = errors.array();
     console.log(erreur)
     res.render('Super Admin/register', {erreur: erreur})
      
     return;
   }
   else {
     
      var nom = req.body.nom
      var motsdepasse = req.body.motsdepasse
      var telephone = req.body.telephone;
      
      var code = req.body.code
    
      try {  
        var codeverifie  = await Codeactivation.verifier(code);
        console.log(codeverifie)
        //Verification si le code est vraie
      if (codeverifie == "") {
        res.send( {codeerreur: "veuillez bien saisir le code d'activation"})
         console.log("NIU NOOI")    
      } else{
        // Creation Administrateur
       
    var hasher =  await  bcrypt.hashSync(req.body.motdepasse, 10, (err, hash) => {
          if (err) {
            console.error(err)
            return
          }
        })
        console.log(hasher)
 const admin = new Admin({
  Nom_admin : req.body.nom,
  Tel_admin : req.body.telephone,
  motdepasse : hasher
});

res.cookie('adminnom', req.body.nom);

res.cookie('admintelephone', req.body.telephone);



await Admin.inscription(admin);
res.send( {success: "Activeer "})
       
        console.log("c'est activer")
      }
       
         } catch(e) {
             console.log(e);
             res.sendStatus(500);
         }
 
   }
 }
]
//Page d'acceuil de  l'administrateur
exports.Acceuil  =  [
  async (req, res) => {

   try {  
     var nom = req.cookies.adminnom;
     var telephone = req.cookies.admintelephone
    console.log(req.cookies.admintelephone)
    res.render('Super Admin/acceuil', {nom: nom, telephone: telephone})
     } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ]
 //Page Liste  des pays 
 exports.Lespays  =  [
  async (req, res) => {

   try {  
     var nom = req.cookies.adminnom;
     var lespays = await Pays.selectpays();
     var telephone = req.cookies.admintelephone
    console.log(req.cookies.admintelephone)
    res.render('Super Admin/listepays', {nom: nom, lespays: lespays, telephone: telephone})
     } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ]
 //Ajout pays 
 exports.Ajoutpays  =  [
  async (req, res, next) => {
  var pays = req.body.pays; 
  console.log(pays)
  const newpays = new Pays({
    pays : pays
  });
   try {  
     await Pays.ajoutpays(newpays);
     var nom = req.cookies.adminnom;
     var telephone = req.cookies.admintelephone
     res.send({success: "activer"})
    } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ]
 //Suppression de pays
exports.Supprimerpays  =  [
  async (req, res) => {

   try {  
     
    var idpays = req.params.idpays;
await Pays.supprimerpays(idpays)
      
      res.redirect("/Superadmin/Lespays");
    } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ] 
 //Modifier le nom du pays 
exports.Modifierpays  =  [
  async (req, res) => {

   try {  
     
    var idpayss = req.body.idpayss;
await  Pays.modifierpays(mopays, idpayss);
    
res.send({success: "activer"})
    } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ] 
 //La liste des ambassades 
 exports.Lesambassade  =  [
  async (req, res) => {

   try {  
     var nom = req.cookies.adminnom;
     var lesamba = await Lesambassade.selectamb();
     var lespays = await Pays.selectpays();
     console.log(lespays)
     var telephone = req.cookies.admintelephone
    console.log(req.cookies.admintelephone)
    res.render('Super Admin/ambassade', {nom: nom, pays: lespays, paysd: lespays, lesamba: lesamba, telephone: telephone})
     } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ]
//Ajoutambassade
exports.Ajoutambassade  =  [
  async (req, res, next) => {
  var nomambassade = req.body.nomambassade; 
  var paysid = req.body.pays; 
  const newambassade = new Lesambassade({
    pays : paysid,
    nomambassade: nomambassade
  })
   try {  
     await Ambassade.ajout(newambassade)
     var nom = req.cookies.adminnom;
     var telephone = req.cookies.admintelephone
     res.send({success: "activer"})
    } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ]
//Suppression d'une ambassade
exports.Supprimerambassade  =  [
  async (req, res) => {

   try {  
     
    var idamb = req.params.idamb;
     await  Lesambassade.supprimeramba(idamb);
      
      res.redirect("/Superadmin/Lesambassade");
    } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ] 
//Modification de l'Ambassade
exports.Modifieramba  =  [
  async (req, res) => {

   try {  
     //Modifcation du nom de l'ambassade
    var idamba = req.body.idamba;
    var moamba = req.body.moamba;
await  Ambassade.modifier(moamba, idamba)
res.redirect("/Superadmin/Lesambassade");
    } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ] 
 //La liste des ambassades 
 exports.Lesconsulats  =  [
  async (req, res) => {

   try {  
     var nom = req.cookies.adminnom;
     var lesconsules = await Consulat.selectconsule();
     var lespays = await Pays.selectpays();
     var lesamba = await Lesambassade.selectamb();
     console.log(lespays)
     var telephone = req.cookies.admintelephone
    console.log(req.cookies.admintelephone)
    res.render('Super Admin/consulats', {nom: nom, pays: lespays, paysd: lespays, lesconsules: lesconsules, lesamba: lesamba, telephone: telephone})
     } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ]
 //Ajout d'un consulat 
 exports.Ajoutconsule  =  [
  async (req, res, next) => {
  var consule = req.body.consule; 
  var ambassade = req.body.ambassade; 
  const newconsule = new Consulat({
    consule : consule,
    ambassade: ambassade
  })
   try {  
     await Consulat.ajout(newconsule);
     var nom = req.cookies.adminnom;
     var telephone = req.cookies.admintelephone
     res.send({success: "activer"})
    } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ]

 //Suppression d'un consulat 
exports.Supprimerconsulat  =  [
  async (req, res) => {

   try {  
     
    var idconsule = req.params.idconsule;
     await  Consulat.supprimercons(idconsule)
      
      res.redirect("/Superadmin/Lesconsules");
    } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ] 
 //Modification de l'Ambassade
exports.Modifierconsulat  =  [
  async (req, res) => {

   try {  
     //Modifcation du nom de l'ambassade

    var idconsule = req.params.idconsule;
    var valeur = req.params.valeur;
await  Consulat.modifierconsul( valeur, idconsule);
res.send({success: "activer"})
    } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ] 
 //Modification de l'ambassde du consulat 
 exports.ModifierconsulatAmba  =  [
  async (req, res) => {

   try {  
     //Modifcation du nom de l'ambassade
    var idconsule = req.params.idconsule;
    var valeur = req.params.valeur;
await  Consulat.modifierconsulamba( valeur, idconsule);
res.send({success: "activer"})
    } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ] 

 //La liste des Agents Ambassades 
 exports.Lesagents  =  [
  async (req, res) => {

   try {  
     var nom = req.cookies.adminnom;
     var agent = await Agentambassade.selectagent();
     var lesamba = await Lesambassade.selectamb();
     console.log(lesamba)
     var telephone = req.cookies.admintelephone
    console.log(req.cookies.admintelephone)
    res.render('Super Admin/listedesagentsambassade', {nom: nom, lesamba: lesamba, agent: agent, telephone: telephone})
     } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ]

 //Suppression d'un Agent 
 exports.Supprimeragent  =  [
  async (req, res) => {

   try {  
     
    var idagent = req.params.idagent;
     await  Agentambassade.supprimeragent(idagent)
      
      res.redirect("/Superadmin/LesAngentAmbassade");
    } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ] 
 //Ajout d'un Agent  
 exports.Ajoutagent  =  [
  async (req, res, next) => {
  var nom = req.body.nom; 
  var prenom = req.body.prenom;
  var ladate = req.body.ladate;
  var matricule = req.body.matricule;
  var genre = req.body.genre;
  var telephone = req.body.telephone;
  var email = req.body.email;
  var ambassadeid = req.body.ambassadeid;
  var motdepasse = req.body.motdepasse;
    
  var hasher =  await  bcrypt.hashSync(motdepasse, 10, (err, hash) => {
    if (err) {
      console.error(err)
      return
    }
  })
  console.log(hasher)
  const newagentamba = new Agentambassade({
    nom : nom,
    prenom: prenom,
    datenaissance : ladate,
    sex: genre,
    matricule: matricule,
    telephone: telephone,
    email: email,
    motdepasse : hasher,
    ambassadeid : ambassadeid,
    statue: 1
  })
   try {  
     await Agentambassade.ajoutagent(newagentamba);
     var nom = req.cookies.adminnom;
     var telephone = req.cookies.admintelephone
     res.send({success: "activer"})
    } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ]

//Voir Details  
exports.AgentsVoir  =  [
  async (req, res) => {

   try {  
     var nom = req.cookies.adminnom;
     var idamba = req.params.idamba;
     var agent = await Agentambassade.selectagent();
     var lesamba = await Lesambassade.selectamb();
     var unagent = await Agentambassade.unagent(idamba);
     console.log(unagent)
     var telephone = req.cookies.admintelephone

    res.render('Super Admin/voiragents', {nom: nom,unagent: unagent[0] , lesamba: lesamba, agent: agent, telephone: telephone})
     } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ]
//Configuration des type de comptes
exports.TypedeCompte  =  [
  async (req, res) => {

   try {  
     var nom = req.cookies.adminnom;
   var type = await TypeCompte.selectypecompte();
     console.log(type)
     var telephone = req.cookies.admintelephone
    res.render('Super Admin/typecompte', {nom: nom, type: type,  telephone: telephone})
     } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
     
 ]
 //Configuration des comptes 
 exports.LesCompte  =  [
  async (req, res) => {

   try {  
     var nom = req.cookies.adminnom;
   var compte = await LesComptess.selectcomptes();
   var type = await TypeCompte.selectypecompte();
     console.log(compte)
     var telephone = req.cookies.admintelephone
    res.render('Super Admin/lescompte', {nom: nom, type: type,  compte: compte,  telephone: telephone})
     } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
     
 ]
 //Ajout d'un compte  
 exports.Ajoutcompte  =  [
  async (req, res, next) => {
  var numcpte = req.body.numcpte; 
  var decrit = req.body.decrit;
  var type = req.body.type;
   
  const newscomptes = new LesComptess({
    numcpte : numcpte,
    intcompte: decrit,
    typcompte : type
  })
   try {  
     await LesComptess.ajoutcomptes(newscomptes)
     var nom = req.cookies.adminnom;
     var telephone = req.cookies.admintelephone
     res.send({success: "activer"})
    } catch(e) {
         console.log(e);
         res.sendStatus(500);
     }
 
     }
 ]
  //Suppression d'un Compte
  exports.Supprimercompte  =  [
    async (req, res) => {
  
     try {  
       
      var idcpte = req.params.idcpte;
     await LesComptess.supprimecompte(idcpte)
        res.redirect("/Superadmin/LesCompte");
      } catch(e) {
           console.log(e);
           res.sendStatus(500);
       }
   
       }
   ] 
   //Modification du numero de compte 
 
 
exports.Modificationnumcpte =  [
  /*
ce middelware permet de creer un compte
  */
 // verifie si le matricule est un nombre.
 body('modifienumcpte').isNumeric().withMessage('Veuilez bien saisir un numero valide').trim(),
async (req, res, next) => {

   // Extract the validation errors from a request.
   const errors = validator.validationResult(req);
   //les erreurs 
   // Create a genre object with escaped and trimmed data
   if (!errors.isEmpty()) {
     // There are errors. Render the form again with sanitized values/error messages.
     var erreur = errors.array();
     res.send({erreurnumcpte: erreur})
     console.log(erreur)
     return;
    
   }
   else {
    var modifienumcpte = req.body.modifienumcpte
    var idcptes = req.body.idcptes;
    
    try {  
      await LesComptess.modifiernumcpte(modifienumcpte, idcptes);
      res.send({sucess: "Hi JOE"})
     
       } catch(e) {
           console.log(e);
           res.sendStatus(500);
       }
    //verifier si le matricule existe dans la base de donner

 
   } 
 }
]
//Modification de l'intituler de compte 
exports.Modificationintitulecpte =  [
  /*
ce middelware permet de creer un compte
  */
 // verifie si le matricule est un nombre.
 body('modifierintitule').isLength({ min: 3}).withMessage('Veuilez bien saisir un numero valide').trim(),
async (req, res, next) => {

   // Extract the validation errors from a request.
   const errors = validator.validationResult(req);
   //les erreurs 
   // Create a genre object with escaped and trimmed data
   if (!errors.isEmpty()) {
     // There are errors. Render the form again with sanitized values/error messages.
     var erreur = errors.array();
     res.send({erreurintuler: erreur})
     console.log(erreur)
     return;
    
   }
   else {
    var modifierintitule= req.body.modifierintitule
    var idcptes = req.body.idcptes;
    
    try {  
     await LesComptess.modifierintitulercpt(modifierintitule, idcptes)
      res.send({sucess: "Hi JOE"})
     
       } catch(e) {
           console.log(e);
           res.sendStatus(500);
       }
    //verifier si le matricule existe dans la base de donner

 
   } 
 }
]
//Modification du type de compte pour les compte finances
exports.Modificationtypecpte =  [
  /*
ce middelware permet de creer un compte
  */
 // verifie si le matricule est un nombre.
 body('typecompte').isLength({ min: 1}).withMessage('Veuilez bien saisir un numero valide').trim(),
async (req, res, next) => {

   // Extract the validation errors from a request.
   const errors = validator.validationResult(req);
   //les erreurs 
   // Create a genre object with escaped and trimmed data
   if (!errors.isEmpty()) {
     // There are errors. Render the form again with sanitized values/error messages.
     var erreur = errors.array();
     res.send({erreurtype: erreur})
     console.log(erreur)
     return;
    
   }
   else {
    var typecompte = req.body.typecompte
    var idcptes = req.body.idcptes;
    
    try {  
     await LesComptess.modifiertypecpte(typecompte, idcptes)    
      res.send({sucess: "Hi JOE"})
     
       } catch(e) {
           console.log(e);
           res.sendStatus(500);
       }
    //verifier si le matricule existe dans la base de donner

 
   } 
 }
]