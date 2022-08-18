module.exports = (sequelize,DataTypes)=>{
    const SequelizeUUid = require('sequelize');
    
    const Order = sequelize.define("orders", {
        ordernum : { //주문 고유번호
            primarykey : true,
            type : DataTypes.UUID,
            defaultValue : SequelizeUUid.UUIDV4
        },
        place : { //주문 시공 장소
            type : DataTypes.STRING
        },
        customer_name : { //주문 시공하려는 고객
            type : DataTypes.STRING
        },
        customer_telephone : { //주문 시공하려는 고객의 폰 번호
            type : DataTypes.STRING
        },
        status : { // 주문 상태
            type : DataTypes.STRING,
            defaultValue : '시공접수',
        },
        order_id : { //회원 고유번호
            type : DataTypes.STRING
        },
        order_amount : {
            type : DataTypes.STRING,
            defaultValue : '0'
        },
        user_name : {
            type : DataTypes.STRING
        },
        user_phone : {
            type : DataTypes.STRING
        },
        memo : {
            type : DataTypes.STRING
        }
    });

    // Order.associate = (models)=>{
    //     models.orders.belongsTo(models.users,{foreignKey : 'order_id', targetKey : 'unique'})
    // }

    return Order;
}