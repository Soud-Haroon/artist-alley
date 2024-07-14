mblNavBtn.addEventListener("click", function(){
    document.body.classList.toggle("showMblNav")
});

function toggleMobileNav(){
    document.body.classList.toggle("showMblNav");

    document.getElementById("mainNavigation").classList.add("XYZ");
}