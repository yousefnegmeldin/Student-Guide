import { userURL } from "../utils/env.js";
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.querySelector(".signup-form");

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(signupForm);
    const formDataObject = {};

    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
    if (!formDataObject.email.includes("giu-uni.de")) {
      alert("Email should be a GIU email");
      return;
    }
    const apiUrl = `${userURL}/signup`;
    const signUpLoader = document.getElementById("signUpLoader");
    const signUpBtnTxt = document.getElementById("signUpBtnTxt");

    signUpLoader.style.display = "block";
    signUpBtnTxt.style.display = "none";

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataObject),
    })
      .then((response) => {
        if (response.status === 402) {
          alert("Choose another User name or Email", 3000); // Show for 3 seconds
        }
        if (response.status === 401) {
          alert("Email should be a GIU email", 3000); // Show for 3 seconds
        }

        if (!response.ok) {
          signUpLoader.style.display = "none";
          signUpBtnTxt.style.display = "block";
          throw new Error("Network response was not ok");
        }
       
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("userEmail", formDataObject.email);

        window.location.href = "../html/verfiyEmail.html";
        // Handle the response data from the API (e.g., show a success message)
      })
      .catch((error) => {
        // animateFailureAlert("This email is taken.", 3000); // Show for 3 seconds
        console.error("Fetch error:", error);
      });
  });
});

function animateAlert(message, duration) {
  const alertDiv = document.createElement("div");
  alertDiv.textContent = message;
  alertDiv.style.position = "fixed";
  alertDiv.style.top = "10px";
  alertDiv.style.left = "50%";
  alertDiv.style.transform = "translateX(-50%)";
  alertDiv.style.backgroundColor = "lightgreen"; // Green background
  alertDiv.style.color = "green"; // Green text color
  alertDiv.style.padding = "10px";
  alertDiv.style.border = "1px solid #008000"; // Green border
  alertDiv.style.borderRadius = "5px";
  alertDiv.style.textAlign = "center";
  alertDiv.style.opacity = 0;
  alertDiv.style.transition = "opacity 0.5s ease-in-out";

  document.body.appendChild(alertDiv);

  setTimeout(function () {
    alertDiv.style.opacity = 1;
  }, 10); // Delay for a smooth appearance

  setTimeout(function () {
    alertDiv.style.opacity = 0;
    setTimeout(function () {
      document.body.removeChild(alertDiv);
    }, 500); // Remove the alert after the fade-out animation
  }, duration);
}

function animateFailureAlert(message, duration) {
  const alertDiv = document.createElement("div");
  alertDiv.textContent = message;
  alertDiv.style.position = "fixed";
  alertDiv.style.top = "10px";
  alertDiv.style.left = "50%";
  alertDiv.style.transform = "translateX(-50%)";
  alertDiv.style.backgroundColor = "lightcoral"; // Red background
  alertDiv.style.color = "red"; // Red text color
  alertDiv.style.padding = "10px";
  alertDiv.style.border = "1px solid #FF0000"; // Red border
  alertDiv.style.borderRadius = "5px";
  alertDiv.style.textAlign = "center";
  alertDiv.style.opacity = 0;
  alertDiv.style.transition = "opacity 0.5s ease-in-out";

  document.body.appendChild(alertDiv);

  setTimeout(function () {
    alertDiv.style.opacity = 1;
  }, 10); // Delay for a smooth appearance

  setTimeout(function () {
    alertDiv.style.opacity = 0;
    setTimeout(function () {
      document.body.removeChild(alertDiv);
    }, 500); // Remove the alert after the fade-out animation
  }, duration);
}
