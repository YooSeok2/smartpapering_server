const db = require('../DBs/models');
const handler = require('../handlers/user.handler');
const Users = db.users;
const jwt = require('jsonwebtoken');

require('dotenv').config();


exports.create = (req,res)=>{
    // 유효하지 않은 요청 처리
    if(!req.body){
        res.status(400).send({
            message : "유효하지 않은 값으로 인해 유저를 생성할 수 없습니다."
        });
        return;
    }

    handler.cryptoPassword(req.body, (hashUserData)=>{
        const user = {
            username : req.body.username,
            phone : req.body.phone,
            push_token : req.body.push_token,
            ...hashUserData
        }
        
        Users.create(user)
        .then(data=>{
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "서버에서 유저 테이블를 생성하는데 문제가 생김 ::"+err
            })
        })
    })
}

exports.findAll = (req, res)=>{
    Users.findAll({order : [['createdAt','DESC']]})
    .then(data=>{
        res.send({
            data : data,
            count : data.length,
            result : 'ok'
        });
    })
    .catch(err => {
        res.status(500).send({
            message : err.message || "서버에서 유저 테이블을 조회하는데 문제가 생김",
            result : false
        })
    })
}

exports.findAndCountAll = (req,res) => {
    var offset = parseInt(req.query.start);
    var limit = parseInt(req.query.limit);
    Users.findAndCountAll({order : [['createdAt','DESC']],offset : offset, limit : limit})
    .then(data=>{
        res.send({
            data : data.rows,
            count : data.count,
            result : 'ok'
        })
    })
    .catch(err => {
        res.status(500).send({
            message : err.message || "서버에서 유저 테이블을 조회하는데 문제가 생김",
            result : false
        })
    })
}

exports.findOneByQuery = (req,res)=>{
    const query = req.query;
    if(query.phone){
        Users.findOne({where : {phone : query.phone}})
        .then(data=>{
            if(data){
                res.send({
                    data : data,
                    result : 'ok'
                });
            }else{
                res.send({
                    result : false
                })
            }
        })
        .catch(err=>{
            res.status(500).send({
                message : "서버에서 개별 유저 테이블을 조회하는데 문제가 생김 ::"+err,
                result : false
            })
        })
    }else if(query.unique){
        Users.findOne({where : {unique : query.unique}})
        .then(data=>{
            if(data){
                res.send({
                    data : data,
                    result : 'ok'
                });
            }else{
                res.send({
                    message : 'DB에 저장되지않은 사용자',
                    result : false
                })
            }
        })
        .catch(err=>{
            res.status(500).send({
                message : "서버에서 개별 유저 테이블을 조회하는데 문제가 생김 ::"+err,
                result : false
            })
        })
    }else{
        res.send({
            message : '조회하려는 특정 유저에 대한 query값이 없음',
            result : false
        });
    }
   
}

exports.updateByOrder = (req,res) => {
    const unique =  req.params.unique;
    const getBeforePoint = Users.findOne({where : {unique : unique}}).then(data=>{return data});
        getBeforePoint.then(data=>{
            const point = parseInt(data.get().point) + parseInt(req.body.point);
            Users.update({point : point},{where : {unique : unique}})
            .then(status=>{
                if(status == 1){
                    res.send({
                        message : "포인트가 정상적으로 업데이트 되었습니다.",
                        result : 'ok'
                    })
                }else{
                    res.send({
                        message : "포인트를 업데이트 할 수 없습니다 :: unique ="+unique,
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
        })
        .catch(err=>{
            res.status(500).send({
                message : '서버에서 유저의 포인트값을 가져오는데 문제가 생김 ::'+err,
                result : false
            })
        })
}

exports.updateForPasword = (req,res)=>{
    const unique = req.params.unique;
    if(req.body.password){
        handler.cryptoPassword(req.body, (newPassword)=>{
            Users.update(newPassword,{where : {unique : unique}})
            .then(data=>{
                if(data == 1){
                    res.send({
                        message : "비밀번호가 정상적으로 업데이트 되었습니다.",
                        result : 'ok'
                    })
                }else{
                    res.send({
                        message : "비밀번호를 업데이트 할 수 없습니다 :: unique ="+unique,
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
        })
    }else{
        res.status(400).send({
            message : "유효하지 않은 값으로 인해 유저의 비밀번호를 업데이트 할 수 없습니다.",
            result : false
        });
        return;
    }
}

exports.update = (req, res)=>{
    const unique = req.params.unique;
    const key = Object.keys(req.body)[0];
    const value = Object.values(req.body)[0];
    if(req.body){
        Users.update({ [key] : value},{where : {unique : unique}})
        .then(status=>{
            if(status == 1){
                res.send({
                    message : "유저 정보를 정상적으로 업데이트 되었습니다.",
                    result : 'ok'
                })
            }else{
                res.send({
                    message : "유저 정보를 업데이트 할 수 없습니다 :: unique ="+unique,
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
    }else{
        res.status(400).send({
            message : "유효하지 않은 값으로 인해 유저를 업데이트 할 수 없습니다.",
            result : false
        });
        return;
    }
  
    
}


exports.delete = (req, res)=> {
    const unique = req.params.unique;

    Users.destroy({
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


exports.createToken = async(req,res,next)=>{
    const SECRET_KEY = process.env.JWT_SECRET_PRIVATE_KEY;

    const refVal = req.body;

    Users.findOne({where : {phone : refVal.phone}})
    .then(data=>{
        if(data){
            handler.cryptoPassword({password : refVal.password, salt : data.salt}, (hash)=>{
                    if(data.password === hash.password){
                        try{
                            const token = jwt.sign({
                                phone : data.phone
                            }, SECRET_KEY,{expiresIn:'90d'});

                            res.status(200).json({
                                result : 'ok',
                                unique : data.unique,
                                phone : data.phone,
                                username : data.username,
                                point : data.point,
                                createdAt : data.createdAt,
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
            message : '해당 유저 조회 안됨 ::'+err
        })
    })
    
}

exports.createRefreshToken = (req,res)=>{
    const SECRET_KEY = process.env.JWT_SECRET_PRIVATE_KEY;
    const userPhone = req.body.phone

    try{
        const token = jwt.sign({
            phone : userPhone
        }, SECRET_KEY,{expiresIn:'90d'});

        res.status(200).json({
            result : 'ok',
            token : token
        });
    }catch(err){
        console.error(err);
        next(err);
    }
}

exports.verify = (req, res) => {
   try{
        Users.findOne({where : {phone : res.locals.userPhone}})
        .then(data=>{
            if(data){
                res.send({
                    phone : data.phone,
                    unique : data.unique,
                    username : data.username,
                    point : data.point,
                    token_exp : res.locals.exp,
                    result : 'ok'
                });
            }else{
                res.send({
                    message : 'failed',
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