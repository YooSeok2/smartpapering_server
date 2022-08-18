const db = require('../DBs/models');
const Orders = db.orders;
const Users = db.users;



exports.create = (req,res)=>{
    // 유효하지 않은 요청 처리
    if(!req.body){
        res.status(400).send({
            message : "유효하지 않은 값으로 인해 주문을 생성할 수 없습니다."
        });
        return;
    }

    const order = {
        place : req.body.place,
        customer_name : req.body.customer_name,
        customer_telephone : req.body.customer_telephone,
        order_id : req.body.order_id,
        user_name : req.body.user_name,
        user_phone : req.body.user_phone
    }

    Users.findOne({where : {unique:req.body.order_id}})
    .then(data=>{
        if(data){
            Orders.create(order)
            .then(val=>{
                res.send({
                    data : val,
                    result : 'ok'
                });
            })
            .catch(err => {
                res.status(500).send({
                    message : err.message || "서버에서 주문 테이블를 생성하는데 문제가 생김",
                    result : false
                })
            })
        }else{
            res.status(500).send({
                message : '해당 유저를 찾을 수가 없습니다.',
                result : false
            })
        }
    })
    .catch(err=>console.error(new Error(err)));
}

exports.findAll = (req,res)=>{
    Orders.findAll({order : [['createdAt','DESC']]})
    .then(data=>{
        res.send({
            data : data,
            count : data.length,
            result : 'ok'
        });
    })
    .catch(err=>{
        res.status(500).send({
            message : err.message || "서버에서 주문 테이블을 조회하는데 문제가 생김",
            result : false
        })
    })
}


exports.findAllByUserId = (req,res)=>{
    const orderId = req.params.order_id;

    if(orderId){
        Orders.findAll({where : {order_id : orderId}, order: [['createdAt','DESC']]})
        .then(data=>{
            res.send({
                data : data,
                count : data.length,
                result : 'ok'
            })
        })
        .catch(err=>{
            res.send({
                message : "잘못된 order_id입니다."+err,
                result : false
            })
        })
    }else{
        res.send({
            message : 'order_id가 없습니다.',
            result : false
        })
    }
    
}


exports.findOneByQuery = (req,res)=>{
    const query = req.query;
    if(query.ordernum){
        Orders.findOne({where : {ordernum : query.ordernum}})
        .then(data=>{
            if(data){
                res.send({
                    data : data,
                    result : false
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
    }else if(query.order_id){
        Orders.findOne({where : {order_id : query.order_id}})
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


exports.update = (req, res)=>{
    const ordernum = req.body.ordernum;
    const substitute = req.body.substitute
    if(!req.body.substitute){
        res.status(400).send({
            message : "유효하지 않은 값으로 인해 주문을 업데이트 할 수 없습니다."
        });
        return;
    }

    Orders.update(JSON.parse(substitute), {where: {ordernum : ordernum}})
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


exports.delete = (req,res)=>{
    const ordernum = req.params.ordernum; 

    Orders.destroy({
        where : {ordernum : ordernum}
    })
    .then(data=>{
        if(data == 1){
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