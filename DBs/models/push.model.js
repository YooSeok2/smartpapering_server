module.exports = (sequelize,DataTypes)=>{
     const Push = sequelize.define("pushs", {
        user_token: {
            type : DataTypes.STRING
        },
        title: {
            type : DataTypes.STRING
        },
        body: {
            type : DataTypes.STRING
        }
     });

     return Push;
}