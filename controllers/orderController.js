const { userModel, orderModel, commentModel } = require('../models');

function getOrders(req, res, next) {
    const user = req.user;
    const filter = {};

    if (!user) {
        filter.visibility = 'public';
    } else if (user.status === 'customer') {
        filter.visibility = 'public';
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
            path: 'comments',
            populate: {
                path: 'userId'
            }
        })
        .populate('userId')
        .then(order => res.json(order))
        .catch(next);
}

function createOrder(req, res, next) {
    const { orderName, description, address, visibility } = req.body;
    const { _id: userId } = req.user;


    orderModel.create({ orderName, description, address, visibility, userId, providers: [] }).then(order => {
        userModel.findByIdAndUpdate({ _id: userId }, { $push: { orders: order } }).then().catch(next);
        return order;
    }).then(order => res.status(200).json(order))
        .catch(next);
}

function provide(req, res, next) {
    const orderId = req.params.orderId;
    const { _id: userId, status } = req.user;
    const { mesurmentDate } = req.body;

    if (status !== 'provider') {
        res.status(401).json({ message: 'Not allowed!' });
    }

    Promise.all([
        orderModel.findByIdAndUpdate({ _id: orderId }, { mesurmentDate, $addToSet: { providers: userId } }, { new: true }),
        userModel.updateOne({ _id: userId }, { $push: { providing: orderId } }),
    ])
        .then(updatedOrder => {
            res.status(200).json(updatedOrder);
        })
        .catch(next);
}

function updateOrder(req, res, next) {
    const orderId = req.params.orderId;
    const { orderName, description, address, visibility } = req.body;
    const { _id: userId } = req.user;

    orderModel.findOneAndUpdate({ _id: orderId, userId }, { orderName, description, address, visibility }, { runValidators: true, new: true })
    .then(order => {
        if (order) {
            res.status(200).json(order);
        }
        else {
            res.status(401).json({ message: 'Not allowed!' });
        }
    })
    .catch(next);
}

function deleteOrder(req, res, next) {
    const orderId = req.params.orderId;
    const { _id: userId } = req.user;

    Promise.all([
        orderModel.findOneAndDelete({ _id: orderId, userId }),
        userModel.findOneAndUpdate({ _id: userId }, { $pull: { orders: orderId } }),
        commentModel.deleteMany({ orderId: orderId }),
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
