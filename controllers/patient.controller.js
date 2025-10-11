const PatientProfile = require("../models/patient.model");
const User = require("../models/user.model");
const patientService = require('../services/patient.service')

module.exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, phoneNumber, dateOfBirth, gender, address, emergencyContact } = req.body;

        // Kiểm tra quyền
        const user = await User.findById(userId);
        if (!user || user.role !== "patient") {
            return res.status(403).json({ message: "Access denied", success: false });
        }

        // Tìm hồ sơ bệnh nhân
        let profile = await PatientProfile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ message: "Patient profile not found", success: false });
        }

        // Cập nhật thông tin
        profile.firstName = firstName || profile.firstName;
        profile.lastName = lastName || profile.lastName;
        profile.phoneNumber = phoneNumber || profile.phoneNumber;
        profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
        profile.gender = gender || profile.gender;
        profile.address = address || profile.address;

        if (emergencyContact) {
            profile.emergencyContact = {
                name: emergencyContact.name || profile.emergencyContact.name,
                phone: emergencyContact.phone || profile.emergencyContact.phone,
                relationship: emergencyContact.relationship || profile.emergencyContact.relationship,
            };
        }

        await profile.save();

        res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            result: profile
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({
            message: "Failed to update profile - controllers/patientController.js",
            error: error.message,
            success: false
        });
    }
};

module.exports.getPatientById = async (req, res, next) => {

    const id = req.params.id
    console.log(id)

    try {
        const record = await patientService.getPatientById(id)
        return res.status(200).json({ success: true, data: record })
    } catch (err) {
        next(err)
    }
}

