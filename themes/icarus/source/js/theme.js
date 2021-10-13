const btn = document.getElementById('toggleTheme');
let nIntervId;

const changeUtterancesTheme = () => {
  const utterances = document.querySelector('iframe');
  utterances?.contentWindow.postMessage(
    document.body.classList.contains('dark')
      ? {
          type: 'set-theme',
          theme: 'github-dark',
        }
      : {
          type: 'set-theme',
          theme: 'github-light',
        },
    'https://utteranc.es'
  );

  if (nIntervId && utterances) {
    clearInterval(nIntervId);
  }
};

function initTheme() {
  // chk local storage
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    if (!nIntervId) {
      nIntervId = setInterval(changeUtterancesTheme, 500);
    }
    document.body.classList.add('dark');
    btn.innerText = '🌙';
    return;
  }
  if (theme === 'light') {
    btn.innerText = '🌞';
    return;
  }

  //   visit first time
  const isDark = window.matchMedia('(prefers-color-scheme: dark)');
  if (isDark) {
    document.body.classList.add('dark');
  }

  changeUtterancesTheme();
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  btn.innerText = isDark ? '🌙' : '🌞';
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem(
    'theme',
    document.body.classList.contains('dark') ? 'dark' : 'light'
  );

  changeUtterancesTheme();
  btn.innerText = document.body.classList.contains('dark') ? '🌙' : '🌞';
}

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (e) => {
    const newColorScheme = e.matches ? 'dark' : 'light';
    localStorage.setItem('theme', newColorScheme);

    if (newColorScheme === 'dark') {
      document.body.classList.add('dark');
      btn.innerText = '🌙';
      return;
    }
    document.body.classList.remove('dark');
    btn.innerText = '🌞';
  });

btn.addEventListener('click', function (event) {
  toggleTheme();
});

initTheme();
