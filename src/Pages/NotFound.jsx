import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <p>
        Go back to <Link to="/">home</Link>.
      </p>
    </div>
  );
}
