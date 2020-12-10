const express = require('express')
const nnnRouter = require('nnn-router')
const promiseRouter = require('express-promise-router')
const cors = require('cors')

const app = express()

const corsOptionsDelegate = function (req, callback) {
  const corsOptions = { origin: true, credentials: true }

  return callback(null, corsOptions)
}
app.use(cors(corsOptionsDelegate))

app.use(nnnRouter({ routeDir: '/routes', baseRouter: promiseRouter() }))
app.set('view engine', 'ejs')

const port = process.env.PORT || 8001

app.listen(port, () => {
  console.log(`Server is running at port ${port}`)
})

module.exports = app
