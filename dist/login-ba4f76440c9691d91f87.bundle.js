(()=>{var t=document.getElementById("signupLink"),e=document.getElementById("loginLink"),l=document.getElementById("login"),n=document.getElementById("signUp");t.addEventListener("click",(function(){console.log("clicked"),l.setAttribute("style","display:none"),t.setAttribute("style","display:none"),n.setAttribute("style","display:block"),e.setAttribute("style","display:block")})),e.addEventListener("click",(function(){n.setAttribute("style","display:none"),e.setAttribute("style","display:none"),l.setAttribute("style","display:block"),t.setAttribute("style","display:block")}))})();