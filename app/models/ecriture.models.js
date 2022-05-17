const sql = require("../models/db.js");

// constructor


// constructor
const Ecriture = function(ecrit) {
    this.datecr = ecrit.datecr;
    this.libecr = ecrit.libecr;
    this.ambassade = ecrit.ambassade;
    this.reference = ecrit.reference
    //
  };

//Selectionner les Pays
  Ecriture.selectyp = ( ) => {
    return new Promise((resolve, reject)=>{
      sql.query(` SELECT * FROM type_de_compte `,  (error, payss)=>{
          if(error){
              return reject(error);
          }
          return resolve(payss);
      });
  });
  };

  //Ajout d'un ecriture 
  Ecriture.ajoutecrit = (newecrit) => {
    
    return new Promise((resolve, reject)=>{
      sql.query("INSERT INTO ecriture SET ?", newecrit,  (error, enregistre)=>{
          if(error){
              return reject(error);
          }
          return resolve(enregistre.insertId);
      });
  });
  };
  //Verifions l'existance d'un numero d'ecriture 
  Ecriture.unereference = (reference ) =>{
    return new Promise((resolve, reject)=>{
      sql.query(`SELECT *,  TIMESTAMPDIFF(DAY,  datecr, NOW()) as datedif FROM ecriture  WHERE reference =   "${reference}" `,  (error, employees)=>{
          if(error){
              return reject(error);
          }
          return resolve(employees);
      });
  });
  };
  //Modification des ecriture 
  Ecriture.modifierecrit = (date, idec, libecr, reference, idamba) => {
    return new Promise((resolve, reject)=>{
      sql.query(`UPDATE ecriture SET libecr = "${libecr}", datecr = "${date}", reference = "${reference}"   WHERE idec = ${idec} AND ambassade =  ${idamba}  `,  (error, employees)=>{
          if(error){
              return reject(error);
          }
          return resolve(employees);
      });
  });
  }; 
  
  module.exports = Ecriture;