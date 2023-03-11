import React, { useEffect, useState, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { ChatRoom } from "interfaces/index"
import { db } from '../../../firebase'
import { AuthContext } from "App";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where } from 'firebase/firestore';

const ChatRooms: React.FC = () => {
  const { currentUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
//   const chatRooms = [
//     { id: 'GuMq0gkaB7q89LIkqgdQ', title: ' Dogs ' },
//     // { id: 'food', title: ' Food ' },
//     // { id: 'general', title: ' General ' },
//     // { id: 'news', title: ' News ' },
//     // { id: 'music', title: ' Music ' },
//     // { id: 'sports', title: ' Sports ' },
// ];

  const handleGetChatRooms = useCallback(async () => {
    try {
      let data: any = []
      const querySnapshot: any = await db.collection('chat_rooms').where('userIds', 'array-contains', currentUser?.uid).get();
      querySnapshot.forEach((doc: any) => {
        console.log(doc.data())
        data.push(doc.data())
      });
      setChatRooms(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  },[currentUser])

  useEffect(() => {
    handleGetChatRooms();
  }, [handleGetChatRooms]);

  return (
    <>
      {!loading ? (
        chatRooms?.length! > 0 ? (
          // @ts-ignore
          chatRooms?.map((chatRoom: ChatRoom, index: number) => {

            return (
              <Grid container key={index} sx={{ justifyContent: "center" }}>
                <List>
                  <Link
                    to={`/chatroom/${chatRoom?.id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <div
                      style={{
                        flexGrow: 1,
                        minWidth: 340,
                        maxWidth: "100%",
                      }}
                    >
                      <ListItem alignItems='flex-start' style={{ padding: 0 }}>
                        <ListItemAvatar>
                          <Avatar
                            alt='avatar'
                            // @ts-ignore
                            src={chatRoom?.user?.photoURL}
                          />
                        </ListItemAvatar>
                        <ListItemText
                            // @ts-ignore
                            primary={chatRoom?.user?.displayName}
                          // secondary={
                          //   <div style={{ marginTop: "0.5rem" }}>
                          //     <Typography
                          //       component='span'
                          //       variant='body2'
                          //       color='textSecondary'
                          //     >
                          //       {chatRoom?.lastMessage === null
                          //         ? "No messages"
                          //         : chatRoom?.lastMessage?.content?.length > 30
                          //         ? chatRoom?.lastMessage?.content?.substr(0, 30) +
                          //           "..."
                          //         : chatRoom?.lastMessage?.content}
                          //     </Typography>
                          //   </div>
                          // }
                        />
                      </ListItem>
                    </div>
                  </Link>
                  <Divider component='li' />
                </List>
              </Grid>
            );
          })
        ) : (
          <Typography component='p' variant='body2' color='textSecondary'>
            No user
          </Typography>
        )
      ) : (
        <></>
      )}
    </>
  );
};

export default ChatRooms;
