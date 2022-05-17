const sql = require("../models/db.js");

// constructor


// constructor
const LesCompte = function(cpte) {
    this.numcpte = cpte.numcpte;
    this.intcompte = cpte.intcompte;
    this.typcompte = cpte.typcompte;
    //
  };
//Selectionner les Pays
 
  LesCompte.selectcomptes = ( ) => {
    return new Promise((resolve, reject)=>{
      sql.query(`SELECT * FROM compte INNER JOIN type_de_compte ON type_de_compte.idtypcpte = compte.typcompte `,  (error, payss)=>{
          if(error){
              return reject(error);
          }
          return resolve(payss);
      });
  });
  };
//Ajout d'un compte 
  LesCompte.ajoutcomptes = (newcompte) => {
    
    return new Promise((resolve, reject)=>{
      sql.query("INSERT INTO compte SET ?", newcompte,  (error, enregistre)=>{
          if(error){
              return reject(error);
          }
          return resolve(enregistre);
      });
  });
  };
  //Suppression d'un Compte 
  LesCompte.supprimecompte = (cpteid) => {
    return new Promise((resolve, reject)=>{
      sql.query(`DELETE FROM   compte  WHERE 	idcompte = ${cpteid} `,  (error, employees)=>{
          if(error){
              return reject(error);
          }
          return resolve(employees);
      });
  });
  }; 
  //Modification du numero de compte  
   LesCompte.modifiernumcpte = (	numcpte, idcompte) => {
    return new Promise((resolve, reject)=>{
      sql.query(`UPDATE compte  SET 	numcpte = ${numcpte}  WHERE idcompte= ${idcompte} `,  (error, employees)=>{
          if(error){
              return reject(error);
          }
          return resolve(employees);
      });
  });
  }; 
  //Selectionner un numero l'id de compte dont l id
  LesCompte.uncompte = (ncpte) => {
    return new Promise((resolve, reject)=>{
      sql.query(`SELECT idcompte FROM compte WHERE numcpte = ${ncpte} `,  (error, employees)=>{
          if(error){
              return reject(error);
          }
          return resolve(employees);
      });
  });
  }; 
  //Modification  de l'intituler de compte 
  LesCompte.modifierintitulercpt = (	intitule, idcompte) => {
    return new Promise((resolve, reject)=>{
      sql.query(`UPDATE compte  SET intcompte = "${intitule}"  WHERE idcompte= ${idcompte} `,  (error, employees)=>{
          if(error){
              return reject(error);
          }
          return resolve(employees);
      });
  });
  }; 
  //Modifcation du type de compte 
  LesCompte.modifiertypecpte = (	typcompte, idcompte) => {
    return new Promise((resolve, reject)=>{
      sql.query(`UPDATE compte  SET typcompte = ${typcompte}  WHERE idcompte = ${idcompte} `,  (error, employees)=>{
          if(error){
              return reject(error);
          }
          return resolve(employees);
      });
  });
  }; 
  module.exports = LesCompte;