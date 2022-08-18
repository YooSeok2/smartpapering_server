const db = require('../DBs/models');
const fetch = require("node-fetch");
const Pushs = db.pushs;
require('dotenv').config();



exports.createOrderPush = (req,res)=>{
    const sendPush = {
        to : req.body.to,
        sound : 'default',
        title : req.body.title,
        body : req.body.body
    }

    fetch(`https://exp.host/--/api/v2/push/send`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendPush),
    })
    .then(data=>{
        Pushs.create({
            user_token : req.body.to,
            title : req.body.title,
            body : req.body.body
        })
        .then(data=>{
            res.send({
                data : data,
                result : 'ok'
            });
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "서버에서 푸시 테이블를 생성하는데 문제가 생김",
                result : false
            })
        })
    })
    .catch(err=>console.err(err))
}


exports.findPushAllByUserToken = (req, res)=>{
    const userToken = req.params.user_token;
    if(userToken){
        Pushs.findAll({where : {user_token :userToken}, order: [['createdAt','DESC']]})
        .then(data=>{
            res.send({
                data : data,
                count : data.length,
                result : 'ok'
            })
        })
        .catch(err=>{
            res.send({
                message : "잘못된 userToken입니다."+err,
                result : false
            })
        })
    }else{
        res.send({
            message : 'userToken이 없습니다.',
            result : false
        })
    }
}

exports.deleteAllPushByUserToken = (req, res)=>{
    const userToken = req.params.user_token;
    if(userToken){
        Pushs.destroy({
            where : {user_token :userToken}
        })
        .then(data=>{
            if(data == 1){
                res.send({
                    message : "알림을 정상적으로 삭제하였습니다."
                })
            }else{
                res.send({
                    message : '알림을 삭제할 수 없습니다 '
                })            
            }
        })
        .catch(err=>{
            res.status(500).send({
                message : "서버에서 알림을 삭제하는데 문제가 생김 ::"+err
            })
        })
    }
}

exports.sendMessageToChannel=(req,res)=>{
    const teleInfo = req.body;
    const CHATID = process.env.CHATID;
    const BOT_TOKEN = process.env.TELEBOT_TOKEN;

    const TELEURL = `https://api.telegram.org/bot${BOT_TOKEN}/sendmessage?chat_id=${CHATID}&text=`+teleInfo.text;

    fetch(encodeURI(TELEURL),{
        method : 'POST',
        headers: {
             Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(data=>{
        if(data.ok){
            res.send({
                message : '신규회원 텔레그램 메세지 정상 발송',
                result : 'ok'
            });
        }else{
            res.send({
                message : '신규회원 텔레그램 메세지 발송 에러',
                result : false
            });
            console.log('텔레그램 메세지 발송 서버문제 발생');
        }
    })
    .catch(err=>console.log(err))
}

exports.sendMessageToOrderChannel=(req,res)=>{
    const teleInfo = req.body;
    const CHATID = process.env.ORDERCHATID;
    const BOT_TOKEN = process.env.ORDERTELEBOT;

    const TELEURL = `https://api.telegram.org/bot${BOT_TOKEN}/sendmessage?chat_id=${CHATID}&text=`+teleInfo.text;

    fetch(encodeURI(TELEURL),{
        method : 'POST',
        headers: {
             Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(data=>{
        if(data.ok){
            res.send({
                message : '주문 텔레그램 메세지 정상 발송',
                result : 'ok'
            });
        }else{
            res.send({
                message : '주문 텔레그램 메세지 발송 에러',
                result : false
            });
            console.log('주문 텔레그램 메세지 발송 서버문제 발생');
        }
    })
    .catch(err=>console.log(err))
}

exports.sendMessageToWithdrawChannel=(req,res)=>{
    const teleInfo = req.body;
    const CHATID = process.env.WITHDRAWCHATID;
    const BOT_TOKEN = process.env.WITHDRAWTELEBOT;

    const TELEURL = `https://api.telegram.org/bot${BOT_TOKEN}/sendmessage?chat_id=${CHATID}&text=`+teleInfo.text;

    fetch(encodeURI(TELEURL),{
        method : 'POST',
        headers: {
             Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(data=>{
        if(data.ok){
            res.send({
                message : '출금 텔레그램 메세지 정상 발송',
                result : 'ok'
            });
        }else{
            res.send({
                message : '출금 텔레그램 메세지 발송 에러',
                result : false
            });
            console.log('출금 텔레그램 메세지 발송 서버문제 발생');
        }
    })
    .catch(err=>console.log(err))
}