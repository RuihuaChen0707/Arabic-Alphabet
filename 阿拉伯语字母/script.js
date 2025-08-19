// 阿拉伯语字母数据
const arabicLetters = [
    { letter: 'ا', name: 'أَلِف', pronunciation: 'alif', sound: 'a' },
    { letter: 'ب', name: 'بَاء', pronunciation: 'baa', sound: 'b' },
    { letter: 'ت', name: 'تَاء', pronunciation: 'taa', sound: 't' },
    { letter: 'ث', name: 'ثَاء', pronunciation: 'thaa', sound: 'th' },
    { letter: 'ج', name: 'جِيم', pronunciation: 'jeem', sound: 'j' },
    { letter: 'ح', name: 'حَاء', pronunciation: 'haa', sound: 'h' },
    { letter: 'خ', name: 'خَاء', pronunciation: 'khaa', sound: 'kh' },
    { letter: 'د', name: 'دَال', pronunciation: 'daal', sound: 'd' },
    { letter: 'ذ', name: 'ذَال', pronunciation: 'dhaal', sound: 'dh' },
    { letter: 'ر', name: 'رَاء', pronunciation: 'raa', sound: 'r' },
    { letter: 'ز', name: 'زَاي', pronunciation: 'zaay', sound: 'z' },
    { letter: 'س', name: 'سِين', pronunciation: 'seen', sound: 's' },
    { letter: 'ش', name: 'شِين', pronunciation: 'sheen', sound: 'sh' },
    { letter: 'ص', name: 'صَاد', pronunciation: 'saad', sound: 's' },
    { letter: 'ض', name: 'ضَاد', pronunciation: 'daad', sound: 'd' },
    { letter: 'ط', name: 'طَاء', pronunciation: 'taa', sound: 't' },
    { letter: 'ظ', name: 'ظَاء', pronunciation: 'dhaa', sound: 'dh' },
    { letter: 'ع', name: 'عَيْن', pronunciation: 'ayn', sound: 'a' },
    { letter: 'غ', name: 'غَيْن', pronunciation: 'ghayn', sound: 'gh' },
    { letter: 'ف', name: 'فَاء', pronunciation: 'faa', sound: 'f' },
    { letter: 'ق', name: 'قَاف', pronunciation: 'qaaf', sound: 'q' },
    { letter: 'ك', name: 'كَاف', pronunciation: 'kaaf', sound: 'k' },
    { letter: 'ل', name: 'لَام', pronunciation: 'laam', sound: 'l' },
    { letter: 'م', name: 'مِيم', pronunciation: 'meem', sound: 'm' },
    { letter: 'ن', name: 'نُون', pronunciation: 'noon', sound: 'n' },
    { letter: 'ه', name: 'هَاء', pronunciation: 'haa', sound: 'h' },
    { letter: 'و', name: 'وَاو', pronunciation: 'waaw', sound: 'w' },
    { letter: 'ي', name: 'يَاء', pronunciation: 'yaa', sound: 'y' }
];

// 全局变量
let currentQuestion = 0;
let score = 0;
let currentLetter = null;
let questionType = 1; // 1: 显示字母选发音, 2: 显示发音选字母
let usedLetters = [];

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    createAlphabetCards();
    
    // 移动端兼容性处理
    initMobileCompatibility();
});

// 移动端兼容性初始化
function initMobileCompatibility() {
    // 确保用户交互后初始化语音合成
    let isInitialized = false;
    
    function initializeSpeech() {
        if (!isInitialized && 'speechSynthesis' in window) {
            // 创建一个空的语音实例来初始化
            const initUtterance = new SpeechSynthesisUtterance('');
            initUtterance.volume = 0;
            try {
                speechSynthesis.speak(initUtterance);
                speechSynthesis.cancel();
                isInitialized = true;
            } catch (e) {
                console.log('语音初始化失败');
            }
        }
    }
    
    // 监听首次用户交互
    document.addEventListener('touchstart', initializeSpeech, { once: true });
    document.addEventListener('click', initializeSpeech, { once: true });
    
    // 防止移动端双击缩放
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // 添加触摸反馈
    document.addEventListener('touchstart', function(e) {
        if (e.target.closest('.letter-card')) {
            e.target.closest('.letter-card').classList.add('touch-active');
        }
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        if (e.target.closest('.letter-card')) {
            e.target.closest('.letter-card').classList.remove('touch-active');
        }
    }, { passive: true });
}

