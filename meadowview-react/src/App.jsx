import Header from "./components/Header";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Activities from "./pages/Activities";
import Activity from "./pages/ActivityDetails";
import CreateActivity from "./pages/CreateActivity";
import EditActivity from "./pages/EditActivity";
import AdminActivity from "./pages/AdminActivityDetails";
import Events from "./pages/Events";
import EventFavourites from "./pages/EventFavourites";
import Event from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import AdminEvent from "./pages/AdminEventDetails";
import Equipment from "./pages/Equipment";
import EquipmentPiece from "./pages/EquipmentDetails";
import CreateEquipment from "./pages/CreateEquipment";
import EditEquipment from "./pages/EditEquipment";
import AdminEquipment from "./pages/AdminEquipmentDetails";
import RequireAuth from "./components/RequireAuth";
import Profile from "./pages/Profile";
import GuestHome from "./pages/GuestHome";
import AdminHome from "./pages/AdminHome";
import EditProfile from "./pages/EditProfile";


import './App.css'

function App() {
  return (
   <>
       <Header />
       <main id="main">
         <Routes>

          {/* public routes */}
           <Route path="/" element={<Home />} />
           <Route path="/login" element={<Login />} />
           <Route path="/signup" element={<Signup />} />

          {/* protected routes - guest and admin */}
           <Route element={<RequireAuth allowedRoles={['guest', 'admin']} />}>
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/profile/:id/edit" element={<EditProfile />} />
            </Route>

           {/* protected routes - guest */}
           <Route element={ <RequireAuth allowedRoles={["guest"]}/> }>
              <Route path="/home" element={<GuestHome />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/activities/:id" element={<Activity />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/favourites" element={<EventFavourites />} />
              <Route path="/events/:id" element={<Event />} />
              <Route path="/equipment" element={<Equipment />} />
              <Route path="/equipment/:id" element={<EquipmentPiece />} />

            </Route>
              
            {/* protected routes - admin */}
            <Route element={ <RequireAuth allowedRoles={["admin"]}/> }>
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/admin/activities/:id" element={<AdminActivity />} />
              <Route path="/admin/activities/add" element={<CreateActivity />} />
              <Route path="/admin/activities/:id/edit" element={<EditActivity />} />
              <Route path="/admin/events/:id" element={<AdminEvent />} />
              <Route path="/admin/events/add" element={<CreateEvent />} />
              <Route path="/admin/events/:id/edit" element={<EditEvent />} />
              <Route path="/admin/equipment/:id" element={<AdminEquipment />} />
              <Route path="/admin/equipment/add" element={<CreateEquipment />} />
              <Route path="/admin/equipment/:id/edit" element={<EditEquipment />} />

            </Route>

         </Routes>
       </main>
       <Footer />
   </>
 )
}

export default App
