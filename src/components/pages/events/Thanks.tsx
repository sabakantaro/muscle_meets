import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import EventBox from "./EventBox";
import { Event } from "interfaces";
import { db } from '../../../firebase'

export default function EventThanks() {
  const [event, setEvent] = useState<Event>();
  const {id} = useParams();
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

  useEffect(() => {
    handleGetEvent();
  }, [handleGetEvent]);
  return (
    <>
      <Container maxWidth='sm' sx={{ mt: 4 }}>
        <Typography
          component='h1'
          variant='h2'
          align='center'
          color='text.primary'
          gutterBottom
        >
          Thank you for your attendance!
        </Typography>
        <Typography
          variant='h5'
          align='center'
          color='text.secondary'
          paragraph
        >
          Check your event details bellow. If needed you can contact with the
          host of this event.
        </Typography>
        <EventBox key={event?.id} event={event!} />
        <Button
          color='primary'
          variant='contained'
          onClick={() => navigate(`/chatroom/${event?.user?.uid}`)}
          fullWidth
          sx={{ justifyContent: "center", mt: 4, mb: 0 }}
        >
          Contact with host
        </Button>
        <Button
          color='primary'
          variant='outlined'
          onClick={() => navigate(`/`)}
          fullWidth
          sx={{ justifyContent: "center", mt: 2, mb: 4 }}
        >
          Back to top
        </Button>
      </Container>
    </>
  );
}
