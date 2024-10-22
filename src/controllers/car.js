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




// const getDashboardAnalytics = async (req, res) => {
//   try {
//     const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();
//     const getLastWeeksDate = () => {
//       const now = new Date();
//       return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
//     };

//     const getCarsReport = async (carsByYears) => {
//       return [...new Array(12)].map(
//         (_, i) =>
//           carsByYears.filter(
//             (v) =>
//               new Date(v.createdAt).getMonth() + 1 === i + 1 &&
//               v.sellstatus === "sold"
//           ).length
//       );
//     };

//     const getIncomeReport = async (prop, carsByYears) => {
//       const now = new Date();
//       const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

//       const newData = carsByYears.filter((item) => {
//         const itemDate = new Date(item.createdAt);
//         if (prop === "year") {
//           return itemDate.getFullYear() === now.getFullYear();
//         } else if (prop === "week") {
//           return itemDate >= getLastWeeksDate() && itemDate < now;
//         } else { // month
//           return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
//         }
//       });

//       const result = await Promise.all(
//         newData.map(async (car) => {
//           const expenses = await Expense.find({ car: car._id });
//           const totalExpenses = expenses.reduce(
//             (sum, expense) => sum + expense.amount,
//             0
//           );
//           return {
//             ...car.toObject(),
//             netIncome: Number(car.price) - totalExpenses,
//             createdAt: car.createdAt,
//           };
//         })
//       );

//       const getDayData = (date, data) =>
//         data
//           .filter((v) => {
//             const vDate = new Date(v.createdAt);
//             return vDate.getDate() === date.getDate() &&
//                    vDate.getMonth() === date.getMonth() &&
//                    vDate.getFullYear() === date.getFullYear();
//           })
//           .reduce((sum, a) => sum + a.netIncome, 0);

//       if (prop === "week") {
//         return [...new Array(7)].map((_, i) => {
//           const date = new Date(startOfToday);
//           date.setDate(date.getDate() - 6 + i);
//           return Number(getDayData(date, result).toFixed(2));
//         });
//       } else if (prop === "year") {
//         return [...new Array(12)].map((_, i) =>
//           Number(result
//             .filter((v) => new Date(v.createdAt).getMonth() === i)
//             .reduce((sum, a) => sum + a.netIncome, 0)
//             .toFixed(2))
//         );
//       } else { // month
//         const daysInMonth = getDaysInMonth(now.getMonth() + 1, now.getFullYear());
//         return [...new Array(daysInMonth)].map((_, i) => {
//           const date = new Date(now.getFullYear(), now.getMonth(), i + 1);
//           return Number(getDayData(date, result).toFixed(2));
//         });
//       }
//     };

//     const totalUsers = await User.countDocuments({ role: "user" });
//     const totalBrands = await Brand.countDocuments();
//     const totalCategories = await Category.countDocuments();
//     const totalAvailableCars = await Car.countDocuments({
//       sellstatus: "avaliable",
//     });

//     const lastYearDate = new Date();
//     lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);
//     const todayDate = new Date();
//     const carsByYears = await Car.find({
//       createdAt: { $gt: lastYearDate, $lt: todayDate },
//     }).select(["createdAt", "sellstatus", "price"]);

//     // Calculate data for today
//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);
//     const todayEnd = new Date();
//     todayEnd.setHours(23, 59, 59, 999);

//     // Get cars sold today and calculate daily earning
//     const todaysSoldCars = await Car.find({
//       sellstatus: "sold",
//       soldDate: { $gte: todayStart, $lte: todayEnd }
//     });

//     const dailyEarning = todaysSoldCars.reduce(
//       (sum, car) => sum + Number(car.price),
//       0
//     );

//     // Calculate total expenses for today
//     const todayExpenses = await Expense.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: todayStart, $lte: todayEnd }
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: "$amount" }
//         }
//       }
//     ]);

//     const dailyExpenses = todayExpenses[0]?.total || 0;

//     // Calculate daily net income
//     const dailyNetIncome = Number((dailyEarning - dailyExpenses).toFixed(2));

