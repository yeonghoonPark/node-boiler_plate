// import mongoose
const mongoose = require("mongoose");

// import bcrypt
const bcrypt = require("bcrypt");
// salt의 글자 수
const saltRounds = 10;

// import jsonwebtoken
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },

  email: {
    type: String,
    // 문자열 사이의 빈 공백을 자동으로 메꿔주는 역할, trim: true
    trim: true,
    unique: 1,
  },

  password: {
    type: String,
    minlength: 5,
  },

  lastname: {
    type: String,
    maxlength: 50,
  },

  // 예를들어 0이라면 사용자, 1이라면 운영자, 2라면 어디 부서의 누군가 등등
  role: {
    type: Number,
    default: 0,
  },
  image: String,

  // 유효성
  token: {
    type: String,
  },

  // 유효성 기간
  tokenExp: {
    type: Number,
  },
});

// pre(), mongoose의 메서드, mongoose의 'save'메서드 전에 무엇을 실행하겠다. 라는 의미
userSchema.pre("save", function (next) {
  const user = this;

  // 비밀번호를 암호화, 유저스키마에서 'password'를 모디파이 할 때만
  if (user.isModified("password")) {
    // genSalt(), salt생성 메서드, 파라미터1 = saltRounds, 파라미터2 = callback(err,salt)
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// userSchema의 comparePassword 라는 메서드 생성
// plainPassword는 암호화 되기전의 패스워드이고 DB에 저장 된 암호화 된 패스워드와
// 요청 된 패스워드를 다시 bcrypt로 암호화 시켜 DB에 저장 된 암호화 된 패스워드와 비교하는 알고리즘
userSchema.methods.comparePassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

// userSchema의 generateToken 이라는 메서드 생성
userSchema.methods.generateToken = function (callback) {
  const user = this;

  // jsonwebtoken을 이용하여 token생성하기
  const token = jwt.sign(user._id.toHexString(), "secretToken");

  user.token = token;
  user.save(function (err, user) {
    if (err) return callback(err);
    callback(null, user);
  });
};

// userSchema의 findByToken 이라는 메서드 생성
userSchema.statics.findByToken = function (token, callback) {
  const user = this;

  // 토큰을 decode 한다.
  jwt.verify(token, "secretToken", function (err, decoded) {
    // user_id를 이용하여 유저를 찾은 후에
    // 클라이언트에서 가져온 token과 DB에 보관 된 token이 같은지 확인한다.

    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return callback(err);
      callback(null, user);
    });
  });
};

// model = schema를 감싸주는 역할
const User = mongoose.model("User", userSchema);

module.exports = { User };
