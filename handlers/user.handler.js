const crypto = require('crypto');

exports.cryptoPassword = (req, callback) =>{
    const hashConfig = {
        psd : req.password,
        loop : 93419,
        length : 64,
        method : 'sha512'
    }
     
    // 비밀번호  pbkdf2와 salt를 통한 암호화
    if(!req.salt){
        crypto.randomBytes(64, (err,buf)=>{
            if(err){
                console.log('randomByte 생성 오류 ::', err);
            }else{
                crypto.pbkdf2(hashConfig.psd, buf.toString('base64'), hashConfig.loop, hashConfig.length, hashConfig.method, (err, key)=>{
                    if(err){
                        console.log('pbkdf2 암호화 오류 ::', err);
                    }else{
                        const newPassword = {
                            password : key.toString('base64'),
                            salt : buf.toString('base64')
                        }
                        callback(newPassword);
                    }
                })
            }
        });
    }else{
        crypto.pbkdf2(hashConfig.psd, req.salt, hashConfig.loop, hashConfig.length, hashConfig.method, (err, key)=>{
            if(err){
                console.log('pbkdf2 암호화 오류 ::', err);
            }else{
                const hashPassword = {
                    password : key.toString('base64')
                }
                callback(hashPassword);
            }
        })
    }
   
}

