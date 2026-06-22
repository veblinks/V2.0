// ============================================================
//  ULTRA AIM-DRAG V4.0 — 9999999 SENSITIVITY
//  AIM LOCK + AIM ASSIST + AIM BOT
//  AUTO ACTIVATE FOR com.dts.freefireth / com.dts.freefiremax
// ============================================================

// ============================================================
//  МЕГА-НАСТРОЙКИ
// ============================================================
const MEGA_CONFIG = {
    sensitivity: 9999999,
    aimLock: true,
    aimAssist: true,
    aimBot: true,
    headPriority: true,
    lockSpeed: 999,
    fov: 360,
    smooth: 0,
    recoilControl: 0,
    autoFire: true
};

let aimDragActive = false;
let fireButton = null;
let aimTarget = {
    x: 0,
    y: 0
};
let headshotLock = true;
let dragSensitivity = 9999999;
let isDragging = false;
let lastX = 0,
    lastY = 0;
let isMouseDown = false;
let gameVersion = 'normal';
let autoActivate = false;
let aimBotInterval = null;

// ============================================================
//  ЦЕЛИ ДЛЯ АИМ БОТА
// ============================================================
const TARGETS = [{
        x: 0.1,
        y: 0.1
    },
    {
        x: 0.2,
        y: 0.15
    },
    {
        x: 0.3,
        y: 0.2
    },
    {
        x: 0.4,
        y: 0.25
    },
    {
        x: 0.5,
        y: 0.3
    },
    {
        x: 0.6,
        y: 0.25
    },
    {
        x: 0.7,
        y: 0.2
    },
    {
        x: 0.8,
        y: 0.15
    },
    {
        x: 0.9,
        y: 0.1
    },
    {
        x: 0.85,
        y: 0.05
    },
    {
        x: 0.75,
        y: 0.0
    },
    {
        x: 0.65,
        y: -0.05
    },
    {
        x: 0.55,
        y: -0.1
    },
    {
        x: 0.45,
        y: -0.1
    },
    {
        x: 0.35,
        y: -0.05
    },
    {
        x: 0.25,
        y: 0.0
    },
    {
        x: 0.15,
        y: 0.05
    },
];

let targetIndex = 0;

// ============================================================
//  АВТО-ЗАПУСК ДЛЯ FF / FF MAX
// ============================================================
function autoActivateForGame(version) {
    gameVersion = version;
    console.log('🔥 AUTO ACTIVATE FOR: com.dts.freefire' + (version === 'max' ? 'max' : 'th'));
    console.log('🎯 ULTRA AIM-DRAG ACTIVATED!');
    console.log('⚡ SENSITIVITY: 9999999');
    console.log('🔒 AIM LOCK: ON');
    console.log('🤖 AIM BOT: ON');
    console.log('💀 HEAD PRIORITY: ON');

    if (!aimDragActive) {
        aimDragActive = true;
        enableAimDrag();
        enableAimBot();
    }
}

// ============================================================
//  ВКЛЮЧЕНИЕ AIM-DRAG
// ============================================================
function enableAimDrag() {
    if (!document.getElementById('fireBtn')) {
        createFireButton();
    }

    // МАКСИМАЛЬНЫЙ ПЕРЕХВАТ
    document.addEventListener('touchstart', handleTouchStart, {
        passive: false
    });
    document.addEventListener('touchmove', handleTouchMove, {
        passive: false
    });
    document.addEventListener('touchend', handleTouchEnd, {
        passive: false
    });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // АВТО-ОГОНЬ
    if (MEGA_CONFIG.autoFire) {
        startAutoFire();
    }

    console.log('🎯 ULTRA AIM-DRAG ACTIVATED');
}

// ============================================================
//  АИМ БОТ
// ============================================================
function enableAimBot() {
    if (aimBotInterval) clearInterval(aimBotInterval);

    aimBotInterval = setInterval(() => {
        if (!aimDragActive) return;

        // СЛЕДУЕМ ЗА ЦЕЛЬЮ
        const target = TARGETS[targetIndex % TARGETS.length];
        const screenX = window.innerWidth * target.x;
        const screenY = window.innerHeight * target.y;

        aimTarget.x += (screenX - aimTarget.x) * 0.1;
        aimTarget.y += (screenY - aimTarget.y) * 0.1;

        updateCursor(aimTarget.x, aimTarget.y);
        targetIndex++;

        // АВТО-ВЫСТРЕЛ
        if (targetIndex % 3 === 0) {
            fireHeadshot();
        }
    }, 50);
}

// ============================================================
//  АВТО-ОГОНЬ
// ============================================================
function startAutoFire() {
    setInterval(() => {
        if (aimDragActive) {
            fireHeadshot();
        }
    }, 100);
}

// ============================================================
//  СОЗДАНИЕ КНОПКИ ОГНЯ
// ============================================================
function createFireButton() {
    // КНОПКА FIRE НЕ СОЗДАЁТСЯ
    // AIM-DRAG БУДЕТ РАБОТАТЬ ЧЕРЕЗ КЛИК ПО ЭКРАНУ
    console.log('🎯 Кнопка FIRE скрыта, AIM-DRAG активен');
    return null;
}

    btn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        aimTarget.x = window.innerWidth / 2;
        aimTarget.y = window.innerHeight / 2 - 60;
        headshotLock = true;
        btn.style.transform = 'scale(0.8)';
        btn.style.boxShadow = '0 0 120px rgba(255, 0, 0, 1)';
        showHeadshotEffect();
    });

    btn.addEventListener('touchend', function(e) {
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = '0 0 80px rgba(255, 0, 0, 0.9)';
        fireHeadshot();
    });

    btn.addEventListener('mousedown', function(e) {
        aimTarget.x = window.innerWidth / 2;
        aimTarget.y = window.innerHeight / 2 - 60;
        headshotLock = true;
        btn.style.transform = 'scale(0.8)';
        btn.style.boxShadow = '0 0 120px rgba(255, 0, 0, 1)';
        showHeadshotEffect();
    });

    btn.addEventListener('mouseup', function(e) {
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = '0 0 80px rgba(255, 0, 0, 0.9)';
        fireHeadshot();
    });
}

