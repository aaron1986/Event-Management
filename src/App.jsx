import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import { auth } from './Utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './App.css';
import EventList from "./Pages/EventList";
// import FilterEvents from "./Pages/FilterEvents";
import Nav from "./Components/Nav";
import Login from "./Pages/Login";
import EditEvent from "./Components/EditEvent";
import CreateEvent from "./Components/CreateEvent";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Nav user={user} />
      <Routes>
        <Route path='/' element={<EventList isAuthenticated={isAuthenticated} />} />
        {/* <Route path="/find-events" element={<FilterEvents />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/edit-event/:id" element={<EditEvent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
