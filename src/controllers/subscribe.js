const Stripe = require("stripe");
const User = require("../models/User"); // Adjust path as needed
const SubscribePlan = require("../models/subscribePlan"); // Adjust path as needed

const {
  getUser,
  getAdmin,
  getVendor,
  getAdminOrVendor,
} = require("../config/getUser");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// --------CRUD--------

const createSubscribePlan = async (req, res) => {
  try {
    const admin = await getAdmin(req, res);

    if (!admin) {
      res
        .status(500)
        .json({ success: false, message: "Only admin can add SubscribePlan" });
    }

    const { ...others } = req.body;

    console.log("DATA CREATE", others);

    const newBoiler = await SubscribePlan.create({
      ...others,
      vendor: admin._id,
    });

    res
      .status(201)
      .json({
        success: true,
        data: newBoiler,
        message: "SubscribePlan Created",
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSubscribePlanBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const size = await SubscribePlan.findOne({ slug });

    if (!size) {
      return res.status(404).json({ message: "SubscribePlan Not Found" });
    }

    console.log("deeeeeeDA", size);

    res.status(201).json({
      success: true,
      data: size,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateSubscribePlanBySlug = async (req, res) => {
  try {
    const admin = await getAdmin(req, res);

    if (!admin) {
      res
        .status(500)
        .json({
          success: false,
          message: "Only Admin can update SubscribePlan",
        });
    }

    const { slug } = req.params;
    const { ...others } = req.body;

    console.log("SLUIGG-->", slug);

    const updatedSize = await SubscribePlan.findOneAndUpdate(
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
      return res.status(404).json({ message: "SubscribePlan Not Found" });
    }

    res
      .status(201)
      .json({
        success: true,
        data: updatedSize,
        message: "SubscribePlan Updated",
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSubscribePlanBySlug = async (req, res) => {
  try {
    const admin = await getAdmin(req, res);

    if (!admin) {
      res
        .status(500)
        .json({
          success: false,
          message: "Only admin can delete SubscribePlan",
        });
    }

    const { slug } = req.params;
    const size = await SubscribePlan.findOne({ slug });

    if (!size) {
      return res.status(404).json({ message: "SubscribePlan Not Found" });
    }
    // Uncomment the line below if you have a function to delete the logo file
    // const dataaa = await singleFileDelete(brand?.logo?._id);

    await SubscribePlan.deleteOne({ slug });

    res.status(201).json({ success: true, message: "SubscribePlan Deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllSubscribePlan = async (req, res) => {
  try {
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
    const totalSizes = await SubscribePlan.find({
      name: { $regex: search, $options: "i" },
      //   vendor: vendor._id,
    });
    const sizes = await SubscribePlan.find(
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
      
    ).populate({
          path: "permissions",
          select: ["name" ,"_id"],
      })
    console.log("🔶️🔷️🔶️🔷️🔶️🔷️🔶️🔷️🔶️🔷️🔶️🔷️", sizes);

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





// --------VENDOR FUNCTIONS-----
const createCheckoutSession = async (req, res) => {
  const { userStripeId, plan, billingCycle } = req.body;

  const priceMap = {
    gold: {
      yearly: "price_1Q5WUBF5haJ9Do96iz7SZ2UN",
      monthly: "price_1Q5SWTF5haJ9Do9621qaufRS",
      // monthly: process.env.PRICE_GOLD_MONTHLY,
      // yearly: process.env.PRICE_GOLD_YEARLY,
    },
    silver: {
      monthly: process.env.PRICE_SILVER_MONTHLY,
      yearly: process.env.PRICE_SILVER_YEARLY,
    },
    starter: {
      monthly: process.env.PRICE_STARTER_MONTHLY,
      yearly: process.env.PRICE_STARTER_YEARLY,
    },
  };

  const priceId = priceMap[plan.toLowerCase()]?.[billingCycle.toLowerCase()];

  if (!userStripeId || !priceId) {
    return res.status(400).json({ error: "Invalid user or plan." });
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      success_url: `http://localhost:3000/test/sub/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/test/sub/cancel`,
      customer: userStripeId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription", // This will create a subscription
    });

    return res.status(200).json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return res.status(500).json({ error: "Error creating checkout session." });
  }
};

// after payment success update user subscibe plan

const updateSubscription = async (req, res) => {
  const { sessionId } = req.body;

  try {
    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Retrieve the subscription using the subscription ID from the session
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription
    );

    const startDate = new Date(subscription.current_period_start * 1000);
    const endDate = new Date(subscription.current_period_end * 1000);

    const customerId = session.customer;

    // Retrieve the first subscription item
    const subscriptionItem = subscription.items.data[0];
    const planId = subscriptionItem.plan.id;

    // Fetch plan details
    const planDetails = await stripe.plans.retrieve(planId);
    const productDetails = await stripe.products.retrieve(planDetails.product);

    // Extract necessary details
    const planName = productDetails.name || "Default Plan Name";
    const billingInterval = `${planDetails.interval_count} ${planDetails.interval}`; // e.g., "1 month"

    console.log("SESSION >>>>>><<<<", planName, billingInterval);

    const user = await User.findOne({ stripeCustomerId: customerId });

    if (user) {
      user.subscription = {
        plan: planName, // or any other field you want
        startDate: startDate,
        endDate: endDate,
        isActive: true,
        period:billingInterval

      };
      await user.save();
    }

    //  console.log("SESSION >>>>>><<<<" ,user)

    res.status(200).json({ message: "Subscription updated successfully." });
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(500).json({ error: "Error updating subscription." });
  }
};


// const updateSubscription = async (req, res) => {
//   const { sessionId } = req.body;
//   try {
//     // Retrieve the checkout session
//     const session = await stripe.checkout.sessions.retrieve(sessionId);
    
//     // Retrieve the subscription using the subscription ID from the session
//     const subscription = await stripe.subscriptions.retrieve(session.subscription);
    
//     const startDate = new Date(subscription.current_period_start * 1000);
//     const endDate = new Date(subscription.current_period_end * 1000);
    
//     const customerId = session.customer;
    
//     // Retrieve the first subscription item
//     const subscriptionItem = subscription.items.data[0];
//     const planId = subscriptionItem.plan.id;

//     // Fetch plan details
//     const planDetails = await stripe.plans.retrieve(planId);
//     const productDetails = await stripe.products.retrieve(planDetails.product);

//     // Extract necessary details
//     const planName = productDetails.name || "Default Plan Name";
//     const billingInterval = `${planDetails.interval_count}${planDetails.interval}`; // e.g., "1 month"

//     console.log("SESSION >>>>>><<<<", planName, billingInterval);

//     // Fetch the user by their Stripe customer ID
//     const user = await User.findOne({ customerId: customerId ,message: "Subscription updated successfully" });

//     if (user) {
//       // Update user's subscription information
//       user.subscription = {
//         plan: planName,
//         startDate: startDate,
//         endDate: endDate,
//         period:billingInterval,
//         isActive: true,
//       };
//       await user.save();
//       console.log("User subscription updated successfully.");
//      res.status(200).json({ message: "Subscription updated successfully." });

//     } else {
//       console.error("User not found with customerId:", customerId);
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Error updating subscription." });
//     console.error("Error updating subscription:", error);
//     throw new Error("Error updating subscription.");
   

//   }
// };

//delete subscription

const cancelSubscription = async (req, res) => {
  const admin = await getUser(req, res);

  if (!admin) {
    res
      .status(500)
      .json({ success: false, message: "Only admin can add Addons Category" });
  }

  const userId = admin?._id;

  try {
    // Find the user in your database
    const user = await User.findById(userId);

    if (!user || !user.stripeCustomerId) {
      return res
        .status(404)
        .json({ error: "User not found or no Stripe account associated." });
    }

    // Retrieve subscriptions for the user
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: "active",
    });

    console.log("user?>>?>?>", subscriptions);

    // Cancel all active subscriptions
    const cancelPromises = subscriptions?.data.map(async (subscription) => {
      console.log("Cancelling subscription with ID:", subscription.id);
      return await stripe.subscriptions.cancel(subscription.id);
    });

    await Promise.all(cancelPromises);

    // Optionally, update user subscription status in your database
    user.subscription.isActive = false; // Set subscription to inactive
    user.subscription.plane = "free";
    await user.save();

    res.status(200).json({ message: "Subscription cancelled successfully." });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    res.status(500).json({ error: "Error cancelling subscription." });
  }
};

module.exports = {
  createCheckoutSession,
  updateSubscription,
  cancelSubscription,
  createSubscribePlan,
  updateSubscribePlanBySlug,
  deleteSubscribePlanBySlug,
  getAllSubscribePlan,
  getSubscribePlanBySlug
};
