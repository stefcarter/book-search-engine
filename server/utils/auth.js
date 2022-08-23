const jwt = require('jsonwebtoken');
const secret = 'mysecretssshhhhhhh';
const expiration = '2h';


module.exports = {
    authMiddleware: function ({ req, res }) {
        if (req.body.operationName === 'addUser') {
            return req;
        } else {
            let token = req.body.token || req.query.token || req.headers.authorization;

        if (req.headers.authorization) {
            token = token.split(' ').pop().trim();
        }

        if (!token) {
            return res.status(400).json({ message: 'You have no token!' });
        }

        try {
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data;
        } catch {
            console.log('Invalid token');
            return res.status(400).json({ message: 'invalid token' });
        }
        return req;
        }
        
    },
    signToken: function ({ username, email, _id }) {
        const payload = { username, email, _id };
        return jwt.sign({ date: payload }, secret, { expiresIn: expiration });
    },
};