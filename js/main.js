// メインJavaScript

(function() {
    'use strict';

    // 検索機能
    function initSearch() {
        const searchForm = document.querySelector('.search-box');
        if (searchForm) {
            const form = searchForm.closest('form') || searchForm;
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const input = form.querySelector('input[type="search"], input[type="text"]');
                const announcement = document.getElementById('search-results-announcement');
                
                if (input && input.value.trim()) {
                    const searchTerm = input.value.trim();
                    
                    // 検索結果をスクリーンリーダーに通知
                    if (announcement) {
                        announcement.textContent = `「${searchTerm}」の検索を実行しました。検索機能は準備中です。`;
                    }
                    
                    // ページタイトルを更新
                    if (window.updateTitleOnSearch) {
                        window.updateTitleOnSearch(searchTerm);
                    }
                    
                    // 検索処理（実際の実装ではサーバーに送信）
                    alert('検索機能は準備中です。検索語: ' + searchTerm);
                } else {
                    // 検索語が空の場合
                    if (announcement) {
                        announcement.textContent = '検索キーワードを入力してください。';
                    }
                }
            });
        }
    }

    // ヒーロースライダー
    function initHeroSlide() {
        const slider = document.querySelector('.hero-slider');
        if (!slider) return;

        const slides = slider.querySelectorAll('.hero-slide');
        const dots = slider.querySelectorAll('.slider-dot');
        const prevBtn = slider.querySelector('.slider-prev');
        const nextBtn = slider.querySelector('.slider-next');
        
        if (slides.length === 0) return;

        let currentSlide = 0;
        let slideInterval = null;
        const progressBar = slider.querySelector('.slider-progress-bar');

        // プログレスバーのアニメーションをリセット
        function resetProgress() {
            if (progressBar) {
                // アニメーションクラスを削除
                progressBar.classList.remove('animating');
                // アニメーションを無効化してからリセット
                progressBar.style.animation = 'none';
                progressBar.style.width = '0%';
                // 再フローを強制してアニメーションをリセット
                void progressBar.offsetWidth;
                // アニメーションスタイルをクリア（次回のアニメーションのために）
                progressBar.style.animation = '';
            }
        }

        // プログレスバーのアニメーションを開始
        function startProgress() {
            if (progressBar) {
                resetProgress();
                // 次のフレームでアニメーションを開始
                requestAnimationFrame(function() {
                    if (progressBar) {
                        // style.animationを削除してCSSアニメーションを有効にする
                        progressBar.style.animation = '';
                        progressBar.classList.add('animating');
                    }
                });
            }
        }

        // スライドを表示する関数
        function showSlide(index) {
            // インデックスを範囲内に収める
            if (index < 0) {
                index = slides.length - 1;
            } else if (index >= slides.length) {
                index = 0;
            }

            // すべてのスライドとドットからactiveクラスを削除
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => {
                dot.classList.remove('active');
                dot.setAttribute('aria-selected', 'false');
            });

            // 現在のスライドとドットにactiveクラスを追加
            slides[index].classList.add('active');
            if (dots[index]) {
                dots[index].classList.add('active');
                dots[index].setAttribute('aria-selected', 'true');
            }

            // スライド変更をスクリーンリーダーに通知
            const announcement = document.getElementById('slider-announcement');
            if (announcement) {
                const slideTitle = slides[index].querySelector('h2');
                const slideText = slideTitle ? slideTitle.textContent : `スライド${index + 1}`;
                announcement.textContent = `スライドが変更されました: ${slideText}`;
            }

            currentSlide = index;
        }

        // 次のスライドへ
        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        // 前のスライドへ
        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        // 自動スライドを開始
        function startAutoSlide() {
            // 既存のタイマーをクリア
            stopAutoSlide();
            // プログレスバーをリセットして再開
            startProgress();
            // 5秒ごとに自動切り替え
            slideInterval = setInterval(function() {
                nextSlide();
                // スライド切り替え後にプログレスバーをリセットして再開
                startProgress();
            }, 5000);
        }

        // 自動スライドを停止
        function stopAutoSlide() {
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
            }
        }

        // ドットをクリックしたときの処理
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function(e) {
                stopAutoSlide();
                showSlide(index);
                startAutoSlide(); // 5秒後に自動スライドを再開
                // クリック後にフォーカスを外す（ホバーアニメーションが残らないように）
                e.currentTarget.blur();
            });
        });

        // 前へボタン
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                stopAutoSlide();
                prevSlide();
                startAutoSlide(); // 5秒後に自動スライドを再開
                // クリック後にフォーカスを外す（ホバーアニメーションが残らないように）
                e.currentTarget.blur();
            });
        }

        // 次へボタン
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                stopAutoSlide();
                nextSlide();
                startAutoSlide(); // 5秒後に自動スライドを再開
                // クリック後にフォーカスを外す（ホバーアニメーションが残らないように）
                e.currentTarget.blur();
            });
        }

        // ホバー時もアニメーションを継続（停止しない）

        // キーボードナビゲーション
        slider.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                stopAutoSlide();
                prevSlide();
                startAutoSlide(); // 5秒後に自動スライドを再開
            } else if (e.key === 'ArrowRight') {
                stopAutoSlide();
                nextSlide();
                startAutoSlide(); // 5秒後に自動スライドを再開
            }
        });

        // アニメーション制御の確認（prefers-reduced-motion）
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // 初期化
        showSlide(0);
        
        // アニメーションを減らす設定が有効でない場合のみ自動スライドを開始
        if (!prefersReducedMotion) {
            startAutoSlide();
        }
        
        // 設定変更を監視
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            mediaQuery.addEventListener('change', function(e) {
                if (e.matches) {
                    stopAutoSlide();
                } else {
                    startAutoSlide();
                }
            });
        }
    }

    // スムーススクロール
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    // 初期化
    function init() {
        initSearch();
        initHeroSlide();
        initSmoothScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

