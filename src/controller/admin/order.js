const Order = require("../../models/order");

exports.updateOrder = (req, res) => {
	Order.updateOne(
		{
			_id: req.body.orderId,
			"orderStatus.type": req.body.type,
		},
		{
			$set: {
				"orderStatus.$": [
					{
						date: new Date(),
						type: req.body.type,
						isCompleted: true,
					},
				],
			},
		}
	).exec((error, order) => {
		if (error) return res.status(400).json({ error });
		if (order) res.status(201).json({ order });
	});
};

exports.getCustomerOrders = async (req, res) => {
	const orders = await Order.find({})
		.populate({ path: "items.productId", select: "_id name" })
		.populate({ path: "user", select: "_id firstName lastName" })
		.exec();
	res.status(200).json({ orders });
};
