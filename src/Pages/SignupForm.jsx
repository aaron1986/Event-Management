import { useState } from 'react';
import { registerUser } from '../Utils/authService';
import { useNavigate } from 'react-router-dom';

export default function SignupForm() {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const validationErrors = {};
    const { email, password, confirmPassword } = formData;

    if (!email.trim()) {
      validationErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.email = 'Invalid email format.';
    }

    if (!password) {
      validationErrors.password = 'Password is required.';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)) {
      validationErrors.password =
        'Password must be at least 8 characters, include uppercase, lowercase, number, and symbol.';
    }

    if (!confirmPassword) {
      validationErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match.';
    }

    return validationErrors;
  };

  const evaluatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[\W_]/.test(password)) score++;

    if (score <= 2) return { label: 'Weak', color: 'red' };
    if (score === 3 || score === 4) return { label: 'Moderate', color: 'orange' };
    if (score === 5) return { label: 'Strong', color: 'green' };
    return { label: '', color: 'transparent' };
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
      navigate('/');
    } catch (error) {
      setGeneralError(error.message || 'Signup failed. Please try again.');
    }
  };

  const getInputClass = (field) =>
    errors[field] ? 'error-input' : formData[field] ? 'success-input' : '';

  const passwordStrength = evaluatePasswordStrength(formData.password);

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
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={getInputClass('password')}
        />
        <div style={{ marginTop: '4px' }}>
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword((prev) => !prev)}
          />
          <label htmlFor="showPassword"> Show password</label>
        </div>
        <div style={{ marginTop: '4px', height: '6px', backgroundColor: '#ddd' }}>
          <div
            style={{
              height: '6px',
              width:
                passwordStrength.label === 'Weak'
                  ? '33%'
                  : passwordStrength.label === 'Moderate'
                  ? '66%'
                  : '100%',
              backgroundColor: passwordStrength.color,
              transition: 'width 0.3s',
            }}
          ></div>
        </div>
        <small style={{ color: passwordStrength.color }}>{passwordStrength.label}</small>
        {errors.password && <p className="error-message">{errors.password}</p>}

        <label>Confirm Password:</label>
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={getInputClass('confirmPassword')}
        />
        <div style={{ marginTop: '4px' }}>
          <input
            type="checkbox"
            id="showConfirmPassword"
            checked={showConfirmPassword}
            onChange={() => setShowConfirmPassword((prev) => !prev)}
          />
          <label htmlFor="showConfirmPassword"> Show confirm password</label>
        </div>
        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

        {generalError && <p className="error-message">{generalError}</p>}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
