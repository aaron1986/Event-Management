import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../Utils/firebase';

export default function Nav({ user }) {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    await signOut(auth);
    navigate('/login');
  };

  return (
   <nav role="navigation" aria-label="Main navigation">
  <ul>
    <li><Link to="/">Home</Link></li>

    {user ? (
      <>
        {user.role === 'staff' && (
          <li><Link to="/create-event">Create Event</Link></li>
        )}
        <li>
          <button onClick={handleLogout} className="logout-button" aria-label="Log out">Log Out</button>
        </li>
      </>
    ) : (
      <>
        <li><Link to="/login_Events">Log In</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
      </>
    )}
  </ul>
</nav>
  );
}
