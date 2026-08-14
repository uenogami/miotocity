// アクセシビリティ機能 - ユニバーサルスイッチ

(function() {
    'use strict';

    // フォントサイズ変更
    function initFontSize() {
        const fontSmallBtn = document.getElementById('font-small');
        const fontNormalBtn = document.getElementById('font-normal');
        const fontLargeBtn = document.getElementById('font-large');
        const fontExtraLargeBtn = document.getElementById('font-extra-large');
        
        // モバイル版
        const mobileFontNormalBtn = document.getElementById('mobile-font-normal');
        const mobileFontExtraLargeBtn = document.getElementById('mobile-font-extra-large');

        function setFontSize(size) {
            document.body.className = document.body.className.replace(/font-\w+/g, '');
            if (size !== 'normal') {
                document.body.classList.add('font-' + size);
            }
            localStorage.setItem('fontSize', size);
            
            // モバイル版ボタンのactiveクラスを更新（動的に取得）
            const mobileNormalBtn = document.getElementById('mobile-font-normal');
            const mobileExtraLargeBtn = document.getElementById('mobile-font-extra-large');
            if (mobileNormalBtn && mobileExtraLargeBtn) {
                if (size === 'normal') {
                    mobileNormalBtn.classList.add('active');
                    mobileExtraLargeBtn.classList.remove('active');
                } else {
                    mobileNormalBtn.classList.remove('active');
                    mobileExtraLargeBtn.classList.add('active');
                }
            }
        }

        if (fontSmallBtn) {
            fontSmallBtn.addEventListener('click', function() {
                setFontSize('small');
            });
        }

        if (fontNormalBtn) {
            fontNormalBtn.addEventListener('click', function() {
                setFontSize('normal');
            });
        }
        
        if (mobileFontNormalBtn) {
            mobileFontNormalBtn.addEventListener('click', function() {
                setFontSize('normal');
            });
        }

        if (fontLargeBtn) {
            fontLargeBtn.addEventListener('click', function() {
                setFontSize('large');
            });
        }

        if (fontExtraLargeBtn) {
            fontExtraLargeBtn.addEventListener('click', function() {
                setFontSize('extra-large');
            });
        }
        
        if (mobileFontExtraLargeBtn) {
            mobileFontExtraLargeBtn.addEventListener('click', function() {
                setFontSize('extra-large');
            });
        }

        // 保存された設定を読み込む
        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize && savedFontSize !== 'normal') {
            document.body.classList.add('font-' + savedFontSize);
            // モバイル版ボタンのactiveクラスを更新（動的に取得）
            const mobileNormalBtn = document.getElementById('mobile-font-normal');
            const mobileExtraLargeBtn = document.getElementById('mobile-font-extra-large');
            if (mobileNormalBtn && mobileExtraLargeBtn) {
                mobileNormalBtn.classList.remove('active');
                mobileExtraLargeBtn.classList.add('active');
            }
        } else {
            // 初期状態（normal）の場合
            const mobileNormalBtn = document.getElementById('mobile-font-normal');
            const mobileExtraLargeBtn = document.getElementById('mobile-font-extra-large');
            if (mobileNormalBtn && mobileExtraLargeBtn) {
                mobileNormalBtn.classList.add('active');
                mobileExtraLargeBtn.classList.remove('active');
            }
        }
    }

    // 色のコントラスト変更
    function initContrast() {
        const contrastBtn = document.getElementById('toggle-contrast');
        const mobileContrastNormalBtn = document.getElementById('mobile-contrast-normal');
        const mobileContrastBtn = document.getElementById('mobile-toggle-contrast');
        
        function toggleContrast() {
            document.body.classList.toggle('high-contrast');
            const isHighContrast = document.body.classList.contains('high-contrast');
            localStorage.setItem('highContrast', isHighContrast);
            
            // モバイル版ボタンのactiveクラスを更新
            if (mobileContrastNormalBtn && mobileContrastBtn) {
                if (isHighContrast) {
                    mobileContrastNormalBtn.classList.remove('active');
                    mobileContrastBtn.classList.add('active');
                } else {
                    mobileContrastNormalBtn.classList.add('active');
                    mobileContrastBtn.classList.remove('active');
                }
            }
        }
        
        if (contrastBtn) {
            contrastBtn.addEventListener('click', toggleContrast);
        }
        
        if (mobileContrastBtn) {
            mobileContrastBtn.addEventListener('click', toggleContrast);
        }
        
        if (mobileContrastNormalBtn) {
            mobileContrastNormalBtn.addEventListener('click', function() {
                if (document.body.classList.contains('high-contrast')) {
                    toggleContrast();
                }
            });
        }

        // 保存された設定を読み込む
        const savedContrast = localStorage.getItem('highContrast');
        if (savedContrast === 'true') {
            document.body.classList.add('high-contrast');
            // モバイル版ボタンのactiveクラスを更新
            if (mobileContrastNormalBtn && mobileContrastBtn) {
                mobileContrastNormalBtn.classList.remove('active');
                mobileContrastBtn.classList.add('active');
            }
        } else {
            // 初期状態（標準コントラスト）の場合
            if (mobileContrastNormalBtn && mobileContrastBtn) {
                mobileContrastNormalBtn.classList.add('active');
                mobileContrastBtn.classList.remove('active');
            }
        }
    }

    // 音声読み上げ（Web Speech API使用）
    function initReadAloud() {
        const readAloudBtn = document.getElementById('read-aloud');
        const mobileReadAloudBtn = document.getElementById('mobile-read-aloud');
        
        let isReading = false;
        let utterance = null;
        
        function toggleReadAloud(btn) {
            if (isReading) {
                // 停止
                window.speechSynthesis.cancel();
                isReading = false;
                if (readAloudBtn) readAloudBtn.textContent = '音声読み上げ';
                if (mobileReadAloudBtn) mobileReadAloudBtn.textContent = '音声読み上げ';
            } else {
                // 開始
                const mainContent = document.querySelector('.main-content');
                if (mainContent) {
                    const text = mainContent.innerText || mainContent.textContent;
                    utterance = new SpeechSynthesisUtterance(text);
                    utterance.lang = 'ja-JP';
                    utterance.rate = 1.0;
                    utterance.pitch = 1.0;
                    utterance.volume = 1.0;

                    utterance.onend = function() {
                        isReading = false;
                        if (readAloudBtn) readAloudBtn.textContent = '音声読み上げ';
                        if (mobileReadAloudBtn) mobileReadAloudBtn.textContent = '音声読み上げ';
                    };

                    utterance.onerror = function() {
                        isReading = false;
                        if (readAloudBtn) readAloudBtn.textContent = '音声読み上げ';
                        if (mobileReadAloudBtn) mobileReadAloudBtn.textContent = '音声読み上げ';
                    };

                    window.speechSynthesis.speak(utterance);
                    isReading = true;
                    if (readAloudBtn) readAloudBtn.textContent = '読み上げ停止';
                    if (mobileReadAloudBtn) mobileReadAloudBtn.textContent = '読み上げ停止';
                }
            }
        }
        
        if (readAloudBtn && 'speechSynthesis' in window) {
            readAloudBtn.addEventListener('click', function() {
                toggleReadAloud(readAloudBtn);
            });
        } else if (readAloudBtn) {
            readAloudBtn.style.display = 'none';
        }
        
        if (mobileReadAloudBtn && 'speechSynthesis' in window) {
            mobileReadAloudBtn.addEventListener('click', function() {
                toggleReadAloud(mobileReadAloudBtn);
            });
        } else if (mobileReadAloudBtn) {
            mobileReadAloudBtn.style.display = 'none';
        }
    }

    // 言語切り替え
    function initLanguageSwitch() {
        const langJaBtn = document.getElementById('lang-ja');
        const langEnBtn = document.getElementById('lang-en');
        const mobileLangJaBtn = document.getElementById('mobile-lang-ja');
        const mobileLangEnBtn = document.getElementById('mobile-lang-en');
        
        if (langJaBtn && langEnBtn) {
            // 日本語ボタンのクリック
            langJaBtn.addEventListener('click', function() {
                switchLanguage('ja');
            });
            
            // 英語ボタンのクリック
            langEnBtn.addEventListener('click', function() {
                switchLanguage('en');
            });
        }
        
        if (mobileLangJaBtn && mobileLangEnBtn) {
            // モバイル版日本語ボタンのクリック
            mobileLangJaBtn.addEventListener('click', function() {
                switchLanguage('ja');
            });
            
            // モバイル版英語ボタンのクリック
            mobileLangEnBtn.addEventListener('click', function() {
                switchLanguage('en');
            });
        }
        
        // 保存された言語設定を読み込む
        const savedLang = localStorage.getItem('language') || 'ja';
        switchLanguage(savedLang, false);
    }
    
    // 言語切り替え処理
    function switchLanguage(lang, save = true) {
        const langJaBtn = document.getElementById('lang-ja');
        const langEnBtn = document.getElementById('lang-en');
        const mobileLangJaBtn = document.getElementById('mobile-lang-ja');
        const mobileLangEnBtn = document.getElementById('mobile-lang-en');
        
        if (lang === 'ja') {
            if (langJaBtn) langJaBtn.classList.add('active');
            if (langEnBtn) langEnBtn.classList.remove('active');
            if (mobileLangJaBtn) mobileLangJaBtn.classList.add('active');
            if (mobileLangEnBtn) mobileLangEnBtn.classList.remove('active');
            document.documentElement.lang = 'ja';
        } else if (lang === 'en') {
            if (langJaBtn) langJaBtn.classList.remove('active');
            if (langEnBtn) langEnBtn.classList.add('active');
            if (mobileLangJaBtn) mobileLangJaBtn.classList.remove('active');
            if (mobileLangEnBtn) mobileLangEnBtn.classList.add('active');
            document.documentElement.lang = 'en';
        }
        
        if (save) {
            localStorage.setItem('language', lang);
        }
        
        // 言語変更イベントを発火（必要に応じて他の機能で使用可能）
        const event = new CustomEvent('languagechange', { detail: { language: lang } });
        document.dispatchEvent(event);
    }
    
    // グローバルに公開
    window.switchLanguage = switchLanguage;

    // キーボードナビゲーション強化
    function initKeyboardNavigation() {
        // すべてのフォーカス可能要素にキーボードアクセスを確保
        document.addEventListener('keydown', function(e) {
            // Tabキーでフォーカス移動
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        // マウス使用時はキーボードナビゲーションクラスを削除
        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // フォーカストラップ機能（モーダルダイアログ用）
    function createFocusTrap(container) {
        const focusableElements = container.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        function trapFocus(e) {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }

        container.addEventListener('keydown', trapFocus);
        firstElement.focus();

        // クリーンアップ関数を返す
        return function() {
            container.removeEventListener('keydown', trapFocus);
        };
    }

    // グローバルに公開（将来のモーダルダイアログ実装で使用）
    window.createFocusTrap = createFocusTrap;

    // 初期化
    function init() {
        initFontSize();
        initContrast();
        initReadAloud();
        initLanguageSwitch();
        initKeyboardNavigation();
    }
    
    // DOMContentLoaded時に基本設定を初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ヘッダー読み込み後にも再度初期化（動的読み込み対策）
    document.addEventListener('headerLoaded', function() {
        // 少し遅延を入れて、DOMが完全に更新されるのを待つ
        setTimeout(init, 50);
    });
})();

