// Blog comment form AJAX handler
(function() {
  const form = document.getElementById('comment-form');
  if (!form) return;
  const feedback = document.getElementById('comment-feedback');

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default redirect
    feedback.textContent = 'Sending…';

    const url = form.getAttribute('action'); // Formspree endpoint
    const data = new FormData(form);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Accept': 'application/json' }, // important
        body: data
      });

      if (res.ok) {
        feedback.textContent = 'Thank you for your comment!';
        form.reset(); // clear form fields
      } else {
        const json = await res.json().catch(() => null);
        feedback.textContent = (json && json.error) ? json.error : 'Something went wrong.';
      }
    } catch (err) {
      feedback.textContent = 'Network error — please try again.';
    }
  });
})();
