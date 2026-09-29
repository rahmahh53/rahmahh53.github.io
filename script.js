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
    body: '<p>Preprocessed echocardiographic videos had been separated from the physical scaling stored in their source DICOM files, preventing segmentation outputs from being interpreted as anatomically calibrated measurements.</p><h3>Approach</h3><p>I reconciled approximately 18,000 DICOM studies, AVI clips, segmentation outputs, and cardiac MRI references, then reconstructed the crop, resize, and padding geometry needed to restore physical scale.</p><h3>Result</h3><p>Refined calibration reduced ejection-fraction mean absolute error by 14.5%, RMSE by 15.3%, and systematic bias by 99.4% out of sample.</p>'
  },
  seabed: {
    kicker: 'Geospatial modeling · Google-sponsored REU',
    title: 'Testing relationships across space',
    body: '<p>Irregular measurements do not arrive as neat grids. I joined 42,401 Gulf of Mexico seabed observations with bathymetry and produced 19 terrain, spatial, and collection features for 15,345 validated locations across 34 geographic blocks.</p><h3>Approach</h3><p>I compared seven definitions of geographic proximity and evaluated models across five geographically separated folds.</p><h3>Result</h3><p>Extra Trees reduced mean grain-size RMSE by 16.2% and outperformed the prior boosting model in every geographic fold.</p>'
  },
  diabetes: {
    kicker: 'Population health · Howard University',
    title: 'A prediction is incomplete without an audit',
    body: '<p>I integrated 13 interview, examination, and laboratory components across four cycles, producing a reproducible cohort of 17,345 adults from 39,156 participants and 18 predictors that excluded outcome-defining measurements.</p><h3>Approach</h3><p>I compared five candidate models on 4,115 adults from a chronological holdout and audited sensitivity, calibration, false-negative behavior, and discrimination across 15 demographic groups.</p><h3>Result</h3><p>Gradient boosting achieved 0.793 AUROC, 0.743 AUPRC, and 89.5% sensitivity while reducing Brier error by 15.8% versus full logistic regression. The audit identified an 11.2-point age-group AUROC gap.</p>'
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
