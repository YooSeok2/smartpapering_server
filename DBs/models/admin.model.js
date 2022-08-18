module.exports = (sequelize, DataTypes)=>{
    const SequelizeUUid = require('sequelize');
    
    const Admin = sequelize.define("admins", {
        adminnum : { //관리자 고유번호
            primarykey : true,
            type : DataTypes.UUID,
            defaultValue : SequelizeUUid.UUIDV4
        },
        admin_id : {
            type : DataTypes.STRING
        },
        password : {
            type : DataTypes.STRING
        },
        salt : {
            type : DataTypes.STRING
        }
    });
    return Admin
}