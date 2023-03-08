import React, { useState, useCallback, useEffect, useContext } from "react";
import Typography from "@mui/material/Typography";
import {
  createEventsFavorites,
  deleteEventsFavorites,
} from "../../../lib/api/gotoreAPI";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Event } from "interfaces";
import { AuthContext } from "App";

type Props = {
  event: Event
}
const EventsFavoritesButton: React.FC<Props> = ({ event }) => {
  const { currentUser } = useContext(AuthContext);
  const [favorite, setFavorite] = useState(false);

  const handleEventsFavorites = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (favorite) {
        await deleteEventsFavorites(Number(event?.id));
        setFavorite(false);
      } else {
        const data = { eventId: Number(event?.id), userId: currentUser?.id };
        await createEventsFavorites(Number(event?.id), data);
        setFavorite(true);
      }
    },
    [currentUser, event, favorite]
  );

  useEffect(() => {
    // @ts-ignore
    setFavorite(currentUser?.myFavoriteEventIds?.includes(event?.id));
  }, [currentUser, event]);

  return (
    <IconButton
      disableRipple
      disableFocusRipple
      disabled={currentUser == null}
      sx={{ mt: -5, justifyContent: "flex-end" }}
      onClick={(e) => handleEventsFavorites(e)}
    >
      {favorite ? (
        <FavoriteIcon sx={{ color: "#f06292" }} />
      ) : (
        <FavoriteBorderIcon sx={{ color: "white" }} />
      )}
      <Typography variant='body1' color='white'>
        {event?.eventsFavorites?.length}
      </Typography>
    </IconButton>
  );
};

export default EventsFavoritesButton;
