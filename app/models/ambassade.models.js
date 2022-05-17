const sql = require("../models/db.js");

// constructor


// constructor
const Ambassade = function(unamba) {
    this.pays = unamba.pays;
    
  };
//Selectionner les Ambassades 
 
  Ambassade.selectamb = ( ) => {
    return new Promise((resolve, reject)=>{
      sql.query(`SELECT * FROM ambassade INNER JOIN pays ON pays.idpays = ambassade.pays `,  (error, payss)=>{
          if(error){
              return reject(error);
          }
          return resolve(payss);
      });
  });
  };
  //Ajout d'un ambassade 
  Ambassade.ajout = (newamb) => {
    
    return new Promise((resolve, reject)=>{
      sql.query("INSERT INTO ambassade SET ?", newamb,  (error, enregistre)=>{
          if(error){
              return reject(error);
          }
          return resolve(enregistre);
      });
  });
  };
  //Suppression d'un Ambassade 
  Ambassade.supprimeramba = (ambid) => {
    return new Promise((resolve, reject)=>{
      sql.query(`DELETE FROM  ambassade  WHERE idamb = ${ambid} `,  (error, employees)=>{
          if(error){
              return reject(error);
          }
          return resolve(employees);
      });
  });
  };
  //Modification du nom de l'ambassade
  Ambassade.modifier = (nom, idamba) => {
    return new Promise((resolve, reject)=>{
      sql.query(`UPDATE ambassade SET pays = ${nom}  WHERE 	idamb = ${idamba} `,  (error, employees)=>{
          if(error){
              return reject(error);
          }
          return resolve(employees);
      });
  });
  }; 

  //Selectionner le taux d'Echanges d'une Ambassades 
  Ambassade.selectaux = (idamba ) => {
    return new Promise((resolve, reject)=>{
      sql.query(`SELECT taux FROM ambassade WHERE  ambassade.idamb =  ${idamba} `,  (error, payss)=>{
          if(error){
              return reject(error);
          }
          return resolve(payss);
      });
  });
  };
  //Modification des Taux d'echanges 
  Ambassade.modifiertaux = (taux, idamba) => {
    return new Promise((resolve, reject)=>{
      sql.query(`UPDATE ambassade SET taux = ${taux}  WHERE 	idamb = ${idamba} `,  (error, employees)=>{
          if(error){
              return reject(error);
          }
          return resolve(employees);
      });
  });
  }; 

  module.exports = Ambassade;