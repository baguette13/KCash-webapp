import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultPage from "./pages/DefaultPage";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import LogisticsPage from "./pages/LogisticsPage";
import PrivateRoute from "./routes/PrivateRoute";
import { CartProvider } from "./context/CartContext";
import { ApiProvider, useApiContext } from "./context/ApiContext";
import LoadingIndicator from "./components/notification/LoadingIndicator";
import useSessionMonitor from "./hooks/useSessionMonitor";

const SessionMonitor = () => {
  useSessionMonitor();
  return null;
};

const AppContent = () => {
  const { loading } = useApiContext();
  
  return (
    <>
      <LoadingIndicator show={loading} />
      <Router>
        <SessionMonitor />
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
    </>
  );
};

function App() {
  return (
    <>
      <CartProvider>
        <ApiProvider>
          <AppContent />
        </ApiProvider>
      </CartProvider>
    </>
  );
}

export default App;
