const Page = require("../../models/page")

exports.createPage = (req, res) => {
    const { banners, products } = req.files;

    if (banners && banners.length > 0) {
        req.body.banners = banners.map(banner => ({
            img : `/public/${banner.filename}`,
            navigateTo : `/bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`
        }))
    }
    
    if (products && products.length > 0) {
        req.body.products = products.map(product => ({
            img : `/public/${product.filename}`,
            navigateTo : `/productClicked?categoryId=${req.body.category}&type=${req.body.type}`
        }))
    }

    req.body.createdBy = req.user._id;

    Page.findOne({ category : req.body.category })
    .exec((error, page) => {
        if (error) return res.status(400).json({ error })
        if (page) {
            Page.findOneAndUpdate({ category : req.body.category }, req.body)
            .exec((error, updatedPage) => {
                if (error) return res.status(400).json({ error })
                if (updatedPage) {
                    return res.status(201).json({ page : updatedPage })
                }
            })
        } else {
            const page = new Page(req.body)            
            page.save((error, newPage) => {
                if (error) return res.status(400).json({ error })
                if (newPage) {
                    return res.status(201).json({ page : newPage })
                }
            })
        }
    })
}

exports.getPage = (req, res) => {
    const { category, type } = req.params;
    
    if (type == "page") {
        Page.findOne({ category : category })
        .exec((error, page) => {
            if (error) return res.status(400).json({ error })
            if (page) return res.status(200).json({ page })
        })
    } else {
        console.log("Type is not equal to Page")
    }
}

exports.getPages = async (req, res) => {
    const pages = await Page.find({})
      .select("_id title description banners products category")
      .populate({ path: "category", select: "_id name" })
      .exec();
  
    res.status(200).json({ pages });
};