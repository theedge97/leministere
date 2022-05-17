const sql = require("../models/db.js");
// constructor


// constructor
const Admin = function(leadmin) {
    this.Nom_admin = leadmin.Nom_admin;
    this.Tel_admin = leadmin.Tel_admin;
    this.motdepasse = leadmin.motdepasse;
    //
  };
//insertion d'une AdministraTEUR
Admin.inscription = (newAdmin) => {
    
  return new Promise((resolve, reject)=>{
    sql.query("INSERT INTO admin SET ?", newAdmin,  (error, enregistre)=>{
        if(error){
            return reject(error);
        }
        return resolve(enregistre);
    });
});
};
  //Recuperer une Administrateur
  Admin.recupereunadmin = (tel) => {
    return new Promise((resolve, reject)=>{
      sql.query(`SELECT * FROM admin   WHERE Tel_admin = ${tel} `,  (error, employees)=>{
          if(error){
              return reject(error);
          }
          return resolve(employees);
      });
  });
  };

  module.exports = Admin;