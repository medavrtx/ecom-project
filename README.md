# Luminae Skincare

![ECOMApp](/public/images/screenshot.png)

Luminae Skincare is a mock up ecommerce project built with Node.js (Express). Uses mongodb for the database, bootstrap for styling. Demonstrates the use of express-session, csrf token, form validation, password encryption (bcrypt), image uploading (multer), pdf creating/downloading (pdfkit), payment (stripe), and cropping images (cropperjs).

## Setup

1. Clone repo
2. Create `.env.local` file in the root directory of this project
3. Insert `MONGO_URI='mongodb+srv://<username>:<password>@<clustername>.jrwem.mongodb.net/todo-app?retryWrites=true&w=majority'` into the `.env.local` file
4. Insert `STRIPEPK='<stripe public key>'` into the `.env.local` file
5. Insert `STRIPESK='<stripe secret key>'` into the `.env.local` file
6. `npm i`
7. `npm run dev`
8. Open browser at `http://localhost:3000`
