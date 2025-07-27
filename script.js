const form = document.getElementById('survey-form');
const resultsDiv = document.getElementById('results');
const resultsList = document.getElementById('results-list');
const toggleTheme = document.getElementById('toggle-theme');

const questions = ['q1', 'q2'];
let hasVoted = localStorage.getItem('survey-voted') === 'true';
let results = JSON.parse(localStorage.getItem('survey-results')) || {
  q1: {},
  q2: {}
};

function countVotes(question, answer) {
  if (!results[question][answer]) results[question][answer] = 0;
  results[question][answer]++;
}

function renderResults() {
  resultsList.innerHTML = '';
  questions.forEach(q => {
    const total = Object.values(results[q]).reduce((a, b) => a + b, 0);
    const div = document.createElement('div');
    div.innerHTML = `<h3>${form.querySelector(`[name=${q}]`).closest('.question').querySelector('p').textContent}</h3>`;
    Object.entries(results[q]).forEach(([option, count]) => {
      const percent = total ? ((count / total) * 100).toFixed(1) : 0;
      div.innerHTML += `
        <div class="result-item">
          <strong>${option}</strong>: ${percent}% (${count} votes)
          <div class="result-bar" style="width:${percent}%"></div>
        </div>
      `;
    });
    resultsList.appendChild(div);
  });

  form.classList.add('hidden');
  resultsDiv.classList.remove('hidden');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (hasVoted) return;

  questions.forEach(q => {
    const answer = form.elements[q].value;
    countVotes(q, answer);
  });

  localStorage.setItem('survey-results', JSON.stringify(results));
  localStorage.setItem('survey-voted', 'true');
  hasVoted = true;
  renderResults();
});

// Dark mode
const theme = localStorage.getItem('theme') || 'light';
document.body.classList.toggle('dark', theme === 'dark');
toggleTheme.textContent = theme === 'dark' ? '☀️' : '🌙';

toggleTheme.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  toggleTheme.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

if (hasVoted) {
  renderResults();
}
