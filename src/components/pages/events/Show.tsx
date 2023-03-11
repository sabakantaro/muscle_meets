import React, { useState, useEffect, useCallback, useContext } from "react";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {
  getEvent,
  createParticipate,
  deleteComment,
  createComment,
} from "../../../lib/api/gotoreAPI";
import AttendButton from "./AttendButton";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import moment from "moment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Summary from "./Summary";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MoreVertIcon from "@mui/icons-material/MoreVert";
// import EventsFavoritesButton from "./EventsFavoritesButton";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItem from "@mui/material/ListItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from '@mui/material/transitions';
import ListItemIcon from "@mui/material/ListItemIcon";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { AuthContext } from "App"
import {Comment, Event} from 'interfaces/index'
import { db } from '../../../firebase'
import { serverTimestamp } from 'firebase/firestore'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const EventShow = () => {
  type Params = {
    id:  string | undefined;
  };

  const { currentUser } = useContext(AuthContext)
  const [event, setEvent] = useState<Event>();
  const [comments, setComments] = useState<Comment>();
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const {id} = useParams<Params>();
  const navigate = useNavigate();

  const handleGetEvent = useCallback(async () => {
    try {
      // @ts-ignore
      await db.collection('events').doc(id).get().then((doc) => {
        // @ts-ignore
        setEvent(doc.data());
      })
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  const handleGetComments = useCallback(async () => {
    try {
      let data: any = []
      const querySnapshot: any = await db.collection('comments').where('eventId', '==', id).orderBy('createdAt','desc').get();
      querySnapshot.forEach((doc: any) => {
        // setComments(res.data());
        data.push(doc.data())
      });
      setComments(data);
      // console.log(query);
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  useEffect(() => {
    handleGetEvent();
    handleGetComments();
  }, [handleGetEvent, handleGetComments]);

  const handleCreateParticipate = useCallback(async () => {
    try {
      const data = {
        user: {
          uid: currentUser?.uid,
          displayName: currentUser?.displayName,
          photoURL: currentUser?.photoURL,
        },
        eventId: id,
        createdAt: serverTimestamp(),
      };
      db.collection('participations').doc().set(data);
      navigate(`/events/${id}/thanks`)
    } catch (err) {
      console.log(err);
    }
  }, [currentUser, id, navigate]);

  const handleCreateComment = useCallback(async () => {
    try {
      const collection = db.collection('comments')
      const docId = collection.doc().id
      const data = {
        id: docId,
        user: {
          uid: currentUser?.uid,
          displayName: currentUser?.displayName,
          photoURL: currentUser?.photoURL,
        },
        eventId: id,
        content: String(content),
        createdAt: serverTimestamp(),
      };
      // @ts-ignore
      await collection.doc(docId).set({...data});
      setContent("");
      handleGetComments();
    } catch (err) {
      console.log(err);
    }
  }, [currentUser, id, content, handleGetComments]);

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      try {
        await db.collection('comments').doc(commentId).delete()
        handleGetComments();
      } catch (err) {
        console.log(err);
      }
    },
    [handleGetComments]
  );

  return (
    <>
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
        <Container maxWidth='lg' sx={{ mt: 0, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} lg={4}>
              <Paper
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Summary event={event!} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={8} lg={8}>
              <Paper
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  sx={{ borderRadius: "4px 4px 0 0", height: 400 }}
                  component='img'
                  src={event?.imageUrl}
                  alt='event image'
                />
                {/* <EventsFavoritesButton
                  event={event!}
                /> */}
                <div style={{ padding: 24 }}>
                  <CardHeader
                    sx={{ p: 0 }}
                    action={
                      currentUser &&
                      event?.user?.uid === currentUser?.uid && (
                        <IconButton
                          component={RouterLink}
                          to={`/event-edit/${event?.id}`}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      )
                    }
                    title={
                      <Typography
                        gutterBottom
                        variant='h5'
                        sx={{
                          mb: 0,
                        }}
                      >
                        {event?.title}
                      </Typography>
                    }
                  />
                  <CardHeader
                    sx={{ pt: 0, pl: 0 }}
                    avatar={
                      <LocationOnIcon color='disabled' sx={{ fontSize: 16 }} />
                    }
                    title={
                      <Typography
                        gutterBottom
                        variant='h5'
                        sx={{
                          mb: 0,
                          fontSize: 16,
                          color: "text.secondary",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          width: "100%",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {event?.address}
                      </Typography>
                    }
                    color='text.secondary'
                  />
                  <CardHeader
                    sx={{ pt: 0 }}
                    avatar={
                      <Avatar src={event?.user?.photoURL}>
                        {event?.user?.name?.charAt(0)}
                      </Avatar>
                    }
                    title={`${event?.user?.name}`}
                  />
                  <Grid container sx={{ mt: 0.5 }}>
                    <Grid item xs={6} sx={{ backgroundColor: "lightgray" }}>
                      <Typography
                        variant='body2'
                        sx={{ fontSize: 14, fontWeight: "bold", ml: 1 }}
                      >
                        Event date
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant='body2'
                        sx={{ fontSize: 14, fontWeight: "bold", ml: 1 }}
                      >
                        {event?.meetingDatetime &&
                          moment(event?.meetingDatetime).format(
                            "dddd, MMMM DD, YYYY HH:mm"
                          )}
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
                    </Grid>
                    {/* <Grid item xs={6}>
                      <Typography
                        variant='body2'
                        sx={{ fontSize: 14, fontWeight: "bold", ml: 1 }}
                      >
                        {event?.category?.name}
                      </Typography>
                    </Grid> */}
                  </Grid>
                  <Divider />
                  <Typography
                    sx={{
                      mt: 3,
                    }}
                    variant='h6'
                  >
                    Description
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      whiteSpace: "pre-wrap",
                    }}
                    variant='body1'
                  >
                    {event?.body}
                  </Typography>
                </div>
                <Divider />
                <Typography
                  sx={{
                    mt: 3,
                    pl: 3,
                  }}
                  variant='h6'
                >
                  Comments
                </Typography>
                <List
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                    pr: 1.5,
                  }}
                >
                  {comments?.map((comment: Comment) => (
                    <>
                      <ListItem alignItems='flex-start'>
                        <ListItemAvatar>
                          <Avatar
                            alt='User Name'
                            src={comment?.user?.imageUrl}
                          />
                        </ListItemAvatar>
                        <ListItemText primary={`${comment.content}`} />
                        {currentUser?.id === comment.userId && (
                          <Stack
                            direction='row'
                            alignItems='center'
                            spacing={1}
                          >
                            <IconButton aria-label='delete' size='small'>
                              <DeleteIcon
                                fontSize='small'
                                onClick={() => handleDeleteComment(String(comment?.id))}
                              />
                            </IconButton>
                          </Stack>
                        )}
                      </ListItem>

                      <Divider variant='inset' component='li' />
                    </>
                  ))}
                </List>
                <TextField
                  id='outlined-multiline-static'
                  multiline
                  rows={4}
                  sx={{ p: 1.5, pt: 1 }}
                  value={content}
                  placeholder="Hello, I'm Muscle! Where is this event held? I'd like to know detail address."
                  onChange={(e) => setContent(e.target.value)}
                  fullWidth
                />
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button
                    color='primary'
                    variant='contained'
                    onClick={handleCreateComment}
                    fullWidth
                  >
                    send
                  </Button>
                </CardActions>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {event?.user?.uid !== currentUser?.uid && (
        <AttendButton
          openAttendModal={(e) => setOpen(e)} disabled={false} />
      )}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby='attend-modal-slide'
      >
        <DialogTitle>Confirm your participation</DialogTitle>
        <DialogContent>
          <DialogContentText id='attend-modal-slide'>
            {event?.title}
            <ListItem>
              <ListItemIcon>
                <AccessTimeIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  event?.meetingDatetime &&
                  moment(event?.meetingDatetime).format(
                    "dddd, MMMM DD, YYYY HH:mm"
                  )
                }
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocationOnIcon />
              </ListItemIcon>
              <ListItemText
                primary={`${event?.city?.name}`}
                secondary={`${event?.address}`}
              />
            </ListItem>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color='primary'
            variant='contained'
            fullWidth
            onClick={handleCreateParticipate}
          >
            OK
          </Button>
          <Button
            color='primary'
            variant='outlined'
            fullWidth
            onClick={() => setOpen(false)}
          >
            return
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventShow;
