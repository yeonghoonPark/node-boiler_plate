const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const { auth } = require("./server/middleware/auth");

const config = require("./server/config/key");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

const { User } = require("./server/models/User");

const mongoose = require("mongoose");
mongoose
  .connect(
    config.mongoURI,
    // mongoose 6버전 이상부터는 필요없음
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log("Error", err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 회원가입 router
app.post("/api/users/register", (req, res) => {
  // 회원 가입시에 필요 정보들을 client에서 가져오면
  // 가져온 정보를 데이터베이스에 넣어준다.

  const user = new User(req.body);

  // save()는 mongoose에서 오는 메서드
  // 6버전 이후의 save()메서드는 callback함수를 받지 않는다.
  user.save((err, user) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.status(200).json({
      success: true,
    });
  });
});

// 로그인 router
app.post("/api/users/login", (req, res) => {
  // 1. 클라이언트에서 요청 한 계정이 DB에 있는지 찾는다.
  // findOne(), mongoose 메서드
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "요청 된 계정에 해당하는 유저가 없습니다.",
      });
    }

    // 2. 요청 된 계정이 DB에 존재한다면 비밀번호가 같은지 확인한다.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 일치하지 않습니다.",
        });
      }

      // 3. 비밀번호까지 같다면 Token을 생성한다.
      user.generateToken((err, user) => {
        if (err) {
          return res.status(400).send(err);
        }

        // 토큰을 저장한다, 쿠키 or 로컬 or 세션 등등
        res
          // x_auth라는 이름으로 user.token을 넣는다.
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

// auth router
app.get("/api/users/auth", auth, (req, res) => {
  // 여기까지 미들웨어를 통과해 왔다는 얘기는 auth가 true라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

// logout router
app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({ success: true });
  });
});

// test
app.get("/api/hello", (req, res) => {
  res.send("안녕성공~");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
