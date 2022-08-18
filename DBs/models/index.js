const MysqlConfig = require("../config/db.config.js");
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);

const Sequelize = require('sequelize');

const db = {};

const sequelizeOption = {
    host : "smartpapering.com",
    dialect: MysqlConfig.dialect,
    logging: false
}
const sequelize = new Sequelize(MysqlConfig.DB, MysqlConfig.USER, MysqlConfig.PASSWORD, sequelizeOption);
// const sequelize = new Sequelize('nodeexample', 'root', '1234', {host : 'localhost', dialect:'mysql'})

sequelize.authenticate().then(()=>{
    console.log("연결성공");
}).catch(err=>{
    console.log("연결실패",err);
});

// db.["name"].require('route')(sequelize, Sequelize)를 모든 모델에 수행
fs.readdirSync(__dirname).filter(file=>{ //readiireSync => 디렉토리 읽어옴, _dirname :현제 티렉토리에 있는 파일이름
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === ".js");
}).forEach(file =>{
    let model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
});

// 외래키 생성
// Object.keys(db).forEach(modelName=>{
//     if(db[modelName].associate){
//         db[modelName].associate(db);
//     };
// });


db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;


