const got = require('got')

module.exports = async (req, res) => {
  const authToken = req.header('AUTHORIZATION') || ''
  console.log(authToken)
  const isValidToken = await checkToken(authToken)
  if (!isValidToken) {
    return res.sendStatus(401)
  }
  return res.status(200).send({ message: `Welcome to my seminar` })
}

const checkToken = async (authToken) => {
  const token = authToken.split(' ')
  if (token.length < 2) return false
  const response = await got(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${token[1]}`
  ).catch(() => false)
  if (!response) return false
  const validateInfo = JSON.parse(response.body)
  console.log(validateInfo)
  const isEmailVerified = validateInfo.email_verified
  const isEmailValid = validateInfo.email
  const isTimeExpired =
    Math.floor(Number(new Date()) / 1000) - validateInfo.exp > 0
  const isAudienceValid = validateInfo.aud
  if (!isEmailVerified || !isEmailValid || isTimeExpired || !isAudienceValid)
    return false
  return true
}
