const { userModel, orderModel, commentModel } = require('../models');

function getOrders(req, res, next) {
    const user = req.user;
    const filter = {};

    if (!user) {
        filter.visibility = 'Public';
    } else if (user.status === 'customer') {
        filter.visibility = 'Public';
    }

    orderModel.find(filter)
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
    const { orderName, description, address } = req.body;
    const { _id: userId } = req.user;

    orderModel.create({ orderName, description, address, userId, providers: [] })
        .then(order => res.status(200).json(order))
        .catch(next);
}

function provide(req, res, next) {
    const orderId = req.params.orderId;
    const { _id: userId } = req.user;
    orderModel.findByIdAndUpdate({ _id: orderId }, { $addToSet: { providers: userId } }, { new: true })
        .then(updatedOrder => {
            res.status(200).json(updatedOrder);
        })
        .catch(next);
}

function updateOrder(req, res, next) {
    const orderId = req.params.orderId;
    const { orderName, description, address } = req.body;
    
    orderModel.findOneAndUpdate({ _id: orderId }, { orderName, description, address }, { runValidators: true, new: true })
    .then(x => { res.status(200).json(x); })
    .catch(next);
}

function deleteOrder(req, res, next) {
    const orderId = req.params.orderId;
    const { _id: userId } = req.user;

    Promise.all([
        orderModel.findOneAndDelete({ _id: orderId, userId }),
        userModel.findOneAndUpdate({ _id: userId }, { $pull: { orders: orderId } }),
        commentModel.deleteMany({ orderId }),
    ])
        .then(([deletedOne, _, __]) => {
            if (deletedOne) {
                res.status(200).json(deletedOne);
            } else {
                res.status(401).json({ message: 'Not allowed!' });
            }
        })
        .catch(next);
}

module.exports = {
    getOrders,
    createOrder,
    getOrder,
    provide,
    updateOrder,
    deleteOrder
};
