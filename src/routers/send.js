var nodemailer = require('nodemailer');

var sendmail=(reciever,subject,text)=>{
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'harshkumartodolist1@gmail.com',
    pass: 'harshtodo1kumar@'
  }
});

var mailOptions = {
  from: 'harshkumartodolist1@gmail.com',   
  to: reciever,
  subject: subject,
  html: text
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}

module.exports=sendmail;