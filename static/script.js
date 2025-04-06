document.getElementById('jobForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('jobTitle').value;
    const description = document.getElementById('jobDescription').value;

    fetch('/add_job', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById('jobForm').reset();
    });
});

document.getElementById('candidateForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('candidateName').value;
    const cv = document.getElementById('candidateCV').value;

    fetch('/add_candidate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, cv })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById('candidateForm').reset();
    });
});

document.getElementById('matchButton').addEventListener('click', function() {
    fetch('/match_candidates')
    .then(response => response.json())
    .then(data => {
        const resultsDiv = document.getElementById('matchResults');
        resultsDiv.innerHTML = '<h3>Match Results:</h3>';
        if (data.length === 0) {
            resultsDiv.innerHTML += '<p>No matches found.</p>';
        } else {
            data.forEach(result => {
                resultsDiv.innerHTML += `<p>Candidate ID: ${result.candidate_id}, Job ID: ${result.job_id}, Match Score: ${result.match_score.toFixed(2)}%</p>`;
            });
        }
    });
});


document.getElementById('candidateForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('candidateCV');
    const file = fileInput.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const text = event.target.result;
            const keywords = extractKeywords(text);
            displayKeywords(keywords);
        };
        
        reader.readAsText(file);
    }
});

function extractKeywords(text) {
    // Simple keyword extraction logic (can be improved)
    const words = text.match(/\b\w+\b/g);
    const keywordCounts = {};
    
    words.forEach(word => {
        word = word.toLowerCase();
        keywordCounts[word] = (keywordCounts[word] || 0) + 1;
    });
    
    // Sort keywords by frequency
    const sortedKeywords = Object.entries(keywordCounts).sort((a, b) => b[1] - a[1]);
    
    // Return top 10 keywords
    return sortedKeywords.slice(0, 10).map(entry => entry[0]);
}

function displayKeywords(keywords) {
    const keywordResults = document.getElementById('keywordResults');
    keywordResults.innerHTML = keywords.length > 0 ? keywords.join(', ') : 'No keywords found.';
}