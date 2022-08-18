const express = require("express");
const helmet = require('helmet');
const csp = require('helmet-csp');
const models = require("./DBs/models");
const fs = require('fs');
const https = require('https');
const http = require('http');
const serveStatic = require('serve-static');
const favicon = require('serve-favicon');
const path = require('path');

const app = express();
const SERVER_PORT = 443;
const WEBPORT = 80;

const scriptSrc = [
  "'self'",
  "ext-all.js",
  "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js",
  "https://code.jquery.com/jquery-1.12.4.min.js",
  "'sha256-RBn9eiPMXwaJRQwa5j3s11z17/IxfRgGwO+fb9iXDpk='",
  "'unsafe-eval'"
];

const cspOptions = {
  directives : {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(), //csp 헬멧 default 설정을 불러옴
    "script-src" : scriptSrc,
    "frame-src" : ['self', '*.google.com/']
  }
}

const fv = path.join(__dirname, 'web', 'images', 'favicon', 'favicon3.ico');

require('v8-compile-cache'); //인스턴스화 시간단축
app.get("*",(req, res, next)=>{ //http로 접속 시 https로 리다이렉트 해주는 미들웨어
  if(req.secure){
      next()
  }else{
      return res.redirect("https://"+req.headers.host+req.url);
  }
})
app.use(favicon(fv));

// helmet default 옵션
// dnsPresfetchControl : 공격자가 dns요청을 보내 사이트에 방문하지 않았는데 방문한거처럼 속일 수 있게 한다. default : true
// Frameguard : clickjacking 공격을 완하합니다. *clickjacking : 사용자의 의도하지않은 클릭을 유도하고 클릭했을 때 링크등을 숨겨놓아 해당 링크로 접속하게끔 한다. defalult : true
// Hide Powered-By : X-Powered-By헤더를 숨겨준다. default : true
// HSTS : 브라우저가 이 헤더를 보면 60일동안 HTTPS만을 사용하여 사이트를 방문. default : true
// ieNoOpen : X-Download-Options를 설정해 ie가 사이트의 context를 다운로드하는걸 막는다. default : true
// noSniff : Mime타입 추측 방지. default : true
// xssFilter : X-XSS-Protection헤더를 설정하여 XSS공격을 방지합니다. *XSS(Cross-site-scripting) : 웹 사이트에 스크립트를 삽입하는 공격기법. default : true
app.use(helmet());
app.use(csp(cspOptions));

const options = {
  ca : fs.readFileSync('/etc/letsencrypt/live/smartpapering.com/fullchain.pem'),
  key : fs.readFileSync('/etc/letsencrypt/live/smartpapering.com/privkey.pem'),
  cert : fs.readFileSync('/etc/letsencrypt/live/smartpapering.com/cert.pem')
};

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(serveStatic(path.join(__dirname, 'web')));
app.use(express.static(__dirname+'/views/cms'))

app.get('/', (req, res)=>{
    res.send('스마트페이퍼링 홈페이지 리뉴얼중');
})

// 각 라우터에 서버 app넘김
const routes = fs.readdirSync('./routes').filter(file => {
  return (file.indexOf('.') !== 0) && (file.slice(-3) === ".js");
});

routes.forEach(ele => {
   require(`./routes/${ele}`)(app);
});


models.sequelize.sync({force:false}).then(()=>{ //force가 true이면 실행 할 때마다 디비 초기화
    https.createServer(options, app).listen(SERVER_PORT)
    http.createServer(app).listen(WEBPORT);
})

module.exports = app;