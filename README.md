# Group Chat

This project allows users to create, join, and manage groups for real-time communication. Group members can exchange messages and share files.

## Features

- **Responsive Design**: Works on both mobile and desktop devices using modern web standards (HTML5, CSS3, and responsive frameworks).
- **Secure Authentication**: Token-based authentication with JSON Web Token (JWT) ensures secure access.
- **User Registration**: Users can sign up with their name, email, and password.
- **Login**: Registered users can log in with their email and password.
- **Password Reset**: Users can reset their password via an email link.
- **Group Management**: Users can create and delete groups.
- **Member Management**: Group admins can add or remove members by email.
- **Admin Controls**: Only group admins can manage group members and delete groups.
- **Messaging**: Users can send messages and share files within groups.
- **Message Archiving**: Messages older than one month are automatically archived.
- **Logout**: Users can securely log out and must re-enter their password to log back in.

## Technology Stack

- **Backend**: Node.js, Express, Socket.IO
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap
- **Authentication**: JSON Web Token (JWT)
- **Database**: MySQL (with Sequelize ORM), MongoDB (Mongoose ODM on a separate branch)
- **Cloud Services**: AWS SDK (for file sharing)
- **Email Service**: Nodemailer
- **Other Tools**: Axios, Bcrypt, CORS, Dotenv, Helmet, Morgan, Multer, Node-Cron, UUID

## API Endpoints

### Base URL: `http://localhost:3000/`

### User Endpoints

- `GET /user/signup-page`: Retrieve the sign-up page.
- `GET /user/login-page`: Retrieve the login page.
- `POST /user/signup`: Register a new user.
- `POST /user/login`: Log in an existing user.
- `POST /user/logout`: Log out the current user.

### Password Endpoints

- `GET /password/forgot-password-page`: Retrieve the password reset page.
- `POST /password/forgot-password`: Send a password reset link to the user’s email.
- `GET /password/reset-password-page/:resetId`: Retrieve the password reset page using the token.
- `POST /password/reset-password/:resetId`: Reset the password using the token.

### Group Endpoints

- `GET /group/get-groups`: Retrieve all available groups.
- `POST /group/create-group`: Create a new group.
- `DELETE /group/delete-group/:groupId`: Delete a group by its ID.
- `POST /group/add-to-group`: Add members to a group.
- `POST /group/remove-from-group`: Remove members from a group.
- `GET /group/get-group-members/:groupId`: Get all members of a group by its ID.

### Message Endpoints

- `POST /message/send-message`: Send a message in a group.
- `GET /message/get-message/:groupId`: Retrieve messages from a group.
- `POST /message/upload-file/:groupId`: Upload a file to a group.

## Screenshots

### signup page
![signup](/screenshots/01-signup.png)

### login page
![login](/screenshots/02-login.png)

### forgot password page
![forgot password](/screenshots/03-forgotPassword.png)

### reset password link sent
![reset password link sent](/screenshots/04-resetPasswordLinkSend.png)

### reset password link
![reset password link](/screenshots/05-resetPasswordLink.png)

### change password
![change password](/screenshots/06-changePassword.png)

### password changed
![password changed](/screenshots/07-passwordChanged.png)

### home page
![home](/screenshots/08-home.png)

### create group
![create group](/screenshots/09-createGroup.png)

### open group as admin
![open group as admin](/screenshots/10-openGroupAsAdmin.png)

### delete group
![delete group](/screenshots/11-deleteGroup.png)

### add people to group
![add people](/screenshots/12-addPeople.png)

### remove people from group
![remove people](/screenshots/13-removePeople.png)

### people added to group
![people added](/screenshots/14-peopleAdded.png)

### open group as a member
![open group as a member](/screenshots/15-openGroupAsMember.png)

### join other group
![join other group](/screenshots/16-joinOtherGroup.png)

### group messages
![group messages](/screenshots/17-groupMessages.png)

### select a file to send in group
![select a file to send](/screenshots/18-selectFileToSend.png)

### sending file in group
![sending file](/screenshots/19-sendingFile.png)

### viewing file
![viewing file](/screenshots/20-viewingFile.png)