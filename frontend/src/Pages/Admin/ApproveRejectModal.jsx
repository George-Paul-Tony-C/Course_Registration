import React from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/api_paths';

const ApproveRejectModal = ({ course, onClose, onSuccess }) => {
    const handleAction = async (status) => {
        try {
            await axiosInstance.patch(`${API_PATHS.ADMIN.ALL_COURSES}/${course.id}/status`, { status });
            onSuccess();
        } catch (err) {
            alert('Error updating status');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-xl font-bold mb-4">Review Course</h2>
                <p className="mb-4">Do you want to approve or reject the course <strong>{course.title}</strong>?</p>
                <div className="flex justify-end space-x-3">
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded"
                        onClick={() => handleAction('ACTIVE')}
                    >
                        Approve
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded"
                        onClick={() => handleAction('ARCHIVED')}
                    >
                        Reject
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApproveRejectModal;
