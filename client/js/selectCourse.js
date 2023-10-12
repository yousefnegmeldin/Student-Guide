// Define the courses for each semester
const courses = {
  1: ["Math 1", "Physics", "Techn", "CS 1"],
  2: ["Math 2", "OOP", "Network", "Micro", "Theo"],
  3: ["CPP", "OS", "DSA", "DB", "Math 3"],
  4: ["SE", "DS", "IT", "DIS", "Media", "Math 4"],
};

// Get the select element
const semesterSelect = document.getElementById("semester");
const courseList = document.getElementById("course-list");

// Function to display courses for the selected semester
function displayCourses() {
  const selectedSemester = semesterSelect.value;
  const selectedCourses = courses[selectedSemester];

  // Clear the existing course list
  courseList.innerHTML = "";

  // Display the courses for the selected semester as buttons
  if (selectedCourses) {
    selectedCourses.forEach((course) => {
      const button = document.createElement("button");
      button.className = "course-button";
      button.textContent = course;
      button.addEventListener("click", async function () {
        try {
          const apiUrl = `http://localhost:5002/course/${course}`; // Replace with your API URL
          fetch(apiUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              console.log("Response from the API:", data);
              // Handle the response data from the API (e.g., show a success message)
            })
            .catch((error) => {
              console.error("Fetch error:", error);
            });

          courseList.appendChild(button);
        } catch (err) {
          console.error(err);
        }
      });
      courseList.appendChild(button);
    });
  } else {
    courseList.textContent = "No courses available for this semester.";
  }
}

// Initially display courses for the selected semester
displayCourses();

// Add an event listener to update the course list when the user selects a different semester
semesterSelect.addEventListener("change", displayCourses);