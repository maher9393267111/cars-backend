const Footer = require('../models/footer');
const { multiFilesDelete, singleFileDelete } = require('../config/digitalOceanFunctions');

//create footer
exports.createFooter = async (req, res) => {
  const footer = new Footer(req.body);
  await footer.save();
  res.status(201).json(footer);
};

//get footer
exports.getFooter = async (req, res) => {
  try {
    const footer = await Footer.findOne();
    res.status(200).json({data:footer , message:"Footer fetched successfully"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update footer
exports.updateFooter = async (req, res) => {
  const {...other} = req.body;
  try {
    const footer = await Footer.findOneAndUpdate({ }, other, { new: true });
    res.status(200).json(footer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 


};
