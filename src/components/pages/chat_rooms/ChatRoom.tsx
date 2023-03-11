import React, { useEffect, useState, useCallback,  useContext } from "react";
import { useParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { User, Message } from "interfaces/index"
import { AuthContext } from "App"
import { db } from "../../../firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where } from 'firebase/firestore';


const ChatRoom: React.FC = () => {
  const { currentUser } = useContext(AuthContext)
  const {id} = useParams<string>();
  const [loading, setLoading] = useState<boolean>(false)
  const [otherUser, setOtherUser] = useState<User>()
  const [messages, setMeesages] = useState<Message[]>([])
  const [content, setContent] = useState<string>("")

  const handleGetChatRoom = useCallback(async () => {
    setLoading(true)
    return onSnapshot(
      query(
          //@ts-ignore
          collection(db, 'chat_rooms', id, 'messages'),
          orderBy('createdAt', 'asc')
      ),
      (querySnapshot: any) => {
          const messages = querySnapshot.docs.map((x: any) => ({
              id: x.id,
              ...x.data(),
          }));
          setMeesages(messages);
          setLoading(false)
        }
  );
  }, [id]);

  const handleGetOtherUser = useCallback(async () => {
    return onSnapshot(
      query(
          //@ts-ignore
          collection(db, 'chat_rooms', id, 'users'),
          where("uid", "!=", currentUser?.uid),
          ),
      (querySnapshot: any) => {
          const otherUser = querySnapshot.docs.map((x: any) => ({
              ...x.data(),
          }))[0];
          setOtherUser(otherUser);
        }
  );
  }, [currentUser?.uid, id]);

  useEffect(() => {
    handleGetChatRoom();
    handleGetOtherUser();
  }, [handleGetChatRoom, handleGetOtherUser]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      //@ts-ignore
      await addDoc(collection(db, 'chat_rooms', id, 'messages'), {
          userId: currentUser?.uid,
          content: content,
          createdAt: serverTimestamp(),
      });
      setContent('');
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <>
      {!loading ? (
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
          }}
        >
          <Container
            component='main'
            maxWidth='sm'
            sx={{ mb: 4, justifyContent: "center" }}
          >
            <Grid container sx={{ mb: 1, justifyContent: "center" }}>
              <Grid item>
                <Avatar
                  alt='avatar'
                  src={otherUser?.photoURL || ""}
                  sx={{
                    width: 60,
                    height: 60,
                    margin: "0 auto",
                  }}
                />
                <Typography
                  variant='body2'
                  component='p'
                  gutterBottom
                  sx={{
                    mt: 0.5,
                    mb: 1,
                    textAlign: "center",
                  }}
                >
                  {otherUser?.displayName}
                </Typography>
              </Grid>
            </Grid>
            {messages.map((message, index) => {
              return (
                <Grid
                  key={index}
                  container
                  sx={{
                    justifyContent:
                      message?.userId === otherUser?.uid
                        ? "flex-start"
                        : "flex-end",
                  }}
                >
                  <Grid item>
                    <Box
                      borderRadius={
                        message?.userId === otherUser?.uid
                          ? "30px 30px 30px 0px"
                          : "30px 30px 0px 30px"
                      }
                      bgcolor={
                        message?.userId === otherUser?.uid ? "#d3d3d3" : "#666666"
                      }
                      color={
                        message?.userId === otherUser?.uid ? "#333333" : "#ffffff"
                      }
                      sx={{ p: 1, m: 1 }}
                    >
                      <Typography variant='body1' component='p'>
                        {message?.content}
                      </Typography>
                    </Box>
                    <Typography
                      variant='body2'
                      component='p'
                      color='textSecondary'
                      sx={{
                        textAlign:
                          message?.userId === otherUser?.uid ? "left" : "right",
                      }}
                    >
                      {'2023/03/29'}
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
            <Grid container sx={{ mt: 2, justifyContent: "center" }}>
              <form
                style={{
                  padding: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
                noValidate
                autoComplete='off'
              >
                <TextField
                  required
                  multiline
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  fullWidth
                  variant='standard'
                />
                <Button
                  variant='contained'
                  color='primary'
                  disabled={!content ? true : false}
                  onClick={handleSubmit}
                  sx={{ ml: 1 }}
                >
                  <SendIcon />
                </Button>
              </form>
            </Grid>
          </Container>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};

export default ChatRoom;
