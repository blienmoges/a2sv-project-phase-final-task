you can get the the screen shot "public/scrrenshonshot1" "public/scrrenshonshot2 " "public/scrrenshonshot3"
# User Authentication System with NextAuth

This project implements a secure authentication system using NextAuth.js, featuring email/password signup/signin and Google OAuth integration.

## Features

- Email/password registration and login
- Google OAuth authentication
- Email verification flow
- Form validation
- Secure session management

## API Endpoints Used

| Endpoint       | Method | Description                     |
|----------------|--------|---------------------------------|
| `/signup`      | POST   | User registration               |
| `/login`       | POST   | User authentication             |
| `/verify-email`| POST   | Email verification with OTP     |

## Screenshots

### 1. Signup Page

![Signup Page](/screenshots/signup.png)

**Description**:  
The signup page allows new users to register using email/password or Google authentication. It includes:
- Form validation (name, email, password strength)
- Password confirmation
- Google OAuth button
- Link to login page for existing users

---

### 2. Login Page

![Login Page](/screenshots/login.png)

**Description**:  
The login page enables registered users to authenticate. Features include:
- Email/password login
- Google OAuth option
- "Forgot password" link
- Client-side validation
- Error message display

---

### 3. Email Verification Page

![Verification Page](/screenshots/verify-email.png)

**Description**:  
After registration, users receive an OTP to verify their email address. This page:
- Accepts 6-digit verification code
- Includes resend code functionality
- Shows countdown timer
- Validates OTP format

---

### 4. Dashboard (Protected Route)

![Dashboard](/screenshots/dashboard.png)

**Description**:  
Authenticated users are redirected to the dashboard which:
- Displays user-specific content
- Shows authenticated status
- Contains protected resources
- Implements session management

## Technical Implementation

### Key Components

1. **NextAuth Configuration**  
   - Credentials provider for email/password
   - Google provider for OAuth
   - JWT session strategy
   - Secure token handling

2. **Form Validation**  
   ```javascript
   // Example validation
   if (!/^\S+@\S+\.\S+$/.test(email)) {
     throw new Error('Invalid email format');
   }