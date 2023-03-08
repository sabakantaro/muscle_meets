import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import moment from "moment";
import { Event } from "interfaces";

type Props = {
  event: Event;
}

const Summary: React.FC<Props> = ({ event }) => {
  return (
    <>
      <List>
        <ListItem>
          <ListItemIcon>
            <AccessTimeIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              event?.meetingDatetime &&
              moment(event?.meetingDatetime).format("dddd, MMMM DD, YYYY HH:mm")
            }
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <LocationOnIcon />
          </ListItemIcon>
          <ListItemText primary={event?.city?.name} secondary={event?.address} />
        </ListItem>
      </List>
      <div style={{ width: "100%", height: 240 }}>
        <iframe
          title='Google Map'
          src={`https://www.google.com/maps?output=embed&q=${
            event?.address || event?.city?.name
          }`}
          style={{
            border: 0,
            borderRadius: 3,
            width: "100%",
            height: 240,
          }}
        />
      </div>
    </>
  );
}

export default Summary