import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Activities from "./pages/Activities";
import Activity from "./pages/ActivityDetails";
import CreateActivity from "./pages/CreateActivity";
import Events from "./pages/Events";
import Event from "./pages/EventDetails";
import Equipment from "./pages/Equipment";
import EquipmentPiece from "./pages/EquipmentDetails";

import './App.css'

function App() {
  return (
   <>
     <BrowserRouter>
       <Header />
       <main id="main">
         <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/login" element={<Login />} />
           <Route path="/signup" element={<Signup />} />
           <Route path="/activities" element={<Activities />} />
           <Route path="/activities/:id" element={<Activity />} />
           <Route path="/activities/add" element={<CreateActivity />} />
           <Route path="/events" element={<Events />} />
           <Route path="/events/:id" element={<Event />} />
           <Route path="/equipment" element={<Equipment />} />
           <Route path="/equipment/:id" element={<EquipmentPiece />} />
         </Routes>
       </main>
       <Footer />
     </BrowserRouter>
   </>
 )
}

export default App
