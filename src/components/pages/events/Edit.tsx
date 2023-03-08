import React, { useState, useCallback, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import CardMedia from "@mui/material/CardMedia";
import Cancel from "@mui/icons-material/Cancel";
import CameraAlt from "@mui/icons-material/CameraAlt";
import {
  editEvent,
  getEvent,
  getCategories,
  getcities,
} from "../../../lib/api/gotoreAPI";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Category, City } from "interfaces";
import { AuthContext } from "App";

const theme = createTheme();

const EditEvent: React.FC = () => {
  const { currentUser } = useContext(AuthContext)
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [address, setAddress] = useState("");
  const [meetingDatetime, setMeetingDatetime] = useState(new Date());
  const [categoryId, setCategoryId] = useState(0);
  const [cityId, setCityId] = useState(0);
  const [categoriesList, setcategoriesList] = useState([]);
  const [citiesList, setcitiesList] = useState([]);
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const {id} = useParams();
  const navigate = useNavigate();

  const handleGetEvent = useCallback(async () => {
    try {
      const res = await getEvent(id);
      const event = res.data.event;
      setTitle(event.title);
      setBody(event.body);
      setAddress(event.address);
      setMeetingDatetime(
        event.meetingDatetime !== null ? event.meetingDatetime : new Date()
      );
      setCategoryId(event.categoryId);
      setImage(event.imageUrl);
      setPreview(event.imageUrl);
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  const handleGetCategories = useCallback(async () => {
    try {
      const res = await getCategories();
      setcategoriesList(res.data.categories);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleGetcities = useCallback(async () => {
    try {
      const res = await getcities();
      setcitiesList(res.data.cities);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    handleGetEvent();
    handleGetCategories();
    handleGetcities();
  }, [handleGetEvent, handleGetCategories, handleGetcities]);

  useEffect(() => {
    handleGetEvent();
  }, [handleGetEvent]);

  const parseAsMoment = (dateTimeStr: moment.MomentInput) => {
    return moment.utc(dateTimeStr, "YYYY-MM-DDTHH:mm:00Z", "ja").utcOffset(9);
  };

  const uploadImage = useCallback((e: any) => {
    const file = e.target.files[0];
    setImage(file);
  }, []);

  const previewImage = useCallback((e: any) => {
    const file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file));
  }, []);

  const createFormData = useCallback(() => {
    const formData = new FormData();
    formData.append("event[image]", image);
    formData.append("event[title]", title);
    formData.append("event[body]", body);
    formData.append("event[address]", address);
    formData.append("event[meeting_datetime]", String(meetingDatetime));
    formData.append("event[category_id]", String(categoryId));
    formData.append("event[user_id]", String(currentUser?.id));

    return formData;
  }, [body, categoryId, currentUser, image, meetingDatetime, address, title]);

  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void; }) => {
      e.preventDefault();

      const data = createFormData();
      console.log(data);

      await editEvent(Number(id), data).then(() => {
        navigate("/");
      });
    },
    [createFormData, navigate, id]
  );

  const UploadButton = useCallback((props: any) => {
    return (
      <label htmlFor={`upload-button-${props.name}`}>
        <input
          style={{ display: "none" }}
          id={`upload-button-${props.name}`}
          name={props.name}
          multiple
          type='file'
          onChange={props.onChange}
        />
        <IconButton aria-label='upload picture' component='center'>
          <CameraAlt />
        </IconButton>
      </label>
    );
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component='main' maxWidth='sm' sx={{ mb: 4 }}>
        <Paper
          variant='outlined'
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component='h1' variant='h4' align='center'>
            Gather workout friends!
          </Typography>
          <Box component='form' sx={{ mt: 1, alignItems: 'center' }}>
            {preview ? (
              <Box sx={{ borderRadius: 1, borderColor: "grey.400" }}>
                <IconButton color='inherit' onClick={() => setPreview("")}>
                  <Cancel />
                </IconButton>
                <CardMedia
                  height='200'
                  component='img'
                  src={preview}
                  alt='preview img'
                />
              </Box>
            ) : (
              <UploadButton
                className='primary'
                name='image'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  uploadImage(e);
                  previewImage(e);
                }}
              />
            )}
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin='normal'
              required
              fullWidth
              id='title'
              label='Title'
              name='title'
              autoComplete='title'
            />
            <TextField
              value={body}
              onChange={(e) => setBody(e.target.value)}
              margin='normal'
              required
              fullWidth
              id='body'
              label='Body'
              name='body'
              autoComplete='body'
            />
            <FormControl fullWidth required margin='normal'>
              <InputLabel id='demo-simple-select-label'>Category</InputLabel>
              <Select
                label='Catogory'
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value as number)}
              >
                {categoriesList &&
                  categoriesList.map((category: Category) => (
                    <MenuItem key={category?.id} value={category?.id}>
                      {category?.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required margin='normal'>
              <InputLabel id='demo-simple-select-label'>city</InputLabel>
              <Select
                label='city'
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={cityId}
                onChange={(e) => setCityId(e.target.value as number)}
              >
                {citiesList &&
                  citiesList.map((city: City) => (
                    <MenuItem key={city?.id} value={city?.id}>
                      {city?.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              margin='normal'
              required
              fullWidth
              id='address'
              label='Address'
              name='address'
              autoComplete='address'
            />
            <DatePicker
              selected={moment(meetingDatetime).toDate()}
              onChange={(date) => setMeetingDatetime(date as Date)}
              customInput={
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  id='datetime'
                  label='Datetime'
                  name='datetime'
                  autoComplete='datetime'
                  inputProps={{ readOnly: true }}
                >
                  {parseAsMoment(meetingDatetime).format("YYYY/MM/DD")}
                </TextField>
              }
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Let's start Gathering!
            </Button>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default EditEvent