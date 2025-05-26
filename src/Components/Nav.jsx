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
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        {user ? (
          <li>
            <a href="/logout" onClick={handleLogout}>Log Out</a>
          </li>
        ) : (
          <li><Link to="/login">Log In</Link></li>
        )}

        {user && (
    <li><Link to="/create-event">Create Event</Link></li>

)}
      </ul>
    </nav>
  );
}

