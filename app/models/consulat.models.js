const sql = require("../models/db.js");


const Consulat = function(uncon) {
    this.consule = uncon.consule;
    this.ambassade = uncon.ambassade;  
  };
//Selectionner les Consulats
 
Consulat.selectconsule = ( ) => {
    return new Promise((resolve, reject)=>{
      sql.query(`SELECT c.idconsulat, pays.pays AS paysconsule , p.pays AS paysamba FROM consulat AS c INNER JOIN pays ON pays.idpays = c.consule INNER JOIN ambassade AS am ON am.idamb = c.ambassade INNER JOIN pays as p ON p.idpays = am.pays `,  (error, payss)=>{
          if(error){
              return reject(error);
          }
          return resolve(payss);
      });
  });
  };
//Ajout consulat 
Consulat.ajout = (newcons) => {
    
    return new Promise((resolve, reject)=>{
      sql.query("INSERT INTO consulat SET ?", newcons,  (error, enregistre)=>{
          if(error){
              return reject(error);
          }
          return resolve(enregistre);
      });
  });
  };

  //Suppression d'un Consulat 
   Consulat.supprimercons = (id) => {
    return new Promise((resolve, reject)=>{
      sql.query(`DELETE FROM  consulat  WHERE idconsulat = ${id} `,  (error, employees)=>{
          if(error){
              return reject(error);
          }
          return resolve(employees);
      });
  });
  };
    //Modification du 
    Consulat.modifierconsul = (nom, id) => {
        return new Promise((resolve, reject)=>{
          sql.query(`UPDATE consulat SET consule = ${nom}  WHERE idconsulat = ${id} `,  (error, employees)=>{
              if(error){
                  return reject(error);
              }
              return resolve(employees);
          });
      });
      }; 
      //Modifier ambassade de consulat 
      Consulat.modifierconsulamba = (nom, id) => {
        return new Promise((resolve, reject)=>{
          sql.query(`UPDATE consulat SET ambassade = ${nom}  WHERE idconsulat = ${id} `,  (error, employees)=>{
              if(error){
                  return reject(error);
              }
              return resolve(employees);
          });
      });
      };







  module.exports = Consulat;