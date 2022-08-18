const renderTermsOfusePage = require('../handlers/renderTermsOfUsePage');
const renderPrivacyPage = require('../handlers/renderPrivacyPage');

module.exports = app =>{
    const router = require('express').Router();

    const termsOfUsePageRoute = ['/terms_of_use'];
    const privacyPageRoute = ['/privacy'];

    router.get(termsOfUsePageRoute, renderTermsOfusePage);
    router.get(privacyPageRoute, renderPrivacyPage);

    app.use('/terms', router);
}