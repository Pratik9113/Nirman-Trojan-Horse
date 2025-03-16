# AI-Powered Price Negotiation Chatbot with Google Gemini

This project implements an AI-powered price negotiation chatbot for an e-commerce platform using Google's Gemini API. The chatbot allows users to negotiate prices for products in a natural, conversational way.

## Features

- Interactive chat interface for price negotiation
- Powered by Google's Gemini AI model
- Smart detection of budget and quantity from user messages
- Real-time negotiation based on discount thresholds
- Purchase completion flow
- Typing indicators and visual feedback
- Mobile-responsive design

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-directory>
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nirman-trojan-horse
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
```

4. Get a Gemini API key:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create an API key
   - Copy the key to your `.env` file

5. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Install frontend dependencies:
```bash
cd frontend
npm install
```

2. Start the frontend development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## How to Use

1. Browse the available products on the dashboard
2. Click "Negotiate Price" on any product
3. Enter your budget and desired quantity
4. Negotiate with the AI assistant
5. Complete the purchase when a deal is reached

## Customization

### Negotiation Parameters

You can customize the negotiation parameters in `backend/controllers/negotiation.controller.js`:

- Discount thresholds
- Negotiation strategies
- Response tone and style

### UI Customization

The UI components are built with shadcn/ui and can be customized in the frontend components.

## Technologies Used

- **Backend**: Node.js, Express, MongoDB
- **Frontend**: React, Vite, shadcn/ui
- **AI**: Google Gemini API
- **Styling**: Tailwind CSS

## License

MIT

## Acknowledgements

- Google Gemini API
- shadcn/ui component library
- Tailwind CSS

