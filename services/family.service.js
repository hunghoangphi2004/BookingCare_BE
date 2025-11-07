// services/family.service.js
const Family = require('../models/family.model');
const User = require('../models/user.model');
const Doctor = require('../models/doctor.model'); // model bác sĩ
// module.exports.createFamily = async (data, userId) => {
//   try {
//     const { familyName, members = [] } = data;

//     if (!familyName || familyName.trim() === '') {
//       throw new Error('Vui lòng nhập tên gia đình');
//     }

//     const user = await User.findById(userId);
//     if (!user || user.isDeleted || user.role !== 'patient' || user.isActive === false) {
//       throw new Error('Người dùng không tồn tại');
//     }

//     const existingFamily = await Family.findOne({ ownerId: userId });
//     if (existingFamily) {
//       throw new Error('Bạn đã có hồ sơ gia đình. Mỗi tài khoản chỉ tạo được 1 gia đình.');
//     }

//     if (members.length > 0) {
//       for (let member of members) {
//         if (!member.fullName || member.fullName.trim() === '') {
//           throw new Error('Họ tên thành viên không được để trống');
//         }
//       }
//     }

//     const family = new Family({
//       familyName: familyName.trim(),
//       ownerId: userId,
//       members: members.map(m => ({
//         fullName: m.fullName.trim(),
//         relationship: m.relationship || '',
//         dateOfBirth: m.dateOfBirth || null,
//         gender: m.gender || 'other',
//         phoneNumber: m.phoneNumber || '',
//         userId: m.userId || null,
//         patientProfileId: m.patientProfileId || null
//       })),
//       familyDoctors: []
//     });

//     await family.save();

//     return {
//       success: true,
//       message: 'Tạo hồ sơ gia đình thành công',
//       family
//     };

//   } catch (error) {
//     throw new Error(error.message);
//   }
// };
module.exports.getAllFamily = async (filters = {}, page = 1, limit = 10) => {
  page = Math.max(1, parseInt(page) || 1);
  limit = Math.max(1, parseInt(limit) || 10);
  const skip = (page - 1) * limit;

  const matchStage = {};

  if (filters.keyword) {
    const regex = new RegExp(filters.keyword, "i");
    matchStage.$or = [
      { familyName: regex },
      { "owner.email": regex },
      { "owner.firstName": regex },
      { "owner.lastName": regex },
    ];
  }

  const pipeline = [
    {
      $lookup: {
        from: "users", // tên collection của User
        localField: "ownerId",
        foreignField: "_id",
        as: "owner"
      }
    },
    { $unwind: "$owner" },
    { $match: matchStage },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    ...(limit === 0 ? [] : [{ $limit: limit }]),
    {
      $project: {
        familyName: 1,
        ownerId: 1,
        members: 1,
        familyDoctors: 1,
        createdAt: 1,
        "owner.email": 1,
        "owner.firstName": 1,
        "owner.lastName": 1,
      }
    }
  ];

  const families = await Family.aggregate(pipeline);
  const total = await Family.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner"
      }
    },
    { $unwind: "$owner" },
    { $match: matchStage },
    { $count: "total" }
  ]);

  return {
    data: families,
    pagination: {
      total: total[0]?.total || 0,
      page,
      limit,
      totalPages: limit === 0 ? 1 : Math.ceil((total[0]?.total || 0) / limit),
    },
  };
};

