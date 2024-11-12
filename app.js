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
      return { job: job['Job Role'], score: score, skills: job['Technical Skills'] };
   });

   // Sort and get the top 3
   recommendations = recommendations.sort((a, b) => b.score - a.score).slice(0, 3);

   const recommendationDiv = document.getElementById("recommendations");
   recommendationDiv.innerHTML = "<h2>Top Profession Recommendations:</h2>";

   recommendations.forEach((rec, index) => {
      // Display the job title
      const jobTitle = document.createElement("p");
      jobTitle.textContent = rec.job;
      recommendationDiv.appendChild(jobTitle);

      // Parse and count technical skills for pie chart
      const skills = rec.skills.split(",").map(skill => skill.trim());
      const skillCounts = skills.reduce((acc, skill) => {
         acc[skill] = (acc[skill] || 0) + 1;
         return acc;
      }, {});

      // Create canvas for each chart
      const canvas = document.createElement("canvas");
      canvas.id = `chart-${index}`;
      recommendationDiv.appendChild(canvas);

      // Prepare data and colors for Chart.js
      const labels = Object.keys(skillCounts);
      const data = Object.values(skillCounts);
      const numSkills = labels.length;
      const colors = Array(numSkills).fill().map((_, i) => `rgba(0, 0, 255, ${0.3 + (i * 0.6 / numSkills)})`);

      // Render pie chart using Chart.js
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
}
