import { create } from "zustand";
import { nanoid } from "nanoid";
import { persist } from "zustand/middleware";

const useChatStore = create(
  persist(
    (set) => ({
      chatrooms: [],
      messages: {},

      addChatroom: (title) =>
        set((state) => {
          const id = nanoid();
          return {
            chatrooms: [...state.chatrooms, { id, title }],
            messages: { ...state.messages, [id]: [] },
          };
        }),
      loadOlderMessages: (chatroomId) =>
        set((state) => {
          const oldMessages = Array.from({ length: 10 }).map(() => ({
            id: nanoid(),
            text: "Old message...",
            sender: "user",
            timestamp: new Date().toISOString(),
          }));

          return {
            messages: {
              ...state.messages,
              [chatroomId]: [...oldMessages, ...(state.messages[chatroomId] || [])],
            },
          };
        }),

      deleteChatroom: (id) =>
        set((state) => {
          const { [id]: _, ...rest } = state.messages;
          return {
            chatrooms: state.chatrooms.filter((room) => room.id !== id),
            messages: rest,
          };
        }),

      sendMessage: (chatroomId, text, sender = "user", image = null) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatroomId]: [
              ...(state.messages[chatroomId] || []),
              {
                id: nanoid(),
                text,
                image,
                sender,
                timestamp: new Date().toISOString(),
              },
            ],
          },
        })),
    }),
    {
      name: "chat-store", // key in localStorage
    }
  )
);

export default useChatStore;
