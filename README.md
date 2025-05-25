# SignSetu: Visual Sign Language Dictionary

SignSetu is a comprehensive sign language learning platform aimed at bridging communication gaps by providing an interactive visual dictionary. The project offers a rich library of sign language words with images, videos, and detailed explanations.

## Live Demo

- **Frontend**: [https://sign-setu-frontend.vercel.app/](https://sign-setu-frontend.vercel.app/)
- **Backend API**: [https://sign-setu-backend.vercel.app/api](https://sign-setu-backend.vercel.app/api)
- **Demo Video**: [Watch the explanation video](https://www.loom.com/share/99586b1aa9f14eacb447395c032fc7e8?sid=f89b9b2e-bb01-4f6d-ac56-cb18264e2773) 

## Features

### Core Features
- **Visual Dictionary**: Search and browse for sign language words
- **Word Details**: View detailed sign language demonstrations with images and videos
- **Add Words**: Contribute to the dictionary by adding new words
- **Edit/Delete**: Modify or remove existing entries

### Advanced Features
- **Sign Language Translator**: Translate text to sign language with character-by-character animation
- **Indian Voice Support**: Text-to-speech with Indian English voices
- **Interactive 3D Cards**: Engaging UI with 3D effects and animations
- **Accessibility Modes**: High contrast, deaf-friendly, and motor-friendly modes
- **Welcome Experience**: Personalized onboarding flow for first-time users
- **Calculator**: Practice numeric signs with an integrated calculator

## Tech Stack

- **Frontend**:
  - React.js with Hooks and Context API
  - Framer Motion for animations
  - Tailwind CSS for styling
  - Lucide React and React Icons for UI elements
  - Three.js for 3D animations

- **Backend**:
  - Node.js with Express
  - MongoDB for database
  - RESTful API design

## About This Project

### Assignment Requirements and Implementation

This project was developed as part of an assignment to create a Mini Sign Language Visual Dictionary using the MERN stack. The core requirements were:

1. **Home Page with Search Feature**
   - Implemented a dynamic search bar with real-time filtering
   - Added suggestions for popular Indian sign language terms
   - Included recent searches feature for better user experience

2. **Word Display with Media**
   - Each word includes text definition, image representation, and video demonstration
   - Enhanced with interactive 3D card effects for engaging user experience
   - Mobile-responsive design that adapts to different screen sizes

3. **Add Word Form**
   - Created a user-friendly form for adding new signs to the dictionary
   - Implemented validation for all fields
   - Added preview functionality for better user feedback

4. **Backend API**
   - Built RESTful API endpoints for CRUD operations
   - Implemented search functionality with MongoDB
   - Added error handling and appropriate status codes

### Beyond the Requirements

I went beyond the basic requirements by implementing several advanced features:

#### Sign Language Translator (Previously Developed)
The translator feature was a project I was working on before this assignment. While not fully completed, I included it to demonstrate my ongoing interest and commitment to sign language accessibility. This feature:

- Translates text to sign language with character-by-character animations
- Shows signs for each word with appropriate hand gestures
- Includes a special focus on Indian signs (namaste, dhanyavad, etc.)
- Features Indian voice support for better learning

> Note: The translator is still a work in progress. Some animations and signs may not work perfectly, as this was an experimental feature I was developing independently before the assignment.

#### Accessibility Focus
I implemented comprehensive accessibility features because:
- Sign language tools should be accessible to everyone, including those with disabilities
- It demonstrates a deeper understanding of inclusive design principles
- Accessibility is not just a feature but a necessity for applications like this

#### Interactive Learning Components
The 3D effects and animations were added to:
- Make learning sign language more engaging and memorable
- Demonstrate technical proficiency with advanced frontend libraries
- Create a modern user experience that encourages continued use

### Demo Data Context
It's important to note that the demo words included in the application are for demonstration purposes only and may not always be accurate representations of actual sign language. In a production environment:

- Proper sign language experts would verify all content
- More comprehensive videos would be recorded
- Cultural and regional variations of signs would be documented

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local instance or Atlas connection)

### Installation

1. Clone the repository:
```
git clone https://github.com/ShreedharDynamicCraft/SignSetu.git
cd SignSetu
```

2. Install server dependencies:
```
cd server
npm install
```

3. Install client dependencies:
```
cd ../client
npm install
```

4. Create a `.env` file in the server directory with your MongoDB connection:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

5. Create a `.env` file in the client directory:
```
REACT_APP_API_URL=https://sign-setu-backend.vercel.app/api
REACT_APP_PROJECT_NAME=SignSetu
```

6. Start the server:
```
cd ../server
npm start
```

7. Start the client in a new terminal:
```
cd ../client
npm start
```

8. Open your browser and navigate to `http://localhost:3000`

## Deployment

The application is deployed on Vercel:

- Frontend: https://sign-setu-frontend.vercel.app/
- Backend API: https://sign-setu-backend.vercel.app/api

### Deployment Steps

1. Frontend deployment:
   - Pushed code to GitHub repository
   - Connected Vercel to the repository
   - Set up environment variables in Vercel dashboard
   - Deployed with Vercel's automated build process

2. Backend deployment:
   - Created a separate Vercel project for the backend API
   - Set up MongoDB connection string in Vercel environment variables
   - Configured serverless functions for the API endpoints

## API Endpoints

- **GET /api/words** - Get all words
- **GET /api/words?search=query** - Search for specific words
- **GET /api/words/:id** - Get a specific word by ID
- **POST /api/words** - Add a new word
- **PUT /api/words/:id** - Update an existing word
- **DELETE /api/words/:id** - Delete a word

## Design Decisions

### Why MongoDB?
- Perfect for document-based storage of sign language entries
- Flexible schema allows for evolution of data structure
- Excellent search capabilities for dictionary functionality

### Why Framer Motion?
- Creates fluid, natural animations that mimic actual hand movements
- Improves user engagement with interactive elements
- Allows for complex animation sequences needed for sign demonstrations

### Why Context API Over Redux?
- Appropriate complexity level for this application's state management
- Reduces boilerplate code while maintaining clean architecture
- Easier integration with React's hooks system

## Accessibility Features

SignSetu is designed with accessibility in mind:
- Screen reader friendly components
- Keyboard navigation support
- High contrast mode
- Motion-reduced animations option
- Clear visual indicators and focus states

## Future Enhancements

- Offline support with Progressive Web App features
- User accounts and personalization
- Multi-language support
- Mobile app with React Native
- Complete implementation of the translator feature with more accurate sign animations
- Integration with machine learning for sign language detection via webcam

---

Created with ❤️ by Shreedhar
