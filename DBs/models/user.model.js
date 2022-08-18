module.exports = (sequelize,DataTypes)=>{
    const SequelizeUUid = require('sequelize');

    const User = sequelize.define("users", {
        unique : { //회원 고유번호
            primarykey : true,
            type : DataTypes.UUID,
            defaultValue : SequelizeUUid.UUIDV4
        },
        point : { //회원 적립금
            type : DataTypes.STRING,
            defaultValue : '0'
        },
        username : { //회원이름
            type : DataTypes.STRING
        },
        phone : { //회원 폰 번호
            type : DataTypes.STRING
        },
        password : { //회원 계정 비밀번호
            type : DataTypes.STRING
        },
        salt : { //회원 계정 비밀번호 암호화에 필요한 정보
            type : DataTypes.STRING,
        },
        islogin : {
            type : DataTypes.BOOLEAN,
            defaultValue : false
        },
        use_push : {
            type : DataTypes.BOOLEAN,
            defaultValue : true
        },
        push_token : {
            type : DataTypes.STRING
        }
    });

    // User.associate = (models)=>{
        
    //     models.users.hasMany(models.orders, {foreignkey: 'order_id', sourceKey : 'unique'});
    // }

    return User;
}