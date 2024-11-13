// Event listener for form submission
document.getElementById("user-form").addEventListener("submit", (event) => {
   event.preventDefault();  // Prevents the form from submitting and reloading the page
   console.log("Form submitted, calling recommend function...");
   recommend();
});

// Main recommend function
async function recommend() {
   console.log("Starting recommendation process...");

   try {
      const data = await loadData();
      console.log("Data loaded:", data);

      const responses = {
         interest: document.getElementById("interest").value.toLowerCase(),
         skill: document.getElementById("skill").value.toLowerCase(),
         preference: document.getElementById("preference").value.toLowerCase()
      };

      console.log("User responses:", responses);

      let recommendations = data.map(job => {
         let score = 0;
         if (responses.interest.includes(job.Interests.toLowerCase())) score++;
         if (responses.skill.includes(job['Technical Skills'].toLowerCase())) score++;
         if (responses.preference.includes(job['Soft Skills'].toLowerCase())) score++;
         return { job: job['Job Role'], score: score, skills: job['Technical Skills'] };
      });

      // Sort and get the top 3 recommendations
      recommendations = recommendations.sort((a, b) => b.score - a.score).slice(0, 3);
      console.log("Top recommendations:", recommendations);

      const recommendationDiv = document.getElementById("recommendations");
      recommendationDiv.innerHTML = "<h2>Top Profession Recommendations:</h2>";

      recommendations.forEach((rec, index) => {
         const jobTitle = document.createElement("p");
         jobTitle.textContent = rec.job;
         recommendationDiv.appendChild(jobTitle);

         const skills = rec.skills.split(",").map(skill => skill.trim());
         const skillCounts = skills.reduce((acc, skill) => {
            acc[skill] = (acc[skill] || 0) + 1;
            return acc;
         }, {});

         const canvas = document.createElement("canvas");
         canvas.id = `chart-${index}`;
         recommendationDiv.appendChild(canvas);

         const labels = Object.keys(skillCounts);
         const data = Object.values(skillCounts);
         const numSkills = labels.length;
         const colors = Array(numSkills).fill().map((_, i) => `rgba(0, 0, 255, ${0.3 + (i * 0.6 / numSkills)})`);

         new Chart(canvas, {
            type: "pie",
            data: {
               labels: labels,
               datasets: [{
                  data: data,
                  backgroundColor: colors
               }]
            },
            options: {
               responsive: true,
               plugins: {
                  legend: {
                     display: true,
                     position: 'bottom'
                  },
                  title: {
                     display: true,
                     text: `Technical Skills Distribution for ${rec.job}`
                  }
               }
            }
         });
      });

   } catch (error) {
      console.error("An error occurred:", error);
   }
}
