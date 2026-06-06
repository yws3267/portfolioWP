// ── 초기 렌더 ──
document.getElementById('school').textContent = PROFILE.school
document.getElementById('name').textContent = PROFILE.name
document.getElementById('email').textContent = CONTACT.email
document.getElementById('github-link').href = CONTACT.githubUrl
document.getElementById('blog-link').href = CONTACT.blogUrl
document.getElementById('blog-label').textContent = CONTACT.blogLabel

// ── 기술 스택 ──
const techList = document.getElementById('tech-list')
TECH_STACK.forEach(t => {
  const el = document.createElement('div')
  el.className = 'fade-item flex items-center space-x-3 p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-cyan-600 hover:scale-[1.03] transition-all duration-300 shadow-sm'
  el.innerHTML = `
    <svg class="w-5 h-5 text-cyan-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
    </svg>
    <span class="text-sm font-medium text-gray-800">${t.name}</span>`
  techList.appendChild(el)
})

// ── 프로젝트 카드 ──
const projectList = document.getElementById('project-list')
PROJECTS.forEach(p => {
  const card = document.createElement('div')
  card.className = 'fade-item cursor-pointer p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:border-cyan-400 transition-all duration-300 bg-white'
  card.innerHTML = `
    <h3 class="text-xl font-bold mb-2 text-gray-900">${p.title}</h3>
    <p class="text-sm text-gray-600 mb-4">${p.description}</p>
    <span class="text-cyan-600 text-sm font-medium flex items-center">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 015.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
      </svg>
      자세히 보기 →
    </span>`
  card.addEventListener('click', () => showDetail(p))
  projectList.appendChild(card)
})

// ── 네비게이션 ──
const NAV_LINKS = [
  { href: '#home',     label: 'HOME' },
  { href: '#skills',   label: 'TECHNOLOGY' },
  { href: '#projects', label: 'PROJECTS' },
  { href: '#contact',  label: 'CONTACT' },
]

;['desktop-nav', 'mobile-nav'].forEach(id => {
  const nav = document.getElementById(id)
  const isMobile = id === 'mobile-nav'
  NAV_LINKS.forEach(l => {
    const a = document.createElement('a')
    a.href = l.href
    a.textContent = l.label
    a.className = isMobile
      ? 'text-sm font-medium text-gray-600 hover:text-cyan-600'
      : 'text-gray-600 hover:text-cyan-600 transition-colors px-2 py-1 rounded-md text-sm font-medium'
    a.addEventListener('click', e => {
      e.preventDefault()
      showMain()
      setTimeout(() => {
        if (l.href === '#home') { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
        document.getElementById(l.href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
      }, 50)
      document.getElementById('mobile-nav').classList.add('hidden')
      document.getElementById('icon-menu').classList.remove('hidden')
      document.getElementById('icon-close').classList.add('hidden')
    })
    nav.appendChild(a)
  })
})

// ── 햄버거 메뉴 ──
document.getElementById('hamburger-btn').addEventListener('click', () => {
  const nav = document.getElementById('mobile-nav')
  const open = nav.classList.toggle('hidden')
  document.getElementById('icon-menu').classList.toggle('hidden', !open)
  document.getElementById('icon-close').classList.toggle('hidden', open)
})

// ── 페이지 전환 ──
function showMain() {
  document.getElementById('page-main').classList.add('active')
  document.getElementById('page-detail').classList.remove('active')
  window.scrollTo({ top: 0, behavior: 'smooth' })
  initFadeObserver()
}

function showDetail(p) {
  document.getElementById('page-main').classList.remove('active')
  document.getElementById('page-detail').classList.add('active')
  window.scrollTo({ top: 0 })

  document.getElementById('detail-title').textContent = p.title
  document.getElementById('detail-desc').textContent = p.detail.longDescription

  if (p.link) {
    document.getElementById('detail-link').href = p.link
    document.getElementById('detail-link-wrap').classList.remove('hidden')
  } else {
    document.getElementById('detail-link-wrap').classList.add('hidden')
  }

  const iframe    = document.getElementById('detail-video-iframe')
  const videoEl   = document.getElementById('detail-video-file')
  const videoWrap = document.getElementById('detail-video-wrap')

  if (p.detail.videoUrl) {
    videoWrap.classList.remove('hidden')
    const isYoutube = p.detail.videoUrl.includes('youtube.com') || p.detail.videoUrl.includes('youtu.be')
    if (isYoutube) {
      iframe.src = p.detail.videoUrl
      iframe.classList.remove('hidden')
      videoEl.classList.add('hidden')
      videoEl.src = ''
    } else {
      videoEl.src = p.detail.videoUrl
      videoEl.classList.remove('hidden')
      iframe.classList.add('hidden')
      iframe.src = ''
    }
  } else {
    videoWrap.classList.add('hidden')
    iframe.src = ''
    videoEl.src = ''
  }

  const imgGrid = document.getElementById('detail-images')
  const noImg   = document.getElementById('detail-no-image')
  imgGrid.innerHTML = ''
  if (p.detail.images.length > 0) {
    noImg.classList.add('hidden')
    p.detail.images.forEach((src, i) => {
      imgGrid.innerHTML += `<img src="${src}" alt="스크린샷 ${i+1}" class="w-full rounded-lg shadow-sm object-cover" style="aspect-ratio:16/9"/>`
    })
  } else {
    noImg.classList.remove('hidden')
  }
}

document.getElementById('back-btn').addEventListener('click', showMain)

// ── 시계 (Date 객체 활용) ──
function updateClock() {
  const now = new Date()
  const pad = n => String(n).padStart(2, '0')
  document.getElementById('clock').textContent =
    now.getFullYear() + '.' +
    pad(now.getMonth() + 1) + '.' +
    pad(now.getDate()) + '  ' +
    pad(now.getHours()) + ':' +
    pad(now.getMinutes()) + ':' +
    pad(now.getSeconds())
}
updateClock()
setInterval(updateClock, 1000)

// ── 스크롤 페이드인 (IntersectionObserver 이벤트 활용) ──
function initFadeObserver() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.15 })

  document.querySelectorAll('.fade-item').forEach(el => {
    el.classList.remove('visible')
    observer.observe(el)
  })
}

initFadeObserver()