// 创建字母卡片
function createAlphabetCards() {
    const grid = document.getElementById('alphabetGrid');
    
    arabicLetters.forEach((letterData, index) => {
        const card = document.createElement('div');
        card.className = 'letter-card';
        card.innerHTML = `
            <div class="letter">${letterData.letter}</div>
            <div class="letter-name">${letterData.name}</div>
            <div class="letter-pronunciation">${letterData.pronunciation}</div>
        `;
        
        card.addEventListener('click', () => openLearningModal(letterData.letter));
        grid.appendChild(card);
    });
}

// 播放字母发音（增强跨端兼容性）
function playLetterSound(letterData) {
    // 检查并初始化语音合成
    if ('speechSynthesis' in window) {
        // 取消之前的语音（防止重叠）
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = letterData.name;
        utterance.lang = 'ar-SA';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // 处理移动端的语音合成初始化
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        
        // 延迟播放以确保兼容性
        setTimeout(() => {
            try {
                speechSynthesis.speak(utterance);
            } catch (e) {
                console.log('语音播放失败，尝试备用方案');
                // 可以在这里添加备用音频方案
            }
        }, 100);
    } else {
        // 不支持Web Speech API的提示
        console.log('浏览器不支持语音合成');
    }
    
    // 添加视觉反馈动画
    const card = event.target.closest('.letter-card');
    card.classList.add('clicked');
    setTimeout(() => {
        card.classList.remove('clicked');
    }, 300);
}

// 进入测试模式
function enterTestMode() {
    document.getElementById('testModal').style.display = 'block';
    startNewTest();
}

// 开始新测试
function startNewTest() {
    currentQuestion = 0;
    score = 0;
    usedLetters = [];
    updateScore();
    nextQuestion();
}

// 关闭测试模式
function closeTestMode() {
    document.getElementById('testModal').style.display = 'none';
}

// 生成下一题
function nextQuestion() {
    if (currentQuestion >= 10) {
        endTest();
        return;
    }
    
    currentQuestion++;
    document.getElementById('questionNumber').textContent = currentQuestion;
    
    // 重置反馈和按钮
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    
    // 选择未使用过的字母
    let availableLetters = arabicLetters.filter(letter => !usedLetters.includes(letter));
    if (availableLetters.length === 0) {
        availableLetters = arabicLetters;
        usedLetters = [];
    }
    
    currentLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
    usedLetters.push(currentLetter);
    
    // 随机选择题型
    questionType = Math.random() < 0.5 ? 1 : 2;
    
    if (questionType === 1) {
        showQuestionType1();
    } else {
        showQuestionType2();
    }
}

// 题型1：显示字母，选择发音
function showQuestionType1() {
    document.getElementById('questionType1').style.display = 'block';
    document.getElementById('questionType2').style.display = 'none';
    
    document.getElementById('questionLetter').textContent = currentLetter.letter;
    
    // 生成选项（包含正确答案和5个错误答案）
    const options = generateOptions(currentLetter, 'pronunciation');
    displayOptions(options, 'options1', 'pronunciation');
}

// 题型2：显示发音，选择字母
function showQuestionType2() {
    document.getElementById('questionType1').style.display = 'none';
    document.getElementById('questionType2').style.display = 'block';
    
    // 生成选项（包含正确答案和5个错误答案）
    const options = generateOptions(currentLetter, 'letter');
    displayOptions(options, 'options2', 'letter');
    
    // 自动播放发音
    setTimeout(() => playSound(), 500);
}

