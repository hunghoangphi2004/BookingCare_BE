const Role = require("../models/role.model")
const AppError = require("../utils/appError.util")
const mongoose = require('mongoose');

module.exports.getAllRole = async (filters = {}, page = 1, limit = 10) => {
    let find = { isDeleted: false };
    if (filters.keyword) {
        find.name = { $regex: filters.keyword, $options: "i" };
    }

    page = Math.max(1, parseInt(page) || 1);
    limit = Math.max(1, parseInt(limit) || 10);

    const skip = (page - 1) * limit;

    const total = await Role.countDocuments(find);

    const roles = await Role.find(find).select("-__v")
        .skip(limit == 0 ? 0 : skip)
        .limit(limit == 0 ? 0 : limit)
        .sort({ createdAt: -1 })
        .lean();
    return {
        data: roles,
        pagination: {
            total,
            page,
            limit,
            totalPages: limit === 0 ? 1 : Math.ceil(total / limit),
        },
    };
}

module.exports.createRole = async (body) => {
    const { title, role, description } = body;

    if (!title || !role || !description) {
        throw new AppError("Bắt buộc tất cả các trường", 400);
    }

    let newRole = new Role();
    newRole.role = role;
    newRole.title = title;
    newRole.description = description;

    await newRole.save();
    return newRole;
}

module.exports.editRole = async (roleId, body) => {
    const { title, description } = body;

    if (!mongoose.Types.ObjectId.isValid(roleId)) {
        throw new AppError("Id không hợp lệ", 400)
    }

    const role = await Role.findById(roleId);
    if (!role) {
        throw new AppError("Không tìm thấy nhóm quyền", 404)
    }

    if (title) role.title = title;
    if (description) role.description = description;

    await role.save();
    const updatedRole = await Role.findById(roleId)

    return updatedRole
}

module.exports.getRoleById = async (id) => {
    let find = {
        _id: id,
        deleted: false
    };

    let role = await Role.findOne(find);
    if (!role) {
        throw new AppError("Không tìm thấy nhóm quyền", 404)
    }

    role = await Role.findOne(find)
    console.log(role)
    return role;
}

module.exports.deleteRole = async (roleId) => {
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
        throw new AppError("Id không hợp lệ", 400)
    }

    const role = await Role.findById(roleId)
    if (!role) {
        throw new AppError("Không tìm thấy nhóm quyền", 404)
    }

    role.deleted = true;
    await role.save();
    return { message: "Xoá nhóm quyền thành công" };
}

module.exports.getPermissions = async (roleId) => {
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
        throw new AppError("Id không hợp lệ", 400);
    }

    const role = await Role.findOne({ _id: roleId, deleted: false })
        .select('role title permissions');

    if (!role) throw new AppError("Role không tồn tại", 404);

    return role;
};

module.exports.updatePermissions = async (roleId, permissions) => {
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
        throw new AppError("Id không hợp lệ", 400);
    }

    const role = await Role.findById(roleId);
    if (!role) throw new AppError("Role không tồn tại", 404);

    role.permissions = permissions || [];
    await role.save();

    return role;
};