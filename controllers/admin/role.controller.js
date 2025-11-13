const roleService = require("../../services/role.service")
const mongoose = require('mongoose');
const fs = require("fs");

module.exports.getAllRole = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, ...filters } = req.query;
        const result = await roleService.getAllRole(filters, parseInt(page), parseInt(limit));
        return res.status(200).json({ success: true, ...result })
    } catch (err) {
        next(err)
    }
}

module.exports.createRole = async (req, res, next) => {
    try {
        const newRole = await roleService.createRole(req.body);
        return res.status(200).json({ success: true, newRole: newRole})
    } catch (err) {
        next(err)
    }
}

module.exports.editRole = async (req, res, next) => {
    try {
     
        const updatedRole = await roleService.editRole(
            req.params.id,
            req.body
        )
        return res.status(200).json({
            success: true,
            message: "Cập nhật nhóm quyền thành công",
            role: updatedRole
        });

    } catch (err) {
        next(err)
    }
}

module.exports.getRoleById = async (req, res, next) => {
    try {
        const result = await roleService.getRoleById(req.params.id)
        return res.status(200).json({ success: true, role: result })
    } catch (err) {
        next(err)
    }
}

module.exports.deleteRole = async (req, res, next) => {
    try {
        const result = await roleService.deleteRole(req.params.id)
        return res.status(200).json({ success: true, message: result.message })
    } catch (err) {
        next(err)
    }
}

module.exports.getPermissions = async (req, res, next) => {
    try {
        const role = await roleService.getPermissions(req.params.id);
        res.status(200).json({ success: true, data: role });
    } catch (err) {
        next(err);
    }
};

module.exports.updatePermissions = async (req, res, next) => {
    try {
        const { permissions } = req.body; 
        const role = await roleService.updatePermissions(req.params.id, permissions);
        res.status(200).json({ success: true, data: role });
    } catch (err) {
        next(err);
    }
};