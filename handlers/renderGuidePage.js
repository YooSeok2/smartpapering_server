module.exports = (req,res)=>{
    const renderFile = './app/guide.ejs';
    res.render(renderFile);
}