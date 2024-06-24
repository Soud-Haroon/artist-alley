//Hide Nav Menu on Mobile

mblNavBtn.addEventListener("click", function(){
    document.body.classList.toggle("showMblNav")
});

applySavedMode();

function toggleMobileNav(){
    document.body.classList.toggle("showMblNav");

    document.getElementById("mainNavigation").classList.add("XYZ");
}


// Phone number

document.addEventListener("DOMContentLoaded", function() {
    updateCountryCode(); // Set the initial country code when the page loads
});

function updateCountryCode() {
    const countrySelect = document.getElementById("countrySelect");
    const countryCode = countrySelect.value;
    document.getElementById("countryCode").value = countryCode;
}

