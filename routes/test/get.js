const { google } = require('googleapis')

const oAuth2Client = new google.auth.OAuth2()

module.exports = async (req, res) => {
  console.log(req.headers)
  const iapJwt = req.headers['iap-jwt-assertion']
  console.log(iapJwt)
  if (!iapJwt) return res.sendStatus(401)

  const ticket = await verify(iapJwt)
  console.log(ticket)
  if (!ticket) return res.sendStatus(401)

  console.log(ticket)
  const ip =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null)

  return res.status(200).json({ ip })
}

const expectedAudience = ''

const verify = async (iapJwt) => {
  // Verify the id_token, and access the claims.
  const response = await oAuth2Client.getIapPublicKeys()
  const ticket = await oAuth2Client.verifySignedJwtWithCertsAsync(
    iapJwt,
    response.pubkeys,
    expectedAudience,
    ['https://cloud.google.com/iap']
  )

  return ticket
}
