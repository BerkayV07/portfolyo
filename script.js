// ==========================================
// 1. LÜKS GOLD IŞILTI YAĞMURU VE MOUSE PATLAMA EFEKTİ
// ==========================================
const canvas = document.getElementById('bg-animation');
const ctx = canvas.getContext('2d');

let particles = [];
const mouse = { x: null, y: null, radius: 120 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Parçacık Sınıfı
class GoldParticle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5; // Farklı boyutlarda altın tozları
        this.baseX = this.x; // Orijinal X konumu
        this.baseY = this.y; // Orijinal Y konumu
        this.density = (Math.random() * 30) + 10; // Mouse itme gücü hassasiyeti
        this.speedY = Math.random() * 0.3 + 0.1; // Aşağı doğru süzülme hızı
    }

    update() {
        // Doğal aşağı süzülme hareketi
        this.baseY += this.speedY;
        if (this.baseY > canvas.height) {
            this.baseY = 0;
            this.baseX = Math.random() * canvas.width;
        }

        // Mouse Etkileşimi ve Patlama Mekanizması
        if (mouse.x != null && mouse.y != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                // Mouse yaklaştığında parçacıklar hızla dışarı doğru fırlar (Patlama hissi)
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (mouse.radius - distance) / mouse.radius;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;

                this.x -= directionX;
                this.y -= directionY;
                return; // Patlama anında doğal süzülmeyi durdur
            }
        }

        // Mouse uzaklaştığında pürüzsüzce eski orijinal süzülme rotasına geri dönme
        if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 15;
        }
        if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 15;
        }
    }

    draw() {
        // Gold ışıltı rengi ve hafif parıltı efekti
        ctx.fillStyle = 'rgba(223, 183, 108, 0.5)';
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = '#dfb76c';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Performans için gölgeyi sıfırla
    }
}

function init() {
    particles = [];
    const numberOfParticles = (canvas.width * canvas.height) / 6000; // İdeal yoğunluk
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new GoldParticle());
    }
}
init();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    requestAnimationFrame(animate);
}
animate();


// ==========================================
// 4. BUTONLAR İÇİN DİNAMİK TIKLAMA DALGASI (Ripple Effect)
// ==========================================
const allButtons = document.querySelectorAll('.btn');

allButtons.forEach(button => {
    button.addEventListener('click', function (e) {
        // Tıklanan koordinatları buton sınırlarına göre hesapla
        const x = e.clientX - e.target.getBoundingClientRect().left;
        const y = e.clientY - e.target.getBoundingClientRect().top;

        // Geçici bir dalga (span) elementi oluştur
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        // Dalgayı butonun içine enjekte et
        this.appendChild(ripple);

        // Animasyon bitince elementi temizle (Performans için önemli)
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});