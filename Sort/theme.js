// Description: This file contains the javascript code for the theme dropdown menu.

// Theme CSS
Themes = {
  "defaulttheme" : "body{background:#1F497D}.quarter-div,.half-div{background:#4F81BD}p,h3{color:#FFF}.bar{background:#A5A5A5}.currentSelectedBar{background:#FFC000}.pivotBar{background:#ED7D31}button,select,option{background:#D9D9D9}button:hover,select option:hover{background:#A5A5A5}input{background:#D9D9D9}#theme-button{background:#1F497D;color:#FFF}#theme-dropdown a{background:#1F497D;color:#FFF}#theme-dropdown a:hover{background:#4F81BD}#theme-dropdown a.active{background:#4F81BD}",
  "neo-noir" : "*{color:#FFF!important}body{background:#000}.quarter-div,.half-div{background:#282828}p,h3{color:#FFF}.bar{background:#6C6C6C}.currentSelectedBar{background:#FF3366}.pivotBar{background:#00FFFF}button,select,option{background:#333333}button:hover,select option:hover{background:#282828}input{background:#333333}#theme-button{background:#000}#theme-dropdown a{background:#000}#theme-dropdown a:hover{background:#282828}#theme-dropdown a.active{background:#282828}",  
  "warmtheme" : `
          body {background-color: #F2E8C4;}
          .quarter-div, .half-div {background-color: #C9AD7E;}
          p, h3 {color: #2D2926;}
          .bar {background-color: #8B4513;}
          .currentSelectedBar {background-color: #FFD700;}
          .pivotBar {background-color: #FF1000;}
          .pivotBar {background-color: #d98c4d;}
          button, select, option {background-color: #d98c4d;}
          button:hover, select option:hover {background-color: #C9AD7E ;}
          button:disable {background-color: #C9AD7E ;}
          input {background-color: #d98c4d;}
          #theme-button {background-color: #2D2926; color: #ffffff;}
          #theme-dropdown a {background-color: #2D2926; color: #ffffff;}
          #theme-dropdown a:hover {background-color: #C9AD7E;}
          #theme-dropdown a.active {background-color: #C9AD7E;}
  `,
  "bagbazar" : `body{background:#000}.quarter-div,.half-div{background:#F00}p,h3{color:#000}.bar{background:#0F0}.currentSelectedBar{background:#00F}.pivotBar{background:#F00}button,select,option{background:#FFF;color:#000}button:hover,select option:hover{background:#000;color:#FFF}input{background:#FFF;color:#000}#theme-button{background:#000;color:#FFF}#theme-dropdown a{background:#000;color:#FFF}#theme-dropdown a:hover{background:#FFF;color:#000}#theme-dropdown a.active{background:#FFF;color:#000}`,
  "lighttheme" : `
          body{background:#f5f5f5} /* Light Gray */
          .quarter-div,.half-div{background:#e0e0e0} /* Gray */
          p,h3{color:#333333} /* Dark Gray */
          .bar{background:#00cccc} /* Teal */
          .currentSelectedBar{background:#ff00ff} /* Magenta */
          .pivotBar{background:#ff0000} /* Red */
          button,select,option,input{background:#f0f0f0} /* Light Gray */
          button:hover,select option:hover{background:#e0e0e0} /* Gray */
          button:disable{background:#e0e0e0} /* Gray */
          #theme-button{background:#f5f5f5;color:#333333} /* Light Gray */
          #theme-dropdown a{background:#f5f5f5;color:#333333} /* Light Gray */
          #theme-dropdown a:hover,#theme-dropdown a.active{background:#e0e0e0} /* Gray */
  `,
}

// Get the theme button and dropdown elements
//===========================================================
const themeBtn = document.getElementById("theme-btn");
const themeDropdown = document.getElementById("theme-dropdown");
const style = document.createElement("style");

// Add event listeners to the theme button to show/hide the dropdown
//===========================================================
themeBtn.addEventListener("click", function() {
  themeDropdown.style.display = (themeDropdown.style.display === "block") ? "none" : "block";
});
function applyTheme(theme){
  style.innerHTML = ''
  style.innerHTML = theme
  document.head.appendChild(style);
}

// Theme CSS
//===========================================================
document.getElementById("theme-default").addEventListener("click", function() {applyTheme(Themes["defaulttheme"]);themeBtn.click();});
document.getElementById("theme-neo-noir").addEventListener("click", function() {applyTheme(Themes["neo-noir"]);themeBtn.click();});
document.getElementById("theme-light").addEventListener("click", function() {applyTheme(Themes["lighttheme"]);themeBtn.click();});
document.getElementById("theme-warm").addEventListener("click", function() {applyTheme(Themes["warmtheme"]);themeBtn.click();});
document.getElementById("theme-bagbazar").addEventListener("click", function() {applyTheme(Themes["bagbazar"]);themeBtn.click();});
document.getElementById("theme-light").click();
themeBtn.click();

