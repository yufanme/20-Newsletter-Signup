const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const mailchimp = require("@mailchimp/mailchimp_marketing");
let port = process.env.PORT || 3000;

app = express();
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
})

mailchimp.setConfig({
    apiKey: "f1456906bf96e9b474610b19eb6b0ac4-us8",
    server: "us8"
});

app.post('/', (req, res) => {
    console.log("post page load.")
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    console.log(firstName, lastName, email);
    const listId = "efa8bd716c";
    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    };
    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });
        res.sendFile(__dirname + '/success.html');
        console.log(`Successfully added contact as an audience member. The contact's id is ${
            response.id
            }.`);
    }
    run().catch(e => res.sendFile(__dirname + "/failure.html"));
})

app.post('/failure', (req, res) => {
    res.redirect('/');
});

app.listen(port, function() {
    console.log(`Server is running on port ${port}`);
});

// API Key
// f1456906bf96e9b474610b19eb6b0ac4-us8

// list id  
// efa8bd716c

// server
// us8