// 播放当前发音（增强兼容性）
function playSound() {
    if ('speechSynthesis' in window) {
        // 取消之前的语音
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = currentLetter.name;
        utterance.lang = 'ar-SA';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // 处理移动端的语音合成
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        
        setTimeout(() => {
            try {
                speechSynthesis.speak(utterance);
            } catch (e) {
                console.log('语音播放失败');
            }
        }, 100);
    } else {
        alert('您的浏览器不支持语音合成功能，请使用现代浏览器或检查浏览器设置');
    }
}

// 生成选项
function generateOptions(correctLetter, type) {
    const options = [correctLetter];
    const otherLetters = arabicLetters.filter(letter => letter.letter !== correctLetter.letter);
    
    while (options.length < 6) {
        const randomLetter = otherLetters[Math.floor(Math.random() * otherLetters.length)];
        if (!options.includes(randomLetter)) {
            options.push(randomLetter);
        }
    }
    
    // 打乱顺序
    return options.sort(() => Math.random() - 0.5);
}

// 显示选项
function displayOptions(options, containerId, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = type === 'pronunciation' ? option.pronunciation : option.letter;
        button.onclick = () => checkAnswer(option, button);
        container.appendChild(button);
    });
}

// 检查答案
function checkAnswer(selected, button) {
    const isCorrect = selected.letter === currentLetter.letter;
    const feedback = document.getElementById('feedback');
    
    // 禁用所有选项
    document.querySelectorAll('.option-button').forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === (questionType === 1 ? currentLetter.pronunciation : currentLetter.letter)) {
            btn.classList.add('correct');
        } else if (btn === button && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });
    
    if (isCorrect) {
        score += 10;
        feedback.innerHTML = '<div class="feedback correct">✓ 正确！</div>';
        updateScore();
    } else {
        const correctText = questionType === 1 ? 
            `正确答案是: ${currentLetter.pronunciation}` : 
            `正确答案是: ${currentLetter.letter}`;
        feedback.innerHTML = `<div class="feedback incorrect">✗ 错误！${correctText}</div>`;
    }
    
    feedback.style.display = 'block';
    document.getElementById('nextBtn').style.display = 'inline-block';
}

// 更新分数
function updateScore() {
    document.getElementById('score').textContent = score;
}

// 结束测试
function endTest() {
    const feedback = document.getElementById('feedback');
    feedback.innerHTML = `
        <div class="feedback" style="background: #e3f2fd; color: #1976d2;">
            测试完成！<br>
            最终得分: ${score}/100
        </div>
    `;
    feedback.style.display = 'block';
    
    // 隐藏下一题按钮，显示重新开始按钮
    const testButtons = document.querySelector('.test-buttons');
    testButtons.innerHTML = `
        <button onclick="closeTestMode()">退出测试</button>
        <button onclick="startNewTest()">重新开始</button>
    `;
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('testModal');
    if (event.target === modal) {
        closeTestMode();
    }
}

// 字母学习功能
function openLearningModal(letter) {
    const modal = document.getElementById('learningModal');
    const letterData = arabicLetters.find(l => l.letter === letter);
    
    if (!letterData) return;
    
    // 更新模态框标题
    const title = modal.querySelector('h2');
    if (title) {
        title.textContent = `字母 ${letter} 学习`;
    }
    
    // 填充发音符号形式（11种）
    document.getElementById('fatha').textContent = letterData.letter + 'َ';
    document.getElementById('kasra').textContent = letterData.letter + 'ِ';
    document.getElementById('damma').textContent = letterData.letter + 'ُ';
    
    // 特殊处理alif的开口符长音为آ
    if (letterData.letter === 'ا') {
        document.getElementById('fathaLong').textContent = 'آ';
    } else {
        document.getElementById('fathaLong').textContent = letterData.letter + 'َا';
    }
    
    document.getElementById('kasraLong').textContent = letterData.letter + 'ِي';
    document.getElementById('dammaLong').textContent = letterData.letter + 'ُو';
    
    // 开口符鼻音后加上ا
    document.getElementById('fathaNasal').textContent = letterData.letter + 'ًا';
    document.getElementById('kasraNasal').textContent = letterData.letter + 'ٍ';
    document.getElementById('dammaNasal').textContent = letterData.letter + 'ٌ';
    document.getElementById('softAy').textContent = letterData.letter + 'َي';
    document.getElementById('softAw').textContent = letterData.letter + 'َو';
    
    // 填充字母形式（4种）
    document.getElementById('isolatedForm').textContent = letterData.letter;
    document.getElementById('initialForm').textContent = letterData.letter + 'ـ';
    document.getElementById('middleForm').textContent = 'ـ' + letterData.letter + 'ـ';
    document.getElementById('finalForm').textContent = 'ـ' + letterData.letter;
    
    // 初始化白板
    initCanvas();
    
    modal.style.display = 'block';
}



