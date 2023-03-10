import React, { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import moment from "moment";
import LocationOnIcon from "@mui/icons-material/LocationOnOutlined";
import EventIcon from "@mui/icons-material/Event";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
// import EventsFavoritesButton from "./EventsFavoritesButton";
import { AuthContext } from "App";
import {Event} from "interfaces/index"

type Props = {
  event: Event;
}

const EventBox: React.FC<Props> = ({ event }) => {
  const {currentUser} = useContext(AuthContext)
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Link
        // variant='body2'
        style={{ color: "black", textDecoration: "none" }}
        component={RouterLink}
        to={`/events/${event?.id}`}
      >
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardMedia
            height='200'
            component='img'
            src={event?.imageUrl}
            alt='Event image'
          />
          {/* {currentUser && (
            <EventsFavoritesButton event={event} />
          )} */}
          <CardHeader
            avatar={
              <Avatar
                alt='User Image'
                src={event?.user?.photoURL}
              />
            }
            action={
              event?.user?.uid === currentUser?.uid && (
                <IconButton component={RouterLink} to={`/event-edit/${event?.id}`}>
                  <MoreVertIcon />
                </IconButton>
              )
            }
            title={`${event?.user?.displayName}`}
          />
          <CardContent sx={{ flexGrow: 1, pt: 0, pb: 0 }}>
            <Typography
              gutterBottom
              variant='h5'
              sx={{
                mb: 2,
                overflow: "hidden",
                whiteSpace: "nowrap",
                width: "100%",
                textOverflow: "ellipsis",
              }}
            >
              {event?.title}
            </Typography>
            <Grid container>
              <Grid item xs={2}>
                <LocationOnIcon />
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant='body2'
                  sx={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    width: "100%",
                    textOverflow: "ellipsis",
                  }}
                >
                  {event?.address}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={2}>
                <EventIcon />
              </Grid>
              <Grid item xs={6}>
                <Typography variant='body2'>
                  {event?.meetingDatetime && moment(event?.meetingDatetime).format("YYYY-MM-DD")}
                </Typography>
              </Grid>
            </Grid>
            <Typography
              sx={{
                mt: 1,
                overflow: "hidden",
                whiteSpace: "nowrap",
                width: "100%",
                textOverflow: "ellipsis",
              }}
              variant='body1'
            >
              {event?.body}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
};

export default EventBox;
