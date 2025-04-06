from app import Candidate, JobDescription, app, db


def view_data():
    jobs = JobDescription.query.all()
    print("Job Descriptions:")
    for job in jobs:
        print(f"ID: {job.id}, Title: {job.title}, Description: {job.description}")
    candidates = Candidate.query.all()
    print("\nCandidates:")
    for candidate in candidates:
        print(f"ID: {candidate.id}, Name: {candidate.name}, CV: {candidate.cv}")

if __name__ == '__main__':
    with app.app_context():
        view_data()