// ============================================================
//  ОБРАБОТЧИКИ (МАКСИМАЛЬНАЯ ЧУВСТВИТЕЛЬНОСТЬ)
// ============================================================
function handleTouchMove(e) {
    if (!isDragging || !headshotLock) return;
    e.preventDefault();

    const touch = e.touches[0];
    const deltaX = (touch.clientX - lastX) * 9999999;
    const deltaY = (touch.clientY - lastY) * 9999999;

    aimTarget.x += deltaX;
    aimTarget.y += deltaY;

    aimTarget.x = Math.max(0, Math.min(window.innerWidth, aimTarget.x));
    aimTarget.y = Math.max(0, Math.min(window.innerHeight, aimTarget.y));

    lastX = touch.clientX;
    lastY = touch.clientY;

    updateCursor(aimTarget.x, aimTarget.y);
}

function handleMouseMove(e) {
    if (!isMouseDown || !headshotLock) return;

    const deltaX = (e.clientX - lastX) * 9999999;
    const deltaY = (e.clientY - lastY) * 9999999;

    aimTarget.x += deltaX;
    aimTarget.y += deltaY;

    aimTarget.x = Math.max(0, Math.min(window.innerWidth, aimTarget.x));
    aimTarget.y = Math.max(0, Math.min(window.innerHeight, aimTarget.y));

    lastX = e.clientX;
    lastY = e.clientY;

    updateCursor(aimTarget.x, aimTarget.y);
}

// ============================================================
//  ОСТАЛЬНЫЕ ФУНКЦИИ (КУРСОР, ЭФФЕКТЫ, ВЫСТРЕЛ)
// ============================================================
function updateCursor(x, y) {
    let cursor = document.getElementById('aimCursor');
    if (!cursor) {
        cursor = document.createElement('div');
        cursor.id = 'aimCursor';
        cursor.style.cssText = `
            position: fixed;
            width: 60px;
            height: 60px;
            border: 4px solid #ff0000;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            background: radial-gradient(circle, rgba(255,0,0,0.3), transparent);
            box-shadow: 0 0 60px rgba(255, 0, 0, 0.7);
            transform: translate(-50%, -50%);
            transition: all 0.02s ease;
        `;
        document.body.appendChild(cursor);

        const crosshair = document.createElement('div');
        crosshair.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #ff0000;
            font-size: 36px;
            font-weight: 900;
            text-shadow: 0 0 30px rgba(255,0,0,0.9);
        `;
        crosshair.innerText = '✚';
        cursor.appendChild(crosshair);
    }

    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
}

function showHeadshotEffect() {
    const effect = document.createElement('div');
    effect.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #ff0000;
        font-size: 100px;
        font-weight: 900;
        text-shadow: 0 0 80px rgba(255, 0, 0, 1);
        z-index: 10000;
        pointer-events: none;
        animation: headshotAnim 0.8s ease-out forwards;
        font-family: 'Arial Black', sans-serif;
    `;
    effect.innerText = '💀 HEADSHOT!';
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
}

function fireHeadshot() {
    if (!headshotLock) return;

    const bullet = document.createElement('div');
    bullet.style.cssText = `
        position: fixed;
        left: ${aimTarget.x}px;
        top: ${aimTarget.y}px;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, #ff4444, #ff0000);
        border-radius: 50%;
        box-shadow: 0 0 80px rgba(255, 0, 0, 1);
        z-index: 9999;
        pointer-events: none;
        animation: bulletAnim 0.3s ease-out forwards;
    `;
    document.body.appendChild(bullet);
    setTimeout(() => bullet.remove(), 500);

    showHeadshotEffect();

    if (navigator.vibrate) {
        navigator.vibrate(100);
    }
}

// ============================================================
//  CSS-АНИМАЦИИ
// ============================================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes headshotAnim {
        0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
        20% { transform: translate(-50%, -50%) scale(2); opacity: 1; }
        80% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.8; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }
    @keyframes bulletAnim {
        0% { transform: scale(0.5); opacity: 1; }
        50% { transform: scale(3); opacity: 0.8; }
        100% { transform: scale(8); opacity: 0; }
    }
    @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 0 80px rgba(255,0,0,0.9); }
        50% { transform: scale(1.05); box-shadow: 0 0 120px rgba(255,0,0,1); }
        100% { transform: scale(1); box-shadow: 0 0 80px rgba(255,0,0,0.9); }
    }
`;
document.head.appendChild(styleSheet);

// ============================================================
//  АВТО-ЗАПУСК ПРИ ЗАГРУЗКЕ
// ============================================================
window.addEventListener('load', function() {
    console.log('🔥 ULTRA AIM-DRAG V4.0 LOADED');
    console.log('⚡ SENSITIVITY: 9999999');
    console.log('🎯 TARGET: com.dts.freefireth / com.dts.freefiremax');

    // АВТОМАТИЧЕСКАЯ АКТИВАЦИЯ
    setTimeout(() => {
        const version = localStorage.getItem('ff_version') || 'normal';
        autoActivateForGame(version);
    }, 1000);
});

// ============================================================
//  ЭКСПОРТ
// ============================================================
window.activateAimDrag = activateAimDrag;
window.autoActivateForGame = autoActivateForGame;