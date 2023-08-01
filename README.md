# Luminae Skincare - Mockup Ecommerce Site

![Luminae Skincare Logo](/public/images/logo.png)

## Description

Luminae Skincare is a mockup ecommerce site designed to showcase a skincare brand's products and provide a seamless shopping experience for customers. The goal of this project is to create an aesthetically pleasing and user-friendly website to attract potential customers and promote the brand's skincare products.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Routes](#routes)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Product Showcase**: Display a wide range of skincare products with detailed descriptions, images, and pricing.
- **Categories**: Organize products into different categories for easy navigation.
- **Admin**: Easily manage the store with the following features:
  - Add Products: Admin can add new skincare products to the store, including product details and images.
  - Edit Products: Admin can edit existing product information, such as descriptions and prices.
  - Delete Products: Admin has the ability to remove products from the store as needed.
  - Product Categories: Admin can create and manage product categories to keep the store organized.
  - Best Sellers List: Create a curated list of best-selling products to highlight popular items.
- **User Registration and Login**: Allow users to create accounts and log in to access their profiles and order history.
- **Shopping Cart**: Enable users to add products to their cart, update quantities, and proceed to checkout.
- **Checkout Process**: Provide a secure and straightforward checkout process for users to complete their purchases.
- **Responsive Design**: Ensure the website is fully responsive and works seamlessly on various devices, including desktops, tablets, and mobile phones.

## Demo

**Note:** The demo might take a minute to start up.
[Live Demo](https://luminae-ecom.onrender.com/)
![Screenshot](/public/images/screenshot.png)

## Technologies Used

- **Node.js**: A JavaScript runtime used for server-side development.
- **Express.js**: A web application framework for Node.js used to build the backend server.
- **MongoDB**: A NoSQL database for storing product and user data.
- **Mongoose**: An object data modeling library for Node.js and MongoDB.
- **Multer**: A middleware for handling file uploads, used to store product images.
- **EJS**: A templating engine to render dynamic HTML templates.
- **Express-Session**: A session middleware for managing user sessions.
- **Connect-MongoDB-Session**: A MongoDB session store for Express.js.
- **Bcrypt.js**: A library for hashing passwords securely.
- **CSRF**: A middleware for protecting against Cross-Site Request Forgery attacks.
- **Stripe**: A payment processing platform for handling secure online payments.
- **Helmet**: A middleware for setting HTTP headers to enhance security.
- **Ejs-Mate**: A layout engine for EJS, used for reusable template components.
- **Cropper.js**: A JavaScript image cropping library for handling image cropping functionality.
- **Bootstrap**: A popular CSS framework for building responsive and mobile-first websites.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/medaworld/luminae-ecommerce-site
   cd luminae-skincare-ecommerce
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up your environment variables:

- Create a .env.local file in the root directory.
- Add the required environment variables, such as MONGO_URI, SESSION_SECRET, and STRIPEPK for database connection, session secret, and Stripe integration, respectively.

## Usage

1. Customize the content

2. Start the server:

   ```
   npm run dev
   ```

3. Access the site on your browser at http://localhost:3000 to see the Luminae Skincare mockup ecommerce site.
