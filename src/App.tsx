import React, { useState, useEffect, useCallback, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import SignUp from "./components/pages/SignUp";
import SignIn from "./components/pages/SignIn";
import { getCurrentUser } from "./lib/api/gotoreAPI";
import Header from "./components/pages/Header";
import Event from "./components/pages/events/Show";
import EventThanks from "./components/pages/events/Thanks";
import CreateEvent from "./components/pages/events/Create";
import EditEvent from "./components/pages/events/Edit";
import ShowUser from "./components/pages/users/Show";
import EditUser from "./components/pages/users/Edit";
import ChatRooms from "./components/pages/chat_rooms/ChatRooms";
import ChatRoom from "./components/pages/chat_rooms/ChatRoom";
import NotificationsList from "./components/pages/notifications/NotificationsList";
import Relationships from "./components/pages/users/Relationships";
import Evaluations from "./components/pages/users/Evaluations";
import { User } from "interfaces";
import { auth } from "../src/firebase"

export const AuthContext = createContext({} as {
  isSignedIn: boolean
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
  currentUser: User | undefined
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>
})

const App: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  useEffect(() => {
    const unsubscribed = auth.onAuthStateChanged((currentUser: any) => {
      setCurrentUser(currentUser);
      setIsSignedIn(true);
      console.log(currentUser)
    });
    return () => {
      unsubscribed();
    };
  }, []);
  // const handleGetCurrentUser = useCallback(async () => {
  //   try {
  //     const res = await getCurrentUser();
  //     if (res) {
  //       setIsSignedIn(true);
  //       setCurrentUser(res.data?.currentUser);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, []);
  // useEffect(() => {
  //   handleGetCurrentUser();
  // }, [handleGetCurrentUser, setCurrentUser]);

  return (
    <Router>
      <AuthContext.Provider value={{ isSignedIn, setIsSignedIn, currentUser, setCurrentUser}}>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
        <Route
          path='/chatrooms'
          element={<ChatRooms />}
        />
        <Route
          path='/chatroom/:id'
          element={<ChatRoom />}
        />
        <Route
          path='/events/:id'
          element={<Event />}
        />
        <Route
          path='/events/:id/thanks'
          element={<EventThanks />}
        />
        <Route
          path='/event-create'
          element={<CreateEvent />}
        />
        <Route
          path='/event-edit/:id'
          element={<EditEvent />}
        />
        <Route path='/users/:id' element={<ShowUser />} />
        <Route
          path='/user-edit/:id'
          element={<EditUser />}
        />
        <Route
          path='/notifications'
          element={<NotificationsList />}
        />
        <Route
          path='/users/:userId/relationships/:id'
          element={<Relationships />}
        />
        <Route
          path='/users/:id/evaluations'
          element={<Evaluations />}
        />
      </Routes>
            </AuthContext.Provider>
    </Router>
  );
};

export default App;