// 关闭学习模态框
function closeLearningMode() {
    document.getElementById('learningModal').style.display = 'none';
}

// 手写板功能
let canvas, ctx, isDrawing = false, isErasing = false;

function initCanvas() {
    canvas = document.getElementById('writingCanvas');
    ctx = canvas.getContext('2d');
    
    // 设置画布大小
    const container = canvas.parentElement;
    const maxWidth = Math.min(400, container.offsetWidth - 20);
    canvas.width = maxWidth;
    canvas.height = 200;
    
    // 设置画布样式
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    
    // 添加事件监听
    setupCanvasEvents();
}

function setupCanvasEvents() {
    // 鼠标事件
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // 触摸事件
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (isErasing) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 15;
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#333';
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                    e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function togglePencil() {
    isErasing = false;
    document.querySelector('.pencil-btn').classList.add('active');
    document.querySelector('.eraser-btn').classList.remove('active');
}

function toggleEraser() {
    isErasing = true;
    document.querySelector('.eraser-btn').classList.add('active');
    document.querySelector('.pencil-btn').classList.remove('active');
}

// 语音播放管理器
class SpeechManager {
    constructor() {
        this.isPlaying = false;
        this.queue = [];
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    play(text, type = 'normal') {
        if (!text || !('speechSynthesis' in window)) {
            showVisualFeedback(text);
            return;
        }

        // 如果正在播放，加入队列
        if (this.isPlaying) {
            this.queue.push({ text, type });
            return;
        }

        this.isPlaying = true;
        this.playWithRetry(text);
    }

    playWithRetry(text) {
        try {
            // 检查语音系统状态
            if (!speechSynthesis) {
                console.error('语音合成不可用');
                this.handleError(text);
                return;
            }

            // 确保完全清理之前的语音
            if (speechSynthesis.speaking || speechSynthesis.pending) {
                speechSynthesis.cancel();
            }

            // 检查是否有可用的语音
            const voices = speechSynthesis.getVoices();
            if (!voices || voices.length === 0) {
                console.warn('无可用语音，等待语音加载...');
                // 延迟重试
                setTimeout(() => {
                    if (speechSynthesis.getVoices().length > 0) {
                        this.createAndPlayUtterance(text);
                    } else {
                        this.handleError(text);
                    }
                }, 500);
                return;
            }

            // 等待清理完成
            setTimeout(() => {
                this.createAndPlayUtterance(text);
            }, 100);

        } catch (error) {
            console.error('语音播放失败:', error);
            this.handleError(text);
        }
    }

    createAndPlayUtterance(text) {
        try {
            // Safari移动端特殊处理
            if ((isSafari || isMobile) && !speechActivated) {
                console.warn('Safari语音未激活，尝试激活...');
                activateSpeechSynthesis();
                // 延迟重试
                setTimeout(() => {
                    if (speechActivated) {
                        this.createAndPlayUtterance(text);
                    } else {
                        console.warn('Safari语音激活失败，使用视觉反馈');
                        this.handleError(text);
                    }
                }, 300);
                return;
            }
            
            const utterance = new SpeechSynthesisUtterance();
            utterance.text = text;
            utterance.lang = 'ar';
            utterance.rate = 0.7;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            // 获取最佳阿拉伯语语音
            const voices = speechSynthesis.getVoices();
            const arabicVoices = voices.filter(voice => 
                voice.lang.includes('ar') || 
                voice.name.includes('Arabic')
            );
            
            if (arabicVoices.length > 0) {
                utterance.voice = arabicVoices[0];
            }

            // 错误处理
            utterance.onerror = (event) => {
                console.error('语音错误:', event.error, event);
                this.handleSpeechError(text, event);
            };

            // 完成处理
            utterance.onend = () => {
                this.isPlaying = false;
                this.processQueue();
            };

            // 边界处理
            utterance.onboundary = (event) => {
                console.log('语音边界:', event.name, event.charIndex);
            };

            // Safari移动端额外检查
            if (isSafari || isMobile) {
                // 确保语音系统就绪
                if (speechSynthesis.paused) {
                    speechSynthesis.resume();
                }
            }

            // 开始播放
            speechSynthesis.speak(utterance);

        } catch (error) {
            console.error('创建语音失败:', error);
            this.handleError(text);
        }
    }

    handleSpeechError(text, event) {
        this.isPlaying = false;
        
        // 严格检查语音状态
        if (speechSynthesis && (speechSynthesis.speaking || speechSynthesis.pending)) {
            speechSynthesis.cancel();
        }
        
        // 增强的错误处理 - 针对interrupted错误
        if (event.error === 'interrupted' || event.error === 'network' || event.error === 'canceled') {
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                console.log(`重试语音播放 ${this.retryCount}/${this.maxRetries}，错误类型: ${event.error}`);
                
                // 更长的延迟和指数退避
                const delay = 500 * Math.pow(2, this.retryCount - 1);
                setTimeout(() => {
                    // 再次检查语音状态
                    if (speechSynthesis && !speechSynthesis.speaking && !speechSynthesis.pending) {
                        this.playWithRetry(text);
                    } else {
                        this.handleError(text);
                    }
                }, delay);
                return;
            }
        }

        // 最终回退
        this.handleError(text);
    }

    handleError(text) {
        this.isPlaying = false;
        this.retryCount = 0;
        showVisualFeedback(text);
        this.processQueue();
    }

    processQueue() {
        if (this.queue.length > 0) {
            const next = this.queue.shift();
            setTimeout(() => this.playWithRetry(next.text), 100);
        }
    }

    stop() {
        if (speechSynthesis.speaking || speechSynthesis.pending) {
            speechSynthesis.cancel();
        }
        this.isPlaying = false;
        this.queue = [];
        this.retryCount = 0;
    }
}

// 全局语音管理器实例
const speechManager = new SpeechManager();

// 语音系统初始化
function initializeSpeechSystem() {
    if ('speechSynthesis' in window) {
        // 预加载语音
        const loadVoices = () => {
            const voices = speechSynthesis.getVoices();
            console.log('可用语音数量:', voices.length);
            
            // 过滤阿拉伯语语音
            const arabicVoices = voices.filter(voice => 
                voice.lang.includes('ar') || voice.name.includes('Arabic')
            );
            console.log('阿拉伯语语音:', arabicVoices);
        };

        // 立即加载
        loadVoices();
        
        // 监听语音变化事件
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }

        // 测试语音系统
        const testUtterance = new SpeechSynthesisUtterance('');
        testUtterance.volume = 0;
        speechSynthesis.speak(testUtterance);
        speechSynthesis.cancel();
        
        console.log('语音系统初始化完成');
    } else {
        console.warn('当前浏览器不支持语音合成');
    }
}

