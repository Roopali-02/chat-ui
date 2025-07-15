import React,{useState,useMemo} from 'react'
import useChatStore from '../store/chatStore';
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

const Dashboard = () => {
	const navigate = useNavigate();
	 const { chatrooms, addChatroom, deleteChatroom } = useChatStore();
	const [newTitle, setNewTitle] = useState("");
	 const [searchTerm, setSearchTerm] = useState("");

		const filteredChatrooms = useMemo(() => {
		const term = searchTerm.toLowerCase();
		return chatrooms.filter((room) =>
			room.title.toLowerCase().includes(term)
		);
	}, [searchTerm, chatrooms]);

	const handleAdd = () => {
		if (!newTitle.trim()) return;
		addChatroom(newTitle);
		setNewTitle("");
	};

	 const handleSearchChange = debounce((val) => {
		setSearchTerm(val);
	}, 300);
	console.log(chatrooms);
	
	return (
		<div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
		 <div className='flex items-center justify-between'>
				<h1 className="text-2xl font-semibold mb-4 text-center">CHATROOMS</h1>
					<button
					onClick={()=>navigate('/')}
					className="w-4 px-4 py-2 mt-4 mb-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
				>
					Logout
				</button>
		 </div>
		
     {/* Search bar */}
			 <input
				type="text"
				placeholder="Search chatrooms..."
				onChange={(e) => handleSearchChange(e.target.value)}
				className="mb-4 p-2 rounded-lg border w-full dark:bg-gray-700 dark:text-white"
			/>

			{/* Add Chatroom Input */}
			<div className="mb-6 flex gap-4">
				<input
					type="text"
					value={newTitle}
					onChange={(e) => setNewTitle(e.target.value)}
					placeholder="New Chatroom Title"
					className="p-2 rounded-lg border dark:bg-gray-700 dark:text-white w-full"
				/>
				<button
					onClick={handleAdd}
					className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
				>
					Add
				</button>
			</div>

			{/* Chatroom List */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{filteredChatrooms.map((room) => (
					<div
						key={room.id}
						role="button"
						tabIndex={0}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								navigate(`/chatroom/${room.id}`);
							}
						}}
						className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow flex justify-between items-center"
						onClick={() => navigate(`/chatroom/${room.id}`)}
					>
						<span>{room.title}</span>
						<button
							 onClick={(e) => {
										e.stopPropagation(); 
										deleteChatroom(room.id);
									}}
							className="text-sm text-red-600 hover:underline"
						>
							Delete
						</button>
					</div>
				))}
				{filteredChatrooms.length === 0 && (
					<p className="col-span-full text-gray-500 text-center">
						No chatrooms created yet.
					</p>
				)}
			</div>
		</div>
	)
}

export default Dashboard