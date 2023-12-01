# SJSUL Library Management System

## Overview

The SJSUL Library Management System is a robust web application built with Next.js. It provides functionalities such as book search, book checkout, book return, and user management.

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL
- Vercel account for deployment

## Website

You can access the website at [https://school-cmpe132-project-implementation.vercel.app/](https://school-cmpe132-project-implementation.vercel.app/)

## Local Setup

1. Clone the repository: `git clone <repository-url>`.
2. Navigate to the project directory: `cd <project-directory>`.
3. Install dependencies: `npm install`.
4. Set up your PostgreSQL database on vercel and note down the connection details.
5. Create a `.env` file in the root of your project and add your database connection string as `DATABASE_URL`.
6. Create an `AUTH_SECRET` and add it to the `.env` file.
7. Seed the database using `npm run seed`.
8. Run the application: `npm run dev`.

## Usage

After starting the application, you can access the system at `http://localhost:3000`. You can search for books, check out books, return books, and manage users.

## Testing

To run the tests, use the command: `npm test`

## Deployment

1. Push your code to a GitHub repository.
2. Connect your GitHub repository to Vercel.
3. Add your `DATABASE_URL` to the environment variables in your Vercel project settings.
4. Deploy your application.
