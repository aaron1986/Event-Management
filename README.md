<h2>ADMIN ROLE</h2>
email: admin_event_management@admin.com<br/>
password: admin@EVENTS2025
<h2>SET-UP.</h2>
created a new directory in the terminal entitled 'Event-Management' and then proceeded to cd into same directory.
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
(6) Form Validation.</br>
(7) Sign Up Button.</br>
(8) Registed the Site with Google reCAPTCHA.</br>
(9) npm install react-google-recaptcha. </br>
(10) Updated the Login_Events.jsx. </br>
(11) I added google-site-verification from the Google Search Console. </br>
(12) Updated the headings tags, recognized landmark to pass accessibility testing. </br>
(13) The platform should clearly communicate errors to the users. 👉 no fallback route for not found errors. </br>
(14) Created a NotFound.jsx fallback route. </br>
(15) 

<h2>FIREBASE.</h2>
npm install firebase<br/>
npm install -g firebase-tools<br/>
npm firebase deploy<br/>
npm install firebase react-router-dom<br/>
Created a user called admin@events.com to login and create/edit.

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
| ├── FilterEvents.jsx<br/>
│ ├── Login.jsx<br/>
│ └── SignupForm.jsx<br/>
├── Utils/<br/>
│ ├── authService.js<br/>
| └── DataRender.jsx<br/>
│ └── EventDatabase.jsx<br/>
│ └── firebase.js<br/>
│ └── googlecalendar.js<br/>
│ └── userRole.js<br/>
├── App.jsx<br/>
└── main.jsx<br/>

<h2>Google Calendar API</h2>
On the Google Calendar website >> Create project > Enable Google Calendar API >> OAuth consent screen > Add scope >> https://www.googleapis.com/auth/calendar.events >> Create OAuth Client ID → Web App >> http://localhost:5173
<br/><br/>
I added the script tag to the following path public/index.html <script async defer src="https://apis.google.com/js/api.js"></script><br/>
Added the Google Calendar API information to services/calendar.js

<h2>LIGHTHOUSE</h2>
npm install -D vite-imagetools</br>
added the line(s) link rel="preconnect"</br>

<h2>WrireFrames</h2>

![Wireframe Image](./src/assets/wireframes_events.png)