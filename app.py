from flask import Flask, render_template, request, redirect, url_for
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64

app = Flask(__name__)

# Load the dataset
df = pd.read_csv("/kaggle/input/itskills/ictskills.csv")

# Questions to ask the user
questions = [
   "What activities interest you the most? (e.g., solving puzzles, creating art, working with technology, helping others): ",
   "Which skill would you most like to learn or improve? (e.g., coding, communication, design, analysis): ",
   "Do you prefer working with people, working with data, or building things? "
]

def match_profession(user_responses, df):
   professions = []
   for i, row in df.iterrows():
       score = 0
       interests = user_responses[0].lower().split()
       if any(interest in row['Interests'].lower() for interest in interests):
           score += 1
       skills = user_responses[1].lower().split()
       if any(skill in row['Technical Skills'].lower() for skill in skills):
           score += 1
       soft_skills = user_responses[2].lower().split()
       if any(skill in row['Soft Skills'].lower() for skill in soft_skills):
           score += 1
       professions.append((row['Job Role'], score, row['Technical Skills']))
   return sorted(professions, key=lambda x: x[1], reverse=True)

def plot_technical_skills(job_title, technical_skills):
   skills_list = [skill.strip() for skill in technical_skills.split(',')]
   skill_counts = {}
   for skill in skills_list:
       if skill in skill_counts:
           skill_counts[skill] += 1
       else:
           skill_counts[skill] = 1
   total = sum(skill_counts.values())
   skills = list(skill_counts.keys())
   percentages = [count / total * 100 for count in skill_counts.values()]
   num_skills = len(skills)
   blues = plt.cm.Blues(np.linspace(0.3, 0.9, num_skills))
   plt.figure(figsize=(10, 8))
   plt.pie(percentages, labels=skills, colors=blues, autopct='%1.1f%%', startangle=90)
   plt.title(f'Technical Skills Distribution for {job_title}', pad=20)
   plt.axis('equal')
   img = io.BytesIO()
   plt.savefig(img, format='png')
   img.seek(0)
   plot_url = base64.b64encode(img.getvalue()).decode()
   plt.close()
   return plot_url

@app.route("/", methods=["GET", "POST"])
def index():
   if request.method == "POST":
       user_responses = [
           request.form["question1"],
           request.form["question2"],
           request.form["question3"]
       ]
       recommendations = match_profession(user_responses, df)
       top_recommendations = recommendations[:3]
       plots = [(job, plot_technical_skills(job, tech_skills)) for job, _, tech_skills in top_recommendations]
       return render_template("results.html", plots=plots)
   return render_template("index.html", questions=questions)

if __name__ == "__main__":
   app.run(debug=True)
