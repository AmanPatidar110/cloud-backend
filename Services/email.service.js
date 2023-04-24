const axios = require('axios').default;

const sendEmail = async (to = "119cs0036@iiitk.ac.in", subject = "Test Email", body = "Test", htmlBody = "Test") => {
    try{
        console.log("IN send EMAIL service, sending to:", to)

        const result = await axios.post("https://api.postmarkapp.com/email", {
            "From": "119cs0005@iiitk.ac.in",
            "To": to,
            "Subject": subject,
            "TextBody": body,
            "HtmlBody": htmlBody,
            "MessageStream": "outbound"
          }, {headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Postmark-Server-Token": "0686c568-2b89-4fe3-9e7d-cfce90f2d2fe"
        }})

        console.log('Response', result.data);
    }catch(er){
        console.log('Error sending Email', er);
    }
}

module.exports = sendEmail;