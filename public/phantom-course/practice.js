const form = document.getElementById("practice");
const feedback = document.getElementById("feedback");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const choices = new FormData(form);
  const morning = choices.get("morning") === "dismiss";
  const evening = choices.get("evening") === "uphold";

  if (morning && evening) {
    feedback.textContent = "Both decisions match the source. Open the worked answer to compare your evidence and proposed fix.";
  } else if (morning) {
    feedback.textContent = "Your morning verdict is supported. For the evening setter, trace the path from line 26 to the write on line 27. Which caller check runs?";
  } else if (evening) {
    feedback.textContent = "Your evening verdict is supported. For the morning setter, follow onlyCurator on line 22 back to the check on line 18.";
  } else {
    feedback.textContent = "Revisit both. Compare the two function declarations, then trace what happens before each write.";
  }
});
form.addEventListener("change", () => { feedback.textContent = ""; });
form.hidden = false;
