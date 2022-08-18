const db = require('../DBs/models');
const handler = require('../handlers/user.handler')
const Admin = db.admins;
const Order = db.orders;
const Withdraw = db.withdraws;
const User = db.users;
const jwt = require('jsonwebtoken');
const Op = require('sequelize').Op;

require('dotenv').config();

exports.create = (req,res)=>{
    // 유효하지 않은 요청 처리
    if(!req.body){
        res.status(400).send({
            message : "유효하지 않은 값으로 인해 관리자를 생성할 수 없습니다."
        });
        return;
    }

    handler.cryptoPassword(req.body, (hashUserData)=>{
        const admin = {
            admin_id : req.body.admin_id,
            ...hashUserData
        }
        
        Admin.create(admin)
        .then(data=>{
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "서버에서 관리자 테이블를 생성하는데 문제가 생김 ::"+err
            })
        })
})
}

exports.findAllAdmin = (req, res) =>{
    Admin.findAll({order : [['createdAt', 'DESC']]})
    .then(data=>{
        res.send(data);
    })
    .catch(err=>{
        res.status(500).send({
            message : err.message,
            result : false
        })
    })
}

exports.login = async(req,res,next)=>{
    const SECRET_KEY = process.env.JWT_SECRET_PRIVATE_KEY;

    const refVal = req.body;

    Admin.findOne({where : {admin_id : refVal.admin_id}})
    .then(data=>{
        if(data){
            handler.cryptoPassword({password : refVal.password, salt : data.salt}, (hash)=>{
                    if(data.password === hash.password){
                        try{
                            const token = jwt.sign({
                                admin_id : data.admin_id
                            }, SECRET_KEY);

                            res.status(200).json({
                                result : 'ok',
                                admin_id : data.admin_id,
                                token
                            })

                        }catch(err){
                            console.error(err);
                            next(err);
                        } 
                    }else{
                        res.send({result : false, message : 'password'})
                    }
            })   
        }else{
            res.send({result : false, message : 'id'});
        }
    })
    .catch(err=>{ 
        res.status(500).send({
            message : '해당 관리자 조회 안됨 ::'+err,
            result : false
        })
    })
    
}

exports.verify = (req, res) => {
   try{
        Admin.findOne({where : {admin_id : res.locals.admin_id}})
        .then(data=>{
            if(data){
                res.send({
                    admin_id : data.admin_id,
                    result : 'ok'
                });
            }else{
                res.send({
                    result : false
                })
            }
         
        })
        .catch(err=>console.log(err))
   }catch(err){
       res.send({
           message : 'failed',
           result : false
       })
       next(err);
   }
}

exports.findAllInProgress = (req,res)=>{
    var offset = parseInt(req.query.start);
    var limit = parseInt(req.query.limit);
    Order.findAndCountAll({where : {status : {[Op.or] : ['시공접수','시공진행']}}, order: [['createdAt','DESC']], offset : offset, limit : limit}) // SELECT * FROM orders WHERE status = '시공진행 OR  status = '시공접수' ORDERBY DESC createdAt
    .then(data=>{
        res.send({
            data : data.rows,
            count : data.count,
            result : 'ok'
        })
    })
    .catch(err=>{
        res.send({
            message : "잘못된 order progress조회 요청입니다."+err,
            result : false
        })
    })
    
}

exports.findAllInEnd = (req,res)=>{
    var offset = parseInt(req.query.start);
    var limit = parseInt(req.query.limit);
    Order.findAndCountAll({where : {status : '시공완료'}, order: [['createdAt','DESC']],offset : offset, limit : limit})
    .then(data=>{
        res.send({
            data : data.rows,
            count : data.count,
            result : 'ok'
        })
    })
    .catch(err=>{
        res.send({
            message : "잘못된 order end조회 요청입니다."+err,
            result : false
        })
    })
}

exports.findAllInCancel = (req,res)=>{
    var offset = parseInt(req.query.start);
    var limit = parseInt(req.query.limit);
    Order.findAndCountAll({where : {status : '거래취소'}, order: [['createdAt','DESC']], offset : offset, limit : limit})
    .then(data=>{
        res.send({
            data : data.rows,
            count : data.count,
            result : 'ok'
        })
    })
    .catch(err=>{
        res.send({
            message : "잘못된 order cancel조회 요청입니다."+err,
            result : false
        })
    })
}

exports.findAllInWithdraw = (req,res)=>{
    var offset = parseInt(req.query.start);
    var limit = parseInt(req.query.limit);
    Withdraw.findAndCountAll({where : {status : '접수'}, order  : [['createdAt', 'DESC']], offset : offset, limit : limit})
    .then(data=>{
        res.send({
            data : data.rows,
            count : data.count,
            result : 'ok'
        })
    })
    .catch(err=>{
        res.send({
            message : "잘못된 CMS 출금조회 요청입니다."+err,
            result : false
        })
    })
}

