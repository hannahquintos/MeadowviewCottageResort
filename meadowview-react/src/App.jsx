import Header from "./components/Header";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Activities from "./pages/Activities";
import Activity from "./pages/ActivityDetails";
import ActivityRegistration from "./pages/ActivityRegistration";
import ActivityRegistrations from "./pages/ActivityRegistrations";
import CreateActivity from "./pages/CreateActivity";
import EditActivity from "./pages/EditActivity";
import AdminActivities from "./pages/AdminActivities";
import AdminActivity from "./pages/AdminActivityDetails";
import Events from "./pages/Events";
import EventFavourites from "./pages/EventFavourites";
import Event from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import AdminEvents from "./pages/AdminEvents";
import AdminEvent from "./pages/AdminEventDetails";
import Equipment from "./pages/Equipment";
import EquipmentPiece from "./pages/EquipmentDetails";
import EquipmentBookings from "./pages/EquipmentBookings";
import CreateEquipment from "./pages/CreateEquipment";
import EditEquipment from "./pages/EditEquipment";
import AdminEquipment from "./pages/AdminEquipment";
import AdminEquipmentPiece from "./pages/AdminEquipmentDetails";
import RequireAuth from "./components/RequireAuth";
import Profile from "./pages/Profile";
import GuestHome from "./pages/GuestHome";
import AdminHome from "./pages/AdminHome";
import EditProfile from "./pages/EditProfile";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import User from "./pages/UserDetails";
import EditUser from "./pages/EditUser";
import AssignEventStaff from "./pages/AssignEventStaff";

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
           <Route element={<RequireAuth allowedRoles={['Guest', 'Admin']} />}>
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/profile/:id/edit" element={<EditProfile />} />
            </Route>

           {/* protected routes - guest */}
           <Route element={ <RequireAuth allowedRoles={["Guest"]}/> }>
              <Route path="/home" element={<GuestHome />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/activities/:id" element={<Activity />} />
              <Route path="/activities/:id/register" element={<ActivityRegistration />} />
              <Route path="/activities/registrations" element={<ActivityRegistrations />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/favourites" element={<EventFavourites />} />
              <Route path="/events/:id" element={<Event />} />
              <Route path="/equipment" element={<Equipment />} />
              <Route path="/equipment/bookings" element={<EquipmentBookings />} />
              <Route path="/equipment/:id" element={<EquipmentPiece />} />

            </Route>
              
            {/* protected routes - admin */}
            <Route element={ <RequireAuth allowedRoles={["Admin"]}/> }>
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/users/:id" element={<User />} />
              <Route path="/admin/users/:id/edit" element={<EditUser />} />
              <Route path="/admin/users/add" element={<CreateUser />} />
              <Route path="/admin/activities" element={<AdminActivities />} />
              <Route path="/admin/activities/:id" element={<AdminActivity />} />
              <Route path="/admin/activities/add" element={<CreateActivity />} />
              <Route path="/admin/activities/:id/edit" element={<EditActivity />} />
              <Route path="/admin/events" element={<AdminEvents />} />
              <Route path="/admin/events/:id" element={<AdminEvent />} />
              <Route path="/admin/events/:id/assignStaff" element={<AssignEventStaff />} />
              <Route path="/admin/events/add" element={<CreateEvent />} />
              <Route path="/admin/events/:id/edit" element={<EditEvent />} />
              <Route path="/admin/equipment" element={<AdminEquipment />} />
              <Route path="/admin/equipment/:id" element={<AdminEquipmentPiece />} />
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
