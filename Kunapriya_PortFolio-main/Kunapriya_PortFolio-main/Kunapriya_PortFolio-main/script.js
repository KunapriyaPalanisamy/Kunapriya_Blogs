// Smooth scrolling for internal links
(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(!href || href === '#') return;
      const targetId = href.slice(1);
      const target = document.getElementById(targetId);
      if(target){
        e.preventDefault();
        const offset = 24;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        if(prefersReduced){
          window.scrollTo(0, top);
        } else {
          window.scrollTo({top, behavior:'smooth'});
        }
      }
    });
  });
})();

// Debug helper: run window.debugAboutStyles() in the console to log computed styles up the tree
function debugAboutStyles(){
  const el = document.querySelector('#about .inner');
  if(!el){ console.log('About element not found'); return; }
  console.log('ABOUT computed:', getComputedStyle(el).color, getComputedStyle(el).opacity, getComputedStyle(el).mixBlendMode);
  let node = el;
  while(node){
    console.log(node.tagName, {
      color: getComputedStyle(node).color,
      opacity: getComputedStyle(node).opacity,
      mixBlend: getComputedStyle(node).mixBlendMode,
      background: getComputedStyle(node).background
    });
    node = node.parentElement;
  }
}
window.debugAboutStyles = debugAboutStyles;

// auto-run if you add ?debug=1 to the page URL
if(new URLSearchParams(location.search).has('debug')){
  debugAboutStyles();
}

// Contact form submit handler (AJAX) - Formspree compatible
(function(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  const feedback = document.getElementById('contact-feedback');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.textContent = 'Sending…';
    const url = form.getAttribute('action'); // https://formspree.io/f/xnngknpl
    const data = new FormData(form);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });

      if (res.ok) {
        feedback.textContent = 'Thanks — your message was sent.';
        form.reset();
      } else {
        const json = await res.json().catch(()=>null);
        feedback.textContent = (json && json.error) ? json.error : 'Sorry — something went wrong.';
      }
    } catch (err) {
      feedback.textContent = 'Network error — please try again.';
    }
  });
})();
// ===== Service Modal Logic =====
(function() {
  const modal = document.getElementById('serviceModal');
  const modalTitle = document.getElementById('serviceTitle');
  const modalDescription = document.getElementById('serviceDescription');
  const modalPoints = document.getElementById('servicePoints');
  const closeBtn = modal.querySelector('.close');

  // Example data for services (you can customize this)
  const servicesData = {
    "Resume Review & Optimization": {
      description: "Get expert feedback to optimize your resume",
      points: [
        "Tailored resume review",
        "Keyword optimization for ATS",
        "Highlight achievements effectively"
      ]
    },
    "Content Strategy & Personal Branding": {
      description: "Build a strong personal brand and create strategic content.",
      points: [
        "Content planning & ideation",
        "Personal brand positioning",
        "LinkedIn Profile Enhancement Guidance"
      ]
    },
    "Public Speaking & Presentation Skills": {
      description: "Enhance your speaking confidence and presentation skills.",
      points: [
        "Speech structure guidance",
        "Voice modulation & clarity",
        "Audience engagement techniques"
      ]
    },
    "Corporate Communication & Soft Skills": {
      description: "Improve communication & interpersonal skills for professional growth.",
      points: [
        "Email & report etiquette",
        "Conflict resolution",
        "Team collaboration techniques"
      ]
    },
    "Academia to Industry Transition Guidance": {
      description: "Smooth your transition from academic to professional life.",
      points: [
        "Career mapping & mentorship",
        "Skill gap analysis",
        "Interview preparation"
      ]
    }
  };

  // Open modal on card click
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('h3').textContent;
      const data = servicesData[title];

      if(data){
        modalTitle.textContent = title;
        modalDescription.textContent = data.description;
        modalPoints.innerHTML = ''; // Clear previous points
        data.points.forEach(pt => {
          const li = document.createElement('li');
          li.textContent = pt;
          modalPoints.appendChild(li);
        });
        modal.style.display = 'flex'; // Show modal
      }
    });
  });

  // Close modal on X click
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close modal if user clicks outside the modal content
  window.addEventListener('click', (e) => {
    if(e.target === modal) modal.style.display = 'none';
  });
})();
// ====== Display most recent blog on index.html ======
function showRecentBlog() {
  const blogSection = document.querySelector('#blog .inner');
  if (!blogSection || !window.blogData || blogData.length === 0) return;

  const recent = blogData[0]; // first blog = most recent

  const blogCard = document.createElement('article');
  blogCard.className = 'blog-card';

  blogCard.innerHTML = `
    <img src="${recent.image}" alt="${recent.title} image">
    <h3>${recent.title}</h3>
    <p class="excerpt">${recent.excerpt}</p>
    <p class="full-text" style="display:none;">${recent.fullText}</p>
    <button class="btn read-more">Read More</button>
  `;

  blogSection.appendChild(blogCard);

  // Add Read More toggle
  const btn = blogCard.querySelector('.read-more');
  btn.addEventListener('click', () => {
    const fullText = blogCard.querySelector('.full-text');
    const excerpt = blogCard.querySelector('.excerpt');
    if (fullText.style.display === 'none') {
      fullText.style.display = 'block';
      excerpt.style.display = 'none';
      btn.textContent = 'Read Less';
    } else {
      fullText.style.display = 'none';
      excerpt.style.display = 'block';
      btn.textContent = 'Read More';
    }
  });
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', showRecentBlog);
// Simulate fetching latest blog post
const latestBlog = {
  title: "LinkedIn Isn’t a Stage — It’s a Space to Express",
  description: "Building an authentic brand starts with showing up — not for attention, but with intention...",
  image: "assets/img/LinkedIn.jpg",
  link: "blog4.html"
};

const blogContainer = document.getElementById("latest-blog");

if (blogContainer) {
  const blogCard = document.createElement("a");
  blogCard.href = latestBlog.link;
  blogCard.className = "blog-preview";
  blogCard.innerHTML = `
    <img src="${latestBlog.image}" alt="${latestBlog.title}">
    <div class="blog-info">
      <h3>${latestBlog.title}</h3>
      <p>${latestBlog.description}</p>
      <span>Read More →</span>
    </div>
  `;
  blogContainer.appendChild(blogCard);
}



