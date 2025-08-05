document.addEventListener('DOMContentLoaded', function() {
    
    setTimeout(() => {
        document.querySelector('.loading-animation').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.loading-animation').style.display = 'none';
        }, 500);
    }, 1000);

   
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
    });

    
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.querySelector('i').classList.remove('fa-times');
            menuToggle.querySelector('i').classList.add('fa-bars');
        });
    });

    
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

    
    if (document.getElementById('gameArea')) {
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
                clickSound.currentTime = 0;
                clickSound.play();
                
                score += points;
                scoreElement.textContent = score;
                
                
                const explosion = document.createElement('div');
                explosion.className = 'explosion';
                explosion.style.left = `${randomX - 20}px`;
                explosion.style.top = `${randomY - 20}px`;
                gameArea.appendChild(explosion);
                
                explosionSound.currentTime = 0;
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

    
if (document.getElementById('editorContent')) {
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

if (document.getElementById('converterValue')) {
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

    if (document.getElementById('imageUpload')) {
    const imageUpload = document.getElementById('imageUpload');
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    const colorGrid = document.getElementById('colorGrid');
    const selectedColorBox = document.getElementById('selectedColorBox');
    const hexValue = document.getElementById('hexValue');
    const rgbValue = document.getElementById('rgbValue');
    const copyBtn = document.getElementById('copyColor');
    const colorResults = document.getElementById('colorResults');

    imageUpload.addEventListener('change', handleImageUpload);

    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                extractColors();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    function extractColors() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const colorMap = {};
        
        
        for (let i = 0; i < imageData.length; i += 16 * 4) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const hex = rgbToHex(r, g, b);
            
            if (!colorMap[hex]) {
                colorMap[hex] = { r, g, b, count: 1 };
            } else {
                colorMap[hex].count++;
            }
        }
        
        
        const colors = Object.values(colorMap)
            .sort((a, b) => b.count - a.count)
            .slice(0, 12); 
        
        displayColors(colors);
    }

    function displayColors(colors) {
        colorGrid.innerHTML = '';
        colors.forEach(color => {
            const hex = rgbToHex(color.r, color.g, color.b);
            const colorElement = document.createElement('div');
            colorElement.className = 'color-item';
            colorElement.style.backgroundColor = hex;
            colorElement.dataset.hex = hex;
            colorElement.dataset.rgb = `rgb(${color.r}, ${color.g}, ${color.b})`;
            
            colorElement.addEventListener('click', function() {
                selectColor(this);
            });
            
            colorGrid.appendChild(colorElement);
        });
        
       
        if (colors.length > 0) {
            selectColor(colorGrid.firstChild);
        }
        
        colorResults.style.display = 'block';
    }

    function selectColor(element) {
        const hex = element.dataset.hex;
        const rgb = element.dataset.rgb;
        
        selectedColorBox.style.backgroundColor = hex;
        hexValue.textContent = hex;
        rgbValue.textContent = rgb;
        
    
        document.querySelectorAll('.color-item').forEach(item => {
            item.classList.remove('selected');
        });
        element.classList.add('selected');
    }

    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(hexValue.textContent)
            .then(() => {
                copyBtn.textContent = 'Tersalin!';
                setTimeout(() => {
                    copyBtn.textContent = 'Salin HEX';
                }, 2000);
            });
    });
}

    
    if (document.getElementById('danaPayment')) {
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

    
    if (document.querySelector('.category-btn')) {
        
        const categoryBtns = document.querySelectorAll('.category-btn');
        const toolCards = document.querySelectorAll('.tool-card');
        
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                
                categoryBtns.forEach(b => b.classList.remove('active'));
                
                btn.classList.add('active');
                
                const category = btn.dataset.category;
                
                
                toolCards.forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
        
        
        const toolBtns = document.querySelectorAll('.tool-btn');
        const toolContainers = document.querySelectorAll('.tool-container');
        const backButtons = document.querySelectorAll('.back-button');
        
        toolBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tool = btn.dataset.tool;
                
                
                toolContainers.forEach(container => {
                    container.style.display = 'none';
                });
                
                
                document.getElementById(`${tool}Tool`).style.display = 'block';
                
                
                document.getElementById('toolContainers').scrollIntoView({ behavior: 'smooth' });
            });
        });
        
        backButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                
                toolContainers.forEach(container => {
                    container.style.display = 'none';
                });
                
                
                document.querySelector('.tools-list').scrollIntoView({ behavior: 'smooth' });
            });
        });
        
        
        if (document.getElementById('generatePassword')) {
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
                if (hasSymbol) chars += '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
                
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
        
        
        if (document.getElementById('fetchInstagram')) {
    const fetchBtn = document.getElementById('fetchInstagram');
    const instagramUrl = document.getElementById('instagramUrl');
    const resultContainer = document.getElementById('instagramResult');
    const previewImg = document.getElementById('instagramPreview');
    const downloadBtns = document.querySelectorAll('.download-btn');
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
            
            // Tampilkan preview
            previewImg.src = data.image || data.thumbnail || data.url;
            
            // Set download links
            downloadBtns.forEach(btn => {
                const type = btn.dataset.type;
                btn.onclick = () => {
                    const downloadUrl = type === 'video' ? 
                        (data.video || data.url) : 
                        (data.image || data.url);
                    
                    if (!downloadUrl) {
                        alert('Tipe konten ini tidak tersedia');
                        return;
                    }
                    
                    window.open(downloadUrl, '_blank');
                };
            });
            
            resultContainer.style.display = 'block';
        } catch (error) {
            showError(error.message);
        } finally {
            loadingSpinner.style.display = 'none';
        }
    });

    function showError(message) {
        errorMessage.style.display = 'flex';
        document.getElementById('errorText').textContent = message;
    }
}
        
        // Click Game Tool
        if (document.getElementById('startGameBtn')) {
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
                
                // Start timer
                timer = setInterval(() => {
                    timeLeft--;
                    gameTime.textContent = timeLeft;
                    
                    if (timeLeft <= 0) {
                        endGame();
                    }
                }, 1000);
                
                // Start creating targets
                gameInterval = setInterval(createClickTarget, 1000);
                
                // Create first target immediately
                createClickTarget();
            }
            
            function createClickTarget() {
                if (!gameRunning) return;
                
                const target = document.createElement('div');
                target.className = 'click-target';
                
                // Random position
                const maxWidth = gameArea.offsetWidth - 60;
                const maxHeight = gameArea.offsetHeight - 60;
                
                const randomX = Math.floor(Math.random() * maxWidth);
                const randomY = Math.floor(Math.random() * maxHeight);
                
                target.style.left = `${randomX}px`;
                target.style.top = `${randomY}px`;
                
                // Random color
                const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                target.style.backgroundColor = randomColor;
                
                // Random size
                const randomSize = 40 + Math.floor(Math.random() * 40);
                target.style.width = `${randomSize}px`;
                target.style.height = `${randomSize}px`;
                
                // Add points value
                const points = Math.floor(randomSize / 10);
                target.textContent = points;
                
                // Click event
                target.addEventListener('click', function() {
                    clickSound.currentTime = 0;
                    clickSound.play();
                    
                    score += points;
                    gameScore.textContent = score;
                    
                    // Create explosion effect
                    const explosion = document.createElement('div');
                    explosion.className = 'explosion';
                    explosion.style.left = `${randomX - 20}px`;
                    explosion.style.top = `${randomY - 20}px`;
                    gameArea.appendChild(explosion);
                    
                    explosionSound.currentTime = 0;
                    explosionSound.play();
                    
                    // Remove elements after animation
                    setTimeout(() => {
                        explosion.remove();
                    }, 500);
                    
                    target.remove();
                });
                
                gameArea.appendChild(target);
                
                // Remove target after 1.5 seconds if not clicked
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
                
                successSound.currentTime = 0;
                successSound.play();
            }
        }
    }
});