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


