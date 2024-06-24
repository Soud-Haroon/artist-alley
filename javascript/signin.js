//Hide Password

function togglePasswordVisibility() {
    var passwordInput = document.getElementById('password');
    var togglePassword = document.querySelector('.toggle-password i');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePassword.classList.remove('fa-eye-slash');
        togglePassword.classList.add('fa-eye');
    } else {
        passwordInput.type = 'password';
        togglePassword.classList.remove('fa-eye');
        togglePassword.classList.add('fa-eye-slash');
    }
}

//Hide Nav Menu on Mobile

mblNavBtn.addEventListener("click", function(){
    document.body.classList.toggle("showMblNav")
});

applySavedMode();

function toggleMobileNav(){
    document.body.classList.toggle("showMblNav");

    document.getElementById("mainNavigation").classList.add("XYZ");
}
