/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import { signUp } from "../../lib/api/gotoreAPI";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "App"
// import { SignUpData } from "interfaces";
import { auth, db } from "../../firebase"


const SignUp = () => {
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext)
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const theme = createTheme();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const currentUser: any = auth.createUserWithEmailAndPassword(email, password).then(({ user }) => {
        const userInitialData = {
          email: email,
          uid: user?.uid,
          name: name
        }
        db.collection('users').doc(user?.uid).set(userInitialData);
      });
      setIsSignedIn(true);
      setCurrentUser(currentUser);
      navigate("/");
      console.log("Signed in successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign up
          </Typography>
          <Box
            component='form'
            noValidate
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete='name'
                  name='Name'
                  required
                  fullWidth
                  id='Name'
                  label='Name'
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  id='email'
                  label='Email Address'
                  name='email'
                  autoComplete='email'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  name='password'
                  label='Password'
                  type='password'
                  id='password'
                  autoComplete='new-password'
                />
              </Grid>
              {/* <Grid item xs={12}>
                <TextField
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  fullWidth
                  name='passwordConfirmation'
                  label='passwordConfirmation'
                  type='passwordConfirmation'
                  id='passwordConfirmation'
                  autoComplete='passwordConfirmation'
                />
              </Grid> */}
            </Grid>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
