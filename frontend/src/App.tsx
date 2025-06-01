import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultPage from "./pages/DefaultPage";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import LogisticsPage from "./pages/LogisticsPage";
import PrivateRoute from "./routes/PrivateRoute";
import { CartProvider } from "./context/CartContext";


function App() {
  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<DefaultPage />} />
            <Route path="/login" element={<Login />} />
            {/*<Route path="/product/:id" element={<Register />} />*/}
            <Route element={<PrivateRoute />}>
              <Route path="/main" element={<MainPage />} />
              <Route path="/logistics" element={<LogisticsPage />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </>
  );
}

export default App;
