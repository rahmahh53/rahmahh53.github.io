const root = document.documentElement;
const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navList = document.querySelector('#site-nav');
const themeButton = document.querySelector('.theme-toggle');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelector('#year').textContent = new Date().getFullYear();
window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 12), {passive:true});

menuButton.addEventListener('click', () => {
  const open = navList.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', open);
});
document.querySelectorAll('#site-nav a').forEach(link => link.addEventListener('click', () => {
  navList.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const savedTheme = localStorage.getItem('rahmah-theme');
if (savedTheme) root.dataset.theme = savedTheme;
themeButton.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('rahmah-theme', root.dataset.theme);
});

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  }
}), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

let counted = false;
const numberPanel = document.querySelector('.hero-panel');
const numberObserver = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting || counted) return;
  counted = true;
  document.querySelectorAll('[data-count]').forEach(node => {
    const target = Number(node.dataset.count);
    if (reduceMotion) { node.textContent = target.toLocaleString(); return; }
    const start = performance.now();
    const duration = 1100;
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const value = target * (1 - Math.pow(1 - p, 3));
      node.textContent = Number.isInteger(target) ? Math.round(value).toLocaleString() : value.toFixed(1);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, {threshold:.4});
numberObserver.observe(numberPanel);

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  document.querySelectorAll('.project-card').forEach(card => {
    card.hidden = filter !== 'all' && !card.dataset.category.includes(filter);
  });
}));

const notes = {
  dicom: {
    kicker: 'Medical imaging · Rice University',
    title: 'Recovering the geometry behind a prediction',
    body: '<p>The central issue was not simply whether a model produced a number. Preprocessed echocardiographic videos had been separated from physical scaling stored in their source DICOM files, making clinical interpretation harder.</p><h3>Approach</h3><p>I linked AVI, DICOM, and CMR records, investigated error patterns, and built a DICOM-aware reconstruction workflow. Evaluation was performed out of sample so that calibration changes were not judged on the observations used to derive them.</p><h3>Result</h3><p>Mean absolute error fell from 11.39 to 9.74 percentage points, while bias moved from +5.40 to +0.03 percentage points. The work was completed in collaboration with Houston Methodist.</p>'
  },
  seabed: {
    kicker: 'Geospatial modeling · Google-sponsored REU',
    title: 'Testing relationships across space',
    body: '<p>Irregular measurements do not arrive as neat grids. I transformed 42,401 ocean-bed records into 15,345 analysis-ready nodes across 34 geographic blocks, engineered 19 features, and constructed a 104,368-edge spatial graph.</p><h3>Approach</h3><p>I compared seven graph definitions using 5–20-neighbor kNN and 10–50 km radius connectivity, then evaluated models on geographically held-out regions rather than randomly mixed observations.</p><h3>Result</h3><p>Graph-augmented gradient boosting reduced grain-size RMSE from 2.245 for a train-mean baseline to 2.097, a 6.6% reduction.</p>'
  },
  diabetes: {
    kicker: 'Population health · Howard University',
    title: 'A prediction is incomplete without an audit',
    body: '<p>I assembled an analysis-ready cohort of 17,345 adults from 39,156 participants and constructed 18 predictors without using outcome-defining measurements as model inputs.</p><h3>Approach</h3><p>Five candidate models were compared on a held-out temporal sample. I then reviewed performance across 15 demographic groups and reported uncertainty rather than interpreting every observed difference as meaningful.</p><h3>Result</h3><p>The selected model achieved 0.793 AUROC and 0.743 AUPRC. The project is framed as a screening benchmark, not a diagnostic tool or causal fairness study.</p>'
  }
};
const modal = document.querySelector('.project-modal');
document.querySelectorAll('.project-detail').forEach(button => button.addEventListener('click', () => {
  const note = notes[button.dataset.project];
  document.querySelector('#modal-kicker').textContent = note.kicker;
  document.querySelector('#modal-title').textContent = note.title;
  document.querySelector('#modal-body').innerHTML = note.body;
  modal.showModal();
}));
document.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('#site-nav a')];
const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
}), {rootMargin:'-35% 0px -55%'});
sections.forEach(section => sectionObserver.observe(section));
