import { includeHeaderFooter } from "./utilities.js";

const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');

const headerElement = document.querySelector('header');
const footerElement = document.querySelector('footer');

includeHeaderFooter(headerElement, footerElement);

signupBtn.addEventListener('click', gotoSignupFlow);

loginBtn.addEventListener('click', gotoLoginFlow);

if (isUserLoggedIn()) {
    window.location.replace('../html/homepage.html');
}

function gotoSignupFlow() {
    console.log('inside signup flow')
    window.location.href = '../html/signup.html';
}

function gotoLoginFlow() {
    console.log('inside login flow.')
    window.location.href = '../html/login.html';
}

function isUserLoggedIn() {
    let user = JSON.parse(localStorage.getItem("user")) || {};
    console.log(user.uid);
    return user.uid;
}