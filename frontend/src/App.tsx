// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LoginPage from "./pages/Login";

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;


// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div className="bg-blue-500 text-white p-4 rounded-lg">
//       ✅ Tailwind is working!
//       </div>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

// import { Routes, Route, Navigate } from 'react-router-dom';
// import LoginPage from './pages/Auth/LoginPage';
// import AdminDashboard from './pages/Admin/Dashboard';
// import ConsultantDashboard from './pages/Consultant/Dashboard';

// function App() {
//   const token = localStorage.getItem('token');
//   const role = localStorage.getItem('role');

//   return (
//     <Routes>
//       <Route path="/login" element={<LoginPage />} />
//       <Route
//         path="/admin"
//         element={
//           token && role === 'admin' ? (
//             <AdminDashboard />
//           ) : (
//             <Navigate to="/login" />
//           )
//         }
//       />
//       <Route
//         path="/consultant"
//         element={
//           token && role === 'consultant' ? (
//             <ConsultantDashboard />
//           ) : (
//             <Navigate to="/login" />
//           )
//         }
//       />
//       <Route path="*" element={<Navigate to="/login" />} />
//     </Routes>
//   );
// }

// export default App;

// import React from 'react';
// import AppRouter from './router';

// const App: React.FC = () => {
//   return <AppRouter />;
// };

// export default App;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import LoginPage from './pages/LoginPage';
// import ConsultantDashboard from './pages/ConsultantDashboard';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/consultant/dashboard" element={<ConsultantDashboard />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import AppRouter from './router';


const App: React.FC = () => {
  return <AppRouter />;
  
};

export default App;
