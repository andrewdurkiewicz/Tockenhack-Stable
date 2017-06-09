const Bot = require('./lib/Bot')
const SOFA = require('sofa-js')
const Fiat = require('./lib/Fiat')
const Web3 = require('./lib/web3')

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
    case 'Init':
      welcome(session)
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


function welcome(session) {
  sendMessage(session, `Which academic program would you like to sponsor?`)
}

function Arts(session) {
    session.reply(SOFA.Message({
      attachments: [{
        "type": "image",
        "url": "art.jpeg"
      }],
    }))
  let body = `\"Art is the most intense mode of individualism that the world has known.\" \n-Oscar Wilde
  \nYou have chosen to aid a student studying fine arts. Below are two candidates who fit this selection:`
  let controls = [
    {type: 'button', label: 'Brandon Jacobs\nHarvard: Dance', action: 'Webview::https://lsaether.github.io/tokenhack/'},
    {type: 'button', label: 'Jane Yoo\nBrown: Painting', action: 'Webview::https://lsaether.github.io/tokenhack/'},
    {type: 'button', label: 'Go Back', value: 'Init'}]
  session.reply(SOFA.Message({
    body: body,
    controls: controls,
    showKeyboard: false,
  }))
}
function Physics(session) {
    session.reply(SOFA.Message({
      attachments: [{
        "type": "image",
        "url": "physics.jpeg"

      }], 
      showKeyboard: false,
    }))
  let body = `\"Not only is the Universe stranger than we think, it is stranger than we can think.\" \n-Werner Heisenberg
  \nYou have chosen to aid a student studying physics. Below are two candidates who fit this selection:`
  let controls = [
    {type: 'button', label: 'Brandon Jacobs\nHarvard: Tunneling', action: 'Webview::https://lsaether.github.io/tokenhack/'},
    {type: 'button', label: 'Jane Yoo\nBrown: Radiation', action: 'Webview::https://lsaether.github.io/tokenhack/'},
    {type: 'button', label: 'Go Back', value: 'Init'}]
  session.reply(SOFA.Message({
    body: body,
    controls: controls,
    showKeyboard: false,
  }))
}
function Chemistry(session) {
    session.reply(SOFA.Message({
      attachments: [{
        "type": "image",
        "url": "chemistry.jpeg"
      }],
      showKeyboard: false,
    }))
  let body = `\"We must reason in natural philosophy not from what we hope, or even expect, but from what we perceive.\" \n-Humphry Davy
  \nYou have chosen to aid a student studying chemistry. Below are two candidates who fit this selection:`
  let controls = [
    {type: 'button', label: 'Brandon Jacobs\nHarvard: Chemistry', action: 'Webview::https://lsaether.github.io/tokenhack/'},
    {type: 'button', label: 'Jane Yoo\nBrown: Solids', action: 'Webview::https://lsaether.github.io/tokenhack/'},
    {type: 'button', label: 'Go Back', value: 'Init'}]
  session.reply(SOFA.Message({
    body: body,
    controls: controls,
    showKeyboard: false,
  }))
}

function Biology(session) {
    session.reply(SOFA.Message({
      attachments: [{
        "type": "image",
        "url": "frog.jpeg"
      }],
      showKeyboard: false,
    }))
  let body = `\"Biology is the study of complicated things that have the appearance of having been designed with a purpose.\" \n-Richard Dawkins
  \nYou have chosen to aid a student studying biology. Below are two candidates who fit this selection:`
  let controls = [
    {type: 'button', label: 'Brandon Jacobs\nHarvard: CRISPR', action: 'Webview::https://lsaether.github.io/tokenhack/'},
    {type: 'button', label: 'Jane Yoo\nBrown: Stem-Cells', action: 'Webview::https://lsaether.github.io/tokenhack/'},
    {type: 'button', label: 'Go Back', value: 'Init'}]
  session.reply(SOFA.Message({
    body: body,
    controls: controls,
    showKeyboard: false,
  }))
}

function Mathematics(session) {
    session.reply(SOFA.Message({
      attachments: [{
        "type": "image",
        "url": "math.jpeg"
      }]}))
  let body = `\"Mathematics is the music of reason.\" \n-James Joseph Sylvester
  \nYou have chosen to aid a student studying mathematics. Below are two candidates who fit this selection:`
  let controls = [
    {type: 'button', label: 'Brandon Jacobs\nHarvard: Geometry', action: 'Webview::https://lsaether.github.io/tokenhack/'},
    {type: 'button', label: 'Jane Yoo\nBrown: Reduction', action: 'Webview::https://lsaether.github.io/tokenhack/'},
    {type: 'button', label: 'Go Back', value: 'Init'}]
  session.reply(SOFA.Message({
        body: body,
            controls: controls,
                showKeyboard: false,}))}
function Business(session) {
    session.reply(SOFA.Message({
      attachments: [{
        "type": "image",
        "url": "business.jpeg"
      }],
      showKeyboard: false,}))
  let body = `\"If you want to succeed you should strike out on new paths, rather than travel the worn paths of accepted success.\" \n-John D. Rockefeller
  \nYou have chosen to aid a student studying business. Below are two candidates who fit this selection:`
  let controls = [
    {type: 'button', label: 'Brandon Jacobs\nHarvard: Patents', action: 'Webview::https://lsaether.github.io/tokenhack/'},
    {type: 'button', label: 'Jane Yoo\nBrown: Economics', action: 'Webview::https://lsaether.github.io/tokenhack/'},
    {type: 'button', label: 'Go Back', value: 'Init'}]
  session.reply(SOFA.Message({
    body: body,
    controls: controls,
    showKeyboard: false,
  }))
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