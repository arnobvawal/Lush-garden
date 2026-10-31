const navLinks = document.querySelectorAll(".nav-link");
const sections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter((section) => section !== null);

let targetId = null;

const options = {
  root: null,
  threshold: 0.5,
  rootMargin: "-20% 0px -40% 0px",
};

function setActive(id) {
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === `#${id}`) {
      link.classList.add("underline", "decoration-2", "underline-offset-8");
    } else {
      link.classList.remove("underline", "decoration-2", "underline-offset-8");
    }
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const currentId = entry.target.getAttribute("id");

      if (targetId === null) {
        setActive(currentId);
      } else if (currentId === targetId) {
        setActive(targetId);
        targetId = null;
      }
    }
  });
}, options);

sections.forEach((section) => observer.observe(section));

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    targetId = link.getAttribute("href").replace("#", "");
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      setActive(targetId);

      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

const heartBtns = document.querySelectorAll(".green-heart-btn");

heartBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const outlineIcon = btn.querySelector(".heart-outline");
    const solidIcon = btn.querySelector(".heart-solid");

    if (outlineIcon && solidIcon) {
      outlineIcon.classList.toggle("hidden");
      solidIcon.classList.toggle("hidden");
    }
  });
});

const emailForm = document.querySelector("#email-submission-form");

if (emailForm) {
  emailForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(emailForm);
    const userEmail = formData.get("user_email")?.trim();

    if (!userEmail) {
      alert("Please enter a valid email address.");
      return;
    }

    console.log("Email captured safely:", userEmail);
    alert(`Success! Captured email: ${userEmail}`);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      if (response.ok) {
        alert("Subscribed successfully!");
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }

    emailForm.reset();
  });
}
