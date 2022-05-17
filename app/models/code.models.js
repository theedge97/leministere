const sql = require("../models/db.js");
// constructor de la table code activation
 
const Codeadmin = function(lecode) {
  this.code = lecode.code;
};

Codeadmin.verifier =  ( codeid) => {
  return new Promise((resolve, reject)=>{
    sql.query(`SELECT * FROM code_admin WHERE code = ${codeid} `,  (error, employees)=>{
        if(error){
            return reject(error);
        }
        return resolve(employees);
    });
});
};

  
module.exports = Codeadmin;