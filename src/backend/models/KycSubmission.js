const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const KycSubmission = sequelize.define('KycSubmission', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    document_type: { type: DataTypes.STRING, allowNull: false },
    kyc_type: { type: DataTypes.ENUM('personal', 'business'), defaultValue: 'personal' },
    document_path: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
}, {
    timestamps: true,
    createdAt: 'submitted_at',
    updatedAt: false
});

module.exports = KycSubmission;
