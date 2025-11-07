const mongoose = require('mongoose');
const User = require("../models/user.model")
const Supporter = require("../models/supporter.model")
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError.util")
const Appointment = require("../models/appointment.model");

module.exports.getAllSupporter = async (filters = {}, page = 1, limit = 5) => {
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

  const supporters = await Supporter.find(find)
    .populate({
      path: "userId",
      select: "email role isActive",
      match: { isDeleted: false }
    })
    .skip(limit === 0 ? 0 : skip)
    .limit(limit === 0 ? 0 : limit)
    .sort({ createdAt: -1 })
    .lean();

  const filteredSuppoters = supporters.filter(p => p.userId !== null);

  return {
    data: filteredSuppoters,
    pagination: {
      total: filteredSuppoters.length,
      page,
      limit,
      totalPages: limit === 0 ? 1 : Math.ceil(filteredSuppoters.length / limit),
    },
  };
};

module.exports.createSupporter = async (body) => {
    const { email, name, password, thumbnail, phoneNumber } = body;

    if (!email) {
        throw new AppError("Email là bắt buộc", 400);
    }
    if (!name) {
        throw new AppError("Name là bắt buộc", 400);
    }
    if (!password) {
        throw new AppError("Password là bắt buộc", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError("Email đã tồn tại", 409);
    }

    let newUser = new User();
    newUser.email = email;
    newUser.password = bcrypt.hashSync(password, 8);
    newUser.role = 'supporter';
    newUser.isDeleted = false;
    await newUser.save();

    let newSupporter = new Supporter();
    newSupporter.userId = newUser._id;
    newSupporter.name = name;
    newSupporter.phoneNumber = phoneNumber;
    newSupporter.thumbnail = thumbnail,
    newSupporter.isDeleted = false;

    await newSupporter.save();
    return { newUser, newSupporter }
}

module.exports.editSupporter = async (supporterId, body, userId) => {
  try {
    const {
      email,
      password,
      name,
      phoneNumber,
      thumbnail
    } = body;

    const supporter = await Supporter.findOne({ _id: supporterId })
    if (!supporter) {
      throw new AppError("Không tìm thấy hỗ trợ viên", 404)
    }
    const user = await User.findOne({ _id: supporter.userId }).select("-tokens")
    if (!user) {
      throw new AppError("Không tìm thấy tài khoản liên kết hỗ trợ viên", 404)
    }

    const existingUser = await User.findOne({ _id: { $ne: user._id }, email: email, isDeleted: false });
    if (existingUser) {
      throw new AppError('Email này đã tồn tại trong hệ thống');
    }

    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if(phoneNumber) supporter.phoneNumber = phoneNumber;
    if(name) supporter.name = name;
    if (thumbnail) supporter.thumbnail = thumbnail;

    await user.save();
    await supporter.save();

    return {
      user,
      supporter
    }
  } catch (error) {
    throw new AppError(error.message);
  }
};

module.exports.deleteSupporter = async (supporterId, userId) => {
  try {
    const supporter = await Supporter.findOne({ _id: supporterId })

    if (!supporter) {
      throw new AppError("Không tìm thấy hỗ trợ viên", 404)
    }
    const user = await User.findOne({ _id: supporter.userId }).select("-tokens")

    if (!user) {
      throw new AppError("Không tìm thấy tài khoản liên kết hỗ trợ viên", 404)
    }

    if (user.isDeleted) {
      throw new AppError("Tài khoản này đã bị xóa trước đó", 400);
    }

    user.isDeleted = true;
    await user.save();

    return {
      message: "Xoá hỗ trợ viên thành công"
    }
  } catch (error) {
    throw new AppError(error.message);
  }
};

module.exports.changeStatus = async (supporterId, status, userId) => {
  try {

    const supporter = await Supporter.findOne({ _id: supporterId })

    if (!supporter) {
      throw new AppError("Không tìm thấy hỗ trợ viên", 404)
    }
    const user = await User.findOne({ _id: supporter.userId }).select("-tokens")


    if (!user) {
      throw new AppError("Không tìm thấy tài khoản liên kết bệnh nhân", 404)
    }


    const isActive = (status === true || status === "true") ? true : false;
    user.isActive = isActive
    await user.save();

    return {
      message: "Sửa trạng thái hỗ trợ viên thành công"
    }
  } catch (error) {
    throw new AppError(error.message);
  }
};

module.exports.getSupporterById = async (supporterId, userId) => {
  try {

    const supporter = await Supporter.findOne({ _id: supporterId }).select("-createdAt -updatedAt -__v")

    if (!supporter) {
      throw new AppError("Không tìm thấy hỗ trợ viên", 404)
    }
    const user = await User.findOne({ _id: supporter.userId }).select("-tokens -createdAt -updatedAt -__v")

    if (!user) {
      throw new AppError("Không tìm thấy tài khoản liên kết hỗ trợ viên", 404)
    }

    return {
      supporter: supporter,
      user: user
    }
  } catch (error) {
    throw new AppError(error.message);
  }
};