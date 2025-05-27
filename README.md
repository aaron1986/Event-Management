SET-UP.
</br></br>
npm create vite@latest events-platform -- --template react
</br></br>
PLAYWRIGHT.
<br/><br/>
installed playwright testing:<br/>
npm init playwright<br/>
<br/><br/>
changed the package.json file:<br/>
"scripts": {<br/>
    "test": "playwright test --headed"<br/>
}<br/>
<br/><br/>
Completed test(s) for the following:<br/>
(1) Title of website.<br/>
(2) Navigation Links.<br/>
(3) Log In Authentication.<br/>
(4) Create Event.<br/>
(5) Edit Event.<br/>

FIREBASE.
<br/><br/>
npm install firebase<br/>
npm install -g firebase-tools<br/>
npm firebase deploy<br/>
npm install firebase react-router-dom<br/>
<br/><br/>
I created the Project Structure as followed:
<br/><br/>
src/<br/>
├── Components/<br/>
│ ├── EventCard.jsx<br/>
│ ├── EventForm.jsx<br/>
│ └── ProtectedRoute.jsx<br/>
├── pages/<br/>
│ ├── Home.jsx<br/>
│ ├── Login.jsx<br/>
│ ├── Dashboard.jsx<br/>
│ └── CreateEvent.jsx<br/>
├── services/<br/>
│ ├── firebase.js<br/>
│ └── calendar.js<br/>
├── App.jsx<br/>
└── main.jsx<br/>
<br/><br/>
On the Google Calendar website >> Create project > Enable Google Calendar API >> OAuth consent screen > Add scope >> https://www.googleapis.com/auth/calendar.events >> Create OAuth Client ID → Web App >> http://localhost:5173
<br/><br/>
I added the script tag to the following path public/index.html <script async defer src="https://apis.google.com/js/api.js"></script><br/>
Added the Google Calendar API information to services/calendar.js
<br/><br/><br/>
![Wireframe Image](./src/assets/wireframes.png)