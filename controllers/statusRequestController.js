const { statusRequestModel } = require('../models');

function getRequests(req, res, next) {
    const user = req.user;

    if (user.status !== 'provider') {
        console.error('Customer tring to get requests');
        res
            .status(403)
            .send({ message: 'Access denied!' });
        return;
    }

    statusRequestModel.find()
        .populate('userId')
        .then(requests => res.json(requests))
        .catch(next);
}

function getRequest(req, res, next) {
    const user = req.user;
    const { requestId } = req.params;

    if (user.status !== 'provider') {
        console.error('Customer tring to get requests');
        res
            .status(403)
            .send({ message: 'Access denied!' });
        return;
    }

    statusRequestModel.findById(requestId)
        .populate('userId')
        .then(requests => res.json(requests))
        .catch(next);
}

function createRequest(req, res, next) {
    const user = req.user;
    const { description } = req.body;
    const userId = user._id;

    if (user.status !== 'customer') {
        console.error('Provider tring to post requests');
        res
            .status(403)
            .send({ message: 'Access denied!' });
        return;
    }

    statusRequestModel.create({ description, userId })
        .then(requests => res.status(200).json(requests))
        .catch(err => {
            if (err.name === 'MongoError' && err.code === 11000) {
                let field = err.message.split('index: ')[1];
                field = field.split(' dup key')[0];
                field = field.substring(0, field.lastIndexOf('_'));

                res.status(409)
                    .send({ message: `This ${field} is already requested!` });
                return;
            }
            next(err);
        });
}

module.exports = {
    getRequests,
    getRequest,
    createRequest
};