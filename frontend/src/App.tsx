import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultPage from "./pages/DefaultPage";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import PrivateRoute from "./routes/PrivateRoute";


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<DefaultPage />} />
          <Route path="/login" element={<Login />} />
          {/*<Route path="/product/:id" element={<Register />} />*/}
          <Route element={<PrivateRoute />}>
          <Route path="/main" element={<MainPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
