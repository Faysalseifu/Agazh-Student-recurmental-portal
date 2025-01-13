document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.getElementById("navbar");
    
    if (navbarContainer) {
      fetch("../components/navbar.html")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to load navbar");
          }
          return response.text();
        })
        .then((html) => {
          navbarContainer.innerHTML = html;
        })
        .catch((error) => {
          console.error("Error loading navbar:", error);
          navbarContainer.innerHTML = `<p class="error-message">Unable to load the navbar. Please try again later.</p>`;
        });
    }
  });
  