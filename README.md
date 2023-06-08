# ImageHub

This is a website that allows users to create accounts, post images, and leave comments.

# Deployment Instructions

1. Clone the project.
2. Create a database schema.
3. Create a `.env` file and and fill the information below. You can also make a copy from `.env.example` file and update it.
	```
	DB_HOST="localhost"
	DB_NAME="final_project"
	DB_PORT=3306
	DB_USER="root"
	DB_PASSWORD=""
	
	APP_URL="http://localhost:3000"
	APP_SECRET="4wlf2KPppXiGwxguSSUNEhq1D9wKxG3B"
	```
	* `APP_SECRET` is a random 32-character-long string used to encrypt the JWT tokens. 
4. Run the following command to create the database tables.
	```
	$ node create_tables.js
	```
5. Install the required packages.
	```
	$ npm install
	```
6. Start the server.
	```
	$ npm start
	```


From the website's homepage, you can create a new account by clicking on the "Sign Up" button and following the registration process.

Once you have created an account and logged in, you will be able to post images and leave comments on the website.

Technologies Used
Node.js: Backend JavaScript runtime environment.
HTML: Markup language for creating the website's structure.
CSS: Styling language for designing the website's appearance.
JavaScript: Programming language for adding interactivity to the website.
