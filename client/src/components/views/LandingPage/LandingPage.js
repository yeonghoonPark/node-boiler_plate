import { useEffect } from "react";
import axios from "axios";

function LandingPage() {
  const test = async () => {
    const res = await axios.get("/api/hello");
    console.log(res.data);
  };

  useEffect(() => {
    test();
  }, []);

  return <div>LandingPage</div>;
}

export default LandingPage;
