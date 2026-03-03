require('dotenv').config();
const formatResponse = require('../utils/formatResponse');
const jwt = require('jsonwebtoken');

function verifyRefreshToken(req, res, next) {
  try {
    const { refreshToken } = req.cookies;

    const { user } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (!user) {
      return res
        .status(401)
        .json(
          formatResponse(
            401,
            'Невалидный refreshToken',
            null,
            'Невалидный refreshToken',
          ),
        );
    }

    res.locals.user = user;
    next();
  } catch (error) {
    console.log('==== Verify Refresh Token ==== ');
    console.log(error);
    res
      .status(401)
      .json(formatResponse(401, 'Невалидный refreshToken', null, error));
  }
}

module.exports = verifyRefreshToken;
