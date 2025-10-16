// Safari浏览器Web Speech API兼容性polyfill（简化版，与SpeechManager兼容）
(function() {
    'use strict';
    
    // 检测Safari浏览器
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isSafari) {
        console.log('检测到Safari浏览器，启用兼容性模式');
        
        // 预加载语音（供SpeechManager使用）
        function preloadVoices() {
            const voices = speechSynthesis.getVoices();
            if (voices.length === 0) {
                const testUtterance = new SpeechSynthesisUtterance('');
                testUtterance.volume = 0;
                speechSynthesis.speak(testUtterance);
                speechSynthesis.cancel();
            }
        }
        
        // 在用户首次交互时预加载
        ['click', 'touchstart', 'keydown'].forEach(eventType => {
            document.addEventListener(eventType, preloadVoices, { once: true });
        });
    }
    
    // 保留视觉反馈函数供外部使用
    function showVisualFeedback(text) {
        const div = document.createElement('div');
        div.textContent = text;
        div.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1976d2;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-size: 20px;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: fadeInOut 2s ease-in-out;
        `;
        
        // 添加动画样式
        if (!document.getElementById('safari-animations')) {
            const style = document.createElement('style');
            style.id = 'safari-animations';
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(div);
        setTimeout(() => {
            if (div.parentNode) {
                div.parentNode.removeChild(div);
            }
        }, 2000);
    }
    
    // 暴露全局方法
    window.showVisualFeedback = showVisualFeedback;
})();