// 页面加载完成后初始化语音系统
document.addEventListener('DOMContentLoaded', () => {
    initializeSpeechSystem();
    
    // Safari移动端语音激活提示
    if ((isSafari || isMobile) && !speechActivated) {
        setTimeout(() => {
            if (!speechActivated) {
                showSafariActivationTip();
            }
        }, 2000);
    }
});

// Safari语音激活提示函数
function showSafariActivationTip() {
    const tipDiv = document.createElement('div');
    tipDiv.id = 'safari-speech-tip';
    tipDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ff6b6b, #ee5a24);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        z-index: 10001;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        text-align: center;
        max-width: 90%;
        animation: tipFadeIn 0.5s ease-out;
        cursor: pointer;
    `;
    
    tipDiv.innerHTML = `
        <div>📱 点击页面任意位置激活语音功能</div>
        <div style="font-size: 12px; margin-top: 5px; opacity: 0.9;">Safari需要用户交互才能播放语音</div>
    `;
    
    // 添加动画样式
    if (!document.querySelector('#safari-tip-style')) {
        const style = document.createElement('style');
        style.id = 'safari-tip-style';
        style.textContent = `
            @keyframes tipFadeIn {
                0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                100% { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
            @keyframes tipFadeOut {
                0% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(tipDiv);
    
    // 点击提示框也能激活语音
    tipDiv.addEventListener('click', () => {
        activateSpeechSynthesis();
        removeSafariTip();
    });
    
    // 5秒后自动消失
    setTimeout(() => {
        if (document.getElementById('safari-speech-tip')) {
            removeSafariTip();
        }
    }, 8000);
}

// 移除Safari提示
 function removeSafariTip() {
     const tip = document.getElementById('safari-speech-tip');
     if (tip) {
         tip.style.animation = 'tipFadeOut 0.3s ease-in';
         setTimeout(() => {
             if (tip.parentNode) {
                 tip.remove();
             }
         }, 300);
     }
 }
 
 // 显示语音激活成功提示
 function showActivationSuccess() {
     const successDiv = document.createElement('div');
     successDiv.style.cssText = `
         position: fixed;
         top: 20px;
         left: 50%;
         transform: translateX(-50%);
         background: linear-gradient(135deg, #4CAF50, #45a049);
         color: white;
         padding: 12px 20px;
         border-radius: 20px;
         z-index: 10001;
         font-size: 14px;
         font-weight: bold;
         box-shadow: 0 4px 15px rgba(0,0,0,0.2);
         text-align: center;
         animation: tipFadeIn 0.5s ease-out;
     `;
     
     successDiv.innerHTML = '✅ 语音功能已激活！';
     document.body.appendChild(successDiv);
     
     // 2秒后自动消失
     setTimeout(() => {
         successDiv.style.animation = 'tipFadeOut 0.3s ease-in';
         setTimeout(() => {
             if (successDiv.parentNode) {
                 successDiv.remove();
             }
         }, 300);
     }, 2000);
 }

// 防抖计时器
let pronunciationDebounceTimer = null;
let lastPlayTime = 0;

// 增强的发音函数（带严格防抖和错误预防）
function playPronunciation(type) {
    // 清除之前的计时器
    if (pronunciationDebounceTimer) {
        clearTimeout(pronunciationDebounceTimer);
    }
    
    // 设置防抖延迟（增加到300ms）
    pronunciationDebounceTimer = setTimeout(() => {
        const modal = document.getElementById('learningModal');
        const title = modal.querySelector('h2').textContent;
        const currentLetter = title.replace('字母 ', '').replace(' 学习', '');
        
        let pronunciationText = '';
        
        // 核心发音文本生成逻辑（自然发音规则）
        switch(type) {
            case 'fatha': pronunciationText = currentLetter + 'َ'; break;
            case 'kasra': pronunciationText = currentLetter + 'ِ'; break;
            case 'damma': pronunciationText = currentLetter + 'ُ'; break;
            case 'fathaLong': pronunciationText = currentLetter === 'ا' ? 'آ' : currentLetter + 'َا'; break;
            case 'kasraLong': pronunciationText = currentLetter + 'ِي'; break;
            case 'dammaLong': pronunciationText = currentLetter + 'ُو'; break;
            case 'fathaNasal': pronunciationText = currentLetter === 'ا' ? 'ًا' : currentLetter + 'ً'; break;
            case 'kasraNasal': pronunciationText = currentLetter === 'ا' ? 'ٍا' : currentLetter + 'ٍ'; break;
            case 'dammaNasal': pronunciationText = currentLetter === 'ا' ? 'ٌو' : currentLetter + 'ٌ'; break;
            case 'softAy': pronunciationText = currentLetter + 'َي'; break;
            case 'softAw': pronunciationText = currentLetter + 'َو'; break;
            case 'isolated': pronunciationText = currentLetter; break;
            case 'initial': pronunciationText = currentLetter + 'ـ'; break;
            case 'middle': pronunciationText = 'ـ' + currentLetter + 'ـ'; break;
            case 'final': pronunciationText = 'ـ' + currentLetter; break;
        }
        
        if (pronunciationText) {
            const now = Date.now();
            // 防止过于频繁的调用
            if (now - lastPlayTime < 500) {
                return;
            }
            lastPlayTime = now;
            
            // 强制清理并等待更长时间
            if (speechSynthesis.speaking || speechSynthesis.pending) {
                speechSynthesis.cancel();
                setTimeout(() => {
                    speechManager.play(pronunciationText);
                }, 150);
            } else {
                speechManager.play(pronunciationText);
            }
        }
    }, 300); // 增加到300ms防抖延迟
}

// 增强的视觉反馈函数（语音播放失败时的回退方案）
function showVisualFeedback(text) {
    // 移除可能存在的旧提示
    const existingAlert = document.querySelector('.pronunciation-feedback');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // 创建视觉提示
    const alertDiv = document.createElement('div');
    alertDiv.className = 'pronunciation-feedback';
    alertDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #1976d2, #42a5f5);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        z-index: 10000;
        font-size: 28px;
        font-weight: bold;
        box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        pointer-events: none;
        animation: fadeInOut 2.5s ease-in-out;
        font-family: 'Arial', sans-serif;
        text-align: center;
        min-width: 100px;
        border: 2px solid rgba(255,255,255,0.3);
    `;
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
        }
    `;
    
    if (!document.querySelector('#pronunciation-feedback-style')) {
        style.id = 'pronunciation-feedback-style';
        document.head.appendChild(style);
    }
    
    alertDiv.textContent = text;
    document.body.appendChild(alertDiv);
    
    // 自动移除
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 2500);
}

// 移动端Safari语音激活增强机制
let speechActivated = false;

// 检测Safari浏览器
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function activateSpeechSynthesis() {
    if (speechActivated) return;
    
    try {
        // 强制激活语音合成
        const testUtterance = new SpeechSynthesisUtterance('');
        testUtterance.volume = 0;
        testUtterance.rate = 1;
        testUtterance.pitch = 1;
        
        // 立即播放并取消
        speechSynthesis.speak(testUtterance);
        speechSynthesis.cancel();
        
        // 等待语音加载
         setTimeout(() => {
             const voices = speechSynthesis.getVoices();
             console.log('Safari语音激活完成，可用语音数量:', voices.length);
             speechActivated = true;
             
             // 移除激活提示
             removeSafariTip();
             
             // 显示激活成功提示
             if (isSafari || isMobile) {
                 showActivationSuccess();
             }
         }, 100);
        
    } catch (error) {
        console.warn('Safari语音激活失败:', error);
    }
}

// 多重事件监听确保语音激活
if (isSafari || isMobile) {
    const activationEvents = ['touchstart', 'touchend', 'click', 'keydown', 'mousedown'];
    
    activationEvents.forEach(eventType => {
        document.addEventListener(eventType, activateSpeechSynthesis, { 
            once: true, 
            passive: true 
        });
    });
    
    // 页面可见性变化时重新激活
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !speechActivated) {
            setTimeout(activateSpeechSynthesis, 500);
        }
    });
    
    // 页面焦点获得时激活
    window.addEventListener('focus', () => {
        if (!speechActivated) {
            setTimeout(activateSpeechSynthesis, 200);
        }
    });
}

// 语音系统清理和兼容性处理
// 新的SpeechManager类已处理所有兼容性问题，这里保留清理函数