const controller = require('../controllers/cms.controller');
const auth = require("./middlewares/authorization");
const renderCmsLoginedPage = require('../handlers/renderCmsLoginedPage');
const renderCmsLoginPage = require('../handlers/renderCmsLoginPage');
const express = require('express');

module.exports = app => {
    const pageRouter = express.Router() ,apiRouter = express.Router();
    const loginPageRoute = ['/'];
    const loginedPageRoute = ['/dashboard'];

    // 로그인페이지 라우트
    pageRouter.get(loginPageRoute, renderCmsLoginPage);

    // 메인페이지 라우트
    pageRouter.get(loginedPageRoute, renderCmsLoginedPage);

    // 관리자 생성 
    // apiRouter.post('/signup', controller.create);
    
    // 인가
    apiRouter.post('/verify',auth.verifyCmsToken, controller.verify);

    // 로그인 시
    apiRouter.post("/login", controller.login);

    // 모든 관리자 조회
    apiRouter.get('/', controller.findAllAdmin)

    // 시공접수 및 진행중인 모든 order 검색
    apiRouter.get('/progress', controller.findAllInProgress);

    // 시공완료된 모든 order 검색
    apiRouter.get('/end', controller.findAllInEnd);

    // 거래취소된 모든 order 검색
    apiRouter.get('/cancel', controller.findAllInCancel);

    //모든 출금접수요청 조회
    apiRouter.get('/withdraw', controller.findAllInWithdraw);

    //모든 출금접수완료 조회
    apiRouter.get('/end/withdraw', controller.findAllInEndWithdraw);

    //cms 회원관련 APIs
    apiRouter.put('/userupdate', auth.verifyCmsToken,controller.userUpdate);
    apiRouter.delete('/userdelete/:unique', auth.verifyCmsToken, controller.userDelete);

    //cms 주문관련 APIs
    apiRouter.put('/orderupdate', auth.verifyCmsToken, controller.orderUpdate);
    apiRouter.delete('/orderdelete/:ordernum', auth.verifyCmsToken, controller.orderDelete);

    //cms 출금관련 APIs
    apiRouter.put('/withdrawupdate', auth.verifyCmsToken,controller.withdrawUpdate);
    apiRouter.delete('/withdrawdelete/:withdrawnum', auth.verifyCmsToken, controller.withdrawDelete);

    app.use('/cms', pageRouter);
    app.use('/api/cms', apiRouter);
}