const { User } = require("../models/User");

let auth = (req, res, next) => {
  // 인증처리
  // 1. 클라이언트 cookie에서 token을 가져온다.
  let token = req.cookies.x_auth;

  // 2. token을 복호화 한 후 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, err: true });

    req.token = token;
    req.user = user;
    // auth의 파라미터 위치가 미들웨어 이기 때문에 그 후로 진행되도록 next()
    next();
  });

  // 3. 유저가 있으면 인증 okay

  // 4. 유저가 없으면 인증 no
};

module.exports = { auth };
