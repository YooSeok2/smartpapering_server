const db = require('../DBs/models');
const Withdraws = db.withdraws;
const Users = db.users;

exports.create =(req,res)=>{
        // 유효하지 않은 요청 처리
        if(!req.body){
            res.status(400).send({
                message : "유효하지 않은 값으로 인해 출금을 생성할 수 없습니다.",
                result : false
            });
            return;
        }
    
        const withdraw = {
            bank : req.body.bank,
            account_holder : req.body.account_holder,
            withdraw_price : req.body.withdraw_price,
            user_phone : req.body.user_phone,
            user_id : req.body.user_id,
            user_name : req.body.user_name,
            account_num : req.body.account_num
        }
    
        Users.findOne({where : { unique : req.body.user_id }})
        .then(data=>{
            if(data){
                Withdraws.create(withdraw)
                .then(val=>{
                    res.send({
                        data : val,
                        result : 'ok'
                    });
                })
                .catch(err => {
                    res.status(500).send({
                        message : err.message || "서버에서 출금 테이블를 생성하는데 문제가 생김",
                        result : false
                    })
                })
            }else{
                res.status(500).send({
                    message : '해당 유저를 찾을 수가 없습니다.',
                    result : false
                });
            }
        })
        .catch(err=>console.error(new Error(err)));
}

exports.findAll = (req,res)=>{
    Withdraws.findAll({order : [['createdAt','DESC']]})
    .then(data=>{
        res.send({
            data : data,
            count : data.length,
            result : 'ok'
        });
    })
    .catch(err=>{
        res.status(500).send({
            message : err.message || "서버에서 출금정보를 조회하는데 문제가 생김",
            result : false
        })
    })
}

exports.findAllByUserId = (req,res)=>{
    const userId = req.params.user_id;

    if(userId){
        Withdraws.findAll({where : {user_id : userId}, order: [['createdAt','DESC']]})
        .then(data=>{
            res.send({
                data : data,
                result : 'ok'
            })
        })
        .catch(err=>{
            res.send({
                message : '잘못된 값으로 출금정보 검색 안됨 ::'+err,
                result : false
            })
        })
    }else{
        res.send({
            message : 'user_id가 없습니다.',
            result : false
        })
    }
}

exports.update = (req, res)=>{
    const withdrawnum = req.body.withdrawnum;
    const substitute = req.body.substitute
    if(!req.body.substitute){
        res.status(400).send({
            message : "유효하지 않은 값으로 인해 출금정보를 업데이트 할 수 없습니다."
        });
        return;
    }
    Withdraws.update(JSON.parse(substitute), {where: {withdrawnum : withdrawnum}})
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

exports.delete = (req,res)=>{
    const withdrawnum = req.params.withdrawnum; 

    Withdraws.destroy({
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