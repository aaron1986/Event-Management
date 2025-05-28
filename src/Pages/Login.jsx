import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Utils/firebase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
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
      validationErrors.email = 'Invalid email address.';
    }

    if (!formData.password) {
      validationErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match.';
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
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setGeneralError('Invalid email or password.');
    }
  };

  return (
    <div>
      <div className="title"><h1>Login to Your Account</h1></div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email"><span>Email: <span className="required-star">*</span></span></label>
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

        <label htmlFor="password"><span>Password: <span className="required-star">*</span></span></label>
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

        <label htmlFor="confirmPassword"><span>Retype Password: <span className="required-star">*</span></span></label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Retype your password"
          className={getInputClass('confirmPassword')}
        />
        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

        {generalError && <p className="error-message">{generalError}</p>}

        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
}
