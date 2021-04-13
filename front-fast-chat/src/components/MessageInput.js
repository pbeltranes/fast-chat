import { useState } from "react";
import { TextField, Box, Grid, Fab } from "@material-ui/core";
import NavigationIcon from "@material-ui/icons/Navigation";
const MessageInput = (props) => {
  const { onClick } = props;
  const handleSendMessage = () => {
    onClick(newMessage);
    setNewMessage("");
  };
  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };
  const [newMessage, setNewMessage] = useState("");
  return (
    <Box style={{ padding: "0% 15% 0% 15%" }}>
      <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="stretch"
      >
        <Grid item xs={10}>
          <TextField
            onChange={handleNewMessageChange}
            fullWidth={true}
            id="outlined-multiline-static"
            label="Say something..."
            rows={2}
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <Fab variant="extended" onClick={handleSendMessage}>
            <NavigationIcon />
            SEND
          </Fab>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MessageInput;
