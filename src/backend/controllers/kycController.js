const { KycSubmission, User } = require('../models');

exports.submitKycDocument = async (req, res) => {
    try {
        const { user_id, document_type, kyc_type, document_path } = req.body;

        await KycSubmission.create({
            user_id,
            document_type,
            kyc_type,
            document_path
        });

        res.status(201).json({ message: 'KYC document submitted successfully' });
    } catch (error) {
        console.error('Error submitting KYC document:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateKycStatus = async (req, res) => {
    try {
        const { user_id, status } = req.body;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid KYC status' });
        }

        await User.update({ kyc_status: status }, { where: { id: user_id } });

        res.status(200).json({ message: 'KYC status updated successfully' });
    } catch (error) {
        console.error('Error updating KYC status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
