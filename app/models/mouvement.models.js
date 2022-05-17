const sql = require("../models/db.js");

// constructor


// constructor
const Mouvement = function(mvt) {
    this.ecriture = mvt.ecriture;
    this.compteid = mvt.compteid;
    this.debit = mvt.debit;
    this.credit = mvt.credit;
    this.RefJPC = mvt.RefJPC;
    this.taux = mvt.taux;
    //
  };
//Selectionner les Pays
 
Mouvement.selectyp = ( ) => {
    return new Promise((resolve, reject)=>{
      sql.query(` SELECT * FROM mouvement `,  (error, payss)=>{
          if(error){
              return reject(error);
          }
          return resolve(payss);
      });
  });
  };

  //Ajout d'un mvt 
  Mouvement.ajoutmvt = (newecrit) => {
    
    return new Promise((resolve, reject)=>{
      sql.query("INSERT INTO mouvement SET ?", newecrit,  (error, enregistre)=>{
          if(error){
              return reject(error);
          }
          return resolve(enregistre.insertId);
      });
  });
  };
  //Selectionneer le compte en fonction du mvt de la date et de erciture 
  //SELECT * FROM mouvement INNER JOIN ecriture ON ecriture.idec = mouvement.ecriture INNER JOIN compte ON compte.idcompte = mouvement.compteid
    //selectionner la devise d'une monaie 
    Mouvement.uncompteetat = (debut, fin, numcpte,ambaid ) =>{
        return new Promise((resolve, reject)=>{
          sql.query(`SELECT * FROM mouvement INNER JOIN ecriture ON ecriture.idec = mouvement.ecriture INNER JOIN compte ON compte.idcompte = mouvement.compteid  WHERE DATE(ecriture.datecr) BETWEEN  '${debut}' AND  '${fin}'  AND compte.numcpte =    ${numcpte} AND ecriture.ambassade =  ${ambaid} ORDER BY ecriture.idec ASC` ,  (error, employees)=>{
              if(error){
                  return reject(error);
              }
              return resolve(employees);
          });
      });
      }; 

      //SELECTION L'ETAT D 1 COMPTE A DATE 
      Mouvement.uncompteadate = (date, numcpte, ambaid ) =>{
        return new Promise((resolve, reject)=>{
          sql.query(`SELECT * FROM mouvement INNER JOIN ecriture ON ecriture.idec = mouvement.ecriture INNER JOIN compte ON compte.idcompte = mouvement.compteid WHERE DATE(ecriture.datecr) <=  '${date}' AND compte.numcpte = ${numcpte} AND ecriture.ambassade = ${ambaid} ORDER BY ecriture.idec ASC  ` ,  (error, employees)=>{
              if(error){
                  return reject(error);
              }
              return resolve(employees);
          });
      });
      }; 
      //Selectionner les mouvement d 'un ecriture 
      Mouvement.lesmvts = (ecriture) =>{
        return new Promise((resolve, reject)=>{
          sql.query(`SELECT * FROM mouvement INNER JOIN compte ON compte.idcompte = mouvement.compteid  WHERE ecriture = ${ecriture} ORDER BY mouvement.idmvt DESC  ` ,  (error, employees)=>{
              if(error){
                  return reject(error);
              }
              return resolve(employees);
          });
      });
      }; 
      //Modifier les Mvts
      Mouvement.modifiermvt = (idmvt, credit, debit, compteid) => {
        return new Promise((resolve, reject)=>{
          sql.query(` UPDATE mouvement INNER JOIN compte ON compte.idcompte = mouvement.compteid SET credit= ${credit} , debit = ${debit}, compteid = ${compteid}  WHERE idmvt = ${idmvt}  `,  (error, employees)=>{
              if(error){
                  return reject(error);
              }
              return resolve(employees);
          });
      });
      }; 
      //Selectionner Le toto de chaque compte de type Charge  
      /**
       * SELECT SUM(credit) as toto,numcpte,ambassade.idamb as ambassades from mouvement INNER join compte on mouvement.compteid=compte.idcompte
INNER join ecriture on ecriture.idec=mouvement.ecriture
inner join ambassade on ambassade.idamb=ecriture.ambassade
GROUP BY idcompte, ambassades
       */
