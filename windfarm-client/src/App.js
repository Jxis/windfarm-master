import './App.css';
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
  BrowserRouter,
} from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Admin from './pages/Admin';
import WindFarmType from './pages/WindFarmType';
import User from './pages/User';
import WindFarm from './pages/WindFarm';
import Navigation from './components/Navigation';

const queryClient = new QueryClient();

function App() {




  function Layout() {

    return (
      <div>
        <Navigation />
        <Outlet />
      </div>
    );
  }

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/login" element={<Login />} />

              <Route path="/home" element={<Home />} />

              <Route path="/register" element={<Register />} />

              <Route path="/admin" element={<Admin />} />

              <Route path="/admin/wind-farm-type" element={<WindFarmType />} />

              <Route path="/user" element={<User />} />

              <Route path="/user/wind-farm/:id" element={<WindFarm />} />

              <Route path="/" element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
