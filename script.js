document.addEventListener('DOMContentLoaded', function() {
   
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

       
        document.getElementById('fetchInstagram').addEventListener('click', async () => {
            const url = document.getElementById('instagramUrl').value.trim();
            
            if (!url.includes('instagram.com')) {
                showError('Masukkan URL Instagram yang valid');
                return;
            }

            showLoading();
            hideError();
            hideResults();

            try {
                let data = await fetchInstagramData(url);
                if (!data || (!data.image && !data.video && !data.media)) {
                    data = await fetchAlternativeAPI(url);
                }
                
                if (data) {
                    displayResults(data);
                } else {
                    throw new Error('Tidak dapat memproses URL ini');
                }
            } catch (error) {
                showError(`Gagal memuat: ${error.message}`);
            } finally {
                hideLoading();
            }
        });
    }

   
    if (document.getElementById('gameArea')) {
      
    }

    if (document.getElementById('editorContent')) {

    }

   
    if (document.getElementById('converterValue')) {
       
    }

  
    if (document.getElementById('imageUpload')) {
    }

    
    if (document.getElementById('danaPayment')) {
       
    }
});
