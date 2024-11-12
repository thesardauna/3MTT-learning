// Load dataset
async function loadData() {
   const response = await fetch("ictskills.json");
   const data = await response.json();
   return data;
}

// Recommendation function
async function recommend() {
   const data = await loadData();
   const responses = {
      interest: document.getElementById("interest").value.toLowerCase(),
      skill: document.getElementById("skill").value.toLowerCase(),
      preference: document.getElementById("preference").value.toLowerCase()
   };

   let recommendations = data.map(job => {
      let score = 0;
      if (responses.interest.includes(job.Interests.toLowerCase())) score++;
      if (responses.skill.includes(job['Technical Skills'].toLowerCase())) score++;
      if (responses.preference.includes(job['Soft Skills'].toLowerCase())) score++;
      return { job: job['Job Role'], score: score };
   });

   recommendations = recommendations.sort((a, b) => b.score - a.score).slice(0, 3);

   const recommendationDiv = document.getElementById("recommendations");
   recommendationDiv.innerHTML = "<h2>Top Profession Recommendations:</h2>";
   recommendations.forEach(rec => {
      recommendationDiv.innerHTML += `<p>${rec.job} (Score: ${rec.score})</p>`;
   });
}

// Event listener for form submission
document.getElementById("user-form").addEventListener("submit", (event) => {
   event.preventDefault();
   recommend();
});