exports.findAllInEndWithdraw = (req,res)=>{
    var offset = parseInt(req.query.start);
    var limit = parseInt(req.query.limit);
    Withdraw.findAndCountAll({where : {status : '완료'}, order  : [['createdAt', 'DESC']], offset : offset, limit : limit})
    .then(data=>{
        res.send({
            data : data.rows,
            count : data.count,
            result : 'ok'
        })
    })
    .catch(err=>{
        res.send({
            message : "잘못된 CMS 출금완료조회 요청입니다."+err,
            result : false
        })
    })
}


exports.userUpdate = (req,res)=>{
    const substitute = req.body.substitute;
    const unique = req.body.unique;

    User.update(JSON.parse(substitute), {where : {unique : unique}})
    .then(status=>{
        if(status == 1){
            res.send({
                message : "회원정보가 정상적으로 업데이트 되었습니다.",
                result : 'ok'
            })
        }else{
            res.send({
                message : "회원정보를 업데이트 할 수 없습니다 :: unique ="+unique,
                result : false
            })
        }
    })
    .catch(err=>{
        res.status(500).send({
            message : '서버에서 개별 유저 테이블값을 업데이트 하는 데에 문제가 생김 ::'+err,
            result : false
        })
    })
}

exports.userDelete = (req, res)=> {
    const unique = req.params.unique;

    User.destroy({
        where : {unique : unique}
    })
    .then(data=>{
        if(data == 1){
            res.send({
                message : "유저 테이블을 정상적으로 삭제하였습니다.",
                result : 'ok'
            })
        }else{
            res.send({
                message : "유저를 삭제 할 수 없습니다 :: unique ="+unique,
                result : false
            })
        }
    })
    .catch(err=>{
        res.status(500).send({
            message : "서버에서 유저 테이블을 삭제하는 데에 문제가 생김 ::"+err,
            result : false
        })
    })
}


exports.orderUpdate = (req, res)=>{
    const ordernum = req.body.ordernum;
    const substitute = req.body.substitute
    if(!req.body.substitute){
        res.status(400).send({
            message : "유효하지 않은 값으로 인해 주문을 업데이트 할 수 없습니다."
        });
        return;
    }

    Order.update(JSON.parse(substitute), {where: {ordernum : ordernum}})
    .then(data=>{
        if(data == 1){
            res.send({
                message : "주문 상태가 정상적으로 업데이트 되었습니다.",
                result : 'ok'

            })
        }else{
            res.send({
                message : "주문 상태를 업데이트 할 수 없습니다 :: ordernum ="+ordernum,
                result : false
            })
        }
    })
    .catch(err=>{
        res.status(500).send({
            message : '서버에서 특정 주문 테이브을 업데이트 하는데 문제가 생김 ::'+err,
            result : false
        })
    })
}

exports.orderDelete = (req,res) => {
    const ordernum = req.params.ordernum; 

    Order.destroy({
        where : {ordernum : ordernum}
    })
    .then(data=>{
        if(data ==1){
            res.send({
                message : "주문 테이블을 정상적으로 삭제하였습니다."
            })
        }else{
            res.send({
                message : '주문 테이블을 삭제할 수 없습니다 :: ordernum='+ordernum
            })            
        }
    })
    .catch(err=>{
        res.status(500).send({
            message : "서버에서 주문 테이블을 삭제하는데 문제가 생김 ::"+err
        })
    })
}

exports.withdrawUpdate = (req, res)=>{
    const withdrawnum = req.body.withdrawnum;
    const substitute = req.body.substitute
    if(!req.body.substitute){
        res.status(400).send({
            message : "유효하지 않은 값으로 인해 출금정보를 업데이트 할 수 없습니다."
        });
        return;
    }
    Withdraw.update(JSON.parse(substitute), {where: {withdrawnum : withdrawnum}})
    .then(data=>{
        if(data == 1){
            res.send({
                message : "출금 상태가 정상적으로 업데이트 되었습니다.",
                result : 'ok'

            })
        }else{
            res.send({
                message : "출금 상태를 업데이트 할 수 없습니다 :: withdrawnum ="+withdrawnum,
                result : false
            })
        }
    })
    .catch(err=>{
        res.status(500).send({
            message : '서버에서 특정 출금 테이블 업데이트 하는데 문제가 생김 ::'+err,
            result : false
        })
    })
}

exports.withdrawDelete = (req,res)=>{
    const withdrawnum = req.params.withdrawnum; 

    Withdraw.destroy({
        where : {withdrawnum : withdrawnum}
    })
    .then(data=>{
        if(data ==1){
            res.send({
                message : "출금 정보를 정상적으로 삭제하였습니다."
            })
        }else{
            res.send({
                message : '출금 정보를 삭제할 수 없습니다 :: ordernum='+ordernum
            })            
        }
    })
    .catch(err=>{
        res.status(500).send({
            message : "서버에서 출금 정보를 삭제하는데 문제가 생김 ::"+err
        })
    })
}