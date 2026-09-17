import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiCheck } from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.updateProfile(formData);
      toast.success('Profile updated successfully!');
    } catch (err) {
      const errData = err.response?.data;
      const errMsg = errData?.username?.[0] || errData?.email?.[0] || errData?.detail || errData?.message || 'Failed to update profile';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page" style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 className="page-title" style={{ marginBottom: '2rem' }}>My Profile</h1>
      <div className="profile-card" style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}><FiUser /> Username</label>
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              className="form-control"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}><FiMail /> Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="form-control"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Role</label>
            <input 
              type="text" 
              value={user?.role || 'user'} 
              disabled 
              className="form-control"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-secondary)', opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: '500', width: '100%', justifyContent: 'center' }}
          >
            {loading ? 'Saving...' : <><FiCheck /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
