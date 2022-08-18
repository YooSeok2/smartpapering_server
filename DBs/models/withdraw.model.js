module.exports = (sequelize, DataTypes)=>{
    const SequelizeUUid = require('sequelize');

    const Withdraw = sequelize.define("withdraws", {
        withdrawnum : { //출금고유번호
            primarykey : true,
            type : DataTypes.UUID,
            defaultValue : SequelizeUUid.UUIDV4
        },
        bank : {
            type : DataTypes.STRING
        },
        account_holder : { //예금주
            type : DataTypes.STRING
        },
        withdraw_price : { //출금금액
            type : DataTypes.STRING
        },
        user_phone : { //회원 휴대폰번호
            type : DataTypes.STRING
        },
        user_id : { //회원 고유번호
            type : DataTypes.STRING
        },
        user_name : { //회원 이름
            type : DataTypes.STRING
        },
        account_num : {
            type : DataTypes.STRING //계좌번호
        },
        status : {
            type : DataTypes.STRING,
            defaultValue : '접수'
        }
    });

    return Withdraw;
}