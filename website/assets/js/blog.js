document.querySelectorAll('.read-more').forEach(button => {
  button.addEventListener('click', () => {
    const blog = button.closest('.blog-content');
    const fullText = blog.querySelector('.full-text');
    const shortText = blog.querySelector('.short-text');

    if (fullText.style.display === 'block') {
      fullText.style.display = 'none';
      shortText.style.display = 'block';
      button.textContent = 'Read More';
    } else {
      fullText.style.display = 'block';
      shortText.style.display = 'none';
      button.textContent = 'Read Less';
    }
  });
});
