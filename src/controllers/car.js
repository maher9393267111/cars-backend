const Car = require("../models/car");
const Category = require("../models/Category");
const Brand = require("../models/Brand");

const {
  getAdmin,
  getVendor,
  getAdminOrVendor,
  getUser,
} = require("../config/getUser");
const {
  multiFilesDelete,
  singleFileDelete,
} = require("../config/digitalOceanFunctions");

const createCar = async (req, res) => {
  try {
    // const admin = await getAdmin(req, res);
    const admin = await getAdmin(req, res);

    if (!admin) {
      res.status(500).json({
        success: false,
        message: "Only admin and vendor can add Car",
      });
    }

    const { ...others } = req.body;

    const newCar = await Car.create({
      ...others,

      vendor: admin._id,
      likes: 0,
    });

    res
      .status(201)
      .json({ success: true, data: newCar, message: "Car Created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllCarsWithoutPagination = async (req, res) => {
  try {
    const vendor = await getAdmin(req, res);

    if (!vendor) {
      return res.status(500).json({
        success: false,
        message: "Only vendor and admin can fetch Cars",
      });
    }

    const Cars = await Car.find({ vendor: vendor?._id }).sort({
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      data: Cars,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// in CITIES TABLE PAGINATION FILTER

const getAllCars = async (req, res) => {
  try {
    const vendor = await getAdmin(req, res);

    if (!vendor) {
      return res.status(500).json({
        success: false,
        message: "Only vendor and admin can fetch city",
      });
    }

    const { limit = 10, page = 1, search = "", sort = "" } = req.query;

    let sortOption = {};

    // Determine sorting logic based on the sort parameter
    if (sort === "Name A-Z") {
      sortOption = { name: 1 }; // Ascending
    } else if (sort === "Name Z-A") {
      sortOption = { name: -1 }; // Descending
    } else if (sort === "New") {
      sortOption = { createdAt: -1 }; // Sort by creation date, newest first
    } else if (sort === "Old") {
      sortOption = { createdAt: 1 }; // Sort by creation date, oldest first
    } else if (sort === "orderold") {
      sortOption = { order: 1 }; // Sort by creation date, oldest first
    } else if (sort === "ordernew") {
      sortOption = { order: -1 }; // Sort by creation date, oldest first
    } else if (sort === "") {
      sortOption = { createdAt: -1 }; // Sort by creation date, oldest first
    }

    const skip = parseInt(limit) || 10;
    const totalSizes = await Car.find({
      name: { $regex: search, $options: "i" },
      // vendor: vendor._id,
    });
    const sizes = await Car.find(
      {
        name: { $regex: search, $options: "i" },
        // vendor: vendor._id,
      },
      null,
      {
        skip: skip * (parseInt(page) - 1 || 0),
        limit: skip,
      }
    )
      .sort(
        sortOption
        //  {  createdAt: -1, }
      )
      .populate([
        {
          path: "category",
          select: ["name", "_id"],
        },
        {
          path: "brand",
          select: ["_id", "name"],
        },
      ]);

    console.log("cars-->", sizes);

    res.status(201).json({
      success: true,
      data: sizes,
      count: Math.ceil(totalSizes.length / skip),
    });
  } catch (error) {
    console.log(error?.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

//ALL  CarType without pagination or filter

const getCars = async (req, res) => {
  try {
    const cities = await Car.find({
      // vendor: vendor._id,
    }).sort({
      createdAt: -1,
    });

    res.status(201).json({
      success: true,
      data: cities,
    });
  } catch (error) {
    console.log(error?.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

const getCarBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const car = await Car.findOne({ slug });
    // .populate([
    //   {
    //     path: "category",
    //     select: ["name", "_id"],
    //   },
    //   {
    //     path: "brand",
    //     select: ["_id", "name"],
    //   },
    // ]);

    if (!car) {
      return res.status(404).json({ message: "Car Not Found" });
    }

    res.status(201).json({
      success: true,
      data: car,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCarBySlug = async (req, res) => {
  try {
    const admin = await getAdmin(req, res);

    if (!admin) {
      res
        .status(500)
        .json({ success: false, message: "Only Admin can update Car" });
    }

    const { slug } = req.params;
    const { ...others } = req.body;

    console.log("SLUIGG-->", slug);

    const updatedSize = await Car.findOneAndUpdate(
      { slug },
      {
        ...others,
      },
      {
        new: true,
        // runValidators: true,
      }
    );

    if (!updatedSize) {
      return res.status(404).json({ message: "Car Not Found" });
    }

    res
      .status(201)
      .json({ success: true, data: updatedSize, message: "Car Updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCarBySlug = async (req, res) => {
  try {
    const admin = await getAdmin(req, res);

    if (!admin) {
      res
        .status(500)
        .json({ success: false, message: "Only admin can delete Car" });
    }

    const { slug } = req.params;
    const car = await Car.findOne({ slug });

    if (!car) {
      return res.status(404).json({ message: "Car Not Found" });
    }

    if (car && car?.cover) {
      await singleFileDelete(car?.cover?._id);
    }

    if (car && car?.images && car?.images.length > 0) {
      await multiFilesDelete(car.images);
    }

    await car.deleteOne({ slug });

    res
      .status(201)
      .json({ success: true, message: "Car Deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// FIlters here

const getFiltersByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Fetch category data
    const categoryData = await Category.findOne({ slug: category }).select([
      "_id",
      "name",
    ]);
    if (!categoryData) {
      return res
        .status(404)
        .json({ success: false, message: "Category Not Found" });
    }

    // Fetch cars for the category under the specified shop
    const cars = await Car.find({
      // status: { $ne: 'disabled' },
      category: categoryData._id,
    }).select(["brand"]); // Only select brand

    // Extract unique brands
    const brands = [...new Set(cars.map((car) => car.brand))].filter(Boolean); // Clean brands
    console.log("brands-->", brands);

    // Construct the response object for category and brands
    const response = {
      category: categoryData, // Include category details
      brands,
    };

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFilters = async (req, res) => {
  try {
    // Fetch categories (assuming you have a Category model)
    const categories = await Category.find({
      status: { $ne: "disabled" },
    }).select(["name", "slug"]); // Adjust the fields according to your Category schema

    // Fetch brands
    const brands = await Brand.find({
      status: { $ne: "disabled" },
    }).select(["name", "slug"]);

    // Construct the response object for brands and categories
    const response = {
      brands,
      categories,
      prices: [1, 100000000],
    };

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// const getCarsFilter = async (req, res) => {
//   try {
//     const query = req.query; // Extract query params from request

//     var newQuery = { ...query };
//     delete newQuery.page;
//     delete newQuery.limit;
//     delete newQuery.prices;
//     delete newQuery.sizes;
//     delete newQuery.colors;
//     delete newQuery.name;
//     delete newQuery.date;
//     delete newQuery.price;
//     delete newQuery.top;
//     delete newQuery.brand;
//     delete newQuery.rate;
//     delete newQuery.gender;
//     delete newQuery.seats;
//     for (const [key, value] of Object.entries(newQuery)) {
//       newQuery = { ...newQuery, [key]: value.split("_") };
//     }

//     const brand = await Brand.findOne({
//       slug: query.brand,
//     }).select("slug");

//     let categoryIds = [];
//     if (query.categories && query.categories.length > 0) {
//       const categorySlugs = query.categories.split("_"); // Split categories by '_'

//       // Fetch the category IDs based on the slugs
//       const categories = await Category.find({
//         slug: { $in: categorySlugs },
//       }).select("_id");
//       categoryIds = categories.map((category) => category._id);
//     }

//     const skip = Number(query.limit) || 12;
//     const totalProducts = await Car.countDocuments({
//       ...newQuery,
//       ...(Boolean(query.brand) && { brand: brand._id }),
//       ...(categoryIds.length > 0 && { category: { $in: categoryIds } }), // Use the obtained category IDs
//       //  ...(query.seats?.length > 0 && { seats: { $in: query.seats.split('_').map(Number) } }),
//       //  ...(query.seats && { seats: { $in: query.seats.split('_') } }),
//       // ...(query.colors && { colors: { $in: query.colors.split('_') } }),
//       price: {
//         $gt: query.prices ? Number(query.prices.split("_")[0]) : 1,
//         $lt: query.prices ? Number(query.prices.split("_")[1]) : 1000000,
//       },

//       //status: { $ne: 'disabled' },
//     }).select([""]);

//     const minPrice = query.prices ? Number(query.prices.split("_")[0]) : 1;
//     const maxPrice = query.prices
//       ? Number(query.prices.split("_")[1])
//       : 10000000;

//     console.log("new-->", query.seats.split("_").map(Number));

//     const products = await Car.aggregate([
//       {
//         $lookup: {
//           from: "productreviews",
//           localField: "reviews",
//           foreignField: "_id",
//           as: "reviews",
//         },
//       },
//       {
//         $addFields: {
//           averageRating: { $avg: "$reviews.rating" },
//           image: { $arrayElemAt: ["$images", 0] },
//         },
//       },

//       {
//         $match: {
//           ...(Boolean(query.brand) && {
//             brand: brand._id,
//           }),

//           ...(query.categories && {
//             category: { $in: categoryIds },
//           }),

//           ...(query.isFeatured && {
//             isFeatured: Boolean(query.isFeatured),
//           }),

//           ...(query.gender && {
//             gender: { $in: query.gender.split("_") },
//           }),
//           ...(query.sizes && {
//             sizes: { $in: query.sizes.split("_") },
//           }),

//           // ...(query?.seats && {
//           //   seats: { $in: query.seats.split('_').map(Number) },
//           // }),

//           ...(query.colors && {
//             colors: { $in: query.colors.split("_") },
//           }),
//           ...(query.prices && {
//             price: {
//               $gt: minPrice,
//               $lt: maxPrice,
//             },
//           }),
//           // status: { $ne: 'disabled' },
//         },
//       },
//       {
//         $project: {
//           image: { url: "$image.url", blurDataURL: "$image.blurDataURL" },
//           name: 1,
//           available: 1,
//           slug: 1,
//           colors: 1,
//           discount: 1,
//           likes: 1,
//           priceSale: 1,
//           price: 1,
//           averageRating: 1,
//           vendor: 1,

//           createdAt: 1,
//         },
//       },
//       {
//         $sort: {
//           ...((query.date && { createdAt: Number(query.date) }) ||
//             (query.price && {
//               priceSale: Number(query.price),
//             }) ||
//             (query.name && { name: Number(query.name) }) ||
//             (query.top && { averageRating: Number(query.top) }) || {
//               averageRating: -1,
//             }),
//         },
//       },
//       {
//         $skip: Number(skip * parseInt(query.page ? query.page[0] - 1 : 0)),
//       },
//       {
//         $limit: Number(skip),
//       },
//     ]);

//     res.status(200).json({
//       success: true,
//       data: products,
//       total: totalProducts,
//       count: Math.ceil(totalProducts / skip),
//     });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

const getCarsFilter = async (req, res) => {
  try {
    const query = req.query; // Extract query params from request

    var newQuery = { ...query };
    delete newQuery.page;
    delete newQuery.limit;
    delete newQuery.prices;
    delete newQuery.sizes;
    delete newQuery.colors;
    delete newQuery.name;
    delete newQuery.date;
    delete newQuery.price;
    delete newQuery.top;
    delete newQuery.brand;
    delete newQuery.rate;
    delete newQuery.gender;
    delete newQuery.seats;
    delete newQuery.doors;
    delete newQuery.fuelTypes;
    //type automatically added to query object
    delete newQuery.type;

    for (const [key, value] of Object.entries(newQuery)) {
      if (typeof value === 'string') {
        newQuery[key] = value.split("_");
      }
    }

    const brand = await Brand.findOne({
      slug: query.brand,
    }).select("slug");

    let categoryIds = [];
    if (query.categories && query.categories.length > 0) {
      const categorySlugs = query.categories.split("_"); // Split categories by '_'

      // Fetch the category IDs based on the slugs
      const categories = await Category.find({
        slug: { $in: categorySlugs },
      }).select("_id");
      categoryIds = categories.map((category) => category._id);
    }


        // Handle query.seats properly
        let seatsArray = [];
        if (query.seats) {
          if (typeof query.seats === 'string') {
            seatsArray = query.seats.split("_").map(Number); // Convert to array of numbers
          } else if (Array.isArray(query.seats)) {
            seatsArray = query.seats.map(Number); // If it's already an array
          }
        }
        //handle query.doors properly
        let doorsArray = [];
        if (query.doors) {
          if (typeof query.doors === 'string') {
            doorsArray = query.doors.split("_").map(Number); // Convert to array of numbers
          } else if (Array.isArray(query.doors)) {
            doorsArray = query.doors.map(Number); // If it's already an array
          }
        }
        
        // add fueltypes is string with split - and convert to array of strings and search for it in fueltypes array

        let fuelTypesArray = [];
        if (query.fuelTypes) {
          if (typeof query.fuelTypes === 'string') {
            fuelTypesArray = query.fuelTypes.split("_"); // Convert to array of strings
            } else if (Array.isArray(query.fuelTypes)) {
            fuelTypesArray = query.fuelTypes; // If it's already an array
          }
        }

        //type is added to query object
        let typeArray = [];
        if (query.type) {
          if (typeof query.type === 'string') {
            typeArray = query.type.split("_"); // Convert to array of strings
          } else if (Array.isArray(query.type)) {
            typeArray = query.type; // If it's already an array
          }
        }



    const skip = Number(query.limit) || 12;
    const totalProducts = await Car.countDocuments({
      ...newQuery,
      ...(Boolean(query.brand) && { brand: brand._id }),
      ...(categoryIds.length > 0 && { category: { $in: categoryIds } }),
      ...(seatsArray.length > 0 && { seats: { $in: seatsArray } }), 
       ...(doorsArray.length > 0 && { doors: { $in: doorsArray } }),
       //fueltypes is added here
       ...(fuelTypesArray.length > 0 && { fueltype: { $in: fuelTypesArray } }),
       //type is added here
       ...(typeArray.length > 0 && { type: { $in: typeArray } }),
      price: {
        $gt: query.prices ? Number(query.prices.split("_")[0]) : 1,
        $lt: query.prices ? Number(query.prices.split("_")[1]) : 1000000,
      },
    }).select([""]);

    const minPrice = query.prices ? Number(query.prices.split("_")[0]) : 1;
    const maxPrice = query.prices ? Number(query.prices.split("_")[1]) : 10000000;

    const products = await Car.aggregate([
      {
        $lookup: {
          from: "productreviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" },
          image: { $arrayElemAt: ["$images", 0] },
        },
      },
      {
        $match: {
          ...(Boolean(query.brand) && { brand: brand._id }),
          ...(query.categories && { category: { $in: categoryIds } }),
          ...(query.isFeatured && { isFeatured: Boolean(query.isFeatured) }),
          ...(query.gender && { gender: { $in: query.gender.split("_") } }),
          ...(query.sizes && { sizes: { $in: query.sizes.split("_") } }),
          ...(seatsArray.length > 0 && { seats: { $in: seatsArray } }), 
           ...(doorsArray.length > 0 && { doors: { $in: doorsArray } }),
       ...(fuelTypesArray.length > 0 && { fueltype: { $in: fuelTypesArray } }),
         ...(typeArray.length > 0 && { type: { $in: typeArray } }),

          ...(query.colors && { colors: { $in: query.colors.split("_") } }),
          ...(query.prices && {
            price: {
              $gt: minPrice,
              $lt: maxPrice,
            },
          }),
        },
      },
      {
        $project: {
         // image: { url: "$image.url", blurDataURL: "$image.blurDataURL" },
          image: { url: "$cover.url", blurDataURL: "$cover.blurDataURL" },

          name: 1,
          available: 1,
          slug: 1,
          colors: 1,
          discount: 1,
          likes: 1,
          priceSale: 1,
          price: 1,
          averageRating: 1,
          vendor: 1,
          createdAt: 1,
        },
      },
      {
        $sort: {
          ...((query.date && { createdAt: Number(query.date) }) ||
            (query.price && { priceSale: Number(query.price) }) ||
            (query.name && { name: Number(query.name) }) ||
            (query.top && { averageRating: Number(query.top) }) || {
              averageRating: -1,
            }),
        },
      },
      {
        $skip: Number(skip * parseInt(query.page ? query.page[0] - 1 : 0)),
      },
      {
        $limit: Number(skip),
      },
    ]);

    res.status(200).json({
      success: true,
      data: products,
      total: totalProducts,
      count: Math.ceil(totalProducts / skip),
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  createCar,
  getAllCars,
  getCarBySlug,
  updateCarBySlug,
  deleteCarBySlug,
  getCars,
  getAllCarsWithoutPagination,
  //filters routs
  getFiltersByCategory,
  getFilters,
  getCarsFilter,
};
