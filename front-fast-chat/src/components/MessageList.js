import { Box, Grid, Typography } from "@material-ui/core";
const MessageList = (props) => {
  const { messageList = [], username = "" } = props;
  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>
        Channel
      </Typography>
      {messageList.map((message, key) => {
        return (
          <Message
            key={key}
            message={message}
            isMe={username.username !== message.username}
          />
        );
      })}
    </Box>
  );
};

const Message = ({ message, isMe }) => {
  const { text, username, hour } = message;
  const align = isMe ? "left" : "right";
  return (
    <Box style={{ padding: "0% 15% 2% 15%" }}>
      <Grid
        container
        direction="column"
        justify="flex-end"
        alignItems="stretch"
      >
        <Typography variant="body1" component="h1" gutterBottom align={align}>
          {text}
        </Typography>

        <Typography
          variant="overline"
          component="h1"
          gutterBottom
          align={align}
        >
          {username}-{hour}
        </Typography>
      </Grid>
    </Box>
  );
};

export default MessageList;
