# Serverless Blog

This Blog contains UI built with react and an API built with serverless technology

# Functionality of the application

This application will allow creating/removing/updating/fetching Blogs items. Each Blog item can optionally have an attachment image. All user have access to published blog.

# Blogs items

The application should store TODO items, and each TODO item contains the following fields:

* `blogId` (string) - a unique id for a blog
* `createdAt` (string) - date and time when an blog was created
* `title` (string) - Title of a Blog (e.g. "Change a light bulb")
* `content` (string) - content of the blog
* `published` (boolean) - true if an blog was published, false otherwise
* `publishedAt` (string) (optional) - Date the blog was published
* `attachementUrl` (string) (optional) - Url of the hero image
* `userId` (string) - ID of the user that created the blog

# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.
