import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import './App.css'

function App() {
  return (
   <>
     <BrowserRouter>
       <Header />
       <main id="main">
         <Routes>
           <Route path="/" element={<Home />} />
         </Routes>
       </main>
       <Footer />
     </BrowserRouter>
   </>
 )
}

export default App
