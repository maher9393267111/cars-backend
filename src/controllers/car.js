const Car = require("../models/car");
const Category = require("../models/Category");
const Brand = require("../models/Brand");
const Model = require("../models/model");
const User = require("../models/User");
const Expense = require("../models/exoense");

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



const getDashboardAnalytics = async (req, res) => {
  try {
    const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();
    const getLastWeeksDate = () => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    };

    const getCarsReport = async (carsByYears) => {
      return [...new Array(12)].map(
        (_, i) =>
          carsByYears.filter(
            (v) =>
              new Date(v.createdAt).getMonth() + 1 === i + 1 &&
              v.sellstatus === "sold"
          ).length
      );
    };

    const getIncomeReport = async (prop, carsByYears) => {
      const newData = carsByYears.filter((item) =>
        prop === "year"
          ? true
          : prop === "week"
          ? new Date(item.createdAt).getMonth() === new Date().getMonth() &&
            new Date(item.createdAt).getTime() > getLastWeeksDate().getTime()
          : new Date(item.createdAt).getMonth() === new Date().getMonth()
      );

      const result = await Promise.all(
        newData.map(async (car) => {
          const expenses = await Expense.find({ car: car._id });
          const totalExpenses = expenses.reduce(
            (sum, expense) => sum + expense.amount,
            0
          );
          return {
            ...car.toObject(),
            netIncome: car.price - totalExpenses,
          };
        })
      );

      const getDayData = (date, data) =>
        data
          .filter((v) => new Date(v.createdAt).getDate() === date)
          .reduce((sum, a) => sum + Number(a.netIncome), 0);

      if (prop === "week") {
        return [...new Array(7)].map((_, i) =>
          getDayData(getLastWeeksDate().getDate() + i, result)
        );
      } else if (prop === "year") {
        return [...new Array(12)].map((_, i) =>
          result
            .filter((v) => new Date(v.createdAt).getMonth() === i)
            .reduce((sum, a) => sum + Number(a.netIncome), 0)
        );
      } else {
        return [
          ...new Array(
            getDaysInMonth(new Date().getMonth() + 1, new Date().getFullYear())
          ),
        ].map((_, i) => getDayData(i + 1, result));
      }
    };

    const totalUsers = await User.countDocuments({ role: "user" });
    const totalBrands = await Brand.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalAvailableCars = await Car.countDocuments({
      sellstatus: "available",
    });

    const lastYearDate = new Date();
    lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);
    const todayDate = new Date();
    const carsByYears = await Car.find({
      createdAt: { $gt: lastYearDate, $lt: todayDate },
    }).select(["createdAt", "sellstatus", "price"]);

    // Fetch cars sold today
    const todaysCars = await Car.find({
      soldDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    });

    // Calculate total sold cars and net income for sold cars
    const soldCars = await Car.find({ sellstatus: "sold" });
    const totalSoldCars = soldCars.length;

    let netIncomeSoldCars = 0;
    await Promise.all(
      soldCars.map(async (car) => {
        const expenses = await Expense.find({ car: car._id });
        const totalExpenses = expenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );
        netIncomeSoldCars += car.price - totalExpenses;
      })
    );

    const bestSellingCars = await Car.find({ sellstatus: "sold" })
      .sort({ createdAt: -1 })
      .limit(5);

    const totalExpenses = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const dailyEarning = todaysCars.reduce(
      (partialSum, car) => partialSum + Number(car.price),
      0
    );

    // Calculate total revenue from all sold cars
    const totalRevenue = await Car.aggregate([
      { $match: { sellstatus: "sold" } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    // Calculate net earnings
    const netEarnings =
      (totalRevenue[0]?.total || 0) - (totalExpenses[0]?.total || 0);

    const data = {
      salesReport: await getCarsReport(carsByYears),
      bestSellingCars: bestSellingCars,
      carsReport: ["available", "reserved", "sold"].map(
        (sellstatus) =>
          carsByYears.filter((v) => v.sellstatus === sellstatus).length
      ),
      incomeReport: {
        week: await getIncomeReport("week", carsByYears),
        month: await getIncomeReport("month", carsByYears),
        year: await getIncomeReport("year", carsByYears),
      },
      totalExpenses: totalExpenses[0]?.total || 0,
      totalRevenue: totalRevenue[0]?.total || 0,
      netEarnings: netEarnings,
      netIncome: dailyEarning - (totalExpenses[0]?.total || 0),
      totalUsers,
      totalBrands,
      totalCategories,
      totalAvailableCars,
      totalSoldCars: totalSoldCars, // Total sold cars
      netIncomeSoldCars: netIncomeSoldCars, // Net income from sold cars
      totalReservedCars: await Car.countDocuments({ sellstatus: "reserved" }), // Total reserved cars
      dailyCars: todaysCars.length,
      dailyEarning: dailyEarning,
    };

    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getHomepageCars = async (req, res) => {
  try {
    const homepageCars = await Car.find({ ishome: true })
      .limit(6)
      .sort({ createdAt: -1 })
      .populate([
        {
          path: "category",
          select: ["name", "_id"],
        },
        {
          path: "brand",
          select: ["_id", "name", "logo"],
        },
      ]);

    res.status(200).json({
      success: true,
      data: homepageCars,
    });
  } catch (error) {
    console.error("Error fetching homepage cars:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

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
    const Cars = await Car.find({}).sort({
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

// const getCarBySlug = async (req, res) => {
//   try {
//     const { slug } = req.params;
//     const { client } = req.query;

//     const car = await Car.findOne({ slug })
//     .populate([
//       {
//         path: "category",
//         select: ["name", "_id"],
//       },
//       {
//         path: "brand",
//         select: ["_id", "name"],
//       },

//       {
//         path: "model",
//         select: ["_id", "name"],
//       },
//     ]);

//     if (!car) {
//       return res.status(404).json({ message: "Car Not Found" });
//     }

//     console.log("car-->", car);
//     res.status(201).json({
//       success: true,
//       data: car,
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

const getCarBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { client } = req.query;

    let query = Car.findOne({ slug });

    if (client === "true") {
      query = query.populate([
        {
          path: "category",
          select: ["name", "_id"],
        },
        {
          path: "brand",
          select: ["_id", "name"],
        },
        {
          path: "model",
          select: ["_id", "name"],
        },
      ]);
    }

    const car = await query.exec();

    if (!car) {
      return res.status(404).json({ message: "Car Not Found" });
    }

    console.log("car-->", car);
    res.status(200).json({
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

    if (req.body.sellstatus && req.body.sellstatus === "sold") {
      req.body.soldDate = new Date(); // Set soldDate when car is marked as sold
    }

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
      //  status: { $ne: "disabled" },
    }).select(["name", "slug"]); // Adjust the fields according to your Category schema

    // Fetch brands
    const brands = await Brand.find({
      //   status: { $ne: "disabled" },
    }).select(["name", "slug"]);

    const models = await Model.find({
      //   status: { $ne: "disabled" },
    }).select(["name", "slug", "_id", "brand"]);

    // Construct the response object for brands and categories
    const response = {
      brands,
      categories,
      models,
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
//     delete newQuery.doors;
//     delete newQuery.fuelTypes;
//     delete newQuery.bodytypes;
//     //type automatically added to query object
//     delete newQuery.type;
//     delete newQuery.ishome;
//     delete newQuery.models;
//     delete newQuery.year;

//     for (const [key, value] of Object.entries(newQuery)) {
//       if (typeof value === "string") {
//         newQuery[key] = value.split("_");
//       }
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

//     let modelIds = [];
//     if (query.models && query.models.length > 0) {
//       const modelSlugs = query.models.split("_"); // Split categories by '_'

//       // Fetch the category IDs based on the slugs
//       const models = await Model.find({
//         slug: { $in: modelSlugs },
//       }).select("_id");
//       modelIds = models.map((model) => model._id);
//     }

//     // Handle query.seats properly
//     let seatsArray = [];
//     if (query.seats) {
//       if (typeof query.seats === "string") {
//         seatsArray = query.seats.split("_").map(Number); // Convert to array of numbers
//       } else if (Array.isArray(query.seats)) {
//         seatsArray = query.seats.map(Number); // If it's already an array
//       }
//     }
//     //handle query.doors properly
//     let doorsArray = [];
//     if (query.doors) {
//       if (typeof query.doors === "string") {
//         doorsArray = query.doors.split("_").map(Number); // Convert to array of numbers
//       } else if (Array.isArray(query.doors)) {
//         doorsArray = query.doors.map(Number); // If it's already an array
//       }
//     }

//     // add fueltypes is string with split - and convert to array of strings and search for it in fueltypes array

//     let fuelTypesArray = [];
//     if (query.fuelTypes) {
//       if (typeof query.fuelTypes === "string") {
//         fuelTypesArray = query.fuelTypes.split("_"); // Convert to array of strings
//       } else if (Array.isArray(query.fuelTypes)) {
//         fuelTypesArray = query.fuelTypes; // If it's already an array
//       }
//     }

//     //type is added to query object
//     let typeArray = [];
//     if (query.type) {
//       if (typeof query.type === "string") {
//         typeArray = query.type.split("_"); // Convert to array of strings
//       } else if (Array.isArray(query.type)) {
//         typeArray = query.type; // If it's already an array
//       }
//     }

//     //bodytype is added to query object
//     let bodytypeArray = [];
//     if (query.bodytypes) {
//       if (typeof query.bodytypes === "string") {
//         bodytypeArray = query.bodytypes.split("_"); // Convert to array of strings
//       } else if (Array.isArray(query.bodytypes)) {
//         bodytypeArray = query.bodytypes; // If it's already an array
//       }
//     }

//     let minYear, maxYear;
//     if (query.year) {
//       [minYear, maxYear] = query.year.split("_").map(Number);
//     } else {
//       minYear = 1900; // Set a reasonable minimum year
//       maxYear = new Date().getFullYear() + 1; // Current year + 1 for upcoming models
//     }

//     // console.log("isHomXXXX-->", query.year, minYear, maxYear, newQuery);

//    // const skip = Number(query.limit) || 12;
//    const limit = Number(query.limit) || 12;
//    const page = Number(query.page) || 1;
//    const skip = (page - 1) * limit;


//     const totalProducts = await Car.countDocuments({
//       ...newQuery,
//       ...(Boolean(query.brand) && { brand: brand._id }),
//       ...(categoryIds.length > 0 && { category: { $in: categoryIds } }),
//       ...(modelIds.length > 0 && { model: { $in: modelIds } }),
//       ...(seatsArray.length > 0 && { seats: { $in: seatsArray } }),
//       ...(doorsArray.length > 0 && { doors: { $in: doorsArray } }),
//       //fueltypes is added here
//       ...(fuelTypesArray.length > 0 && { fueltype: { $in: fuelTypesArray } }),
//       //bodytype is added here
//       ...(bodytypeArray.length > 0 && { bodytype: { $in: bodytypeArray } }),
//       //type is added here
//       ...(typeArray.length > 0 && { type: { $in: typeArray } }),
//       //ishome is added here
//       ...(query.ishome && { ishome: Boolean(query.ishome) }),
//       price: {
//         $gt: query.prices ? Number(query.prices.split("_")[0]) : 1,
//         $lt: query.prices ? Number(query.prices.split("_")[1]) : 1000000,
//       },
//       year: {
//         $gte: minYear,
//         $lte: maxYear,
//       },
//     }).select([""]);

//     const minPrice = query.prices ? Number(query.prices.split("_")[0]) : 1;
//     const maxPrice = query.prices
//       ? Number(query.prices.split("_")[1])
//       : 10000000;

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
//         $lookup: {
//           from: "brands", // Name of the brands collection
//           localField: "brand", // Field in Car schema
//           foreignField: "_id", // Field in brands collection
//           as: "brandDetails", // Output field for brand details
//         },
//       },

//       {
//         $lookup: {
//           from: "categories", // Name of the categories collection
//           localField: "category", // Field in Car schema
//           foreignField: "_id", // Field in categories collection
//           as: "categoryDetails", // Output field for category details
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
//           ...(Boolean(query.brand) && { brand: brand._id }),
//           ...(query.categories && { category: { $in: categoryIds } }),
//           ...(modelIds.length > 0 && { model: { $in: modelIds } }),

//           ...(query.isFeatured && { isFeatured: Boolean(query.isFeatured) }),
//           ...(query.gender && { gender: { $in: query.gender.split("_") } }),
//           ...(query.sizes && { sizes: { $in: query.sizes.split("_") } }),
//           ...(seatsArray.length > 0 && { seats: { $in: seatsArray } }),
//           ...(doorsArray.length > 0 && { doors: { $in: doorsArray } }),
//           ...(fuelTypesArray.length > 0 && {
//             fueltype: { $in: fuelTypesArray },
//           }),
//           ...(typeArray.length > 0 && { type: { $in: typeArray } }),
//           ...(bodytypeArray.length > 0 && { bodytype: { $in: bodytypeArray } }),
//           ...(query.ishome && { ishome: Boolean(query.ishome) }),

//           ...(query.colors && { colors: { $in: query.colors.split("_") } }),
//           ...(query.prices && {
//             price: {
//               $gt: minPrice,
//               $lt: maxPrice,
//             },
//           }),

//           year: {
//             $gte: minYear,
//             $lte: maxYear,
//           },
//         },
//       },
//       {
//         $project: {
//           // image: { url: "$image.url", blurDataURL: "$image.blurDataURL" },
//           image: { url: "$cover.url", blurDataURL: "$cover.blurDataURL" },

//           images: 1,

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
//           seats: 1,
//           doors: 1,
//           fueltype: 1,
//           tags: 1,

//           type: 1,
//           year: 1,

//           // populate brand and category
//           brand: { $arrayElemAt: ["$brandDetails", 0] }, // Include the first brand detail
//           category: { $arrayElemAt: ["$categoryDetails", 0] }, // Include the first category detail
//         },
//       },
//       {
//         $sort: {
//           ...((query.date && { createdAt: Number(query.date) }) ||
//             (query.price && { priceSale: Number(query.price) }) ||
//             (query.name && { name: Number(query.name) }) ||
//             (query.top && { averageRating: Number(query.top) }) || {
//               averageRating: -1,
//             }),
//         },
//       },
//       // {
//       //   $skip: Number(skip * parseInt(query.page ? query.page[0] - 1 : 0)),
//       // },
//       // {
//       //   $limit: Number(skip),
//       // },
//       {
//         $skip: skip,
//       },
//       {
//         $limit: limit,
//       },
//     ]);

//     console.log("isHomXXXX-->", products?.length , totalProducts);

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
    const query = req.query;

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
    delete newQuery.bodytypes;
    delete newQuery.type;
    delete newQuery.ishome;
    delete newQuery.models;
    delete newQuery.year;

    for (const [key, value] of Object.entries(newQuery)) {
      if (typeof value === "string") {
        newQuery[key] = value.split("_");
      }
    }

    let brand;
    if (query.brand) {
      brand = await Brand.findOne({ slug: query.brand }).select("_id");
    }

    let categoryIds = [];
    if (query.categories && query.categories.length > 0) {
      const categorySlugs = query.categories.split("_");
      const categories = await Category.find({ slug: { $in: categorySlugs } }).select("_id");
      categoryIds = categories.map((category) => category._id);
    }

    let modelIds = [];
    if (query.models && query.models.length > 0) {
      const modelSlugs = query.models.split("_");
      const models = await Model.find({ slug: { $in: modelSlugs } }).select("_id");
      modelIds = models.map((model) => model._id);
    }

    let seatsArray = [];
    if (query.seats) {
      if (typeof query.seats === "string") {
        seatsArray = query.seats.split("_").map(Number);
      } else if (Array.isArray(query.seats)) {
        seatsArray = query.seats.map(Number);
      }
    }

    let doorsArray = [];
    if (query.doors) {
      if (typeof query.doors === "string") {
        doorsArray = query.doors.split("_").map(Number);
      } else if (Array.isArray(query.doors)) {
        doorsArray = query.doors.map(Number);
      }
    }

    let fuelTypesArray = [];
    if (query.fuelTypes) {
      if (typeof query.fuelTypes === "string") {
        fuelTypesArray = query.fuelTypes.split("_");
      } else if (Array.isArray(query.fuelTypes)) {
        fuelTypesArray = query.fuelTypes;
      }
    }

    let typeArray = [];
    if (query.type) {
      if (typeof query.type === "string") {
        typeArray = query.type.split("_");
      } else if (Array.isArray(query.type)) {
        typeArray = query.type;
      }
    }

    let bodytypeArray = [];
    if (query.bodytypes) {
      if (typeof query.bodytypes === "string") {
        bodytypeArray = query.bodytypes.split("_");
      } else if (Array.isArray(query.bodytypes)) {
        bodytypeArray = query.bodytypes;
      }
    }

    let minYear, maxYear;
    if (query.year) {
      [minYear, maxYear] = query.year.split("_").map(Number);
    } else {
      minYear = 1900;
      maxYear = new Date().getFullYear() + 1;
    }

    const limit = Number(query.limit) || 12;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * limit;

    const filter = {
      ...(Boolean(query.brand) && { brand: brand?._id }),
      ...(categoryIds.length > 0 && { category: { $in: categoryIds } }),
      ...(modelIds.length > 0 && { model: { $in: modelIds } }),
      ...(seatsArray.length > 0 && { seats: { $in: seatsArray } }),
      ...(doorsArray.length > 0 && { doors: { $in: doorsArray } }),
      ...(fuelTypesArray.length > 0 && { fueltype: { $in: fuelTypesArray } }),
      ...(bodytypeArray.length > 0 && { bodytype: { $in: bodytypeArray } }),
      ...(typeArray.length > 0 && { type: { $in: typeArray } }),
      ...(query.ishome && { ishome: Boolean(query.ishome) }),
      ...(query.prices && {
        price: {
          $gt: query.prices ? Number(query.prices.split("_")[0]) : 1,
          $lt: query.prices ? Number(query.prices.split("_")[1]) : 1000000,
        },
      }),
      ...(query.year && {
        year: {
          $gte: minYear,
          $lte: maxYear,
        },
      }),
    };

    const totalProducts = await Car.countDocuments(filter);

    const products = await Car.find(filter)
      .populate({
        path: "reviews",
        select: "rating",
      })
      .populate({
        path: "brand",
        select: "slug name logo ",
      })
      .populate({
        path: "category",
        select: "slug name",
      })
      .sort({
        ...(query.date && { createdAt: Number(query.date) }),
        ...(query.price && { priceSale: Number(query.price) }),
        ...(query.name && { name: Number(query.name) }),
        ...(query.top && { averageRating: Number(query.top) }),
      })
      .skip(skip)
      .limit(limit);

    // Calculate average rating for each product
    const productsWithAverageRating = products.map((product) => ({
      ...product.toObject(),
      averageRating: product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length,
    }));

    res.status(200).json({
      success: true,
      data: productsWithAverageRating,
      total: totalProducts,
      count: Math.ceil(totalProducts / limit), // Use limit instead of skip
    });
  } catch (error) {
    console.error(error);
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
  getHomepageCars,
  getDashboardAnalytics,
};
