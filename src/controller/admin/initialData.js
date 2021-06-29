const Category = require("../../models/category");
const Product = require("../../models/product");
const Order = require("../../models/order");
const Page = require("../../models/page");

// Following is a recursive function to cover all the categories along with their sub-categories
const createCategories = (categories, parentId = null) => {
	const categoryList = [];
	let category;

	if (parentId == null) {
		category = categories.filter((cat) => cat.parentId == undefined);
	} else {
		category = categories.filter((cat) => cat.parentId == parentId);
	}

	for (let cat of category) {
		categoryList.push({
			_id: cat._id,
			name: cat.name,
			slug: cat.slug,
			parentId: cat.parentId,
			type: cat.type,
			children: createCategories(categories, cat._id),
		});
	}

	return categoryList;
};

exports.initialData = async (req, res) => {
	const categories = await Category.find({}).exec();

	const products = await Product.find({})
		.select(
			"_id name price quantity slug description productPictures category"
		)
		.populate({ path: "category", select: "_id name" })
		.exec();

	const orders = await Order.find({})
		.populate({ path: "items.productId", select: "_id name" })
		.populate({ path: "user", select: "_id firstName lastName" })
		.exec();

	const pages = await Page.find({})
		.select("_id title description banners products category")
		.populate({ path: "category", select: "_id name" })
		.exec();

	res.status(200).json({
		categories: createCategories(categories),
		products,
		orders,
		pages,
	});
};
