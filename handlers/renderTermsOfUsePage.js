module.exports = (req, res)=>{
    const renderFile = './terms/terms_of_use.ejs';
    res.render(renderFile);
}