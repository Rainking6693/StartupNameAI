import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

const UserInfoModal = ({ isOpen, onClose, nameData, onSubmit, loading }) => {
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!userInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!userInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!userInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(userInfo.email)) newErrors.email = 'Please enter a valid email';
    if (!selectedDomain) newErrors.domain = 'Please select a domain';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(userInfo, selectedDomain);
  };

  if (!isOpen || !nameData) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Reserve Domain</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h3 className="text-xl font-bold text-gray-900">{nameData.name}</h3>
              <p className="text-gray-600">Brandability Score: {nameData.brandabilityScore}/10</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Domains</h3>
              <div className="space-y-3">
                {nameData.availableDomains?.map((domain, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedDomain?.domain === domain.domain
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                      }`}
                    onClick={() => setSelectedDomain(domain)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{domain.domain}</div>
                        <div className="text-sm text-gray-600">{domain.extension}</div>
                      </div>
                      <div className="font-bold text-green-600">
                        ${domain.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.domain && (
                <div className="text-red-600 text-sm mt-2">{errors.domain}</div>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={userInfo.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 ${errors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={userInfo.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 ${errors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 ${errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={userInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !selectedDomain}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Reserving...' : 'Reserve Domain'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UserInfoModal;