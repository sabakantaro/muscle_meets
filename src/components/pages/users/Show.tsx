import React, { useEffect, useState, useCallback, useContext } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import Edit from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import EventBox from "../events/EventBox";
import { getUser, follow, unfollow } from "../../../lib/api/gotoreAPI";
import { AuthContext } from "App";
import { Event, User } from "interfaces";
import { db } from '../../../firebase';


const UserShow: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [participateEvents, setParticipateEvents] = useState([]);
  // @ts-ignore
  const [user, setUser] = useState<User>();
  const [isFollowed, setIsFollowed] = useState(false);
  const {id} = useParams();

  const handleGetUser = useCallback(async () => {
    try {
      // const res = await getUser(Number(id));
      // @ts-ignore
      await db.collection('users').doc(id).get().then((doc) => {
        // @ts-ignore
        setUser(doc.data());
      })
      // setFavoriteEvents(res.data.favoriteEvents);
      // setParticipateEvents(res.data.participateEvents);
      // setIsFollowed(res.data.isFollowed);
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  useEffect(() => {
    handleGetUser();
  }, [handleGetUser]);

  const handleFollowStatus = useCallback(async () => {
    try {
      // const data = { followedId: user?.uid, followerId: currentUser?.uid };
      // if (isFollowed) {
      //   await unfollow(user?.uid);
      //   setIsFollowed(false);
      // } else {
      //   await follow(user?.uid, data);
      //   setIsFollowed(true);
      // }
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <>
    {console.log(user)}
      <Box
        component='main'
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
          pt: 4,
        }}
      >
        <Container component='main' maxWidth='sm' sx={{ mb: 4 }}>
          <Grid item xs={12} md={4} lg={4}>
            <CardMedia
              sx={{ borderRadius: "4px 4px 0 0", height: 120 }}
              component='img'
              src={user?.photoURL}
              alt='User image'
            />
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      alt={user?.displayName?.charAt(0)}
                      src={user?.photoURL}
                      sx={{ width: 112, height: 112, mt: -8 }}
                    />
                  }
                  action={
                    currentUser?.uid === id ? (
                      <IconButton
                        component={RouterLink}
                        to={`/user-edit/${currentUser?.uid}`}
                      >
                        <Edit />
                      </IconButton>
                    ) : (
                      <Button
                        variant={isFollowed ? "outlined" : "contained"}
                        size='small'
                        onClick={() => {
                          handleFollowStatus();
                        }}
                        sx={{ mt: 1.5 }}
                      >
                        {isFollowed ? "unfollow" : "follow"}
                      </Button>
                    )
                  }
                  sx={{ mt: -3 }}
                />
                <Typography
                  variant='body2'
                  sx={{ fontSize: 20, fontWeight: "bold" }}
                >
                  {user?.displayName}
                </Typography>
                {user?.evaluationScore && (
                  <Rating
                    name='half-rating-read'
                    defaultValue={user?.evaluationScore}
                    precision={0.5}
                    readOnly
                  />
                )}
                <Grid container sx={{ mt: 0.5 }}>
                  <Link
                    underline='hover'
                    color='inherit'
                    component={RouterLink}
                    to={`/users/${user?.uid}/relationships/0`}
                  >
                    Followers {user?.followersCount}
                  </Link>
                  {"　/　"}
                  <Link
                    underline='hover'
                    color='inherit'
                    component={RouterLink}
                    to={`/users/${user?.uid}/relationships/1`}
                  >
                    Followings {user?.followingsCount}
                  </Link>
                </Grid>
                {/* <Grid container sx={{ mt: 0.5 }}>
                  <Grid item xs={6} sx={{ backgroundColor: "lightgray" }}>
                    <Typography
                      variant='body2'
                      sx={{ fontSize: 14, fontWeight: "bold", ml: 1 }}
                    >
                      Event joined
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant='body2'
                      sx={{ fontSize: 14, fontWeight: "bold", ml: 1 }}
                    >
                      {user?.displayName}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ mt: 0.5, mb: 1 }}>
                  <Grid item xs={6} sx={{ backgroundColor: "lightgray" }}>
                    <Typography
                      variant='body2'
                      sx={{ fontSize: 14, fontWeight: "bold", ml: 1 }}
                    >
                      Category
                    </Typography>
                  </Grid> */}
                  {/* <Grid item xs={6}>
                    <Typography
                      variant='body2'
                      sx={{ fontSize: 14, fontWeight: "bold", ml: 1 }}
                    >
                      {user?.displayName}
                    </Typography>
                  </Grid> */}
                {/* </Grid> */}
              </Box>
            </Paper>
          </Grid>
        </Container>
        {/* {participateEvents && (
          <Container maxWidth='md'>
            <Typography
              variant='body2'
              sx={{ fontSize: 20, fontWeight: "bold" }}
            >
              Participate events
            </Typography>
            <Grid container sx={{ mb: 5 }} spacing={4}>
              {participateEvents.map((event: Event) => (
                <EventBox
                  key={event?.uid}
                  event={event}
                />
              ))}
            </Grid>
          </Container>
        )} */}
        {/* {favoriteEvents && (
          <Container maxWidth='md'>
            <Typography
              variant='body2'
              sx={{ fontSize: 20, fontWeight: "bold" }}
            >
              Favorite events
            </Typography>
            <Grid container sx={{ mb: 5 }} spacing={4}>
              {favoriteEvents.map((event: Event) => (
                <EventBox
                  key={event?.uid}
                  event={event}
                />
              ))}
            </Grid>
          </Container>
        )} */}
      </Box>
    </>
  );
};

export default UserShow;
