const Bot = require('./lib/Bot')
const SOFA = require('sofa-js')
const Fiat = require('./lib/Fiat')

let bot = new Bot()

// ROUTING

bot.onEvent = function(session, message) {
  switch (message.type) {
    case 'Init':
      welcome(session)
      break
    case 'Message':
      onMessage(session, message)
      break
    case 'Command':
      onCommand(session, message)
      break
    case 'Payment':
      onPayment(session, message)
      break
    case 'PaymentRequest':
      welcome(session)
      break

  }
}

function onMessage(session, message) {
  welcome(session)
}

function onCommand(session, command) {
  switch (command.content.value) {
    case 'Physics':
      Physics(session)
      break
    case 'Mathematics':
      Mathematics(session)
      break
    case 'Chemistry':
      Chemistry(session)
      break
    case 'Biology':
      Biology(session)
    case 'Business':
      Business(session)
      break
    case 'Arts':
      Arts(session)
      break
    }
}

function onPayment(session, message) {
  if (message.fromAddress == session.config.paymentAddress) {
    // handle payments sent by the bot
    if (message.status == 'confirmed') {
      // perform special action once the payment has been confirmed
      // on the network
    } else if (message.status == 'error') {
      // oops, something went wrong with a payment we tried to send!
    }
  } else {
    // handle payments sent to the bot
    if (message.status == 'unconfirmed') {
      // payment has been sent to the ethereum network, but is not yet confirmed
      sendMessage(session, `Thanks for the payment! 🙏`);
    } else if (message.status == 'confirmed') {
      // handle when the payment is actually confirmed!
    } else if (message.status == 'error') {
      sendMessage(session, `There was an error with your payment!🚫`);
    }
  }
}

// STATES

function welcome(session) {
  sendMessage(session, `Which academic program would you like to sponsor?`)
}

function Arts(session) {
    session.reply(SOFA.Message({
      attachments: [{
        "type": "image",
        "url": "finearts.jpg"

      }],
      showKeyboard: false,
    }))
  sendText(session, `\"Art is the most intense mode of individualism that the world has known.\" \n-Oscar Wilde`)
  sendText(session, `You have chosen to aid a student studying fine arts. Below are three candidates who fit this selection:`)

}

// example of how to store state on each user
function Physics(session) {
    session.reply(SOFA.Message({
      attachments: [{
        "type": "image",
        "url": "newton.jpg"

      }],
      showKeyboard: false,
    }))
  sendText(session, `\"Not only is the Universe stranger than we think, it is stranger than we can think.\" \n-Werner Heisenberg`)
  sendText(session, `You have chosen to aid a student studying physics. Below are three candidates who fit this selection:`)

}

function Chemistry(session) {
    session.reply(SOFA.Message({
      attachments: [{
        "type": "image",
        "url": "chem.jpg"

      }],
      showKeyboard: false,
    }))
  sendText(session, `\"We must reason in natural philosophy not from what we hope, or even expect, but from what we perceive.\" \n-Humphry Davy`)
  sendText(session, `You have chosen to aid a student studying chemistry. Below are three candidates who fit this selection:`)

}
function Biology(session) {
    session.reply(SOFA.Message({
      attachments: [{
        "type": "image",
        "url": "dna.jpg"

      }],
      showKeyboard: false,
    }))
  sendText(session, `\"Biology is the study of complicated things that have the appearance of having been designed with a purpose.\" \n-Richard Dawkins`)
  sendText(session, `You have chosen to aid a student studying biology. Below are three candidates who fit this selection:`)

}
function Mathematics(session) {
    session.reply(SOFA.Message({
      attachments: [{
        "type": "image",
        "url": "pi.jpg"

      }],
      showKeyboard: false,
    }))
  sendText(session, `\"Mathematics is the music of reason.\" \n-James Joseph Sylvester`)
  sendText(session, `You have chosen to aid a student studying mathematics. Below are three candidates who fit this selection:`)

}

function Business(session) {
    session.reply(SOFA.Message({
      attachments: [{
        "type": "image",
        "url": "Business.jpg"

      }],
      showKeyboard: false,
    }))
  sendText(session, '\"If you want to succeed you should strike out on new paths, rather than travel the worn paths of accepted success.\" \n-John D. Rockefeller')
  sendText(session, `You have chosen to aid a student studying business. Below are three candidates who fit this selection:`)
}

// HELPERS
function sendText(session,message){
    session.reply(message)
}
function sendMessage(session, message) {
  let controls = [
    {type: 'button', label: 'Fine Arts', value: 'Arts'},
    {type: 'button', label: 'Business', value: 'Business'},
    {type: 'group', 
    label: 'S.T.E.M', 
    controls: [
                {type: 'button', label: 'Mathematics', value: 'Mathematics'},
                {type: 'button', label: 'Physics', value: 'Physics'},
                {type: 'button', label: 'Chemistry', value: 'Chemistry'},
                {type: 'button', label: 'Biology', value: 'Biology'}
                ]}]
  session.reply(SOFA.Message({
    body: message,
    controls: controls,
    showKeyboard: false,
  }))
}
