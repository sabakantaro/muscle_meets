import * as React from "react";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

type Props ={
  openAttendModal: (value: boolean) => void;
  disabled: boolean
}
const AttendButton:React.FC<Props> = ({ openAttendModal, disabled }) => {
  return (
    <CardActions sx={{ justifyContent: "center" }}>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          pb: 1,
        }}
      >
        <Button
          color='primary'
          variant='contained'
          onClick={() => openAttendModal(true)}
          disabled={disabled}
        >
          Attend
        </Button>
      </Box>
    </CardActions>
  );
}

export default AttendButton