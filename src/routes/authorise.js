const express = require('express')
const authoriseRouter = express.Router()
const request = require('request-promise')
const redirectUrl = process.env.REDIRECTURL || 'https://google.com'
module.exports = function () {
  authoriseRouter.route('/')
    .post(function (req, res) {
      const requestOptions = ({
        method: 'POST',
        jar: true,
        json: true,
        strictSSL: false,
        uri: '',
        body: {}
      })
      requestOptions.uri = `${process.env.URI}/api/login`
      requestOptions.body = {
        username: process.env.USERNAME,
        password: process.env.PASSWORD
      }
      request(requestOptions)
        .then(loginResp => {
          requestOptions.uri = `${process.env.URI}/api/s/${process.env.SITENAME}/cmd/stamgr`
          requestOptions.body = {
            cmd: 'authorize-guest',
            minutes: '',
            up:'',
            down:'',
            mac: req.session.macAddr
          }
          return request(requestOptions)
        })
        .then(authResp => {
          console.log(authResp)
          requestOptions.uri = `${process.env.URI}/api/logout`
          return request(requestOptions)
        })
        .then(logoutResp => {
          res.redirect(redirectUrl)
        })
        .catch(err => {
          console.log(err)
        })
    })
  return authoriseRouter
}
