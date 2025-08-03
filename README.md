# BlogHub

BlogHub is a full-stack web application for creating, sharing, and interacting with blog posts. Built with a modern tech stack, it offers a seamless user experience with features like infinite scrolling, user authentication, and real-time interactions.

## Features

### Blog Management
- **Create Blogs**: Authenticated users can create new blog posts with a title and HTML-rich content using a user-friendly interface.
- **Edit Blogs**: Blog authors can edit their posts to update the title or content.
- **Delete Blogs**: Authors can delete their own blog posts.
- **View Blogs**: Users can browse all blogs on the home page with infinite scrolling for seamless pagination.
- **Blog Details**: View detailed blog posts with content, author information, likes, and comments.

### User Interactions
- **Like Blogs**: Authenticated users can like blog posts, with the like count displayed in real-time.
- **Comment on Blogs**: Users can add comments to blog posts, with comments displayed below the post content.
- **User Profiles**: View user profiles with their authored blogs and basic information (name, email, avatar).

### Authentication
- **User Registration**: New users can sign up with a name, email, and password.
- **User Login**: Secure login for registered users to access protected features (creating, editing, liking, commenting).
- **Auth Callback**: Supports OAuth or external authentication flows via an `/auth-callback` endpoint.

### UI/UX
- **Responsive Design**: Built with Tailwind CSS for a responsive and modern UI, optimized for desktop and mobile devices.
- **Infinite Scrolling**: Blogs load dynamically as users scroll, improving performance and user experience.
- **Rich Text Content**: Blog content supports HTML formatting for rich text display.
- **Error Handling**: Robust error boundaries and loading states ensure a smooth user experience even during network issues.

### Technical Features
- **Type-Safe Code**: Uses TypeScript for type safety across the frontend and backend.
- **State Management**: Redux Toolkit for managing global state (blogs, authentication).
- **API Integration**: RESTful API with endpoints for blog CRUD operations, likes, and comments.
- **MongoDB Backend**: Persistent storage using MongoDB with Mongoose for schema validation.
- **Debounced Infinite Scroll**: Prevents excessive API calls with debounced fetching.

## Tech Stack
- **Frontend**:
  - React (with TypeScript)
  - React Router for navigation
  - Redux Toolkit for state management
  - Tailwind CSS for styling
  - React Infinite Scroll Component for pagination
  - Lucide React for icons
- **Backend**:
  - Node.js with Express
  - MongoDB with Mongoose
  - TypeScript for type safety
- **Database**: MongoDB
- **Dependencies**: Axios, Lodash, Vite (frontend build tool)

## Prerequisites
Before setting up BlogHub, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **MongoDB** (local or cloud instance, e.g., MongoDB Atlas)
- **Git** (for cloning the repository)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/BlogHub.git
cd BlogHub
```

### 2. Set Up the Backend
1. Navigate to the backend directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory with the following:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bloghub
   JWT_SECRET=your_jwt_secret_key
   ```
   - Replace `mongodb://localhost:27017/bloghub` with your MongoDB connection string (e.g., MongoDB Atlas URI).
   - Replace `your_jwt_secret_key` with a secure secret for JWT authentication.
4. Start the MongoDB server (if using a local instance):
   ```bash
   mongod
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

### 3. Set Up the Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd blog-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   npm install lodash @types/lodash
   ```
3. Create a `.env` file in the `blog-frontend` directory with the following:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   - Ensure `VITE_API_URL` points to your backend API base URL.
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

### 4. Seed the Database (Optional)
To populate the database with test data:
1. Connect to MongoDB:
   ```bash
   mongosh
   ```
2. Switch to the `bloghub` database:
   ```javascript
   use bloghub
   ```
3. Insert a test user:
   ```javascript
   db.users.insertOne({
     _id: ObjectId("688cb1ac6a9eadc99150ce03"),
     name: "Test User",
     email: "test@example.com",
     password: "hashed_password",
     avatar: "",
     createdAt: ISODate(),
     updatedAt: ISODate()
   });
   ```
