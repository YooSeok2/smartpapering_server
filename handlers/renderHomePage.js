module.exports = (req,res)=>{
    const renderFile = './home/index.ejs';
    res.render(renderFile);
}