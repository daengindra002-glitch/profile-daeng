document.addEventListener('DOMContentLoaded', function() {
   window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    const loader = document.querySelector('.loading-animation');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});
    setTimeout(() => {
        document.querySelector('.loading-animation').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.loading-animation').style.display = 'none';
        }, 500);
    }, 1000);

    
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        document.querySelectorAll('nav ul li a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    
    const animateOnScroll = () => {
        const sections = document.querySelectorAll('.animated-section');
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (sectionTop < windowHeight - 100) {
                section.classList.add('visible');
            }
        });
    };
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    
    const animatedTexts = document.querySelectorAll('.animated-text');
    animatedTexts.forEach(text => {
        const words = text.textContent.split(' ');
        text.innerHTML = '';
        words.forEach((word, i) => {
            const span = document.createElement('span');
            span.textContent = word + ' ';
            span.style.animationDelay = `${i * 0.1}s`;
            text.appendChild(span);
        });
    });

  
    if (document.getElementById('fetchInstagram')) {
        
        async function fetchInstagramData(url) {
            try {
                const response = await fetch(`https://api.bhawanigarg.com/social/instagram/?url=${encodeURIComponent(url)}`);
                if (!response.ok) throw new Error('API request failed');
                return await response.json();
            } catch (error) {
                console.error('Error with main API:', error);
                return null;
            }
        }

        async function fetchAlternativeAPI(url) {
            try {
                // Implementasi alternatif jika API utama gagal
                const response = await fetch(`https://api.example.com/backup?url=${encodeURIComponent(url)}`);
                if (!response.ok) throw new Error('Backup API failed');
                return await response.json();
            } catch (error) {
                console.error('Error with backup API:', error);
                throw new Error('All download methods failed');
            }
        }

       
        function showLoading() {
            const el = document.getElementById('instagramLoading');
            if (el) el.style.display = 'flex';
        }

        function hideLoading() {
            const el = document.getElementById('instagramLoading');
            if (el) el.style.display = 'none';
        }

       
        document.getElementById('fetchInstagram')?.addEventListener('click', async () => {
    const urlInput = document.getElementById('instagramUrl');
    const resultContainer = document.getElementById('instagramResult');
    const previewArea = document.getElementById('previewArea');
    const loadingSpinner = document.getElementById('instagramLoading');
    const errorElement = document.getElementById('instagramError');
    
    if (!urlInput || !resultContainer || !previewArea) return;

    const url = urlInput.value.trim();
    
    // Validasi dasar URL
    if (!url || !url.includes('instagram.com')) {
        showError('Masukkan URL Instagram yang valid (contoh: https://www.instagram.com/p/ABC123/)');
        return;
    }

    // Tampilkan loading
    if (loadingSpinner) loadingSpinner.style.display = 'flex';
    if (errorElement) errorElement.style.display = 'none';
    previewArea.innerHTML = '';
    
    try {
        // Coba API utama
        let data = await fetchInstagramData(url);
        
        // Fallback jika data tidak lengkap
        if (!data.image && !data.video) {
            data = await fetchAlternativeAPI(url);
        }
        
        // Tampilkan hasil
        if (data.image || data.video) {
            displayMedia(data);
            resultContainer.style.display = 'block';
        } else {
            throw new Error('Tidak menemukan media yang dapat diunduh');
        }
    } catch (error) {
        console.error('Download error:', error);
        showError(`Gagal: ${error.message || 'Coba lagi nanti'}`);
    } finally {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
});

// Fungsi untuk menampilkan media
function displayMedia(data) {
    const previewArea = document.getElementById('previewArea');
    if (!previewArea) return;

    previewArea.innerHTML = '';

    if (data.video) {
        previewArea.innerHTML = `
            <div class="media-container">
                <video controls class="media-preview">
                    <source src="${data.video}" type="video/mp4">
                    Browser tidak mendukung video
                </video>
                <button class="download-btn" onclick="downloadFile('${data.video}', 'video')">
                    <i class="fas fa-download"></i> Download Video
                </button>
            </div>
        `;
    } else if (data.image) {
        previewArea.innerHTML = `
            <div class="media-container">
                <img src="${data.image}" class="media-preview" alt="Preview Instagram">
                <button class="download-btn" onclick="downloadFile('${data.image}', 'image')">
                    <i class="fas fa-download"></i> Download Gambar
                </button>
            </div>
        `;
    }
}

// Fungsi download umum
function downloadFile(url, type) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `instagram-${Date.now()}.${type === 'video' ? 'mp4' : 'jpg'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Fungsi tampilkan error
function showError(message) {
    const errorElement = document.getElementById('instagramError');
    const errorText = document.getElementById('errorText');
    
    if (errorElement && errorText) {
        errorText.textContent = message;
        errorElement.style.display = 'flex';
    }
}