module.exports.createFamily = async (data, userId) => {
  try {
    const { familyName, members = [] } = data;

    // ========== 1. Validation ==========
    if (!familyName || familyName.trim() === '') {
      throw new Error('Vui lòng nhập tên gia đình');
    }

    // ========== 2. Kiểm tra user tồn tại ==========
    const user = await User.findById(userId);
    if (!user || user.isDeleted) {
      throw new Error('Người dùng không tồn tại');
    }

    // ========== 3. Kiểm tra đã có gia đình chưa ==========
    const existingFamily = await Family.findOne({ ownerId: userId });
    if (existingFamily) {
      throw new Error('Bạn đã có hồ sơ gia đình. Mỗi tài khoản chỉ tạo được 1 gia đình.');
    }

    // ========== 4. Validate và xử lý members (nếu có) ==========
    const processedMembers = [];

    if (members.length > 0) {
      for (let member of members) {
        if (!member.fullName || member.fullName.trim() === '') {
          throw new Error('Họ tên thành viên không được để trống');
        }

        let memberUserId = null;
        let memberPatientProfileId = null;

        // Nếu có email → tìm user và PatientProfile
        if (member.email && member.email.trim()) {
          const memberUser = await User.findOne({
            email: member.email.trim(),
            isDeleted: false
          });

          if (memberUser) {
            memberUserId = memberUser._id;

            // Tìm PatientProfile của user này
            const PatientProfile = require('../models/patient.model');
            const patientProfile = await PatientProfile.findOne({
              userId: memberUser._id
            });

            if (patientProfile) {
              memberPatientProfileId = patientProfile._id;
            }
          }
        }

        processedMembers.push({
          fullName: member.fullName.trim(),
          relationship: member.relationship?.trim() || '',
          dateOfBirth: member.dateOfBirth || null,
          gender: member.gender || 'other',
          phoneNumber: member.phoneNumber?.trim() || '',
          userId: memberUserId,
          patientProfileId: memberPatientProfileId
        });
      }
    }

    // ========== 5. Tạo gia đình ==========
    const family = new Family({
      familyName: familyName.trim(),
      ownerId: userId,
      members: processedMembers,
      familyDoctors: []
    });

    await family.save();

    return {
      success: true,
      message: 'Tạo hồ sơ gia đình thành công',
      family
    };

  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports.createFamilyByAdmin = async (data, userId) => {
  try {
    const { familyName, members = [] } = data;

    // ========== 1. Validation ==========
    if (!familyName || familyName.trim() === '') {
      throw new Error('Vui lòng nhập tên gia đình');
    }

    // ========== 2. Kiểm tra user tồn tại ==========
    const user = await User.findById(userId);
    if (!user || user.isDeleted) {
      throw new Error('Người dùng không tồn tại');
    }

    // ========== 3. Kiểm tra đã có gia đình chưa ==========
    const existingFamily = await Family.findOne({ ownerId: userId });
    if (existingFamily) {
      throw new Error('Bạn đã có hồ sơ gia đình. Mỗi tài khoản chỉ tạo được 1 gia đình.');
    }

    // ========== 4. Validate và xử lý members (nếu có) ==========
    const processedMembers = [];

    if (members.length > 0) {
      for (let member of members) {
        if (!member.fullName || member.fullName.trim() === '') {
          throw new Error('Họ tên thành viên không được để trống');
        }

        let memberUserId = null;
        let memberPatientProfileId = null;

        // Nếu có email → tìm user và PatientProfile
        if (member.email && member.email.trim()) {
          const memberUser = await User.findOne({
            email: member.email.trim(),
            isDeleted: false
          });

          if (memberUser) {
            memberUserId = memberUser._id;

            // Tìm PatientProfile của user này
            const PatientProfile = require('../models/patient.model');
            const patientProfile = await PatientProfile.findOne({
              userId: memberUser._id
            });

            if (patientProfile) {
              memberPatientProfileId = patientProfile._id;
            }
          }
        }

        processedMembers.push({
          fullName: member.fullName.trim(),
          relationship: member.relationship?.trim() || '',
          dateOfBirth: member.dateOfBirth || null,
          gender: member.gender || 'other',
          phoneNumber: member.phoneNumber?.trim() || '',
          userId: memberUserId,
          patientProfileId: memberPatientProfileId
        });
      }
    }

    // ========== 5. Tạo gia đình ==========
    const family = new Family({
      familyName: familyName.trim(),
      ownerId: userId,
      members: processedMembers,
      familyDoctors: []
    });

    await family.save();

    return {
      success: true,
      message: 'Tạo hồ sơ gia đình thành công',
      family
    };

  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports.getFamilyByUserId = async (userId) => {
  try {
    const family = await Family.findOne({ ownerId: userId })
      .populate('ownerId', 'fullName email phoneNumber')
      .populate('members.userId', 'fullName email')
      .lean();

    if (!family) {
      return {
        success: false,
        message: 'Người dùng chưa có hồ sơ gia đình'
      };
    }

    return {
      success: true,
      family
    };

  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports.getFamilyById = async (id) => {
  try {
    const family = await Family.findOne({ _id: id })
      .populate('ownerId', 'email')
      .populate('members.userId', 'email')
      .lean();

    if (!family) {
      return {
        success: false,
        message: 'Không tìm thấy hồ sơ gia đình'
      };
    }

    return {
      success: true,
      family
    };

  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports.updateFamily = async (data, userId) => {
  try {
    const { familyName, members = [] } = data;

    const family = await Family.findOne({ ownerId: userId });
    if (!family) {
      throw new Error('Bạn chưa có hồ sơ gia đình để chỉnh sửa');
    }

    if (!familyName || familyName.trim() === '') {
      throw new Error('Vui lòng nhập tên gia đình');
    }
    const processedMembers = [];

    if (members.length > 0) {
      for (let member of members) {
        if (!member.fullName || member.fullName.trim() === '') {
          throw new Error('Họ tên thành viên không được để trống');
        }

        let memberUserId = null;
        let memberPatientProfileId = null;

        if (member.email && member.email.trim()) {
          const memberUser = await User.findOne({
            email: member.email.trim(),
            isDeleted: false
          });

          if (memberUser) {
            memberUserId = memberUser._id;

            const PatientProfile = require('../models/patient.model');
            const patientProfile = await PatientProfile.findOne({
              userId: memberUser._id
            });

            if (patientProfile) {
              memberPatientProfileId = patientProfile._id;
            }
          }
        }

        processedMembers.push({
          fullName: member.fullName.trim(),
          relationship: member.relationship?.trim() || '',
          dateOfBirth: member.dateOfBirth || null,
          gender: member.gender || 'other',
          phoneNumber: member.phoneNumber?.trim() || '',
          userId: memberUserId,
          patientProfileId: memberPatientProfileId
        });
      }
    }

    family.familyName = familyName.trim();
    family.members = processedMembers;

    await family.save();

    return {
      success: true,
      message: 'Cập nhật hồ sơ gia đình thành công',
      family
    };

  } catch (error) {
    throw new Error(error.message);
  }
};

// module.exports.requestFamilyDoctor = async (userId, doctorId, requestNote) => {
//   try {
//     const doctor = await DoctorUser.findById(doctorId);
//     if (!doctor || !doctor.isFamilyDoctor || doctor.isActive === false) {
//       throw new Error('Bác sĩ không tồn tại hoặc không hoạt động');
//     }

//     const family = await Family.findOne({ ownerId: userId });
//     if (!family) {
//       throw new Error('Bạn chưa có hồ sơ gia đình để đặt bác sĩ');
//     }

//     const existingRequest = family.familyDoctors.find(
//       fd => fd.doctorId.toString() === doctorId.toString() &&
//             ['pending', 'approved'].includes(fd.status)
//     );

//     if (existingRequest) {
//       throw new Error('Bác sĩ này đã được đặt hoặc đang chờ duyệt');
//     }

//     family.familyDoctors.push({
//       doctorId,
//       requestNote: requestNote || '',
//       requestedAt: new Date(),
//       status: 'pending'
//     });

//     await family.save();

//     return {
//       success: true,
//       message: 'Gửi yêu cầu đặt bác sĩ gia đình thành công. Vui lòng chờ bác sĩ duyệt.',
//       family
//     };
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

module.exports.requestFamilyDoctor = async (userId, doctorId, requestNote, schedule) => {
  try {
    // 1️⃣ Kiểm tra bác sĩ tồn tại và đang hoạt động
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new Error('Không tìm thấy hồ sơ bác sĩ');
    }
    if (!doctor.isFamilyDoctor) {
      throw new Error('Bác sĩ này không hỗ trợ chức năng bác sĩ gia đình');
    }

    // 2️⃣ Kiểm tra hồ sơ gia đình của user
    const family = await Family.findOne({ ownerId: userId });
    if (!family) {
      throw new Error('Bạn chưa có hồ sơ gia đình để đặt bác sĩ');
    }

    // 3️⃣ Kiểm tra trùng yêu cầu cùng bác sĩ
    const existingRequest = family.familyDoctors.find(fd =>
      fd.doctorId.toString() === doctorId.toString() &&
      ['pending', 'approved'].includes(fd.status)
    );
    if (existingRequest) {
      throw new Error('Bác sĩ này đã được đặt hoặc đang chờ duyệt');
    }

    // 4️⃣ Validate lịch (schedule)
    if (!schedule || !schedule.startDate || !schedule.timeSlot) {
      throw new Error('Vui lòng chọn ngày bắt đầu và khung giờ khám');
    }

    // Nếu weekly => cần có dayOfWeek
    if (schedule.frequency === 'weekly' && schedule.dayOfWeek === undefined) {
      throw new Error('Thiếu thông tin thứ trong tuần cho lịch weekly');
    }

    // Nếu monthly => cần có dayOfMonth
    if (schedule.frequency === 'monthly' && schedule.dayOfMonth === undefined) {
      throw new Error('Thiếu ngày trong tháng cho lịch monthly');
    }

    // 5️⃣ Kiểm tra trùng khung giờ của cùng bác sĩ
    const conflict = await Family.findOne({
      'familyDoctors.doctorId': doctorId,
      'familyDoctors.status': { $in: ['pending', 'approved'] },
      'familyDoctors.schedule.frequency': schedule.frequency,
      'familyDoctors.schedule.timeSlot': schedule.timeSlot,
      ...(schedule.frequency === 'weekly'
        ? { 'familyDoctors.schedule.dayOfWeek': schedule.dayOfWeek }
        : { 'familyDoctors.schedule.dayOfMonth': schedule.dayOfMonth })
    });

    if (conflict) {
      throw new Error('Bác sĩ đã có lịch trùng khung giờ này');
    }

    // 6️⃣ Lưu yêu cầu mới
    family.familyDoctors.push({
      doctorId,
      requestNote: requestNote || '',
      requestedAt: new Date(),
      schedule,
      status: 'pending'
    });

    await family.save();

    return {
      success: true,
      message: 'Gửi yêu cầu đặt bác sĩ gia đình thành công. Vui lòng chờ bác sĩ duyệt.',
      data: family
    };
  } catch (error) {
    throw new Error(error.message);
  }
};