4. Insert a test blog:
   ```javascript
   db.blogs.insertOne({
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
   ```

### 5. Access the Application
- Open `http://localhost:5173` in your browser.
- Register a new user or log in with test credentials (if seeded).
- Create, view, like, comment, edit, or delete blogs.

## API Documentation

The BlogHub backend provides a RESTful API for managing blogs, likes, and comments. All endpoints are prefixed with `/api`.

### Authentication
- Most endpoints require a JWT token in the `Authorization` header: `Bearer <token>`.
- Obtain a token by registering (`POST /api/auth/register`) or logging in (`POST /api/auth/login`).

### Endpoints

#### 1. Create a Blog
- **Endpoint**: `POST /api/blogs`
- **Description**: Create a new blog post.
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "title": "string",
    "content": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "success": true,
      "message": "Blog created successfully",
      "data": {
        "_id": "string",
        "title": "string",
        "content": "string",
        "author": {
          "_id": "string",
          "name": "string",
          "email": "string",
          "avatar": "string"
        },
        "likes": [],
        "comments": [],
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
    ```
  - **400 Bad Request** or **500 Internal Server Error**:
    ```json
    {
      "success": false,
      "message": "Error message",
      "error": "Error details"
    }
    ```

#### 2. Get All Blogs (Paginated)
- **Endpoint**: `GET /api/blogs?page=<number>&limit=<number>`
- **Description**: Retrieve a paginated list of blogs.
- **Authentication**: Optional
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Number of blogs per page (default: 10)
- **Response**:
  - **200 OK**:
    ```json
    {
      "success": true,
      "message": "Blogs fetched successfully",
      "data": [
        {
          "_id": "string",
          "title": "string",
          "content": "string",
          "author": {
            "_id": "string",
            "name": "string",
            "email": "string",
            "avatar": "string"
          },
          "likes": ["string"],
          "comments": [
            {
              "_id": "string",
              "user": {
                "_id": "string",
                "name": "string",
                "email": "string",
                "avatar": "string"
              },
              "content": "string",
              "createdAt": "string"
            }
          ],
          "createdAt": "string",
          "updatedAt": "string"
        }
      ],
      "hasMore": true
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "success": false,
      "message": "Server error",
      "error": "Error details"
    }
    ```

#### 3. Get a Blog by ID
- **Endpoint**: `GET /api/blogs/:id`
- **Description**: Retrieve a single blog by its ID.
- **Authentication**: Optional
- **Response**:
  - **200 OK**:
    ```json
    {
      "success": true,
      "message": "Blog fetched successfully",
      "data": {
        "_id": "string",
        "title": "string",
        "content": "string",
        "author": {
          "_id": "string",
          "name": "string",
          "email": "string",
          "avatar": "string"
        },
        "likes": ["string"],
        "comments": [
          {
            "_id": "string",
            "user": {
              "_id": "string",
              "name": "string",
              "email": "string",
              "avatar": "string"
            },
            "content": "string",
            "createdAt": "string"
          }
        ],
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
    ```
  - **404 Not Found** or **500 Internal Server Error**:
    ```json
    {
      "success": false,
      "message": "Blog not found",
      "error": "Error details"
    }
    ```

#### 4. Update a Blog
- **Endpoint**: `PUT /api/blogs/:id`
- **Description**: Update a blog post (only by the author).
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "title": "string",
    "content": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "success": true,
      "message": "Blog updated successfully",
      "data": {
        "_id": "string",
        "title": "string",
        "content": "string",
        "author": {
          "_id": "string",
          "name": "string",
          "email": "string",
          "avatar": "string"
        },
        "likes": ["string"],
        "comments": [],
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
    ```
  - **403 Forbidden**, **404 Not Found**, or **500 Internal Server Error**:
    ```json
    {
      "success": false,
      "message": "Unauthorized to edit this blog",
      "error": "Error details"
    }
    ```

#### 5. Delete a Blog
- **Endpoint**: `DELETE /api/blogs/:id`
- **Description**: Delete a blog post (only by the author).
- **Authentication**: Required
- **Response**:
  - **200 OK**:
    ```json
    {
      "success": true,
      "message": "Blog deleted successfully",
      "data": {}
    }
    ```
  - **403 Forbidden**, **404 Not Found**, or **500 Internal Server Error**:
    ```json
    {
      "success": false,
      "message": "Unauthorized to delete this blog",
      "error": "Error details"
    }
    ```

#### 6. Like a Blog
- **Endpoint**: `POST /api/blogs/:id/like`
- **Description**: Like or unlike a blog post.
- **Authentication**: Required
- **Response**:
  - **200 OK**:
    ```json
    {
      "success": true,
      "message": "Blog liked successfully",
      "data": {
        "_id": "string",
        "title": "string",
        "content": "string",
        "author": {
          "_id": "string",
          "name": "string",
          "email": "string",
          "avatar": "string"
        },
        "likes": ["string"],
        "comments": [],
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
    ```
  - **404 Not Found** or **500 Internal Server Error**:
    ```json
    {
      "success": false,
      "message": "Blog not found",
      "error": "Error details"
    }
    ```

#### 7. Comment on a Blog
- **Endpoint**: `POST /api/blogs/:id/comment`
- **Description**: Add a comment to a blog post.
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "content": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "success": true,
      "message": "Comment added successfully",
      "data": {
        "_id": "string",
        "title": "string",
        "content": "string",
        "author": {
          "_id": "string",
          "name": "string",
          "email": "string",
          "avatar": "string"
        },
        "likes": ["string"],
        "comments": [
          {
            "_id": "string",
            "user": {
              "_id": "string",
              "name": "string",
              "email": "string",
              "avatar": "string"
            },
            "content": "string",
            "createdAt": "string"
          }
        ],
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
    ```
  - **404 Not Found** or **500 Internal Server Error**:
    ```json
    {
      "success": false,
      "message": "Blog not found",
      "error": "Error details"
    }
    ```

#### 8. User Registration
- **Endpoint**: `POST /api/auth/register`
- **Description**: Register a new user.
- **Authentication**: Not required
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "success": true,
      "message": "User registered successfully",
      "data": {
        "_id": "string",
        "name": "string",
        "email": "string",
        "avatar": "string"
      },
      "token": "string"
    }
    ```
  - **400 Bad Request** or **500 Internal Server Error**:
    ```json
    {
      "success": false,
      "message": "Email already exists",
      "error": "Error details"
    }
    ```

#### 9. User Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Log in a user and return a JWT token.
- **Authentication**: Not required
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "success": true,
      "message": "Login successful",
      "data": {
        "_id": "string",
        "name": "string",
        "email": "string",
        "avatar": "string"
      },
      "token": "string"
    }
    ```
  - **401 Unauthorized** or **500 Internal Server Error**:
    ```json
    {
      "success": false,
      "message": "Invalid credentials",
      "error": "Error details"
    }
    ```

## Usage
1. **Home Page**: Browse all blogs with infinite scrolling. Click a blog title to view details.
2. **Blog Detail Page**: View blog content, like or comment on posts, and edit/delete if you’re the author.
3. **Profile Page**: View a user’s blogs and profile information.
4. **Create/Edit Blog**: Use the blog creation form to write or update posts with HTML content.
5. **Authentication**: Log in or register to access protected features.

## Troubleshooting
- **MongoDB Connection Errors**:
  - Ensure MongoDB is running and the `MONGODB_URI` in `.env` is correct.
  - Check for invalid user references:
    ```javascript
    db.users.find();
    db.blogs.find({ author: { $exists: false } });
    ```
- **API Errors**:
  - Verify the backend is running on `http://localhost:5000`.
  - Check Console and Network tabs in the browser’s DevTools for errors.
- **Infinite Update Loop**:
  - Ensure `lodash` is installed (`npm install lodash @types/lodash`).
  - Disable React Strict Mode in `blog-frontend/src/main.tsx` for testing:
    ```tsx
    createRoot(document.getElementById('root')!).render(<App />);
    ```

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License
This project is licensed under the MIT License.