//     // Calculate total sold cars and net income for all sold cars
//     const soldCars = await Car.find({ sellstatus: "sold" });
//     const totalSoldCars = soldCars.length;

//     let netIncomeSoldCars = 0;
//     await Promise.all(
//       soldCars.map(async (car) => {
//         const expenses = await Expense.find({ car: car._id });
//         const totalExpenses = expenses.reduce(
//           (sum, expense) => sum + expense.amount,
//           0
//         );
//         netIncomeSoldCars += Number(car.price) - totalExpenses;
//       })
//     );

//     const bestSellingCars = await Car.find({ sellstatus: "sold" })
//       .sort({ createdAt: -1 })
//       .limit(5);

//     // Calculate total revenue and expenses (all-time)
//     const totalRevenue = await Car.aggregate([
//       { $match: { sellstatus: "sold" } },
//       { $group: { _id: null, total: { $sum: "$price" } } },
//     ]);

//     const totalExpenses = await Expense.aggregate([
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);

//     // Calculate net earnings (all-time)
//     const netEarnings = Number(((totalRevenue[0]?.total || 0) - (totalExpenses[0]?.total || 0)).toFixed(2));

//     const data = {
//       salesReport: await getCarsReport(carsByYears),
//       bestSellingCars: bestSellingCars,
//       carsReport: ["avaliable", "reserved", "sold"].map(
//         (sellstatus) =>
//           carsByYears.filter((v) => v.sellstatus === sellstatus).length
//       ),
//       incomeReport: {
//         week: await getIncomeReport("week", carsByYears),
//         month: await getIncomeReport("month", carsByYears),
//         year: await getIncomeReport("year", carsByYears),
//       },
//       totalExpenses: totalExpenses[0]?.total || 0,
//       totalRevenue: totalRevenue[0]?.total || 0,
//       netEarnings: netEarnings,
//       netIncome: dailyNetIncome,
//       totalUsers,
//       totalBrands,
//       totalCategories,
//       totalAvailableCars,
//       totalSoldCars: totalSoldCars,
//       netIncomeSoldCars: Number(netIncomeSoldCars.toFixed(2)),
//       totalReservedCars: await Car.countDocuments({ sellstatus: "reserved" }),
//       dailyCars: todaysSoldCars.length,
//       dailyEarning: dailyEarning,
//       dailyExpenses: dailyExpenses,
//     };

