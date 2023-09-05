# Luminae Skincare - Mockup Ecommerce Site

![Luminae Skincare Logo](/public/images/logo.png)

## Introduction

Luminae Skincare is a mockup ecommerce platform crafted to elegantly display a skincare brand's offerings. The project aimed to provide a seamless and aesthetically pleasing experience for users, ensuring both customers and administrators found it intuitive and user-friendly.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)

## Features

- **Product Showcase**: A pristine display of skincare products, complete with detailed descriptions, images, and pricing.
- **Categories**: Products are systematically organized into various categories for effortless navigation.
- **Admin Dashboard**: Administrators are equipped with a robust set of tools:
  - **Add, Edit, & Delete Products**: Manage product listings with ease.
  - **Product Categories**: Curate and oversee product categories.
  - **Best Sellers Highlight**: Accentuate popular items with a dedicated list.
- **User Interactivity**:
  - **Registration & Login**: A seamless integration for users to create accounts and revisit their profiles and transactional history.
  - **Shopping Cart & Checkout**: From adding products to secure payment processing, the transactional flow is intuitive.
- **Responsive Design**: Ensuring coherence across devices, be it desktops, tablets, or mobiles.

## Demo

**Note:** Server initialization might take a brief moment.
<br>
Experience the live demo here: [luminae-ecom.onrender.com](https://luminae-ecom.onrender.com/)
<br>
![Screenshot](/public/images/screenshot.png)

## Technologies Used

- **[Node.js](https://nodejs.org/)** & **[Express.js](https://expressjs.com/)**: Crafting the server-side functionality.
- **[MongoDB](https://www.mongodb.com/)** & **[Mongoose](https://mongoosejs.com/)**: Database storage and structured data modeling.
- **[Multer](https://www.npmjs.com/package/multer)**: Handling image uploads.
- **[Express-Session](https://www.npmjs.com/package/express-session)** & **[Connect-MongoDB-Session](https://www.npmjs.com/package/connect-mongodb-session)**: User session management.
- **[Bcrypt.js](https://www.npmjs.com/package/bcrypt)**: Secure password hashing.
- **[CSRF](https://www.npmjs.com/package/csurf)**: Protection against Cross-Site Request Forgery.
- **[Stripe](https://stripe.com/)**: Online payment processing.
- **[Helmet](https://helmetjs.github.io/)**: Setting HTTP headers for enhanced security.
- **[EJS](https://www.npmjs.com/package/ejs)** & **[Ejs-Mate](https://www.npmjs.com/package/ejs-mate)**: Dynamic HTML rendering and layout management.
- **[Bootstrap](https://getbootstrap.com/)**: Styling and responsive design.
- **[Cropper.js](https://fengyuanchen.github.io/cropperjs/)**: Image cropping utility.

## Getting Started

### Prerequisites

- Node.js
- Yarn or npm
- A local or remote instance of MongoDB

### Installation

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

4. Customize the content

5. Start the server:

   ```
   npm run dev
   ```

6. Access the App:
   Open your browser and visit [http://localhost:3000](http://localhost:3000) to see the Luminae Skincare mockup ecommerce site.
