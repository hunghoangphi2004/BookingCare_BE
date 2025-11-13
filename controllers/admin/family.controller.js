const familyService = require('../../services/family.service');
const Family = require('../../models/family.model');

module.exports.getAllFamily = async (req, res, next) => {
  try {
    const { page = 1, limit = 5, ...filters } = req.query;
    const result = await familyService.getAllFamily(filters, parseInt(page), parseInt(limit));
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

module.exports.getFamilyById= async (req, res) => {
  try {
    const id = req.params.id;
    const result = await familyService.getFamilyById(id);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message
      });
    }
  

    res.status(200).json({
      success: true,
      family: result
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
