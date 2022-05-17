const sql = require("../models/db.js");

// constructor


// constructor
const TypeCompte = function(cpte) {
    this.libcpte = cpte.libcpte;
    //
  };
//Selectionner les Pays
 
  TypeCompte.selectypecompte = ( ) => {
    return new Promise((resolve, reject)=>{
      sql.query(` SELECT * FROM type_de_compte `,  (error, payss)=>{
          if(error){
              return reject(error);
          }
          return resolve(payss);
      });
  });
  };
  
  module.exports = TypeCompte;