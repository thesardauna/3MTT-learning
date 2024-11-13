document.getElementById("user-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const interest = document.getElementById("interest").value.toLowerCase();
  const skill = document.getElementById("skill").value.toLowerCase();
  const preference = document.getElementById("preference").value.toLowerCase();

  try {
    const response = await fetch('data.json');
    const data = await response.json();

    const recommendations = data.map(job => {
      let score = 0;
      if (job.Interests.toLowerCase().includes(interest)) score++;
      if (job['Technical Skills'].toLowerCase().includes(skill)) score++;
      if (job['Soft Skills'].toLowerCase().includes(preference)) score++;
      return { job: job['Job Role'], score: score, skills: job['Technical Skills'] };
    });

    // Sort and get the top 3 recommendations
    const topRecommendations = recommendations.sort((a, b) => b.score - a.score).slice(0, 3);

    const recommendationDiv = document.getElementById("recommendations");
    recommendationDiv.innerHTML = "<h2>Top Profession Recommendations:</h2>";

    topRecommendations.forEach((rec, index) => {
      // ... (rest of the code for displaying recommendations and charts)
    });
  } catch (error) {
    console.error("Error fetching data or processing recommendations:", error);
    recommendationDiv.innerHTML = "<p>An error occurred. Please try again later.</p>";
  }
});
