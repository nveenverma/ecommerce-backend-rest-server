const Category = require("../models/category");
const slugify = require("slugify");
const shortid = require("shortid");

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
			type:cat.type,
			children: createCategories(categories, cat._id),
		});
	}

	return categoryList;
};

// Function to Add Categories
exports.addCategory = (req, res) => {
	const categoryObj = {
		name: req.body.name,
		slug: `${slugify(req.body.name)}-${shortid.generate()}`,
	};

	if (req.file) {
		categoryObj.categoryImage =
			"/public/" + req.file.filename;
	}

	if (req.body.parentId) {
		categoryObj.parentId = req.body.parentId;
	}

	const cat = new Category(categoryObj);
	cat.save((error, category) => {
		if (error) {
			return res.status(400).json({ error });
		}
		if (category) {
			return res.status(201).json({ category });
		}
	});
};

// Function to Get the Categories
exports.getCategories = (req, res) => {
	Category.find({}).exec((error, categories) => {
		if (error) {
			return res.status(400).json({ error });
		}
		if (categories) {
			// Return the categroies in a nested formatted format using below function
			const categoryList = createCategories(categories);
			res.status(200).json({ categoryList });
		}
	});
};

// Function to edit categories
exports.updateCategories = async (req, res) => {
	const { _id, name, parentId, type } = req.body;
	const updatedCategories = [];
	if (name instanceof Array) {
		for (let i = 0; i < name.length; i++) {
			const category = {
				name: name[i],
				type: type[i],
			};
			if (parentId[i] !== "") {
				category.parentId = parentId[i];
			}

			const updatedCategory = await Category.findOneAndUpdate(
				{ _id : _id[i]},
				category,
				{ new: true }
			);
			updatedCategories.push(updatedCategory);
		}
		return res.status(201).json({ updatedCategories });
	} else {
		const category = {
			name,
			type,
		};
		if (parentId !== "") {
			category.parentId = parentId;
		}

		const updatedCategory = await Category.findOneAndUpdate(
			{ _id },
			category,
			{ new: true }
		);

		return res.status(201).json({ updatedCategory });
	}
};

// Function to delete categories
exports.deleteCategories = async (req, res) => {

	const { ids } = req.body.payload;
	const deletedCategories = [];

	for (let i=0; i<ids.length; i++) {
		const deletedCategory = await Category.findOneAndDelete({ _id : ids[i]._id })
		deletedCategories.push(deletedCategory);
	}

	if (deletedCategories.length === ids.length) {
		res.status(201).json({ message : "Categories removed" })
	} else {
		res.status(400).json({ message : 'Something went wrong' })
	}
}
