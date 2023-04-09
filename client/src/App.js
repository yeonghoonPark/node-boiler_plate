import { BrowserRouter, Switch, Route } from "react-router-dom";
import NavBar from "./components/views/NavBar/NavBar";
import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import Footer from "./components/views/Footer/Footer";
import auth from "./hoc/auth";
import "./App.css";

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route exact path='/' component={auth(LandingPage, null)} />
          <Route exact path='/login' component={auth(LoginPage, false)} />
          <Route exact path='/register' component={auth(RegisterPage, false)} />

          {/* <Route path='/' element={<LandingPage />} /> */}
          {/* <Route path='/login' element={<LoginPage />} /> */}
          {/* <Route path='/register' element={<RegisterPage />} /> */}
        </Switch>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
