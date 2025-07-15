## 🚀 Project Overview
This is a conversational AI frontend built using React, Zustand, Tailwind CSS, and React Hook Form + Zod. It simulates OTP login, chatroom management, AI messaging, image uploads, dark mode, and responsive UI.

## Live Link
https://chat-ui-inky-one.vercel.app/


## Setup & run Installations
1. Clone the repository:
```bash
   git clone https://github.com/Roopali-02/chat-ui.git
```
2. Navigate into the project directory:
```bash
    cd chat-ui
```
3. Install dependencies:
```bash
    npm install
```
4. Start the development server:
```bash
    npm run dev
```

## Folder/component structure explanation
- `pages/`: Top-level route pages including Login, Dashboard, and ChatRoom.
- `store/`: Zustand store for managing auth state, chatrooms, and messages.

## How throttling, pagination, infinite scroll, and form validation are implemented
- Form Validation: Handled using React Hook Form + Zod on the login screen. Validates country code and phone number.
- Throttling: Search input in dashboard is throttled using lodash.debounce (300ms delay).
- Infinite Scroll: Older messages load when you scroll to the top in the chat screen (reverse infinite scroll). 
- Simulated AI Messaging: Gemini replies with delay using setTimeout, with typing indicator.
- OTP Simulation: OTP send/verify is faked using setTimeout and basic input checks.
- Image Upload: Messages support image preview using base64 via FileReader.
- Copy to Clipboard: Hover on a text message shows a copy button.
- Dark Mode: UI adapts based on dark/light mode toggle.
- Toast Notifications: Shown for actions like OTP sent, message copied.