import client from "./client";
import Cookies from "js-cookie";
import { SignUpData, SignInData, Participate, Message, EventFavorite, Evaluate, Relationship, UpdateUserFormData, UpdateEventFormData } from "interfaces/index"

export const signUp = (params: SignUpData) => {
  return client.post("auth", params);
};

export const signIn = (params: SignInData) => {
  return client.post("auth/sign_in", params);
};

export const signOut = () => {
  return client.delete("auth/sign_out", {
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

export const getCurrentUser = () => {
  if (
    Cookies.get("_access_token") &&
    Cookies.get("_client") &&
    Cookies.get("_uid")
  ) {
    return client.get("/auth/sessions", {
      headers: {
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
    });
  }
};

export const getUser = (id: number | undefined) => {
  return client.get(`/users/${id}`, {
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

export const editUser = (id: number | undefined, data: UpdateUserFormData) => {
  return client.put(`/users/${id}`, data);
};

export const getCategories = () => {
  return client.get("/categories");
};

export const getcities = () => {
  return client.get("/cities");
};

export const createParticipate = (data: Participate) => {
  return client.post("/participates", data);
};

export const getChatRooms = () => {
  return client.get("/chat_rooms", {
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

export const getChatRoom = (id: number) => {
  return client.get(`/chat_rooms/${id}`, {
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

export const createMessage = (data: Message) => {
  return client.post("/messages", data);
};

export const getEvents = () => {
  return client.get("/events", {
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

export const searchEvents = (keyword: string, datetime: string | Date | null) => {
  return client.get(`/events`, {
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
    params: {
      keyword: keyword,
      datetime: datetime,
    },
  });
};

export const getEvent = (id: string | undefined) => {
  return client.get(`/events/${id}`);
};

export const createEvent = (data: UpdateEventFormData) => {
  return client.post("/events", data);
};

export const editEvent = (id: number, data: UpdateEventFormData) => {
  return client.patch(`/events/${id}`, data);
};

export const deleteEvent = (id: number) => {
  return client.delete(`/events/${id}`);
};

export const getNotifications = () => {
  return client.get("/notifications", {
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

export const updateNotification = (id: number) => {
  return client.patch(`/notifications/${id}`);
};

export const createEventsFavorites = (eventId: number, data: EventFavorite) => {
  return client.post(`/events/${eventId}/events_favorites`, data);
};

export const deleteEventsFavorites = (eventId: number) => {
  return client.delete(`/events/${eventId}/events_favorites`, {
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

export const follow = (userId: number | undefined | null, data: Relationship) => {
  return client.post(`/users/${userId}/relationships`, data);
};

export const unfollow = (userId: number | undefined | null) => {
  return client.delete(`/users/${userId}/relationships`, {
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

export const getFollowings = (userId: number) => {
  return client.get(`/users/${userId}/followings`);
};

export const getFollowers = (userId: number) => {
  return client.get(`/users/${userId}/followers`);
};

export const evaluate = (id: number, data: Evaluate) => {
  return client.post(`/users/${id}/evaluations`, data);
};

export const createComment = (eventId: number, data: Comment) => {
  return client.post(`/events/${eventId}/comments`, data);
};

export const deleteComment = (eventId: number, id: number) => {
  return client.delete(`/events/${eventId}/comments/${id}`, {
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

