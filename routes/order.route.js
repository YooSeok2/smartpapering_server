const controller = require('../controllers/order.controller');
const auth = require("./middlewares/authorization");

module.exports = app =>{
    const router = require('express').Router();

    // 새로운 주문 생성
    router.post("/", auth.verifyAppToken, controller.create);

    // 모든 주문 검색
    router.get("/", controller.findAll);

    // order_id와 일치하는 모든 order 검색
    router.get("/:order_id", controller.findAllByUserId);

    // ordernum쿼리값으로 특정 주문 검색
    router.get("/special", controller.findOneByQuery)

    // ordernum값으로 주문 값 업데이트
    router.put("/update", controller.update);

    // ordernum값으로 주문 삭제
    router.delete("/delete/:ordernum", controller.delete);

    app.use('/api/order', router);
}