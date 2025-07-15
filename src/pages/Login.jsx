import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
	countryCode: z.string().min(1, "Select a code"),
	phone: z.string().min(6, "Phone number is reuired ! Should be minimum 6 digits!"),
});
const Login = () => {
	const navigate = useNavigate();
	const [countries, setCountries] = useState([]);
	const [otpSent, setOtpSent] = useState(false);
	const [userPhone, setUserPhone] = useState(null);
	const {register,handleSubmit,formState: { errors }} = useForm({
		resolver: zodResolver(loginSchema),
	});
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const fallbackCountries = [
  { name: "India", code: "+91", flag: "" },
  { name: "United States", code: "+1", flag: "" },
  { name: "United Kingdom", code: "+44", flag: "" },
];

	useEffect(() => {
		const fetchCountries = async () => {
			try {
				 setLoading(true);
				const res = await fetch("https://restcountries.com/v3.1/all?fields=name,idd,flags");
				if (!res.ok) throw new Error("Network response was not ok");
				const data = await res.json();
				if (!Array.isArray(data)) throw new Error("Expected array but got something else");
				const formatted = data
					.map((country) => ({
						name: country.name?.common,
						code: country.idd?.root
							? `${country.idd.root}${country.idd.suffixes?.[0] || ""}`
							: null,
						flag: country.flags?.png,
					}))
					.filter((c) => c.code);
				setCountries(formatted.sort((a, b) => a.name.localeCompare(b.name)));
				setError(false);
			} catch (err) {
				console.error("Failed to load countries:", err.message);
				setCountries(fallbackCountries);
				setError(true);
			}finally {
			setLoading(false);
		}
		};

		fetchCountries();
	}, []);

	// Handle Send OTP
	const onSubmit = (data) => {
		toast.info(`Sending OTP to ${data.countryCode}${data.phone}...`);
		setUserPhone(`${data.countryCode}  ${data.phone}`);
		setTimeout(() => {
			setOtpSent(true);
			toast.success("OTP sent successfully!");
		}, 1500);
	};

	// Handle Verify OTP
	const verifyOtp = () => {
	const otpInput = document.querySelector("input[placeholder='Enter OTP']")?.value;

	if (!otpInput || otpInput.length !== 6 || !/^\d{6}$/.test(otpInput)) {
		toast.error("Invalid OTP. Please enter a 6-digit number.");
		return;
	}
	toast.success("OTP Verified! Logging you in...");
	setTimeout(() => {
		console.log("✅ Logged in with:", userPhone);
		navigate("/dashboard");
	}, 2000);
};

	return (
		<div className="min-h-screen flex items-center justify-center dark:from-gray-900 dark:to-gray-700 transition-colors duration-500"
		>
			<div className="dark:bg-gray-800 p-6 rounded-2xl shadow-md w-full max-w-md">
				<div className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-white">
					Login
				</div>
				<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
					{loading && <p className="text-sm text-gray-500">Loading 	country codes...</p>}
					{error && (
						<p className="text-sm text-red-500">
							Failed to load countries. Please check your internet or try again later.
						</p>
					)}

					{/* Country Code + Phone */}
					<div className="flex gap-2">
						<select
							{...register("countryCode")}
							className="w-1/3 p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
							defaultValue=""
						>
							<option value="" disabled>Code</option>
							{countries.map((country, idx) => (
								<option key={idx} value={country.code}>
									{country.code}
								</option>
							))}
						</select>
						<input
							{...register("phone")}
							type="tel"
							placeholder="Phone Number"
							className="w-2/3 p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
						/>
					</div>

					{/* Errors */}
					{errors.countryCode && (
						<p className="text-sm text-red-500">{errors.countryCode.message}</p>
					)}
					{errors.phone && (
						<p className="text-sm text-red-500">{errors.phone.message}</p>
					)}

					{/* Submit Button */}
					<button
						type="submit"
						className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
					>
						Send OTP
					</button>
				</form>

				{/* OTP Input & Verify Button */}
				{otpSent && (
					<div className="space-y-2 mt-6">
						<p className="text-sm text-gray-600 dark:text-gray-300">
							OTP sent to <span className="font-semibold">{userPhone}</span>
						</p>

						<input
							type="text"
							placeholder="Enter OTP"
							className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
							maxLength={6}
						/>

						<button
							type="button"
							onClick={verifyOtp}
							className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
						>
							Verify OTP
						</button>
					</div>
				)}
			</div>
			</div>
	)
}

export default Login