// controllers/offer.js
const Offer = require('../models/offer');
const { multiFilesDelete, singleFileDelete } = require('../config/digitalOceanFunctions');

const createOffer = async (req, res) => {
  try {
    const { offers } = req.body;

    if (!offers || !Array.isArray(offers) || offers.length === 0) {
      return res.status(400).json({ success: false, message: "At least one offer is required" });
    }

    const newOffers = await Offer.create({ offers });

    res.status(201).json({ success: true, data: newOffers, message: "Offers Created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'An unknown error occurred' });
  }
};

const getOffers = async (req, res) => {
  try {
    const offers = await Offer.findOne();

    if (!offers) {
      return res.status(404).json({ message: "Offers Not Found" });
    }

    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'An unknown error occurred' });
  }
};

const updateOffers = async (req, res) => {
  try {
    const { offers } = req.body;

    if (!offers || !Array.isArray(offers) || offers.length === 0) {
      return res.status(400).json({ success: false, message: "At least one offer is required" });
    }

    const existingOffers = await Offer.findOne();

    if (!existingOffers) {
      return res.status(404).json({ message: "Offers Not Found" });
    }

    // Find offers to delete
    const offersToDelete = existingOffers.offers.filter(
      existingOffer => !offers.some(newOffer => newOffer._id && newOffer._id.toString() === existingOffer._id.toString())
    );

    // Delete images for removed offers
    const imagesToDelete = offersToDelete
      .map(offer => offer.image && offer.image._id)
      .filter(id => id);

    if (imagesToDelete.length > 0) {
      await multiFilesDelete(imagesToDelete);
    }

    const updatedOffers = await Offer.findOneAndUpdate(
      {},
      { offers },
      { new: true, runValidators: true }
    );

    if (!updatedOffers) {
      return res.status(404).json({ message: "Failed to update offers" });
    }

    res.status(200).json({ success: true, data: updatedOffers, message: "Offers Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'An unknown error occurred' });
  }
};

const deleteOffer = async (req, res) => {
  try {
    const { offerId } = req.params;

    const offers = await Offer.findOne();

    if (!offers) {
      return res.status(404).json({ message: "Offers Not Found" });
    }

    const offerToDelete = offers.offers.id(offerId);

    if (!offerToDelete) {
      return res.status(404).json({ message: "Offer Not Found" });
    }

    // Delete the image associated with the offer
    if (offerToDelete.image && offerToDelete.image._id) {
      await singleFileDelete(offerToDelete.image._id);
    }

    // Remove the offer from the array
    offers.offers = offers.offers.filter(offer => offer._id.toString() !== offerId);

    await offers.save();

    res.status(200).json({ success: true, message: "Offer Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'An unknown error occurred' });
  }
};

module.exports = {
  createOffer,
  getOffers,
  updateOffers,
  deleteOffer,
};