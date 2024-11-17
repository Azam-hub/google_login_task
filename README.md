## To Use this Project

- Create an empty folder and open the terminal at that folder's path.
- Run **"git clone https://github.com/Azam-hub/google_login_task.git ."** (Clone into that folder)
- Run **"cd backend\"**
- Run **"composer install"**
- Run **"php artisan migrate"** (Make sure that your database server is running)
- Run **"cd ../frontend"**
- Run **"npm install"**
- Copy and Paste **".env"** variables to "backend/.env"
- Now open terminal in both folders ("frontend" and "backend")
- Run **"php artisan serve"** in **backend** folder terminal (Make sure that backend (laravel) is running on http://localhost:8000 otherwise change **REACT_APP_BACKEND_URL** in "frontend/.env")
- Run **"npm start"** in **frontend** folder terminal (Make sure that frontend (react) is running on http://localhost:3000 because redirect is set to this url)

Enjoy the website.
