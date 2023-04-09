import { useEffect } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

function LandingPage(props) {
  const test = async () => {
    const res = await axios.get("/api/hello");
    console.log(res.data);
  };

  useEffect(() => {
    test();
  }, []);

  const onClickHandler = () => {
    axios.get(`/api/users/logout`).then((res) => {
      if (res.data.success) {
        props.history.push("login");
      } else {
        alert("로그아웃에 실패하였습니다.");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <h2>시작페이지</h2>

      <button onClick={onClickHandler}>로그아웃</button>
    </div>
  );
}

export default withRouter(LandingPage);
