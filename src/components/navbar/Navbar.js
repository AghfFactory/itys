import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/material/Icon";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, connect } from "react-redux";
import { logoutUser } from "../redux/actions";
import Cookies from "js-cookie";
import ButtonGroup from "@mui/material/ButtonGroup";
import Divider from "@mui/material/Divider";

// Array of settings for the logged-in user
const settingsLogged = ["Account", "Logout"];

// Styled components for search bar, profile icon, and app bar
const StyledSearch = styled("div")(({ theme }) => ({
  position: "relative",
  borderBottom: `1px solid ${theme.palette.common.black}`,
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  zIndex: theme.zIndex.appBar + 1,
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const StyledSearchIconWrapper = styled("div")(({ theme }) => ({
  color: theme.palette.common.black,
  padding: theme.spacing(1),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.common.black,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  "&::placeholder": {
    color: theme.palette.common.black,
  },
}));

const StyledProfileIcon = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  marginRight: 0,
  width: "auto%",
  [theme.breakpoints.up("sm")]: {
    marginRight: theme.spacing(3),
    width: "auto",
  },
}));

const TransparentAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "transparent",
  boxShadow: "none",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
}));

const StyledBox = styled(Box)({
  position: "static",
  top: 0,
  left: 0,
  right: 0,
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
});

const Navbar = ({ isAuthenticated }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);

  // Open user menu
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  // Close user menu
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleMenuItemClick = (setting) => {
    setAnchorElUser(null);

    // Handle different settingsLogged based on 'setting'
    if (setting === "Logout") {
      handleLogout(); // Or perform specific logout actions
    } else if (setting == "Dashboard") {
      navigate("/dashboard");
    } else if (setting == "Account") {
      navigate("/usersetting");
    } else {
    }
  };
  const handleLogout = () => {
    setAnchorElUser(null);
    dispatch(logoutUser());
    Cookies.remove("authToken");
  };
  return (
    <Box>
      <StyledBox>
        <TransparentAppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Button variant="outlined" onClick={() => navigate("/donation")}>
                Support Us
              </Button>
              <Box style={{ flexGrow: "1" }} />

              {isAuthenticated ? (
                <>
                  <Tooltip title="Open settings">
                    <StyledProfileIcon
                      onClick={handleOpenUserMenu}
                      sx={{ p: 0 }}
                    >
                      <Avatar></Avatar>
                    </StyledProfileIcon>
                  </Tooltip>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <Typography variant="h6" align="center"></Typography>
                    {settingsLogged.map((setting, index) => (
                      <MenuItem
                        key={setting}
                        onClick={() => handleMenuItemClick(setting)}
                      >
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                <Box>
                  <ButtonGroup
                    color="secondary"
                    aria-label="Medium-sized button group"
                  >
                    <Button variant="text" onClick={() => navigate("/signup")}>
                      Signup
                    </Button>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <Button variant="text" onClick={() => navigate("/login")}>
                      Login
                    </Button>
                  </ButtonGroup>
                </Box>
              )}
            </Toolbar>
          </Container>
        </TransparentAppBar>
      </StyledBox>
    </Box>
  );
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.UserReducer.isAuthenticated,
});
export default connect(mapStateToProps)(Navbar);
