const renderWebPage = require('../handlers/renderHomePage');
const express = require('express');

module.exports = app => {
    const pageRouter = express.Router();
    const homePageRoute = ['/'];

    //홈페이지 라우트
    pageRouter.get(homePageRoute, renderWebPage);
}