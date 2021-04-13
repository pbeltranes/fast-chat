import { useState } from "react";
import {
  TextField,
  Box,
  Typography,
  Grid,
  Button,
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { Link } from "react-router-dom";

function Home({ setUsername }) {
  const [roomId, setRoomId] = useState("");
  return (
    <Box style={{ padding: "5% 5% 5% 5%" }}>
      <Typography variant="H1" component="h2" gutterBottom>
        Home Chat
      </Typography>
      <Box style={{ padding: "5% 5% 5% 5%" }}>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={4}
        >
          <Grid item>
            <TextField
              onChange={(event) => {
                setRoomId(event.target.value);
              }}
              id="outlined-multiline-static"
              placeholder="ROOM"
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <TextField
              onChange={(event) => {
                setUsername(event.target.value);
                localStorage.setItem("username", event.target.value);
              }}
              id="outlined-multiline-static"
              placeholder="USERNAME"
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <Button
              component={Link}
              to={`/${roomId}`}
              className="enter-room-button"
              variant="contained"
              color="primary"
            >
              {" "}
              Join room
              <PlayArrowIcon />
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Home;
