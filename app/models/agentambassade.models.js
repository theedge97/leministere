const sql = require("../models/db.js");


const Agentamba = function(agent) {
    this.nom = agent.nom;
    this.prenom = agent.prenom;
    this.datenaissance = agent.datenaissance;
    this.sex = agent.sex;  
    this.matricule = agent.matricule;
    this.telephone = agent.telephone;
    this.email = agent.email;
    this.photo = agent.photo;
    this.motdepasse = agent.motdepasse;
    this.ambassadeid = agent.ambassadeid;
    this.statue = agent.statue; 
};
//Selectionner les Agents de Ambassade
 
Agentamba.selectagent = ( ) => {
    return new Promise((resolve, reject)=>{
      sql.query(`SELECT * FROM agentamba INNER JOIN ambassade ON ambassade.idamb = agentamba.ambassadeid INNER JOIN pays ON pays.idpays = ambassade.pays`,  (error, payss)=>{
          if(error){
              return reject(error);
          }
          return resolve(payss);
      });
  });
  };
//Suppression d'un Agent 
 //Suppression d'un Ambassade 
 Agentamba.supprimeragent = (ambid) => {
    return new Promise((resolve, reject)=>{
      sql.query(`DELETE FROM agentamba  WHERE idagentamba = ${ambid} `,  (error, employees)=>{
          if(error){
              return reject(error);
          }
          return resolve(employees);
      });
  });
  };
  //Ajout d'un Agent
  Agentamba.ajoutagent = (newagents) => {
    
    return new Promise((resolve, reject)=>{
      sql.query("INSERT INTO agentamba SET ?", newagents,  (error, enregistre)=>{
          if(error){
              return reject(error);
          }
          return resolve(enregistre);
      });
  });
  };
  //Selectionner un Agent 
  Agentamba.unagent = (id ) => {
    return new Promise((resolve, reject)=>{
      sql.query(`SELECT * FROM agentamba INNER JOIN ambassade ON ambassade.idamb = agentamba.ambassadeid INNER JOIN pays ON pays.idpays = ambassade.pays WHERE idagentamba = ${id} `,  (error, payss)=>{
          if(error){
              return reject(error);
          }
          return resolve(payss);
      });
  });
  };
  //Selection des informations d'un Agent
  Agentamba.recupereunagent = (matri) => {
    return new Promise((resolve, reject)=>{
      sql.query(`SELECT * FROM agentamba INNER JOIN ambassade ON ambassade.idamb = agentamba.ambassadeid INNER JOIN pays ON pays.idpays = ambassade.pays WHERE matricule = "${matri}" `,  (error, employees)=>{
          if(error){
              return reject(error);
          }
          return resolve(employees);
      });
  });
  };
  //Modification du mot de passe de L 'Agent 
   Agentamba.modifiermotdepasse = (matri, motdepasse) => {
    return new Promise((resolve, reject)=>{
      sql.query(`UPDATE agentamba SET motdepasse = "${motdepasse}" WHERE matricule = "${matri}" `,  (error, employees)=>{
          if(error){
              return reject(error);
          }
          return resolve(employees);
      });
  });
  };
 






  module.exports = Agentamba;