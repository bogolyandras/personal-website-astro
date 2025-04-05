// Get the stylesheet
const stylesheet = document.styleSheets[0];

//Change the stylesheet if we have javascript enabled
for (let i = 0; i < stylesheet.cssRules.length; i++) {
    const rule = stylesheet.cssRules[i];

    // The hamburger menu should be hidden by default
    if (rule.selectorText === '.nav-links') {
        rule.style.display = 'none';
        break;
    }
}

// Add event listener to the hamburger menu
document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('expanded');
});