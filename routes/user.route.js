const controller = require('../controllers/user.controller');
const auth = require("./middlewares/authorization");

module.exports = app =>{
    const router = require('express').Router();

    // 로그인 시
    router.post("/login", controller.createToken);

    // 새로운 유저 생성
    router.post("/signup", controller.create);

    // 모든 유저 검색
    router.get("/", controller.findAll);

    //페이지네이션을 위한 유저 조회
    router.get('/cmsusers', controller.findAndCountAll);

    // Query값으로 특정 유저 검색
    router.get("/special", controller.findOneByQuery);

    // unique값으로 유저 값 업데이트
    router.put("/update/:unique", auth.verifyAppToken,controller.update);

    // unique값으로 유저 비밀번호만 업데이트
    router.put('/updateforpassword/:unique', controller.updateForPasword);

    // order에서 포인트값 업데이트
    router.put('/updatebyorder/:unique', controller.updateByOrder);

    // unique값으로 유저 삭제 
    router.delete("/delete/:unique",auth.verifyAppToken, controller.delete);

    // 인가
    router.post('/verify',auth.verifyAppToken, controller.verify);

    // 리프레시 토큰 발급
    router.post('/getrefreshtoken', auth.verifyAppToken, controller.createRefreshToken);

    app.use('/api/user', router);
}