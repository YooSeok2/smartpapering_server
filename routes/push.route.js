const controller = require('../controllers/push.controller');
const auth = require("./middlewares/authorization");

module.exports = app=>{
    const router = require('express').Router();

    // 주문 메세지 발송
    router.post('/ordermessages',controller.createOrderPush);

    // 유저토큰과 일치하는 모든 앱 알림 검색
    router.get('/getpushs/:user_token', controller.findPushAllByUserToken);

    // 푸시토큰과 일치하는 모든 알림정보 삭제
    router.delete('/deletepushs/:user_token', controller.deleteAllPushByUserToken);

    // 텔레그램 봇 알림
    router.post('/telebot', controller.sendMessageToChannel);

    // 주문 텔레그램 봇 알림
    router.post('/ordertele', controller.sendMessageToOrderChannel);

    // 출금 텔레그램 봇 알림
    router.post('/withdrawtele', controller.sendMessageToWithdrawChannel);

    app.use('/api/push', router);
}