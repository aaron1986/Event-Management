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

if (!formData.password) {
  validationErrors.password = 'Password is required.';
} else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(formData.password)) {
  validationErrors.password = 'Password must be at least 8 characters, with uppercase, lowercase, number, and symbol.';
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
