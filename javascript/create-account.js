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

function togglePasswordVisibilityconfirm() {
    var passwordInputconfirm = document.getElementById('confirmPassword');
    var togglePasswordconfirm = document.querySelector('.toggle-passwordconfirm i');
    if (passwordInputconfirm.type === 'password') {
        passwordInputconfirm.type = 'text';
        togglePasswordconfirm.classList.remove('fa-eye-slash');
        togglePasswordconfirm.classList.add('fa-eye');
    } else {
        passwordInputconfirm.type = 'password';
        togglePasswordconfirm.classList.remove('fa-eye');
        togglePasswordconfirm.classList.add('fa-eye-slash');
    }
}