require("dotenv").config()
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const transport = {
  host: "smtp.gmail.com",
  auth: {
    user: process.env.MAILER_USERNAME,
    pass: process.env.MAILER_PASSWORD
  }
}

const transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages");
  }
});

router.post("/send", (req, res, next) => {

  let from = req.body.from
  let to = req.body.to
  let subject = req.body.subject
  let text = req.body.text
  let key = req.body.key
  let html = req.body.html

  // bcrypt.hash(key, 10, function (err, hash) {
  //   console.log(hash)
  // })

  if (from && to && subject && text) {
    let mail = {
      from: from,
      to: to,
      subject: subject,
      text: text,
      html: html
    }

    bcrypt.compare(key, process.env.HASHED_KEY, function (err, result) {
      if (result) {
        transporter.sendMail(mail, (err, data) => {
          if (err) {
            res.json({
              message: "Failed to send message"
            })
          } else {
            res.json({
              message: "Success"
            })
          }
        })
      } else {
        return res.status(403).json({ message: "Invalid Key" })
      }
    })
  } else {
    return res.status(400).json({ message: "Bad Request" })
  }
})

module.exports = router;
