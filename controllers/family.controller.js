const familyService = require('../services/family.service');
const Family = require('../models/family.model');

module.exports.getAllFamily = async (req, res, next) => {
  try {
    const { page = 1, limit = 5, ...filters } = req.query;
    const result = await familyService.getAllFamily(filters, parseInt(page), parseInt(limit));
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

module.exports.createFamily = async (req, res) => {
  try {
    const userId = req.user.id; 
    const data = req.body;

    const result = await familyService.createFamily(data, userId);

    res.status(201).json({
      success: true,
      message: result.message,
      family: result.family
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports.createFamilyByAdmin = async (req, res) => {
  try {
    const userId = req.params.id; 
    const data = req.body;

    const result = await familyService.createFamilyByAdmin(data, userId);

    res.status(201).json({
      success: true,
      message: result.message,
      family: result.family
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
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

module.exports.getFamilyByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await familyService.getFamilyByUserId(userId);

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

module.exports.updateFamily = async (req, res) => {
  try {
    const userId = req.user.id; 
    const result = await familyService.updateFamily(req.body, userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// exports.requestFamilyDoctor = async (req, res) => {
//   try {
//     const userId = req.user.id; 
//     const { doctorId, requestNote } = req.body;

//     const result = await familyService.requestFamilyDoctor(userId, doctorId, requestNote);
//     return res.status(200).json(result);

//   } catch (error) {
//     console.error('Request Family Doctor Error:', error);
//     return res.status(400).json({
//       success: false,
//       message: error.message || 'Lỗi khi gửi yêu cầu bác sĩ gia đình'
//     });
//   }
// };

exports.requestFamilyDoctor = async (req, res) => {
  try {
    const userId = req.user.id;
    const { doctorId, requestNote, schedule } = req.body;

    const result = await familyService.requestFamilyDoctor(userId, doctorId, requestNote, schedule);
    return res.status(200).json(result);

  } catch (error) {
    console.error('Request Family Doctor Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi gửi yêu cầu bác sĩ gia đình'
    });
  }
};