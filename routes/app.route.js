const renderGuidePage = require('../handlers/renderGuidePage');

module.exports = app => {
    const router = require('express').Router();

    const guidePageRoute = ['/guide'];

    router.get(guidePageRoute, renderGuidePage)

    app.use('/app', router);
}