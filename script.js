document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const loader = document.querySelector('.loading-animation');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
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

    
    initGame();
    initEditor();
    initConverter();
    initColorPicker();
    initDanaPayment();
    initToolNavigation();
    initPasswordGenerator();
    initInstagramDownloader();
    initClickGame();
    initJsonGenerator();

   
    function initGame() {
        if (!document.getElementById('gameArea')) return;

        const gameArea = document.getElementById('gameArea');
        const startGameBtn = document.getElementById('startGame');
        const scoreElement = document.getElementById('score');
        const clickSound = document.getElementById('clickSound');
        const explosionSound = document.getElementById('explosionSound');
        
        let score = 0;
        let gameActive = false;
        
        startGameBtn.addEventListener('click', startGame);
        
        function startGame() {
            gameActive = true;
            score = 0;
            scoreElement.textContent = score;
            gameArea.innerHTML = '';
            startGameBtn.disabled = true;
            
            createTarget();
        }
        
        function createTarget() {
            if (!gameActive) return;
            
            const target = document.createElement('div');
            target.className = 'target';
            
            const maxWidth = gameArea.offsetWidth - 50;
            const maxHeight = gameArea.offsetHeight - 50;
            
            const randomX = Math.floor(Math.random() * maxWidth);
            const randomY = Math.floor(Math.random() * maxHeight);
            
            target.style.left = `${randomX}px`;
            target.style.top = `${randomY}px`;
            
            const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            target.style.backgroundColor = randomColor;
            
            const randomSize = 30 + Math.floor(Math.random() * 30);
            target.style.width = `${randomSize}px`;
            target.style.height = `${randomSize}px`;
            
            const points = Math.floor(randomSize / 10);
            target.textContent = points;
            
            target.addEventListener('click', function() {
                if (!clickSound.paused) clickSound.currentTime = 0;
                clickSound.play();
                
                score += points;
                scoreElement.textContent = score;
                
                const explosion = document.createElement('div');
                explosion.className = 'explosion';
                explosion.style.left = `${randomX - 20}px`;
                explosion.style.top = `${randomY - 20}px`;
                gameArea.appendChild(explosion);
                
                if (!explosionSound.paused) explosionSound.currentTime = 0;
                explosionSound.play();
                
                setTimeout(() => {
                    explosion.remove();
                }, 500);
                
                target.remove();
                
                setTimeout(createTarget, 500);
            });
            
            gameArea.appendChild(target);
            
            setTimeout(() => {
                if (gameArea.contains(target)) {
                    target.remove();
                    createTarget();
                }
            }, 2000);
        }
    }

    
    function initEditor() {
        if (!document.getElementById('editorContent')) return;

        const editorContent = document.getElementById('editorContent');
        const toolbarButtons = document.querySelectorAll('.editor-toolbar button');
        const toolbarSelects = document.querySelectorAll('.editor-toolbar select');
        const clearBtn = document.getElementById('clearEditor');
        const saveBtn = document.getElementById('saveEditor');
        const copyBtn = document.getElementById('copyEditor');

        toolbarButtons.forEach(button => {
            button.addEventListener('click', function() {
                const command = this.dataset.command;
                
                if (command === 'createLink') {
                    const url = prompt('Masukkan URL:');
                    if (url) document.execCommand(command, false, url);
                } else {
                    document.execCommand(command, false, null);
                }
                
                editorContent.focus();
            });
        });

        toolbarSelects.forEach(select => {
            select.addEventListener('change', function() {
                document.execCommand(this.dataset.command, false, this.value);
                editorContent.focus();
            });
        });

        clearBtn.addEventListener('click', function() {
            editorContent.innerHTML = '<p>Ketik di sini...</p>';
        });

        saveBtn.addEventListener('click', function() {
            const html = editorContent.innerHTML;
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'document.html';
            a.click();
            
            URL.revokeObjectURL(url);
        });

        copyBtn.addEventListener('click', function() {
            const range = document.createRange();
            range.selectNode(editorContent);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy');
            window.getSelection().removeAllRanges();
            
            copyBtn.textContent = 'Tersalin!';
            setTimeout(() => {
                copyBtn.textContent = 'Salin Teks';
            }, 2000);
        });

        editorContent.addEventListener('click', function() {
            if (this.textContent === 'Ketik di sini...') {
                this.innerHTML = '<p></p>';
            }
        });
    }

    
    function initConverter() {
        if (!document.getElementById('converterValue')) return;

        const converterValue = document.getElementById('converterValue');
        const converterFrom = document.getElementById('converterFrom');
        const converterTo = document.getElementById('converterTo');
        const converterResult = document.getElementById('converterResult');
        const categoryBtns = document.querySelectorAll('.converter-categories .category-btn');

        const conversionRates = {
            length: {
                cm: 1,
                m: 100,
                km: 100000,
                in: 2.54,
                ft: 30.48,
                mi: 160934
            },
            weight: {
                g: 1,
                kg: 1000,
                oz: 28.35,
                lb: 453.592,
                ton: 1000000
            },
            temperature: {
                c: { formula: (v, to) => to === 'f' ? (v * 9/5) + 32 : v + 273.15 },
                f: { formula: (v, to) => to === 'c' ? (v - 32) * 5/9 : (v - 32) * 5/9 + 273.15 },
                k: { formula: (v, to) => to === 'c' ? v - 273.15 : (v - 273.15) * 9/5 + 32 }
            }
        };

        let currentCategory = 'length';

        function updateUnits() {
            const units = Object.keys(conversionRates[currentCategory]);
            const fromValue = converterFrom.value;
            const toValue = converterTo.value;
            
            converterFrom.innerHTML = units.map(unit => 
                `<option value="${unit}">${getUnitName(unit)}</option>`
            ).join('');
            
            converterTo.innerHTML = units.map(unit => 
                `<option value="${unit}">${getUnitName(unit)}</option>`
            ).join('');
            
            if (units.includes(fromValue)) converterFrom.value = fromValue;
            if (units.includes(toValue)) converterTo.value = toValue;
            
            convert();
        }

        function getUnitName(unit) {
            const names = {
                cm: 'Centimeter (cm)',
                m: 'Meter (m)',
                km: 'Kilometer (km)',
                in: 'Inch (in)',
                ft: 'Feet (ft)',
                mi: 'Mile (mi)',
                g: 'Gram (g)',
                kg: 'Kilogram (kg)',
                oz: 'Ounce (oz)',
                lb: 'Pound (lb)',
                ton: 'Ton (ton)',
                c: 'Celsius (°C)',
                f: 'Fahrenheit (°F)',
                k: 'Kelvin (K)'
            };
            return names[unit] || unit;
        }

        function convert() {
            const value = parseFloat(converterValue.value);
            if (isNaN(value)) {
                converterResult.value = '';
                return;
            }

            const from = converterFrom.value;
            const to = converterTo.value;

            if (currentCategory === 'temperature') {
                const result = conversionRates.temperature[from].formula(value, to);
                converterResult.value = result.toFixed(2);
            } else {
                const rateFrom = conversionRates[currentCategory][from];
                const rateTo = conversionRates[currentCategory][to];
                const result = (value * rateFrom) / rateTo;
                converterResult.value = result.toFixed(6);
            }
        }

        converterValue.addEventListener('input', convert);
        converterFrom.addEventListener('change', convert);
        converterTo.addEventListener('change', convert);

        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                categoryBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentCategory = this.dataset.category;
                updateUnits();
            });
        });

        updateUnits();
    }

    
   function initColorPicker() {
    const imageUpload = document.getElementById('imageUpload');
    const previewImage = document.getElementById('previewImage');
    const extractColorsBtn = document.getElementById('extractColorsBtn');
    const colorGrid = document.getElementById('colorGrid');
    const selectedColorBox = document.getElementById('selectedColorBox');
    const colorValue = document.getElementById('colorValue');
    const copyColorBtn = document.getElementById('copyColorBtn');
    const colorResults = document.querySelector('.color-results');
    const uploadArea = document.querySelector('.upload-area');

    if (!imageUpload) return;

    
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            alert('Silakan pilih file gambar');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            previewImage.src = event.target.result;
            previewImage.style.display = 'block';
            extractColorsBtn.style.display = 'inline-block';
            uploadArea.style.display = 'none';
        };
        reader.readAsDataURL(file);
    });

    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function() {
        this.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        imageUpload.files = e.dataTransfer.files;
        const changeEvent = new Event('change');
        imageUpload.dispatchEvent(changeEvent);
    });

    
    extractColorsBtn.addEventListener('click', function() {
        extractColorsFromImage(previewImage);
        colorResults.style.display = 'block';
    });

   
    function extractColorsFromImage(img) {
        colorGrid.innerHTML = '';
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const colorCount = {};
        
        
        const sampleStep = 5; 
        for (let y = 0; y < canvas.height; y += sampleStep) {
            for (let x = 0; x < canvas.width; x += sampleStep) {
                const i = (y * canvas.width + x) * 4;
                const r = pixelData[i];
                const g = pixelData[i + 1];
                const b = pixelData[i + 2];
                const a = pixelData[i + 3];
                
                if (a < 128) continue;
                
                const hex = rgbToHex(r, g, b);
                colorCount[hex] = (colorCount[hex] || 0) + 1;
            }
        }
        
        
        const sortedColors = Object.entries(colorCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 25)
            .map(item => item[0]);
        
        
        sortedColors.forEach(color => {
            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = color;
            colorBox.dataset.hex = color;
            
            colorBox.addEventListener('click', function() {
                selectColor(color);
            });
            
            colorGrid.appendChild(colorBox);
        });
        
        
        if (sortedColors.length > 0) {
            selectColor(sortedColors[0]);
        }
    }

    function selectColor(color) {
        selectedColorBox.style.backgroundColor = color;
        colorValue.textContent = color;
        
        
        document.querySelectorAll('.color-box').forEach(box => {
            box.classList.toggle('selected', box.dataset.hex === color);
        });
    }

    copyColorBtn.addEventListener('click', function() {
        if (!colorValue.textContent) return;
        
        navigator.clipboard.writeText(colorValue.textContent).then(() => {
            copyColorBtn.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
            setTimeout(() => {
                copyColorBtn.innerHTML = '<i class="fas fa-copy"></i> Salin Warna';
            }, 2000);
        }).catch(err => {
            console.error('Gagal menyalin warna:', err);
        });
    });

   
    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    initColorPicker();
    
});
    
    function initDanaPayment() {
        if (!document.getElementById('danaPayment')) return;

        const danaPayment = document.getElementById('danaPayment');
        const danaDetails = document.getElementById('danaDetails');
        const copyDana = document.getElementById('copyDana');
        const danaNumber = document.getElementById('danaNumber');
        
        danaPayment.addEventListener('click', () => {
            danaDetails.style.display = 'block';
            danaDetails.scrollIntoView({ behavior: 'smooth' });
        });
        
        copyDana.addEventListener('click', () => {
            danaNumber.select();
            document.execCommand('copy');
            
            const originalText = copyDana.innerHTML;
            copyDana.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
            
            setTimeout(() => {
                copyDana.innerHTML = originalText;
            }, 2000);
        });
    }

 
    function initToolNavigation() {
        if (!document.querySelector('.category-btn')) return;

        const categoryBtns = document.querySelectorAll('.category-btn');
        const toolCards = document.querySelectorAll('.tool-card');
        const toolBtns = document.querySelectorAll('.tool-btn');
        const toolContainers = document.querySelectorAll('.tool-container');
        const backButtons = document.querySelectorAll('.back-button');
        
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const category = btn.dataset.category;
                
                toolCards.forEach(card => {
                    card.style.display = (category === 'all' || card.dataset.category === category) 
                        ? 'block' 
                        : 'none';
                });
            });
        });
        
        toolBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tool = btn.dataset.tool;
                
                toolContainers.forEach(container => {
                    container.style.display = 'none';
                });
                
                const toolContainer = document.getElementById(`${tool}Tool`);
                if (toolContainer) {
                    toolContainer.style.display = 'block';
                    toolContainer.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        backButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                toolContainers.forEach(container => {
                    container.style.display = 'none';
                });
                
                const toolsList = document.querySelector('.tools-list');
                if (toolsList) {
                    toolsList.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    
    function initPasswordGenerator() {
        if (!document.getElementById('generatePassword')) return;

        const generateBtn = document.getElementById('generatePassword');
        const passwordField = document.getElementById('generatedPassword');
        const copyBtn = document.getElementById('copyPassword');
        const lengthSlider = document.getElementById('passwordLength');
        const lengthValue = document.getElementById('lengthValue');
        const uppercase = document.getElementById('uppercase');
        const lowercase = document.getElementById('lowercase');
        const numbers = document.getElementById('numbers');
        const symbols = document.getElementById('symbols');
        const strengthBar = document.getElementById('strengthBar');
        const strengthText = document.getElementById('strengthText');
        
        lengthSlider.addEventListener('input', () => {
            lengthValue.textContent = lengthSlider.value;
        });
        
        generateBtn.addEventListener('click', generatePassword);
        
        copyBtn.addEventListener('click', () => {
            passwordField.select();
            document.execCommand('copy');
            
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="far fa-copy"></i>';
            }, 2000);
        });
        
        function generatePassword() {
            const length = lengthSlider.value;
            const hasUpper = uppercase.checked;
            const hasLower = lowercase.checked;
            const hasNumber = numbers.checked;
            const hasSymbol = symbols.checked;
            
            let chars = '';
            if (hasUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (hasLower) chars += 'abcdefghijklmnopqrstuvwxyz';
            if (hasNumber) chars += '0123456789';
            if (hasSymbol) chars += '!@#$%^&*()_+~`|}{[]\\:;?><,./-=';
            
            if (chars === '') {
                passwordField.value = 'Pilih setidaknya satu opsi';
                return;
            }
            
            let password = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * chars.length);
                password += chars[randomIndex];
            }
            
            passwordField.value = password;
            updateStrength(password);
        }
        
        function updateStrength(password) {
            let strength = 0;
            
            strength += Math.min(50, (password.length / 32) * 50);
            
            const variety = [];
            if (password.match(/[A-Z]/)) variety.push('upper');
            if (password.match(/[a-z]/)) variety.push('lower');
            if (password.match(/[0-9]/)) variety.push('number');
            if (password.match(/[^A-Za-z0-9]/)) variety.push('symbol');
            
            strength += (variety.length / 4) * 50;
            
            strengthBar.style.width = `${strength}%`;
            
            if (strength < 30) {
                strengthBar.style.backgroundColor = '#e74c3c';
                strengthText.textContent = 'Lemah';
            } else if (strength < 70) {
                strengthBar.style.backgroundColor = '#f39c12';
                strengthText.textContent = 'Sedang';
            } else {
                strengthBar.style.backgroundColor = '#2ecc71';
                strengthText.textContent = 'Kuat';
            }
        }
        
        generatePassword();
    }

    
    function initInstagramDownloader() {
        if (!document.getElementById('fetchInstagram')) return;

        const fetchBtn = document.getElementById('fetchInstagram');
        const instagramUrl = document.getElementById('instagramUrl');
        const resultContainer = document.getElementById('instagramResult');
        const loadingSpinner = document.getElementById('instagramLoading');
        const errorMessage = document.getElementById('instagramError');

        fetchBtn.addEventListener('click', async () => {
            const url = instagramUrl.value.trim();
            
            if (!url.includes('instagram.com')) {
                showError('URL Instagram tidak valid');
                return;
            }

            try {
                loadingSpinner.style.display = 'block';
                errorMessage.style.display = 'none';
                resultContainer.style.display = 'none';

                const apiUrl = `https://api.bhawanigarg.com/social/instagram/?url=${encodeURIComponent(url)}`;
                const response = await fetch(apiUrl);
                
                if (!response.ok) throw new Error('Gagal mengambil data');
                
                const data = await response.json();
                
                if (data.error) throw new Error(data.message || 'Konten tidak ditemukan');
                
                displayInstagramResult(data);
            } catch (error) {
                showError(error.message);
            } finally {
                loadingSpinner.style.display = 'none';
            }
        });

        function displayInstagramResult(data) {
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
                        <button class="download-btn" data-url="${data.video}" data-type="video">
                            <i class="fas fa-download"></i> Download Video
                        </button>
                    </div>
                `;
            } else if (data.image) {
                previewArea.innerHTML = `
                    <div class="media-container">
                        <img src="${data.image}" class="media-preview" alt="Preview Instagram">
                        <button class="download-btn" data-url="${data.image}" data-type="image">
                            <i class="fas fa-download"></i> Download Gambar
                        </button>
                    </div>
                `;
            }

            previewArea.querySelectorAll('.download-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const url = this.dataset.url;
                    const type = this.dataset.type;
                    if (url) {
                        window.open(url, '_blank');
                    }
                });
            });

            resultContainer.style.display = 'block';
        }

        function showError(message) {
            errorMessage.style.display = 'flex';
            const errorText = document.getElementById('errorText');
            if (errorText) {
                errorText.textContent = message;
            }
        }
    }

   
    function initClickGame() {
        if (!document.getElementById('startGameBtn')) return;

        const startGameBtn = document.getElementById('startGameBtn');
        const gameArea = document.getElementById('clickGameArea');
        const gameScore = document.getElementById('gameScore');
        const gameTime = document.getElementById('gameTime');
        const clickSound = document.getElementById('clickSound');
        const explosionSound = document.getElementById('explosionSound');
        const successSound = document.getElementById('successSound');
        
        let score = 0;
        let timeLeft = 60;
        let gameInterval;
        let timer;
        let gameRunning = false;
        
        startGameBtn.addEventListener('click', startClickGame);
        
        function startClickGame() {
            if (gameRunning) return;
            
            gameRunning = true;
            score = 0;
            timeLeft = 60;
            gameScore.textContent = score;
            gameTime.textContent = timeLeft;
            gameArea.innerHTML = '';
            startGameBtn.disabled = true;
            
            timer = setInterval(() => {
                timeLeft--;
                gameTime.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    endGame();
                }
            }, 1000);
            
            gameInterval = setInterval(createClickTarget, 1000);
            createClickTarget();
        }
        
        function createClickTarget() {
            if (!gameRunning) return;
            
            const target = document.createElement('div');
            target.className = 'click-target';
            
            const maxWidth = gameArea.offsetWidth - 60;
            const maxHeight = gameArea.offsetHeight - 60;
            
            const randomX = Math.floor(Math.random() * maxWidth);
            const randomY = Math.floor(Math.random() * maxHeight);
            
            target.style.left = `${randomX}px`;
            target.style.top = `${randomY}px`;
            
            const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            target.style.backgroundColor = randomColor;
            
            const randomSize = 40 + Math.floor(Math.random() * 40);
            target.style.width = `${randomSize}px`;
            target.style.height = `${randomSize}px`;
            
            const points = Math.floor(randomSize / 10);
            target.textContent = points;
            
            target.addEventListener('click', function() {
                if (!clickSound.paused) clickSound.currentTime = 0;
                clickSound.play();
                
                score += points;
                gameScore.textContent = score;
                
                const explosion = document.createElement('div');
                explosion.className = 'explosion';
                explosion.style.left = `${randomX - 20}px`;
                explosion.style.top = `${randomY - 20}px`;
                gameArea.appendChild(explosion);
                
                if (!explosionSound.paused) explosionSound.currentTime = 0;
                explosionSound.play();
                
                setTimeout(() => {
                    explosion.remove();
                }, 500);
                
                target.remove();
            });
            
            gameArea.appendChild(target);
            
            setTimeout(() => {
                if (gameArea.contains(target)) {
                    target.remove();
                }
            }, 1500);
        }
        
        function endGame() {
            gameRunning = false;
            clearInterval(timer);
            clearInterval(gameInterval);
            startGameBtn.disabled = false;
            
            gameArea.innerHTML = `<h3>Permainan Selesai! Skor Anda: ${score}</h3>`;
            
            if (!successSound.paused) successSound.currentTime = 0;
            successSound.play();
        }
    }

    function initJsonGenerator() {
    if (!document.getElementById('jsonInput')) return;

    const jsonInput = document.getElementById('jsonInput');
    const jsonOutput = document.getElementById('jsonOutput');
    const jsonInfo = document.getElementById('jsonInfo');
    const generateBtn = document.getElementById('generateJson');
    const formatBtn = document.getElementById('formatJson');
    const minifyBtn = document.getElementById('minifyJson');
    const copyBtn = document.getElementById('copyJson');
    const clearBtn = document.getElementById('clearJson');

    // Initialize with example
    jsonInput.value = '{\n  "nama": "John Doe",\n  "umur": 30,\n  "pekerjaan": "Developer",\n  "hobi": ["membaca", "bermain game", "berkebun"],\n  "menikah": false,\n  "alamat": {\n    "jalan": "Jl. Contoh No. 123",\n    "kota": "Jakarta",\n    "kodePos": "12345"\n  }\n}';
    processJson();

    generateBtn.addEventListener('click', processJson);
    formatBtn.addEventListener('click', formatJson);
    minifyBtn.addEventListener('click', minifyJson);
    copyBtn.addEventListener('click', copyJson);
    clearBtn.addEventListener('click', clearJson);

    function processJson() {
        try {
            let input = jsonInput.value.trim();
            
            // If input is not already JSON, convert it to JSON
            if (!input.startsWith('{') && !input.startsWith('[')) {
                // Try to parse as key-value pairs
                const lines = input.split('\n').filter(line => line.trim() !== '');
                const obj = {};
                
                lines.forEach(line => {
                    const separatorIndex = line.indexOf(':');
                    if (separatorIndex > 0) {
                        const key = line.substring(0, separatorIndex).trim();
                        const value = line.substring(separatorIndex + 1).trim();
                        obj[key] = isNaN(value) ? value : Number(value);
                    }
                });
                
                input = JSON.stringify(obj, null, 2);
                jsonInput.value = input;
            }
            
            const jsonObj = JSON.parse(input);
            const formattedJson = JSON.stringify(jsonObj, null, 2);
            
            jsonOutput.innerHTML = syntaxHighlight(formattedJson);
            jsonInfo.textContent = `Valid JSON - ${formattedJson.length} karakter, ${countLines(formattedJson)} baris`;
            jsonInfo.style.color = '#2ecc71';
        } catch (error) {
            jsonOutput.textContent = `Error: ${error.message}`;
            jsonInfo.textContent = 'Invalid JSON';
            jsonInfo.style.color = '#e74c3c';
        }
    }

    function formatJson() {
        try {
            const jsonObj = JSON.parse(jsonInput.value);
            const formattedJson = JSON.stringify(jsonObj, null, 2);
            jsonInput.value = formattedJson;
            processJson();
        } catch (error) {
            jsonOutput.textContent = `Error: ${error.message}`;
            jsonInfo.textContent = 'Invalid JSON';
            jsonInfo.style.color = '#e74c3c';
        }
    }

    function minifyJson() {
        try {
            const jsonObj = JSON.parse(jsonInput.value);
            const minifiedJson = JSON.stringify(jsonObj);
            jsonInput.value = minifiedJson;
            processJson();
        } catch (error) {
            jsonOutput.textContent = `Error: ${error.message}`;
            jsonInfo.textContent = 'Invalid JSON';
            jsonInfo.style.color = '#e74c3c';
        }
    }

    function copyJson() {
        const textToCopy = jsonOutput.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="far fa-copy"></i> Salin JSON';
            }, 2000);
        }).catch(err => {
            console.error('Gagal menyalin teks:', err);
        });
    }

    function clearJson() {
        jsonInput.value = '';
        jsonOutput.textContent = '';
        jsonInfo.textContent = '';
    }

    function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, 
            function(match) {
                let cls = 'json-number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'json-key';
                    } else {
                        cls = 'json-string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'json-boolean';
                } else if (/null/.test(match)) {
                    cls = 'json-null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
    }

    function countLines(text) {
        return text.split('\n').length;
    }
}
});
