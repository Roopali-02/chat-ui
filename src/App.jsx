import React, { useState,useEffect } from 'react'
import {Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from './pages/Dashboard';
import Chatroom from "./pages/Chatroom";
import './App.css'
import { ToastContainer } from "react-toastify";

function App() {
	const [darkMode, setDarkMode] = useState(() => {
		return localStorage.getItem("darkMode") === "true";
	});

	useEffect(() => {
		document.documentElement.classList.toggle("dark", darkMode);
		localStorage.setItem("darkMode", darkMode);
	}, [darkMode]);


	return (
	 <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
		 <div className="p-4 flex justify-end">
				<button
					onClick={() => setDarkMode((prev) => !prev)}
					className="px-3 py-2 text-white bg-blue-600 dark:bg-gray-700 text-sm rounded-lg"
				>
					{darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
				</button>
			</div>
			<Routes>
				<Route path="/" element={<Login />} />
				 <Route path="/dashboard" element={<Dashboard />} />
					 <Route path="/chatroom/:id" element={<Chatroom />} />
			</Routes>
			<ToastContainer position="top-center" autoClose={2000} />
		</div>
	)
}

export default App
