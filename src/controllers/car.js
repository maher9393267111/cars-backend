const Car = require("../models/car");

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
      return res
        .status(500)
        .json({
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
      return res
        .status(500)
        .json({
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
    ).sort(
      sortOption
      //  {  createdAt: -1, }
    ).populate([
        {
          path: "category",
          select: ["name", "_id"],
        },
        {
          path: "brand",
          select: ["_id", "name"],
        },
      ]);
    
      console.log("cars-->" , sizes)

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
    })
      .sort({
        createdAt: -1,
      })
   
      ;

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
    const car = await Car.findOne({ slug })
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

    res.status(201).json({ success: true, message: "Car Deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
};
