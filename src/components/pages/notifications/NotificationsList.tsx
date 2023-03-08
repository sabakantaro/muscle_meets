import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Grid, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

import {
  getNotifications,
  updateNotification,
} from "../../../lib/api/gotoreAPI";
import { Notification } from "interfaces";

const NotificationsList = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification>();
  const navigate = useNavigate();

  const handleGetNotifications = async () => {
    try {
      const res = await getNotifications();

      if (res) {
        setNotifications(res.data.notifications);
      } else {
        console.log("No notifications");
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleGetNotifications();
  }, []);

  const handleIsChecked = async (notification: Notification) => {
    try {
      const res = await updateNotification(Number(notification.id));
      if (res) {
        navigate(notification.linkUrl);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <>
      {!loading ? (
        notifications?.length! > 0 ? (
          notifications?.map((notification) => {
            return (
              <Grid container key={notification?.id} sx={{ justifyContent: "center" }}>
                <List>
                  <Badge
                    variant='dot'
                    color='primary'
                    invisible={notification?.isChecked}
                  >
                    <Link
                      onClick={() => {
                        handleIsChecked(notification);
                      } }
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
                      to={""}
                    >
                      <div
                        style={{
                          flexGrow: 1,
                          minWidth: 340,
                          maxWidth: 340,
                        }}
                      >
                        <ListItem
                          alignItems='flex-start'
                          style={{ padding: 0 }}
                        >
                          <ListItemAvatar>
                            <Avatar alt='avatar' src={notification.imageUrl} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={notification.content}
                            secondary={
                              <div style={{ marginTop: "0.5rem" }}>
                                <Typography
                                  component='span'
                                  variant='body2'
                                  color='textSecondary'
                                >
                                  {notification?.content.length > 30
                                    ? notification.content.substr(0, 30) + "..."
                                    : notification.content}
                                </Typography>
                              </div>
                            }
                          />
                        </ListItem>
                      </div>
                    </Link>
                  </Badge>
                  <Divider component='li' />
                </List>
              </Grid>
            );
          })
        ) : (
          <Grid container sx={{ mt: 5, justifyContent: "center" }}>
            <Typography component='h1' variant='body1' color='textSecondary'>
              No notifications for now.
            </Typography>
          </Grid>
        )
      ) : (
        <></>
      )}
    </>
  );
};

export default NotificationsList;
