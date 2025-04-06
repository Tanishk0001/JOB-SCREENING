from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///recruitment.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class JobDescription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.Text)

class Candidate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    cv = db.Column(db.Text)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add_job', methods=['POST'])
def add_job():
    data = request.json
    job = JobDescription(title=data['title'], description=data['description'])
    db.session.add(job)
    db.session.commit()
    return jsonify({'message': 'Job added successfully'}), 201

@app.route('/add_candidate', methods=['POST'])
def add_candidate():
    data = request.json
    candidate = Candidate(name=data['name'], cv=data['cv'])
    db.session.add(candidate)
    db.session.commit()
    return jsonify({'message': 'Candidate added successfully'}), 201

@app.route('/match_candidates', methods=['GET'])
def match_candidates():
    jobs = JobDescription.query.all()
    candidates = Candidate.query.all()
    results = []

    for job in jobs:
        for candidate in candidates:
            # Simple text matching using cosine similarity
            vectorizer = TfidfVectorizer().fit_transform([job.description, candidate.cv])
            vectors = vectorizer.toarray()
            cosine_sim = cosine_similarity(vectors)
            match_score = cosine_sim[0][1] * 100  # Convert to percentage
            if match_score >= 80:  # Threshold
                results.append({'candidate_id': candidate.id, 'job_id': job.id, 'match_score': match_score})

    return jsonify(results)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables if they don't exist
    app.run(debug=True)