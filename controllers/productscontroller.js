const Product = require("../model/productModel");
const ErrorHandler = require("../utils/errosHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

// Create Product -- Admin
module.exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    product: product,
  });
});

// Get All Product
module.exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  // const resultPerPage = 8;
  // const productsCount = await Product.countDocuments();
  // const allProducts = await Product.find();
  // const apiFeature = new ApiFeatures(allProducts, req.query)
  // .search()
  // .filter();
  // let products = await apiFeature.query;
  // console.log(products);
  // let filteredProductsCount = await products.length;
  // apiFeature.pagination(resultPerPage);
  // products = await apiFeature.query;
  // res.status(200).json({
  //   success: true,
  //   products,
  //   productsCount,
  //   resultPerPage,
  //   apiFeature,
  //   filteredProductsCount,
  // });

  // const resultPerPage = 8;
  // const productsCount = await Product.countDocuments();
  // const apiFeatures = new ApiFeatures(Product.find(), req.query)
  // .search()
  // .filter()
  // .pagination(resultPerPage);
  // console.log(apiFeatures);
  // const products = await apiFeatures.query;
  // let filteredProductsCount = await products.length;

  // res.status(200).json({
  //   success: true,
  //   products,
  //   productsCount,
  //   resultPerPage,
  //   // apiFeatures,
  //   filteredProductsCount
  // });

  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeature = await new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  let products = await apiFeature.query;

  const filteredProductsCount = products.length;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// Get All Product(ADMIN)
module.exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});

// Update Product --Admin
module.exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Images Start Here
  let image = [];

  if (typeof req.body.image === "string") {
    image.push(req.body.image);
  } else {
    image = req.body.image;
  }

  if (image !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.image.length; i++) {
      await cloudinary.v2.uploader.destroy(product.image[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < image.length; i++) {
      const result = await cloudinary.v2.uploader.upload(image[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.image = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// delete product
module.exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  } else {
    product = await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      product: product,
    });
  }
});

// get product details

module.exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

// Create New Review or Update the review

module.exports.createProductReview = catchAsyncErrors(
  async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
      user: req.user._id,
      name: req.body.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);
    const isReviewed = product.review.find(
      (res) => res.user.toString() === req.user._id.toString()
    );
    if (isReviewed) {
      product.review.forEach((res) => {
        if (res.user.toString() === req.user._id.toString()) {
          (res.rating = rating), (res.comment = comment);
        }
      });
    } else {
      product.review.push(review);
      product.numOfReviews = product.review.length;
    }
    let avg = 0;
    product.rating =
      product.review.map((res) => {
        return (avg += res.rating);
      }) / product.review.length;
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
  }
);

// Get All Reviews of a product
module.exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query._id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.review,
  });
});
// Delete review

module.exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  const isReviewed = product.review.find(
    (res) => res.user.toString() === req.user._id
  );
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  const reviews = product.review.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  const ratings = avg / reviews.length;
  const numOfReviews = reviews.length;
  await product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
  });
});
