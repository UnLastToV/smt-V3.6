import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './component/Login/Login.component';
import Mobiledasboard from './component/TicketPage/mobiledasboard';
import CitizenDash from './component/NameListPage/citizenDash';


function App() {
    return (
      
        <Router>
            <Routes>
                <Route path="/citizenDash" element={<CitizenDash />} />
                <Route path="/mobiledasboard" element={<Mobiledasboard />} />
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                <Route path="/" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;







// import logo from './logo.svg';
// import './App.css';
// import Login from './component/Login/login';
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './component/Navbar/navbar'
// import Dashboard from './component/Dashboard/dashboard'
// import Mobiledasboard from './component/Dashboard/mobiledasboard'

// function App() {
//   return ( 
//     <div className="App">
//       <Navbar/>
//       <Mobiledasboard/>
//       {/* <Dashboard /> */}
//       {/* <Login/> */}
//     </div>
//   );
// }

// export default App;



// function App() {
//     return (
//         <Router>
//             <Routes>
//                 <Route path="/" element={<Navbar>< Dashboard/></Navbar>} />
//                 {/* <Route path="/" element={<Navbar />} /> */}
//                 <Route path="/" element={<Login />} />
//             </Routes>
//         </Router>
//     );
// }

// export default App;