Mouvement.lescomptechargestoto = ( idamba) =>{
    return new Promise((resolve, reject)=>{
      sql.query(`SELECT SUM(debit) as toto,numcpte, compte.intcompte As intutile from mouvement INNER join compte on mouvement.compteid=compte.idcompte INNER join ecriture on ecriture.idec=mouvement.ecriture inner join ambassade on ambassade.idamb=ecriture.ambassade WHERE ambassade.idamb = ${idamba} AND  compte.typcompte = 3 GROUP BY idcompte` ,  (error, employees)=>{
          if(error){
              return reject(error);
          }
          return resolve(employees);
      });
  });
  }; 
   //Selectionner Le toto de chaque compte de type Produits  
   Mouvement.lescompteproduitstoto = ( idamba) =>{
    return new Promise((resolve, reject)=>{
      sql.query(`SELECT SUM(credit) as toto,numcpte, compte.intcompte As intutile from mouvement INNER join compte on mouvement.compteid=compte.idcompte INNER join ecriture on ecriture.idec=mouvement.ecriture inner join ambassade on ambassade.idamb=ecriture.ambassade WHERE ambassade.idamb = ${idamba} AND  compte.typcompte = 4 GROUP BY idcompte` ,  (error, employees)=>{
          if(error){
              return reject(error);
          }
          return resolve(employees);
      });
  });

  };
  //Sommes  de toto de chaque compte de type Actifs 
  Mouvement.lescompteactifstoto = ( idamba) =>{
    return new Promise((resolve, reject)=>{
      sql.query(`SELECT SUM(debit) as toto,numcpte, compte.intcompte As intutile from mouvement INNER join compte on mouvement.compteid=compte.idcompte INNER join ecriture on ecriture.idec=mouvement.ecriture inner join ambassade on ambassade.idamb=ecriture.ambassade WHERE ambassade.idamb = ${idamba} AND  compte.typcompte = 1 GROUP BY idcompte` ,  (error, employees)=>{
          if(error){
              return reject(error);
          }
          return resolve(employees);
      });
  });
  };
    //Sommes  de toto de chaque compte de type Passifs 
    Mouvement.lescomptepassiftoto = ( idamba) =>{
        return new Promise((resolve, reject)=>{
          sql.query(`SELECT SUM(credit) as toto,numcpte, compte.intcompte As intutile from mouvement INNER join compte on mouvement.compteid=compte.idcompte INNER join ecriture on ecriture.idec=mouvement.ecriture inner join ambassade on ambassade.idamb=ecriture.ambassade WHERE ambassade.idamb = ${idamba} AND  compte.typcompte = 2 GROUP BY idcompte` ,  (error, employees)=>{
              if(error){
                  return reject(error);
              }
              return resolve(employees);
          });
      });
      };
//Balance A date 
Mouvement.balanceadate = ( idamba, date) =>{
    return new Promise((resolve, reject)=>{
      sql.query(`SELECT SUM(debit) as sommedebit , SUM(credit) as sommecredit, numcpte, compte.intcompte As intutile from mouvement INNER join compte on mouvement.compteid=compte.idcompte INNER join ecriture on ecriture.idec=mouvement.ecriture inner join ambassade on ambassade.idamb=ecriture.ambassade WHERE ambassade.idamb =${idamba} AND DATE(ecriture.datecr) <=  '${date}' GROUP BY idcompte
      ` ,  (error, employees)=>{
          if(error){
              return reject(error);
          }
          return resolve(employees);
      });
  });
  };
  //Balance periodique
  Mouvement.balanceperiodique = ( idamba, debut, fin) =>{
    return new Promise((resolve, reject)=>{
      sql.query(`SELECT SUM(debit) as sommedebit , SUM(credit) as sommecredit, numcpte, compte.intcompte As intutile from mouvement INNER join compte on mouvement.compteid=compte.idcompte INNER join ecriture on ecriture.idec=mouvement.ecriture inner join ambassade on ambassade.idamb=ecriture.ambassade WHERE ambassade.idamb = ${idamba} AND DATE(ecriture.datecr) BETWEEN '${debut}' AND '${fin}' GROUP BY idcompte   ` ,  (error, employees)=>{
          if(error){
              return reject(error);
          }
          return resolve(employees);
      });
  });
  };
  //Balance a Date 
  
  module.exports = Mouvement;