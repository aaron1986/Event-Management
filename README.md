<h1>SET-UP.</h1>
npm create vite@latest events-platform -- --template react
</br></br>
<h2>PLAYWRIGHT.</h2>
installed playwright testing:<br/>
npm init playwright<br/>
<br/>
changed the package.json file:<br/>
"scripts": {<br/>
    "test": "playwright test --headed"<br/>
}<br/>
Completed test(s) for the following:<br/>
(1) Title of website.<br/>
(2) Navigation Links.<br/>
(3) Log In Authentication.<br/>
(4) Create Event.<br/>
(5) Edit Event.<br/>

<h2>FIREBASE.</h2>
npm install firebase<br/>
npm install -g firebase-tools<br/>
npm firebase deploy<br/>
npm install firebase react-router-dom<br/>
<br/><br/>
<h2>Project Structure.</h2>
src/<br/>
├── Components/<br/>
│ ├── CreateEvent.jsx<br/>
│ ├── EditEvent.jsx<br/>
│ └── EventCard.jsx<br/>
│ └── Nav.jsx<br/>
│ └── SearchEvents.jsx<br/>
├── Pages/<br/>
│ ├── EventList.jsx<br/>
│ ├── Login.jsx<br/>
│ ├── FilterEvents.jsx<br/>
│ └── Login.jsx<br/>
├── Utils/<br/>
│ ├── DataRender.js<br/>
│ └── EventDatabase.jsx<br/>
│ └── firebase.js<br/>
│ └── googlecalendar.js<br/>
│ └── userRole.js<br/>
├── App.jsx<br/>
└── main.jsx<br/>
<br/><br/>
On the Google Calendar website >> Create project > Enable Google Calendar API >> OAuth consent screen > Add scope >> https://www.googleapis.com/auth/calendar.events >> Create OAuth Client ID → Web App >> http://localhost:5173
<br/><br/>
I added the script tag to the following path public/index.html <script async defer src="https://apis.google.com/js/api.js"></script><br/>
Added the Google Calendar API information to services/calendar.js

![Wireframe Image](./src/assets/wireframes.png)