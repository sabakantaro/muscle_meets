import React, { useState, useEffect, useCallback } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {
  createTheme,
  ThemeProvider,
  styled,
  alpha,
} from "@mui/material/styles";
import { getEvents, searchEvents } from "../../lib/api/gotoreAPI";
import EventBox from "./events/EventBox";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { db } from '../../firebase'
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';

const theme = createTheme();

const Home: React.FC = () => {
  // @ts-ignore
  const [events, setEvents] = useState();
  const [keyword, setKeyword] = useState("");
  const [meetingDatetime, setMeetingDatetime] = useState<string | Date | null>();

  const eventSearchTitle = meetingDatetime
    ? `Events held at '${moment(meetingDatetime).format("YYYY-MM-DD")}'`
    : keyword
    ? `Events related to the word '${keyword}'`
    : "Recommended Events";

  const handleGetEvents = useCallback(async () => {
    try {
      const arrList: any = [];
      getDocs(collection(db, "events")).then((snapShot) => {
        snapShot.forEach((docs) => {
          const doc = docs.data();
          arrList.push({  id: docs.id ,title: doc.title , imageUrl: doc.imageUrl, meetingDatetime: doc.meetingDatetime, body: doc.body, address: doc.address})
        })
        setEvents(arrList);
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    handleGetEvents();
  }, [handleGetEvents]);

  const handleSearchEvents = useCallback(
    async (newValue: string | Date | null ) => {
      try {
        const arrList: any = [];
        // @ts-ignore
        getDocs(collection(db, "events").startAt([keyword]).endAt([keyword + '\uf8ff'])).then((snapShot) => {
          snapShot.forEach((docs) => {
            const doc = docs.data();
            // @ts-ignore
            arrList.push({  id: docs.id ,title: doc.title , imageUrl: doc.imageUrl, meetingDatetime: doc.meetingDatetime, body: doc.body, address: doc.address})
          })
          setEvents(arrList);
        });
        if (newValue) {
          const res = await searchEvents("", newValue);
          // setEvents(res.data.events);
        } else {
          const res = await searchEvents(keyword, null);
          // setEvents(res.data.events);
          setMeetingDatetime(null);
        }
      } catch (err) {
        console.log(err);
      }
    },
    [keyword]
  );

  const onChange = useCallback(
    async (newValue: string | Date | null) => {
      setMeetingDatetime(newValue);
      handleSearchEvents(newValue);
    },
    [handleSearchEvents]
  );

  const parseAsMoment = (dateTimeStr: string | Date | null) => {
    return moment.utc(dateTimeStr, "YYYY-MM-DDTHH:mm:00Z", "ja").utcOffset(9);
  };

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.05),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.black, 0.07),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
    },
  }));

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main>
          <Box
            sx={{
              bgcolor: "background.paper",
              pt: 8,
              pb: 6,
            }}
          >
            <Container maxWidth='sm' fixed>
              <Typography
                component='h1'
                variant='h2'
                align='center'
                color='text.primary'
                gutterBottom
              >
                Welcome to Gotore!
              </Typography>
              <Typography
                variant='h5'
                align='center'
                color='text.secondary'
                paragraph
              >
                You can enjoy to do some workout with your friends anytime &
                anywhere! Let's search your favorite friend. They could help
                with your workout-life, health, and so on!
              </Typography>
              <Stack sx={{ pt: 1 }} spacing={2} justifyContent='center'>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    autoFocus
                    fullWidth
                    placeholder='Search by free words.'
                    inputProps={{ "aria-label": "search" }}
                    defaultValue={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearchEvents(null);
                      }
                    }}
                  />
                </Search>
              </Stack>
              <Stack
                sx={{ pt: 2 }}
                direction='row'
                spacing={0.5}
                justifyContent='center'
              >
                <Button
                  color='primary'
                  variant='contained'
                  onClick={() =>
                    onChange(parseAsMoment(new Date()).format("YYYY/MM/DD"))
                  }
                  style={{ borderRadius: 32, fontSize: 11 }}
                >
                  Today
                </Button>
                <Button
                  color='primary'
                  variant='contained'
                  onClick={() => {
                    const now = new Date();
                    let yesterday = new Date(
                      now.getFullYear(),
                      now.getMonth(),
                      now.getDate() + 1
                    );
                    onChange(moment(yesterday).format("YYYY/MM/DD"));
                  }}
                  style={{ borderRadius: 32, fontSize: 11 }}
                >
                  Tommorow
                </Button>
                <Button
                  color='primary'
                  variant='contained'
                  onClick={() => {
                    const now = new Date();
                    let yesterday = new Date(
                      now.getFullYear(),
                      now.getMonth(),
                      now.getDate() + 2
                    );
                    onChange(moment(yesterday).format("YYYY/MM/DD"));
                  }}
                  style={{ borderRadius: 32, fontSize: 11 }}
                >
                  Day after tommorow
                </Button>
                <Box>
                  <DatePicker
                    selected={
                      meetingDatetime ? moment(meetingDatetime).toDate() : new Date()
                    }
                    onChange={onChange}
                    customInput={
                      <Button
                        id='datetime'
                        color='primary'
                        variant='outlined'
                        style={{ borderRadius: 32, fontSize: 11 }}
                      >
                        other date
                      </Button>
                    }
                  />
                </Box>
              </Stack>
            </Container>
          </Box>
          <Container maxWidth='md'>
            <Typography
              variant='body2'
              sx={{ fontSize: 20, fontWeight: "bold" }}
            >
              {eventSearchTitle}
            </Typography>
            <Grid container sx={{ mb: 5 }} spacing={4}>
              {/* @ts-ignore */}
              {events?.map((event) => (
                <EventBox
                  key={event?.id}
                  // @ts-ignore
                  event={event}
                />
              ))}
            </Grid>
          </Container>
        </main>
      </ThemeProvider>
    </>
  );
};

export default Home;
