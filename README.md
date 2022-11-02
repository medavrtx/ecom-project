# ECOM App

![ECOMApp](/public/images/screenshot.png)

A ecommerce project built with Node.js and Express. Uses mongoose+mongodb for the database, but also includes tags where MySQL and Sequelize are used. Uses Sass (scss) for styling. The app allows admin to add/edit/delete products. Includes session middleware using express-session, csrf token using csurf, form validation using express-validator, password encryption using bcrypt, image uploading using multer, pdf creating/downloading using pdfkit and payment using stripe. Allows users to create accounts and purchase as well.

## Setup

1. Clone repo
2. Create `.env.local` file in the root directory of this project
3. Insert `MONGO_URI='mongodb+srv://<username>:<password>@<clustername>.jrwem.mongodb.net/todo-app?retryWrites=true&w=majority'` into the `.env.local` file
4. Insert `STRIPEPK='<stripe public key>'` into the `.env.local` file
5. Insert `STRIPESK='<stripe secret key>'` into the `.env.local` file
6. `npm i`
7. `npm run dev`
8. Open browser at `http://localhost:3000`
