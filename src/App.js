import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Home from "./components/pages/Home";
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import Donation from "./components/pages/Donation";
import AddTold from "./components/pages/AddTold";
import ToldDetails from "./components/pages/ToldDetails";
import UserSetting from "./components/pages/UserSetting";
import EditTold from "./components/pages/EditTold";
import SendVerification from "./components/pages/SendVerifaction";
import Verified from "./components/pages/Verified";
import PrivateRoute from "./components/pages/PrivateRoute";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "./components/redux/actions";

const theme = createTheme();
function App() {
  const dispatch = useDispatch();

  const authToken = Cookies.get("authToken");
  if (authToken) {
    // The user is authenticated; dispatch the user to Redux state
    dispatch(setUser({ isAuthenticated: true }));
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tolddetails/:postId" element={<ToldDetails />} />
          <Route path="/donation" element={<Donation />} />
          <Route path="/sendverification" element={<SendVerification />} />
          <Route path="/verified/:token" element={<Verified />} />
          <Route
            path="/addtold"
            element={
              <PrivateRoute>
                <AddTold />
              </PrivateRoute>
            }
          />
          <Route
            path="/edittold/:postId"
            element={
              <PrivateRoute>
                <EditTold />
              </PrivateRoute>
            }
          />
          <Route
            path="/usersetting"
            element={
              <PrivateRoute>
                <UserSetting />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
