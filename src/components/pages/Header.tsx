import React, { useCallback, useContext } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import Cookies from "js-cookie";
import { signOut } from "../../lib/api/gotoreAPI";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import { AuthContext } from "App"
import { auth } from '../../firebase';

const Header: React.FC = () => {
  const { isSignedIn, setIsSignedIn, currentUser} = useContext(AuthContext)
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const theme = createTheme();

  const handleSignOut = useCallback(async () => {
    try {
      await auth.signOut();
      navigate("/signin");
      setAnchorEl(null);
      setIsSignedIn(false);
      console.log("Succeeded in sign out");
    } catch (err) {
      console.log(err);
    }
  }, [navigate, setIsSignedIn]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />
      <AppBar
        position='sticky'
        color='default'
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: "wrap" }}>
          <FitnessCenterIcon sx={{ mr: 2 }} />
          <Typography variant='h6' color='inherit' noWrap sx={{ flexGrow: 1 }}>
            <Link
              href='/'
              variant='body2'
              style={{ color: "black", textDecoration: "none" }}
            >
              Gotore
            </Link>
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {isSignedIn ? (
              <>
                <Button
                  color='inherit'
                  component={RouterLink}
                  to='/event-create'
                >
                  <SendIcon />
                </Button>
                <Button
                  color='inherit'
                  component={RouterLink}
                  to={"/"}
                >
                  <SearchIcon />
                </Button>
                {/* <Button
                  color='inherit'
                  component={RouterLink}
                  to={"/notifications"}
                >
                  <Badge
                    badgeContent={currentUser?.myNotificationsCount}
                    color='primary'
                  >
                    <NotificationsIcon />
                  </Badge>
                </Button> */}
                <Button
                  color='inherit'
                  component={RouterLink}
                  to={`/chatrooms`}
                >
                  <ChatBubbleIcon />
                </Button>
                <Button
                  color='inherit'
                  component={RouterLink}
                  to={`/users/${currentUser?.uid}`}
                >
                  <Avatar src={currentUser?.photoURL}>
                    {currentUser?.displayName?.charAt(0)}
                  </Avatar>
                </Button>
                <Button
                  color='inherit'
                  onClick={handleSignOut}
                >
                  <ExitToAppIcon />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant='outlined'
                  sx={{ my: 1, mx: 1.5 }}
                  component={RouterLink}
                  to='/signup'
                >
                  Sign up
                </Button>
                <Button
                  variant='outlined'
                  sx={{ my: 1, mx: 1.5 }}
                  component={RouterLink}
                  to='/signin'
                >
                  Sign in
                </Button>
              </>
            )}
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size='large'
              aria-label='show more'
              aria-haspopup='true'
              onClick={(e) => (open ? handleClose() : handleClick(e))}
              color='inherit'
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
        <Menu
          anchorEl={anchorEl}
          id='account-menu'
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {open && isSignedIn ? (
            <>
              <ListItemButton
                color='inherit'
                component={RouterLink}
                to='/event-create'
                onClick={() => setAnchorEl(null)}
              >
                <SendIcon />
                <ListItemText
                  primary={"Create event"}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: "medium",
                    marginLeft: 2,
                  }}
                />
              </ListItemButton>
              <ListItemButton
                color='inherit'
                component={RouterLink}
                to={"/"}
                onClick={() => setAnchorEl(null)}
              >
                <SearchIcon />
                <ListItemText
                  primary={"Search"}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: "medium",
                    marginLeft: 2,
                  }}
                />
              </ListItemButton>
              {/* <ListItemButton
                color='inherit'
                component={RouterLink}
                to={"/notifications"}
                onClick={() => setAnchorEl(null)}
              >
                <Badge
                  badgeContent={currentUser?.myNotificationsCount}
                  color='primary'
                >
                  <NotificationsIcon />
                </Badge>
                <ListItemText
                  primary={"Notifications"}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: "medium",
                    marginLeft: 2,
                  }}
                />
              </ListItemButton> */}
              <ListItemButton
                color='inherit'
                component={RouterLink}
                to={`/chatrooms`}
                onClick={() => setAnchorEl(null)}
              >
                <ChatBubbleIcon />
                <ListItemText
                  primary={"Chat room"}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: "medium",
                    marginLeft: 2,
                  }}
                />
              </ListItemButton>
              <ListItemButton
                color='inherit'
                component={RouterLink}
                to={`/users/${currentUser?.uid}`}
                onClick={() => setAnchorEl(null)}
              >
                <Avatar
                  src={currentUser?.photoURL}
                  sx={{ width: 24, height: 24 }}
                />
                <ListItemText
                  primary={"My page"}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: "medium",
                    marginLeft: 2,
                  }}
                />
              </ListItemButton>
              <ListItemButton onClick={handleSignOut}>
                <ExitToAppIcon />
                <ListItemText
                  primary={"Sign out"}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: "medium",
                    marginLeft: 2,
                  }}
                />
              </ListItemButton>
            </>
          ) : (
            open &&
            !isSignedIn && (
              <>
                <ListItemButton
                  component={RouterLink}
                  to='/signup'
                  onClick={() => setAnchorEl(null)}
                >
                  Sign up
                </ListItemButton>
                <ListItemButton
                  component={RouterLink}
                  to='/signin'
                  onClick={() => setAnchorEl(null)}
                >
                  Sign in
                </ListItemButton>
              </>
            )
          )}
        </Menu>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
