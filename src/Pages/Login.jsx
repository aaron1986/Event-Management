import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Utils/firebase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const validationErrors = {};

    if (!formData.email.trim()) {
      validationErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = 'Invalid email format.';
    }

    if (!formData.password) {
      validationErrors.password = 'Password is required.';
    }

    return validationErrors;
  };

  const getInputClass = (field) => {
    if (errors[field]) return 'error-input';
    if (formData[field]) return 'success-input';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, formData.email.trim(), formData.password);
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setGeneralError('No user found with this email.');
      } else if (err.code === 'auth/wrong-password') {
        setGeneralError('Incorrect password.');
      } else if (err.code === 'auth/too-many-requests') {
        setGeneralError('Too many login attempts. Please try again later.');
      } else {
        setGeneralError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div>
      <div className="title"><h1>Login to Your Account</h1></div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          <span>Email: <span className="required-star">*</span></span>
        </label>
        <input 
          type="text"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className={getInputClass('email')}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}

        <label htmlFor="password">
          <span>Password: <span className="required-star">*</span></span>
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className={getInputClass('password')}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}

        {generalError && <p className="error-message">{generalError}</p>}

        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
}
