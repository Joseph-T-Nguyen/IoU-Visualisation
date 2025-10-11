# Google Auth Setup Instructions

## Environment Variables

You need to set up the following environment variables for Google OAuth to work:

### Option 1: Environment Variables
Set these environment variables in your system or deployment environment:

```bash
export GOOGLE_CLIENT_ID="your_google_client_id_here"
export DATABASE_URL="postgresql://username:password@localhost:5432/iou_db"
export PORT=3000
export NODE_ENV=development
```

### Option 2: Create .env files
Create the following files in the `backend/config/` directory:

**backend/config/.env.development:**
```
DATABASE_URL="postgresql://username:password@localhost:5432/iou_db"
GOOGLE_CLIENT_ID="your_google_client_id_here"
PORT=3000
NODE_ENV=development
```

**backend/config/.env.production:**
```
DATABASE_URL="postgresql://username:password@your-production-db:5432/iou_db"
GOOGLE_CLIENT_ID="your_google_client_id_here"
PORT=3000
NODE_ENV=production
```

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" → "OAuth 2.0 Client IDs"
6. Set the application type to "Web application"
7. Add your frontend URL to "Authorized JavaScript origins" (e.g., `http://localhost:5173`)
8. Copy the Client ID and use it as your `GOOGLE_CLIENT_ID`

## Frontend Configuration

Make sure your frontend has the same Google Client ID set in its environment variables:

**frontend/iou/.env.local:**
```
VITE_GOOGLE_CLIENT_ID="your_google_client_id_here"
VITE_API_URL="http://localhost:3000"
```

## How It Works

1. User logs in with Google on the frontend
2. Frontend receives a JWT token from Google
3. Frontend sends this JWT token to `/api/auth/login`
4. Backend verifies the JWT token with Google
5. Backend extracts the Google user ID (from the `sub` field)
6. Backend creates or finds the user in the database using the Google ID as the primary key
7. All subsequent API calls use the JWT token for authentication
8. The user ID is extracted from the token and used for workspace operations

## Database Schema

The system uses the existing `User.id` field to store the Google user ID (from the JWT `sub` field). No schema changes are required.