//     res.status(200).json({ success: true, data: data });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };


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

    const getIncomeReport = async (prop) => {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(startOfToday);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      let startDate, endDate, groupBy;

      if (prop === "week") {
        startDate = startOfWeek;
        endDate = now;
        groupBy = { $dayOfWeek: "$soldDate" };
      } else if (prop === "year") {
        startDate = startOfYear;
        endDate = now;
        groupBy = { $month: "$soldDate" };
      } else { // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = now;
        groupBy = { $dayOfMonth: "$soldDate" };
      }

      const soldCarsData = await Car.aggregate([
        {
          $match: {
            sellstatus: "sold",
            soldDate: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $lookup: {
            from: "expenses",
            localField: "_id",
            foreignField: "car",
            as: "expenses"
          }
        },
        {
          $addFields: {
            netIncome: {
              $subtract: [
                "$price",
                { $sum: "$expenses.amount" }
              ]
            }
          }
        },
        {
          $group: {
            _id: groupBy,
            totalNetIncome: { $sum: "$netIncome" }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      let result;
      if (prop === "week") {
        result = new Array(7).fill(0);
      } else if (prop === "year") {
        result = new Array(12).fill(0);
      } else { // month
        result = new Array(getDaysInMonth(now.getMonth() + 1, now.getFullYear())).fill(0);
      }

      soldCarsData.forEach(item => {
        const index = prop === "week" ? item._id - 1 : item._id - 1;
        result[index] += item.totalNetIncome;
      });

      return result.map(value => Number(value.toFixed(2)));
    };

    const totalUsers = await User.countDocuments({ role: "user" });
    const totalBrands = await Brand.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalAvailableCars = await Car.countDocuments({
      sellstatus: "avaliable",
    });

    const lastYearDate = new Date();
    lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);
    const todayDate = new Date();
    const carsByYears = await Car.find({
      createdAt: { $gt: lastYearDate, $lt: todayDate },
    }).select(["createdAt", "sellstatus", "price"]);

    // Calculate data for today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Get cars sold today and calculate daily earning
    const todaysSoldCars = await Car.find({
      sellstatus: "sold",
      soldDate: { $gte: todayStart, $lte: todayEnd }
    });

    const dailyEarning = todaysSoldCars.reduce(
      (sum, car) => sum + Number(car.price),
      0
    );

    // Calculate total expenses for today
    const todayExpenses = await Expense.aggregate([
      {
        $match: {
          createdAt: { $gte: todayStart, $lte: todayEnd }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    const dailyExpenses = todayExpenses[0]?.total || 0;

    // Calculate daily net income
    const dailyNetIncome = Number((dailyEarning - dailyExpenses).toFixed(2));

    // Calculate total sold cars and net income for all sold cars
    const soldCars = await Car.find({ sellstatus: "sold" });
    const totalSoldCars = soldCars.length;

    const totalSoldCarsIncome = await Car.aggregate([
      { $match: { sellstatus: "sold" } },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);

    const totalSoldCarsExpenses = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const netIncomeSoldCars = Number((
      (totalSoldCarsIncome[0]?.total || 0) - (totalSoldCarsExpenses[0]?.total || 0)
    ).toFixed(2));

    const bestSellingCars = await Car.find({ sellstatus: "sold" })
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate total revenue and expenses (all-time)
    const totalRevenue = totalSoldCarsIncome[0]?.total || 0;
    const totalExpenses = totalSoldCarsExpenses[0]?.total || 0;

    // Calculate net earnings (all-time)
    const netEarnings = Number((totalRevenue - totalExpenses).toFixed(2));

    const data = {
      salesReport: await getCarsReport(carsByYears),
      bestSellingCars: bestSellingCars,
      carsReport: ["avaliable", "reserved", "sold"].map(
        (sellstatus) =>
          carsByYears.filter((v) => v.sellstatus === sellstatus).length
      ),
      incomeReport: {
        week: await getIncomeReport("week"),
        month: await getIncomeReport("month"),
        year: await getIncomeReport("year"),
      },
      totalExpenses: totalExpenses,
      totalRevenue: totalRevenue,
      netEarnings: netEarnings,
      netIncome: dailyNetIncome,
      totalUsers,
      totalBrands,
      totalCategories,
      totalAvailableCars,
      totalSoldCars: totalSoldCars,
      netIncomeSoldCars: netIncomeSoldCars,
      totalReservedCars: await Car.countDocuments({ sellstatus: "reserved" }),
      dailyCars: todaysSoldCars.length,
      dailyEarning: dailyEarning,
      dailyExpenses: dailyExpenses,
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

    const updateSellstatus = async () => {
      await Car.updateMany({}, { $set: { sellstatus: "avaliable" } });
    };

   await updateSellstatus();


    
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
    // const admin = await getAdmin(req, res);

    // if (!admin) {
    //   res
    //     .status(500)
    //     .json({ success: false, message: "Only Admin can update Car" });
    // }

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




const getFilters= async(reqt, res)=> {
  try {
   
    // Fetch categories with count
    const categoriesWithCount = await Car.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'categoryInfo' } },
      { $unwind: '$categoryInfo' },
      { $project: { name: '$categoryInfo.name', slug: '$categoryInfo.slug', count: 1 } }
    ]);

    // Fetch brands with count
    const brandsWithCount = await Car.aggregate([
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $lookup: { from: 'brands', localField: '_id', foreignField: '_id', as: 'brandInfo' } },
      { $unwind: '$brandInfo' },
      { $project: { name: '$brandInfo.name', slug: '$brandInfo.slug', count: 1 } }
    ]);

    // Fetch models with count
    const modelsWithCount = await Car.aggregate([
      { $group: { _id: '$model', count: { $sum: 1 } } },
      { $lookup: { from: 'models', localField: '_id', foreignField: '_id', as: 'modelInfo' } },
      { $unwind: '$modelInfo' },
      { $project: { name: '$modelInfo.name', slug: '$modelInfo.slug', brand: '$modelInfo.brand', count: 1 } }
    ]);

    // Fetch colors with count
    const colorsWithCount = await Car.aggregate([
      { $group: { _id: '$color', count: { $sum: 1 } } },
      { $project: { color: '$_id', count: 1, _id: 0 } }
    ]);

    // Fetch fuel types with count
    const fuelTypesWithCount = await Car.aggregate([
      { $group: { _id: '$fueltype', count: { $sum: 1 } } },
      { $project: { fuelType: '$_id', count: 1, _id: 0 } }
    ]);

    // Fetch and sort years
    // const years = await Car.distinct('year');
    // years.sort((a, b) => a - b);
    const yearsWithCount = await Car.aggregate([
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $project: { year: '$_id', count: 1, _id: 0 } },
      { $sort: { year: 1 } }
    ]);

    // Fetch price range
    const priceRange = await Car.aggregate([
      { $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } },
      { $project: { _id: 0, min: 1, max: 1 } }
    ]);

    // Fetch and sort mileage range
    const mileageRange = await Car.aggregate([
      { $group: { _id: null, min: { $min: '$millege' }, max: { $max: '$millege' } } },
      { $project: { _id: 0, min: 1, max: 1 } }
    ]);

    // Fetch distinct mileage values and sort them
    const mileages = await Car.distinct('millege');
    mileages.sort((a, b) => a - b);


       // Fetch seats with count
       const seatsWithCount = await Car.aggregate([
        { $group: { _id: '$seats', count: { $sum: 1 } } },
        { $project: { seats: '$_id', count: 1, _id: 0 } },
        { $sort: { seats: 1 } }
      ]);
  
      // Fetch doors with count
      const doorsWithCount = await Car.aggregate([
        { $group: { _id: '$doors', count: { $sum: 1 } } },
        { $project: { doors: '$_id', count: 1, _id: 0 } },
        { $sort: { doors: 1 } }
      ]);


        // Fetch car types with count
    const typesWithCount = await Car.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $project: { type: '$_id', count: 1, _id: 0 } }
    ]);


    const response = {
      categories: categoriesWithCount,
      brands: brandsWithCount,
      models: modelsWithCount,
      colors: colorsWithCount,
      fuelTypes: fuelTypesWithCount,
      years:yearsWithCount,
      prices: priceRange[0] || { min: 1, max: 100000000 },
      mileageRange: mileageRange[0] || { min: 0, max: 1000000 },
      millege:mileages,
      types: typesWithCount,
      seats: Object.fromEntries(seatsWithCount.map(item => [item.seats, item.count])),
      doors: Object.fromEntries(doorsWithCount.map(item => [item.doors, item.count])),
    };

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error('Error in getFilters:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}




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
    delete newQuery.carTypes
    delete newQuery.mileage

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
    if (query.carTypes) {
      if (typeof query.carTypes === "string") {
        typeArray = query.carTypes.split("_");
      } else if (Array.isArray(query.carTypes)) {
        typeArray = query.carTypes;
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


    
    let colorArray = [];
    if (query.color) {
      if (typeof query.color === "string") {
        colorArray = query.color.split("_");
      } else if (Array.isArray(query.color)) {
        colorArray = query.color;
      }
    }

 
    let minMileage, maxMileage;
    if (req.query.mileage) {
      [minMileage, maxMileage] = req.query.mileage.split("_").map(Number);
      if (isNaN(maxMileage)) {
        maxMileage = Infinity;
      }
    }

console.log(minMileage ,maxMileage ,req.query.mileage ,req.query)
    let minYear, maxYear;
    // if (query.year) {
    //   [minYear, maxYear] = query.year.split("_").map(Number);
    // }
    if (query.year) {
      [minYear, maxYear] = query.year.split("_").map(Number);
      if (!maxYear) {
        maxYear = new Date().getFullYear() + 1;
      }
    }
    
    else {
      minYear = 20000;
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
      ...(colorArray.length > 0 && { color: { $in: colorArray } }), // Added color filter
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

      ...(req.query.mileage && {
        millege: {
          $gte: minMileage || 0,
          $lte: maxMileage || Infinity,
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


