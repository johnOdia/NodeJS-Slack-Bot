const { App } = require("@slack/bolt");
const token = process.env.token;
const signingSecret = process.env.signingSecret;
const dropdownContent = require("./dropdown/dropdown.json");
const { WebClient, LogLevel } = require("@slack/web-api");
const mongoose = require("mongoose");
const { saveToDataBase, getTime } = require("./database/database");

//Connect to DB
mongoose.set("useFindAndModify", false);

mongoose
  .connect(
    process.env.DB,
    { useUnifiedTopology: true },
    { useNewUrlParser: true }
  )
  .then(() => console.log("DB connected!"));

//Instantiate new client
const client = new WebClient(token, {
  logLevel: LogLevel.DEBUG,
});

//Instantiate new slack bolt app
const app = new App({
  token: token,
  signingSecret: signingSecret,
});

//Listen for app mention event
app.event("app_mention", async ({ event, say }) => {
  if (event.text.includes("saved")) {
    (async () => {
      const savedTime = await getTime(event.user);

      client.chat.postEphemeral({
        channel: event.channel,
        user: event.user,
        text: savedTime,
        
      });
    })();
  }

  if (event.text.includes("hello")) return say(`Hello, <@${event.user}>!`);

  if (event.text.includes("time")) {
    await say({
      blocks: dropdownContent,
    });
  }
});

//Listen and respond to user selection
app.action("text1234", async ({ body, ack, say }) => {
  await ack();
  

  const userId = body.user.id,

    username = body.user.name,

    channelId = body.channel.id;

  const timeSlots = body.actions[0].selected_options;

  if (timeSlots.length > 2 || timeSlots.length == 1) {

    return client.chat.postEphemeral({
      channel: channelId,
      user: userId,
      text: `Hello ${username}, you selected ${timeSlots.length} option(s)! pls select 2 options`,
    });

  } else {

    const selectedTimeSlots = `${timeSlots[0].text.text} and ${timeSlots[1].text.text}`;

    return saveToDataBase(userId, selectedTimeSlots);
  }
});

app.start(process.env.PORT || 4000);
