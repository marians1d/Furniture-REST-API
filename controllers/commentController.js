const { userModel, orderModel, commentModel } = require('../models');

function newComment(text, userId, orderId) {
    return commentModel.create({ text, userId, orderId })
        .then(comment => {
            return Promise.all([
                userModel.updateOne({ _id: userId }, { $push: { comments: comment._id }, $addToSet: { orders: orderId } }),
                orderModel.findByIdAndUpdate({ _id: orderId }, { $push: { comments: comment._id }, $addToSet: { subscribers: userId } }, { new: true })
            ]);
        });
}

function getLatestsComments(req, res, next) {
    const limit = Number(req.query.limit) || 0;

    commentModel.find()
        .sort({ created_at: -1 })
        .limit(limit)
        .populate('orderId userId')
        .then(comments => {
            res.status(200).json(comments);
        })
        .catch(next);
}

function createComment(req, res, next) {
    const { orderId } = req.params;
    const { _id: userId } = req.user;
    const { commentText } = req.body;

    newComment(commentText, userId, orderId)
        .then(([_, updatedOrder]) => res.status(200).json(updatedOrder))
        .catch(next);
}

function editComment(req, res, next) {
    const { commentId } = req.params;
    const { commentText } = req.body;
    const { _id: userId } = req.user;

    // if the userId is not the same as this one of the comment, the comment will not be updated
    commentModel.findOneAndUpdate({ _id: commentId, userId }, { text: commentText }, { new: true })
        .then(updatedComment => {
            if (updatedComment) {
                res.status(200).json(updatedComment);
            }
            else {
                res.status(401).json({ message: 'Not allowed!' });
            }
        })
        .catch(next);
}

function deleteComment(req, res, next) {
    const { commentId, orderId } = req.params;
    const { _id: userId } = req.user;

    Promise.all([
        commentModel.findOneAndDelete({ _id: commentId, userId }),
        userModel.findOneAndUpdate({ _id: userId }, { $pull: { comments: commentId } }),
        orderModel.findOneAndUpdate({ _id: orderId }, { $pull: { comments: commentId } }),
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
    getLatestsComments,
    newComment,
    createComment,
    editComment,
    deleteComment
};
