const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.post("/", function(req, res) {
  const firstName = req.body.Fname;
  const lastName = req.body.Lname;
  const email = req.body.email;

  mailchimp.setConfig({
    apiKey: "0ea9528c6e38039b1c7b7fe723e08b57-us18",
    server: "us18",
  });

  const listId = "a5bbd804b8";

  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    });

    if(response.status == "subscribed") {
      res.sendFile(__dirname + "/success.html");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
    }
  }
  run();
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});
