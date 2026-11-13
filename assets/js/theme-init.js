// Runs in <head>, before first paint: apply the saved theme so the page doesn't flash dark.
// Kept as a file (not inline) so the Content Security Policy can forbid inline scripts.
try {
  if (localStorage.getItem('theme') === 'light') document.documentElement.setAttribute('data-theme', 'light');
} catch (e) {}
