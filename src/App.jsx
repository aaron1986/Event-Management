import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { auth } from './Utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { db } from './Utils/firebase';
import './App.css';

import EventList from "./Pages/EventList";
import Nav from "./Components/Nav";
import Login_Events from "./Pages/Login_Events";
import EditEvent from "./Components/EditEvent";
import CreateEvent from "./Components/CreateEvent";
import SignupForm from './Pages/SignupForm';
import NotFound from './Pages/NotFound';

function ScrollAndFocusManager({ children }) {
  const location = useLocation();
  const mainRef = useRef();

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, [location]);

  return (
    <>
      <header>
        <a href="#main-content" className="skip-link">Skip to main content</a>
      </header>
      <main id="main-content" tabIndex="-1" ref={mainRef} role="main">
        {children}
      </main>
    </>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const role = userDoc.exists() ? userDoc.data().role : "user";
        setUser({ ...user, role });  
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Nav user={user} />
      <ScrollAndFocusManager>
        <Routes>
          <Route path='/' element={<EventList isAuthenticated={isAuthenticated} user={user} />} />
          <Route path="/login_Events" element={<Login_Events />} />
          <Route path="/create-event" element={user?.role === 'staff' ? <CreateEvent /> : <Navigate to="/" />} />
          <Route path="/edit-event/:id" element={user?.role === 'staff' ? <EditEvent /> : <Navigate to="/" />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="*" element={<NotFound />} /> 
        </Routes>
      </ScrollAndFocusManager>
    </BrowserRouter>
  );
}

export default App;
