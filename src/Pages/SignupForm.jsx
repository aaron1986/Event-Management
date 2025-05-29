import { useState } from 'react';
import { registerUser } from '../Utils/authService';
import { useNavigate } from 'react-router-dom';

export default function SignupForm() {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const validationErrors = {};
    const { email, password, confirmPassword } = formData;

    if (!email.trim()) validationErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) validationErrors.email = 'Invalid email format.';

    if (!password) validationErrors.password = 'Password is required.';
    else if (password.length < 6) validationErrors.password = 'Minimum 6 characters.';

    if (!confirmPassword) validationErrors.confirmPassword = 'Please confirm your password.';
    else if (password !== confirmPassword) validationErrors.confirmPassword = 'Passwords do not match.';

    return validationErrors;
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
      await registerUser(formData.email, formData.password);
      navigate('/'); // or navigate to /dashboard or /login
    } catch (error) {
      setGeneralError(error.message);
    }
  };

  const getInputClass = (field) => (errors[field] ? 'error-input' : formData[field] ? 'success-input' : '');

  return (
    <div>
      <h1>Create a New Account</h1>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={getInputClass('email')}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={getInputClass('password')}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}

        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={getInputClass('confirmPassword')}
        />
        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

        {generalError && <p className="error-message">{generalError}</p>}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
