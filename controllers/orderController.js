const { orderModel } = require('../models');
const { newComment } = require('./commentController');

function getOrders(req, res, next) {
    orderModel.find()
        .populate('userId')
        .then(orders => res.json(orders))
        .catch(next);
}

function getOrder(req, res, next) {
    const { orderId } = req.params;

    orderModel.findById(orderId)
        .populate({
            path : 'comments',
            populate : {
              path : 'userId'
            }
          })
        .then(order => res.json(order))
        .catch(next);
}

function createOrder(req, res, next) {
    const { orderName, commentText } = req.body;
    const { _id: userId } = req.user;

    orderModel.create({ orderName, userId, subscribers: [userId] })
        .then(order => {
            newComment(commentText, userId, order._id)
                .then(([_, updatedOrder]) => res.status(200).json(updatedOrder));
        })
        .catch(next);
}

function subscribe(req, res, next) {
    const orderId = req.params.orderId;
    const { _id: userId } = req.user;
    orderModel.findByIdAndUpdate({ _id: orderId }, { $addToSet: { subscribers: userId } }, { new: true })
        .then(updatedOrder => {
            res.status(200).json(updatedOrder);
        })
        .catch(next);
}

module.exports = {
    getOrders,
    createOrder,
    getOrder,
    subscribe,
};
