import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import { getUser, evaluate } from "../../../lib/api/gotoreAPI";
import { Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import { User } from "interfaces";
import { AuthContext } from "App";

const Evaluations: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState<User>();
  const [score, setScore] = useState(0);
  const {id} = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const sendEvaluation = useCallback(async () => {
    try {
      const data = { evaluatedId: user?.id, score: score };
      await evaluate(Number(currentUser?.id), data);
      navigate(`users/${user?.id}`);
    } catch (err) {
      console.log(err);
    }
  }, [currentUser, navigate, score, user]);

  const handleGetUser = useCallback(async () => {
    try {
      const res = await getUser(Number(id));
      setUser(res.data.user);
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  useEffect(() => {
    handleGetUser();
  }, [handleGetUser]);

  return (
    <div>
      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth='sm'>
          <Stack spacing={1}>
            <Typography
              component='h1'
              variant='h4'
              align='center'
              color='text.primary'
              gutterBottom
            >
              Thanks to your participation!
            </Typography>
            <Typography
              variant='h5'
              align='center'
              color='text.secondary'
              paragraph
              sx={{ p: 4 }}
            >
              Please evaluate me!
            </Typography>
          </Stack>
        </Container>
        <Container component='main' maxWidth='sm' sx={{ mb: 4 }}>
          <Grid item xs={12} md={4} lg={4}>
            <Paper
              variant='outlined'
              sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
            >
              <Box sx={{alignItems: 'center'}}>
                <Avatar
                  alt='User Image'
                  src={user?.imageUrl}
                  sx={{ width: 112, height: 112 }}
                />
                <Stack spacing={1}>
                  <Typography
                    variant='body2'
                    sx={{ fontSize: 20, fontWeight: "bold", mt: 1 }}
                  >
                    {user?.name}
                  </Typography>
                </Stack>
                <Rating
                  name='simple-controlled'
                  value={score}
                  sx={{ mt: 1 }}
                  onChange={(_, newscore) => {
                    setScore(newscore as number);
                  }}
                />
              </Box>
              <Button
                color='primary'
                variant='contained'
                sx={{ mt: 1 }}
                fullWidth
                onClick={() => sendEvaluation()}
              >
                Send
              </Button>
              <Button sx={{ mt: 1 }} fullWidth onClick={handleOpen}>
                Event was not held
              </Button>
            </Paper>
          </Grid>
        </Container>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            If the event was not held, you have no need to evaluate.
          </Typography>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            Do you want to exit from this page?
          </Typography>
          <Button
            color='primary'
            variant='contained'
            sx={{ mt: 3 }}
            fullWidth
            onClick={() => navigate(`/users/${user?.id}`)}
          >
            Exit
          </Button>
          <Button
            color='primary'
            variant='outlined'
            sx={{ mt: 1 }}
            fullWidth
            onClick={() => handleClose()}
          >
            Return
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default Evaluations
