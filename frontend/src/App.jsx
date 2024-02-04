import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import UserProfile from "./pages/profile/UserProfile";
import Home from "./pages/home/Home";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Home}></Route>
        <Route path="/login" Component={Login}></Route>
        <Route path="/get-user" Component={UserProfile}></Route>
      </Routes>
    </Router>
  );
}
