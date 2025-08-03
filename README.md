BlogHub
BlogHub is a full-stack web application for creating, sharing, and interacting with blog posts. Built with a modern tech stack, it offers a seamless user experience with features like infinite scrolling, user authentication, and real-time interactions.
Features
Blog Management

Create Blogs: Authenticated users can create new blog posts with a title and HTML-rich content using a user-friendly interface.
Edit Blogs: Blog authors can edit their posts to update the title or content.
Delete Blogs: Authors can delete their own blog posts.
View Blogs: Users can browse all blogs on the home page with infinite scrolling for seamless pagination.
Blog Details: View detailed blog posts with content, author information, likes, and comments.

User Interactions

Like Blogs: Authenticated users can like blog posts, with the like count displayed in real-time.
Comment on Blogs: Users can add comments to blog posts, with comments displayed below the post content.
User Profiles: View user profiles with their authored blogs and basic information (name, email, avatar).

Authentication

User Registration: New users can sign up with a name, email, and password.
User Login: Secure login for registered users to access protected features (creating, editing, liking, commenting).
Auth Callback: Supports OAuth or external authentication flows via an /auth-callback endpoint.

UI/UX

Responsive Design: Built with Tailwind CSS for a responsive and modern UI, optimized for desktop and mobile devices.
Infinite Scrolling: Blogs load dynamically as users scroll, improving performance and user experience.
Rich Text Content: Blog content supports HTML formatting for rich text display.
Error Handling: Robust error boundaries and loading states ensure a smooth user experience even during network issues.

Technical Features

Type-Safe Code: Uses TypeScript for type safety across the frontend and backend.
State Management: Redux Toolkit for managing global state (blogs, authentication).
API Integration: RESTful API with endpoints for blog CRUD operations, likes, and comments.
MongoDB Backend: Persistent storage using MongoDB with Mongoose for schema validation.
Debounced Infinite Scroll: Prevents excessive API calls with debounced fetching.

Tech Stack

Frontend:
React (with TypeScript)
React Router for navigation
Redux Toolkit for state management
Tailwind CSS for styling
React Infinite Scroll Component for pagination
Lucide React for icons


Backend:
Node.js with Express
MongoDB with Mongoose
TypeScript for type safety


Database: MongoDB
Dependencies: Axios, Lodash, Vite (frontend build tool)

Prerequisites
Before setting up BlogHub, ensure you have the following installed:

Node.js (v16 or higher)
npm (v7 or higher)
MongoDB (local or cloud instance, e.g., MongoDB Atlas)
Git (for cloning the repository)

Setup Instructions
1. Clone the Repository
git clone https://github.com/your-username/BlogHub.git
cd BlogHub

2. Set Up the Backend

Navigate to the backend directory:cd server


Install dependencies:npm install


Create a .env file in the server directory with the following:PORT=5000
MONGODB_URI=mongodb://localhost:27017/bloghub
JWT_SECRET=your_jwt_secret_key


Replace mongodb://localhost:27017/bloghub with your MongoDB connection string (e.g., MongoDB Atlas URI).
Replace your_jwt_secret_key with a secure secret for JWT authentication.


Start the MongoDB server (if using a local instance):mongod


Start the backend server:npm run dev

The backend will run on http://localhost:5000.

3. Set Up the Frontend

Open a new terminal and navigate to the frontend directory:cd blog-frontend


Install dependencies:npm install


Create a .env file in the blog-frontend directory with the following:VITE_API_URL=http://localhost:5000/api


Ensure VITE_API_URL points to your backend API base URL.


Start the frontend development server:npm run dev

The frontend will run on http://localhost:5173.

4. Seed the Database (Optional)
To populate the database with test data:

Connect to MongoDB:mongosh


Switch to the bloghub database:use bloghub


Insert a test user:db.users.insertOne({
  _id: ObjectId("688cb1ac6a9eadc99150ce03"),
  name: "Test User",
  email: "test@example.com",
  password: "hashed_password",
  avatar: "",
  createdAt: ISODate(),
  updatedAt: ISODate()
});


Insert a test blog:db.blogs.insertOne({
  _id: ObjectId("688cb34f5be4594f5febd954"),
  title: "Welcome to BlogHub",
  content: "<p>Hi this is the first blog in BlogHub. I am so happy to blog here. Wonderful</p>",
  author: ObjectId("688cb1ac6a9eadc99150ce03"),
  likes: [],
  comments: [
    {
      user: ObjectId("688cb1ac6a9eadc99150ce03"),
      content: "hi",
      createdAt: ISODate("2025-08-01T15:10:15.703Z"),
      _id: ObjectId("688cd8d7173377df15c01745")
    }
  ],
  createdAt: ISODate("2025-08-01T12:30:07.140Z"),
  updatedAt: ISODate("2025-08-01T15:10:15.704Z")
});



5. Access the Application

Open http://localhost:5173 in your browser.
Register a new user or log in with test credentials (if seeded).
Create, view, like, comment, edit, or delete blogs.

Usage

Home Page: Browse all blogs with infinite scrolling. Click a blog title to view details.
Blog Detail Page: View blog content, like or comment on posts, and edit/delete if you’re the author.
Profile Page: View a user’s blogs and profile information.
Create/Edit Blog: Use the blog creation form to write or update posts with HTML content.
Authentication: Log in or register to access protected features.

Troubleshooting

MongoDB Connection Errors:
Ensure MongoDB is running and the MONGODB_URI in .env is correct.
Check for invalid user references with:db.users.find();
db.blogs.find({ author: { $exists: false } });




API Errors:
Verify the backend is running on http://localhost:5000.
Check Console and Network tabs in the browser’s DevTools for errors.


Infinite Update Loop:
Ensure lodash is installed (npm install lodash @types/lodash).
Disable React Strict Mode in blog-frontend/src/main.tsx for testing:createRoot(document.getElementById('root')!).render(<App />);





Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a pull request.

License
This project is licensed under the MIT License.