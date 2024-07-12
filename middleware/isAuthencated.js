const jsonwebtoken = require("jsonwebtoken");
const promisify = require("util").promisify;

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  //   console.log(token);
  if (!token || token === null) {
    return res.send("Please Log In First");
  }

  jsonwebtoken.verify(token, process.env.SECRET, (err, result) => {
    if (err) res.send("Invalid Token");
    else {
      req.userId = result.userId;
      next();
      // console.log(result);
    }
  });

  //   next() used to pass the control to another function in argument list
  // jsonwebtoken.verify(promisify(token,process.env.SECRET));
};

module.exports = isAuthenticated;
