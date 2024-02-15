// load the year
function setCopyrightYear() {
    const yearEle = document.getElementById("year");
    const year = new Date().getFullYear();
    yearEle.textContent = year;
}

setCopyrightYear();