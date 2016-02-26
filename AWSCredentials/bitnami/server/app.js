'use strict';

var util = require('util');
var express = require('express');
var braintree = require('braintree');
var bodyParser = require('body-parser');
var path = require('path');

/**
 * Instantiate your server and a JSON parser to parse all incoming requests
 */
var app = express();
var jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({extended:false}));
app.use(jsonParser);
/**
 * Instantiate your gateway (update here with your Braintree API Keys)
 */
var gateway = braintree.connect({
  environment:  braintree.Environment.Sandbox,
  merchantId:   '9czv8n5v9hqd4qf2',
  publicKey:    'qx6bsvxnhjkxcjmp',
  privateKey:   '5723cde4703bf2c617e9aab4a16d7941'
});

/**
 * Enable CORS (http://enable-cors.org/server_expressjs.html)
 * to allow different clients to request data from your server
 */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/**
 * Route that returns a token to be used on the client side to tokenize payment details
 */
app.post('/api/v1/token', function (request, response) {
  var dataBody = request.body;
  console.log(dataBody.customerId);
  var dataBodyCustomerId = dataBody.customerId.replace(":","");
  gateway.customer.find(dataBodyCustomerId, function(err, customer) {
    console.log(err);
    if(err && err.name == "notFoundError"){
      createNewCustomerAndToken();
    }
    generateToken(dataBodyCustomerId);
  });
  function createNewCustomerAndToken(){
    gateway.customer.create({
      id: dataBodyCustomerId
    }, function (err, result) {
      if(!err){
        generateToken(result.customer.id);
      } else {
        throw err;
      }
    });
  }
  function generateToken(id){
    gateway.clientToken.generate({options:{makeDefault:true},customerId: id}, function (err, res) {
      console.log(res.clientToken);
      if (err) throw err;
      response.json({
        "client_token": res.clientToken
      });
    });
  }
});

/**
 * Route to process a sale transaction
 */
app.post('/api/v1/process',function (request, response) {
// console.log(request);
  console.log(request.body);
  console.log(request.body.sale);
  console.log(request.body.amount);
  var transaction = request.body;
  gateway.transaction.sale({
    amount: transaction.amount,
    paymentMethodNonce: transaction.payment_method_nonce,
    customerId: transaction.customerId.replace(":","")
  }, function (err, result) {
    if (err) throw err;
    console.log(util.inspect(result));
    response.json(result);
  });
});

/**
 * Sends SMS Message
 */
app.post('/api/v1/SMSMessage',function (request, response) {

  console.log(request.body);
  console.log(request.body.to);
  console.log(request.body.from);
  console.log(request.body.message);

  // Your accountSid and authToken from twilio.com/user/account
  var accountSid = 'ACf5e32e325b1d9e32c9a0fd11ffe5e95d';
  var authToken = "b79ee2389d2b69ad5c96feebb3bffb86";
  var client = require('/opt/bitnami/nodejs/lib/node_modules/twilio/lib')(accountSid, authToken);
   
  client.messages.create({
      body: request.body.message,
      to: request.body.to,
      from: "+16783270074"
  }, function(err, message) {
      response.json(message.sid);
  });


});

//Test
app.post("/api/v1/checkout",jsonParser, function (req, res) {
  console.log(jsonParser);
  var nonce = req.body.payment_method_nonce;
  // Use payment method nonce here
  gateway.transaction.sale({
    amount: req.body.amount,
    paymentMethodNonce: nonce,
  }, function (err, result) {
    if (err) throw err;
    console.log(util.inspect(result));
    res.json(result);
  });
});

app.post('/loginTest',function(req,res){
  var user_name=req.body.user;
  var password=req.body.password;
  console.log("User name = "+user_name+", password is "+password);
  res.end("yes");
});

//HTML
// viewed at http://localhost:8080
//app.get('/', function(req, res) {
//    res.sendFile(path.join(__dirname,'../client', '/index.html'));
//});

app.listen(8080, function () {
  console.log('Listening on port 8080');
});
