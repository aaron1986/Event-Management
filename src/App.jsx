import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { useEffect, useState } from 'react';
import { auth } from './Utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { db } from './Utils/firebase';
import './App.css';
import EventList from "./Pages/EventList";
import Nav from "./Components/Nav";
import Login from "./Pages/Login";
import EditEvent from "./Components/EditEvent";
import CreateEvent from "./Components/CreateEvent";
import SignupForm from './Pages/SignupForm';

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
      <Routes>
        <Route path='/' element={<EventList isAuthenticated={isAuthenticated} user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-event" element={user?.role === 'staff' ? <CreateEvent /> : <Navigate to="/" />}/>
        <Route path="/edit-event/:id" element={user?.role === 'staff' ? <EditEvent /> : <Navigate to="/" />} />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
