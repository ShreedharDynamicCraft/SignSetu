# SignSetu Vercel Deployment Guide

This guide explains how to deploy SignSetu to Vercel for a production environment.

## Project Structure

```
SignSetu/
├── client/             # React frontend
├── server/             # Express backend
├── vercel.json         # Root Vercel configuration
└── VERCEL_DEPLOYMENT.md
```

## Deployment Steps

### 1. Deploy the Server (API)

First, deploy the backend API:

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Create a new Vercel project:
   ```
   vercel
   ```

3. Configure environment variables in the Vercel dashboard:
   - `MONGODB_URI` - Your MongoDB connection string
   - `NODE_ENV` - Set to "production"

4. Note the deployment URL (e.g., `https://signsetu-api.vercel.app`)

### 2. Configure the Client

1. Update the production environment variables in `/client/.env.production`:
   ```
   REACT_APP_API_URL=https://your-api-url.vercel.app/api
   REACT_APP_PROJECT_NAME=SignSetu
   GENERATE_SOURCEMAP=false
   ```

### 3. Deploy the Client

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Deploy to Vercel:
   ```
   vercel
   ```

3. Set the client's production domain in Vercel dashboard (e.g., `signsetu.vercel.app`)

### 4. Alternative: Deploy Entire Repository

You can also deploy the entire repository at once:

1. From the project root:
   ```
   vercel
   ```

2. Vercel will use the root `vercel.json` configuration to build and deploy the client

## Local Development

For local development:

1. Install dependencies in both directories:
   ```
   cd server && npm install
   cd ../client && npm install
   ```

2. Start the server:
   ```
   cd server && npm start
   ```

3. Start the client in a separate terminal:
   ```
   cd client && npm start
   ```

4. Access the app at `http://localhost:3000`

## Environment Variables

### Server Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (defaults to 5000)

### Client Environment Variables
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_PROJECT_NAME`: Application name

## Troubleshooting

- If API calls fail, check CORS configuration in `server/index.js`
- Verify environment variables are set correctly in Vercel dashboard
- Check API health at `/api/health` endpoint
