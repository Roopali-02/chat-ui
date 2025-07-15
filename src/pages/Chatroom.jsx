import React, { useEffect, useRef, useState,useMemo  }  from 'react'
import { useParams,useNavigate } from "react-router-dom";
import useChatStore from "../store/chatStore";
import { toast } from "react-toastify";
const Chatroom = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { chatrooms, messages, sendMessage,loadOlderMessages  } = useChatStore();
	const room = chatrooms.find((c) => c.id === id);

	const messageList = useMemo(() => messages[id] || [], [messages, id]);
	const [input, setInput] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const containerRef = useRef(null);
	const [loadingMore, setLoadingMore] = useState(false);
	const bottomRef = useRef(null);
const [hasScrolled, setHasScrolled] = useState(false);

useEffect(() => {
	const el = containerRef.current;
	const onUserScroll = () => setHasScrolled(true);
	el?.addEventListener("scroll", onUserScroll);
	return () => el?.removeEventListener("scroll", onUserScroll);
}, []);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messageList]);

	if (!room) {
		return (
			<div className="min-h-screen flex items-center justify-center text-red-500">
				Chatroom not found!
			</div>
		);
	}

	const handleScroll = () => {
		if (containerRef.current.scrollTop === 0 && !loadingMore && hasScrolled) {
			setLoadingMore(true);
			setTimeout(() => {
				loadOlderMessages(id);
				setLoadingMore(false);
			}, 1000);
		}
	};

 const handleSend = () => {
		if (!input.trim() && !imagePreview) return;

		sendMessage(id, input.trim(), "user", imagePreview);
		setInput("");
		setImageFile(null);
		setImagePreview(null);

		setIsTyping(true);
		setTimeout(() => {
			sendMessage(id, "Gemini AI received your message!", "ai");
			setIsTyping(false);
		}, 1500);
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		 setImageFile(file);
e.target.value = null;
		const reader = new FileReader();
		reader.onloadend = () => {
			setImagePreview(reader.result);
		};
		reader.readAsDataURL(file);
	};
	return (
		<div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
			<div className='flex items-center justify-between'>
				<h2 className="text-xl font-semibold mb-4">Chatroom : {room.title}</h2>
				<button
						onClick={()=>navigate(-1)}
						className="w-4 px-4 py-2 mt-4 mb-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
					>
						Back
					</button>
			</div>

			{/* Messages */}
			<div
				ref={containerRef}
				onScroll={handleScroll}
				className="flex-1 overflow-y-auto space-y-3 p-4 bg-white dark:bg-gray-800 rounded-xl">
				{loadingMore && (
					<div className="text-sm text-gray-500 text-center">Loading more messages...</div>
				)}
				{messageList.map((msg) => (
			  <div
					key={msg.id}
					className={`relative group p-2 rounded-lg max-w-xs ${
						msg.sender === "user"
							? "bg-blue-500 text-white self-end ml-auto"
							: "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
					}`}
					>

		{/* Copy Button (only if text is present) */}
		{msg.text && (
			<button
				onClick={() => {
					navigator.clipboard.writeText(msg.text);
					toast.success("Message copied to clipboard!");
				}}
				className="absolute top-1 right-1 text-xs bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
			>
				Copy
			</button>
		)}

		{/* Message Text */}
		{msg.text && <p>{msg.text}</p>}

		{/* Image (if any) */}
		{msg.image && (
			<img
				src={msg.image}
				alt="Uploaded"
				className="mt-2 max-w-full rounded"
			/>
		)}

		{/* Timestamp */}
		<p className="text-xs mt-1 opacity-70">
			{new Date(msg.timestamp).toLocaleTimeString()}
		</p>
			</div>
	))}

	{isTyping && (
	<div className="flex items-center gap-2 p-2 max-w-xs bg-gray-300 dark:bg-gray-700 rounded-lg">
		{/* Typing dots/skeleton */}
		<div className="animate-pulse flex flex-col gap-1">
			<div className="h-3 w-24 bg-gray-400 dark:bg-gray-600 rounded" />
			<div className="h-3 w-16 bg-gray-400 dark:bg-gray-600 rounded" />
		</div>
		{/* Text requirement */}
		<p className="text-xs text-gray-600 dark:text-gray-300">Gemini is typing...</p>
	</div>
	)}

			<div ref={bottomRef} />
			</div>

			{/* Input area */}
			<div className="mt-4 space-y-2">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault(); 
							handleSend();
						}
					}}
					placeholder="Type your message..."
					className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
				/>

				{/* File upload + preview */}
				<div className="flex items-center gap-2">
					<input
						type="file"
						accept="image/*"
						onChange={handleImageChange}
						className="text-sm text-gray-600 dark:text-gray-300"
					/>
					{imagePreview && (
						<div className="relative">
							<img
								src={imagePreview}
								alt="preview"
								className="h-16 w-16 object-cover rounded"
							/>
							<button
								onClick={() => {
									setImageFile(null);
									setImagePreview(null);
								}}
								className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-5 h-5"
							>
								×
							</button>
						</div>
					)}
				</div>

				<button
					onClick={handleSend}
					className="w-full py-2 my-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
				>
					Send
				</button>
			</div>
		</div>
	)
}

export default Chatroom