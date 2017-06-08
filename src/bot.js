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
    case 'ping':
      pong(session)
      break
    case 'STEM':
      STEM(session)
      break
    case 'donate':
      donate(session)
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
      body: "`Art is the most intense mode of individualism that the world has known. (Oscar Wilde)`",
      attachments: [{
        "type": "image",
        "url": "monalisa.jpg"
      }]
    }))
  sendText(session, `You have chosen to aid a student within the fine arts. Below are three candidates who fit this selection:`)

}

// example of how to store state on each user
function STEM(session) {
  sendMessage(session, `Pong`)
}

function donate(session) {
  // request $1 USD at current exchange rates
  Fiat.fetch().then((toEth) => {
    session.requestEth(toEth.USD(1))
  })
}

// HELPERS
function sendText(session,message){
    session.reply(message)
}
function sendMessage(session, message) {
  let controls = [
    {type: 'button', label: 'Arts', value: 'Arts'},
    {type: 'button', label: 'Business', value: 'donate'},

    {
    type: 'group', 
    label: 'S.T.E.M', 
    controls: [
                {type: 'button', label: 'Mathematics', value: 'ping'},
                {type: 'button', label: 'Physics', value: 'ping'},
                {type: 'button', label: 'Chemistry', value: 'ping'},
                {type: 'button', label: 'Biology', value: 'ping'}
                ],
    value: 'ping'}
  ]
  session.reply(SOFA.Message({
    body: message,
    controls: controls,
    showKeyboard: false,
  }))
}
