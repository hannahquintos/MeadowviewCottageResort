import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Activities from "./pages/Activities";
import Activity from "./pages/ActivityDetails";
import CreateActivity from "./pages/CreateActivity";
import EditActivity from "./pages/EditActivity";
import AdminActivity from "./pages/Admin-ActivityDetails";
import Events from "./pages/Events";
import Event from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import AdminEvent from "./pages/Admin-EventDetails";
import Equipment from "./pages/Equipment";
import EquipmentPiece from "./pages/EquipmentDetails";
import CreateEquipment from "./pages/CreateEquipment";
import EditEquipment from "./pages/EditEquipment";
import AdminEquipment from "./pages/Admin-EquipmentDetails";

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
           <Route path="/admin/activities/:id" element={<AdminActivity />} />
           <Route path="/admin/activities/add" element={<CreateActivity />} />
           <Route path="/admin/activities/:id/edit" element={<EditActivity />} />
           <Route path="/events" element={<Events />} />
           <Route path="/events/:id" element={<Event />} />
           <Route path="/admin/events/add" element={<CreateEvent />} />
           <Route path="/admin/events/:id/edit" element={<EditEvent />} />
           <Route path="/admin/events/:id" element={<AdminEvent />} />
           <Route path="/equipment" element={<Equipment />} />
           <Route path="/equipment/:id" element={<EquipmentPiece />} />
           <Route path="/admin/equipment/add" element={<CreateEquipment />} />
           <Route path="/admin/equipment/:id/edit" element={<EditEquipment />} />
           <Route path="/admin/equipment/:id" element={<AdminEquipment />} />
         </Routes>
       </main>
       <Footer />
     </BrowserRouter>
   </>
 )
}

export default App
