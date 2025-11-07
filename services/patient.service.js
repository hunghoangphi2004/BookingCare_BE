const User = require('../models/user.model');
const Patient = require('../models/patient.model');
const bcrypt = require('bcryptjs');
const AppError = require("../utils/appError.util")


module.exports.getAllPatient = async (filters = {}, page = 1, limit = 10) => {
  let find = {};

  if (filters.keyword) {
    find.$or = [
      { firstName: { $regex: filters.keyword, $options: "i" } },
      { lastName: { $regex: filters.keyword, $options: "i" } },
      { phoneNumber: { $regex: filters.keyword, $options: "i" } },
    ];
  }

  page = Math.max(1, parseInt(page) || 1);
  limit = Math.max(1, parseInt(limit) || 10);
  const skip = (page - 1) * limit;

  const total = await Patient.countDocuments(find);
  const patients = await Patient.find(find)
    .populate({
      path: "userId",
      select: "email role isActive",
      match: { isDeleted: false }
    })
    .skip(limit === 0 ? 0 : skip)
    .limit(limit === 0 ? 0 : limit)
    .sort({ createdAt: -1 })
    .lean();

  const filteredPatients = patients.filter(p => p.userId !== null);

  return {
    data: filteredPatients,
    pagination: {
      total: filteredPatients.length,
      page,
      limit,
      totalPages: limit === 0 ? 1 : Math.ceil(filteredPatients.length / limit),
    },
  };
};

module.exports.createPatient = async (data) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
      thumbnail,
      emergencyContact
    } = data;

    const existingUser = await User.findOne({ email, isDeleted: false });
    if (existingUser) {
      throw new AppError('Email này đã tồn tại trong hệ thống');
    }

    const hashedPassword = await bcrypt.hash(password || '123456', 10);

    const user = new User({
      email,
      password: hashedPassword,
      role: 'patient'
    });
    await user.save();

    const patient = new Patient({
      userId: user._id,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
      thumbnail,
      emergencyContact: {
        name: emergencyContact?.name || "",
        phone: emergencyContact?.phone || "",
        relationship: emergencyContact?.relationship || ""
      }
    });

    await patient.save();

    return {
      message: 'Tạo tài khoản bệnh nhân thành công',
      user,
      patient
    };

  } catch (error) {
    throw new AppError(error.message);
  }
};

module.exports.editPatient = async (patientId, body, userId) => {
  try {
    const {
      email,
      password,
      isActive,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
      thumbnail,
      emergencyContact
    } = body;

    const patient = await Patient.findOne({ _id: patientId })
    const user = await User.findOne({ _id: patient.userId }).select("-tokens")

    const existingUser = await User.findOne({ _id: { $ne: user._id }, email: email, isDeleted: false });
    if (existingUser) {
      throw new AppError('Email này đã tồn tại trong hệ thống');
    }

    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (isActive) user.isActive = isActive;
    if (firstName) patient.firstName = firstName;
    if (lastName) patient.lastName = lastName;
    if (phoneNumber) patient.phoneNumber = phoneNumber;
    if (dateOfBirth) patient.dateOfBirth = dateOfBirth;
    if (gender) patient.gender = gender;
    if (address) patient.address = address;
    if (thumbnail) patient.thumbnail = thumbnail;
    if (emergencyContact) patient.emergencyContact = emergencyContact;

    await user.save();
    await patient.save();
    console.log(user, patient)

    return {
      user,
      patient
    }
  } catch (error) {
    throw new AppError(error.message);
  }
};


module.exports.deletePatient = async (patientId, userId) => {
  try {
    const patient = await Patient.findOne({ _id: patientId })

    if (!patient) {
      throw new AppError("Không tìm thấy bệnh nhân", 404)
    }
    const user = await User.findOne({ _id: patient.userId }).select("-tokens")

    if (!user) {
      throw new AppError("Không tìm thấy tài khoản liên kết bệnh nhân", 404)
    }

    if (user.isDeleted) {
      throw new AppError("Tài khoản này đã bị xóa trước đó", 400);
    }

    user.isDeleted = true;
    await user.save();

    return {
      message: "Xoá bệnh nhân thành công"
    }
  } catch (error) {
    throw new AppError(error.message);
  }
};

module.exports.changeStatus = async (patientId, status, userId) => {
  try {

    const patient = await Patient.findOne({ _id: patientId })

    if (!patient) {
      throw new AppError("Không tìm thấy bệnh nhân", 404)
    }
    const user = await User.findOne({ _id: patient.userId }).select("-tokens")


    if (!user) {
      throw new AppError("Không tìm thấy tài khoản liên kết bệnh nhân", 404)
    }


    const isActive = (status === true || status === "true") ? true : false;
    user.isActive = isActive
    await user.save();

    return {
      message: "Sửa trạng thái bệnh nhân thành công"
    }
  } catch (error) {
    throw new AppError(error.message);
  }
};

module.exports.getPatientById = async (patientId, userId) => {
  try {

    const patient = await Patient.findOne({ _id: patientId }).select("-createdAt -updatedAt -__v")

    if (!patient) {
      throw new AppError("Không tìm thấy bệnh nhân", 404)
    }
    const user = await User.findOne({ _id: patient.userId }).select("-tokens -createdAt -updatedAt -__v")

    if (!user) {
      throw new AppError("Không tìm thấy tài khoản liên kết bệnh nhân", 404)
    }

    return {
      patient: patient,
      user: user
    }
  } catch (error) {
    throw new AppError(error.message);
  }
};
