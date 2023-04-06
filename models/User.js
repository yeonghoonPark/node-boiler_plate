const mongoose = require("mongoose");

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

const User = mongoose.model("User", userSchema);

module.exports = { User };
