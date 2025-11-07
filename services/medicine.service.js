const Medicine = require("../models/medicine.model");
const AppError = require("../utils/appError.util");

module.exports.getAllMedicines = async (filters = {}, page = 1, limit = 10) => {
  let query = { isDeleted: false };

  if (filters.keyword) {
    query.name = { $regex: filters.keyword, $options: "i" };
  }

  const medicines = await Medicine.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Medicine.countDocuments(query);

  return {
    data: medicines,
    pagination: {
      total,
      page,
      limit,
      totalPages: limit == 0 ? 1 : Math.ceil(total / limit),
    },
  };
};

module.exports.createMedicine = async (data) => {
  if (!data.name) {
    throw new AppError("Thiếu tên thuốc", 400);
  }

  const newMedicine = await Medicine.create({
    name: data.name,
    unit: data.unit || "viên",
    usage: data.usage || "",
    description: data.description || "",
  });

  return {
    newMedicine
  };
};

module.exports.editMedicine = async (medicineId, body) => {
  try {
    const { name, unit, description, usage } = body;

    const medicine = await Medicine.findOne({ _id: medicineId, isDeleted: false });
    if (!medicine) {
      throw new AppError("Không tìm thấy thuốc để cập nhật", 404);
    }

    const existingMedicine = await Medicine.findOne({
      _id: { $ne: medicineId },
      name: name,
      isDeleted: false
    });
    if (existingMedicine) {
      throw new AppError("Tên thuốc này đã tồn tại trong hệ thống", 400);
    }

    if (name) medicine.name = name;
    if (unit) medicine.unit = unit;
    if (description) medicine.description = description;
    if (usage) medicine.usage = usage;

    await medicine.save();

    return {
      message: "Cập nhật thuốc thành công",
      medicine
    };
  } catch (error) {
    throw new AppError(error.message);
  }
};

module.exports.getMedicineById = async (id) => {
  let find = {
    _id: id,
    isDeleted: false
  };

  let medicine = await Medicine.findOne(find);
  if (!medicine) {
    throw new AppError("Không tìm thấy thuốc", 404)
  }

  medicine = await Medicine.findOne(find)
  return medicine;
}


module.exports.deleteMedicine = async (id) => {
  const medicine = await Medicine.findById(id);
  if (!medicine || medicine.isDeleted) {
    throw new AppError("Không tìm thấy thuốc", 404);
  }

  medicine.isDeleted = true;
  await medicine.save();

  return { message: "Đã xóa thuốc thành công" };
};
