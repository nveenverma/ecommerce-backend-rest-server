const Product = require("../models/product.js");
const slugify = require("slugify")
const Category = require("../models/category");

exports.createProduct = (req, res) => {

    const { name, price, description, category, quantity } = req.body;

    let productPictures = [];
    if (req.files.length > 0) {
        productPictures = req.files.map(file => {
            return ({ img : file.filename })
        })
    }

    const product = new Product({
        name,
        slug : slugify(name),
        price,
        quantity,
        description,
        productPictures,
        category,
        createdBy : req.user._id
    });
    
    product.save((error, product) => {
      if (error) {
        return res.status(400).json({ error })
      }
      if (product) {
        return res.status(201).json({ product })
      }
    })
  }
  
// Function to edit categories
exports.updateProduct = async (req, res) => {

    const { _id, name, price, description, category, quantity } = req.body;

    let productPictures = [];
    if (req.files.length > 0) {
        productPictures = req.files.map(file => {
            return ({ img : file.filename })
        })
    }

    const product = {
        _id, 
        name,
        slug : slugify(name),
        price,
        quantity,
        description,
        productPictures,
        category,
        createdBy : req.user._id
    };

    const updatedProduct = await Product.findOneAndUpdate(
      { _id },
      product,
      { new: true },
      (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data : ", err);
        }
        console.log("Updated Product : ", doc);
      }
    );
      
    return res.status(201).json({ updatedProduct });
}

exports.getProductsBySlug = (req, res) => {
    const { slug } = req.params;
    Category.findOne({ slug: slug })
      .select("_id type")
      .exec((error, category) => {
        if (error) {
          return res.status(400).json({ error });
        }
  
        if (category) {
          Product.find({ category: category._id }).exec((error, products) => {
            if (error) {
              return res.status(400).json({ error });
            }
  
            if (category.type) {
              if (products.length > 0) {
                res.status(200).json({
                  products,
                  priceRange: {
                    budgetFriendly: '40,000',
                    bestSellers: '80,000',
                    premiumRange: '1,50,000',
                  },
                  productsByPrice: {
                    budgetFriendly: products.filter((product) => product.price <= 40000),
                    bestSellers: products.filter(
                      (product) => product.price > 40000 && product.price <= 80000
                    ),
                    premiumRange: products.filter(
                      (product) => product.price > 80000 && product.price <= 150000
                    )
                  },
                });
              }
            } else {
              res.status(200).json({ products });
            }
          });
        }
      });
  };

exports.getDetailsById = (req, res) => {
    const { productId } = req.params;

    if (productId) {
        Product.findOne({ _id : productId })
        .populate({ path: "category", select: "_id name parentId" })
        .exec((error, product) => {
            if (error) return res.status(400).json({ error })
            if (product) res.status(200).json({ product })            
        })
    } else {
        return res.status(400).json({ error : 'Params required' })
    }
}

exports.deleteProductById = (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    Product.deleteOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.getProducts = async (req, res) => {
  const products = await Product.find({})
    .select("_id name price quantity slug description productPictures category")
    .populate({ path: "category", select: "_id name" })
    .exec();

  res.status(200).json({ products });
};