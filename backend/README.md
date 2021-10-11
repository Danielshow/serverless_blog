# Serverless - Blog Typescript

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

This is a Blog platform that enables use create, update and delete blog

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

## Routes
  - GET - /dev/blogs
  - GET - /blogs/user/mine
  - POST - /blogs
  - PATCH - /blogs/{blogId}
  - DELETE - /blogs/{blogId}
  - POST - /blogs/{blogId}/attachment

### How to install
- Add serverless globally using `npm install -g serverless`
- Add config using `sls config credentials --provider aws --key "$AWS_ACCESS_KEY_ID" --secret "$AWS_SECRET_ACCESS_KEY" --profile serverless`
- npm install
- sls deploy -v

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:
- auth - Contains Jwt details
- helpers - Contains blog utils functions
- lambda - Contains lambda function
- libs - Contains helper utils
- models - Contain models
- requests - Contain request format

### 3rd party libraries
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file

