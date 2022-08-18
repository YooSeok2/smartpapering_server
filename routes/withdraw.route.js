const controller = require('../controllers/withdraw.controller');
const auth = require('./middlewares/authorization');

module.exports = app => {
    const router = require('express').Router();

    // 새로운 출금하기 생성
    router.post("/", auth.verifyAppToken, controller.create);

    // 모든 출금정보 검색
    router.get("/", controller.findAll);

    // 유저별 출금정보 검색
    router.get('/:user_id', controller.findAllByUserId);

    //출금정보 업데이트
    router.put("/update", controller.update);

    //출금정보 삭제
    router.delete('/delete/:withdrawnum', controller.delete);

    app.use('/api/withdraw', router);
}