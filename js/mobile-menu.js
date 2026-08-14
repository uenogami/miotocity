// モバイルメニュー機能

(function() {
    'use strict';

    // 初期化済みフラグ（重複初期化を防ぐ）
    let isInitialized = false;

    function initMobileMenu() {
        // 既に初期化済みの場合はスキップ
        if (isInitialized) {
            return;
        }

        const hamburgerToggle = document.getElementById('hamburger-toggle');
        const hamburgerMenu = document.getElementById('hamburger-menu');
        const mobileSearchToggle = document.querySelector('.header__search-toggle') || document.getElementById('mobile-search-toggle');
        const mobileSearchBox = document.getElementById('mobile-search-box');
        const mobileSearchClose = document.querySelector('.header__search-close');
        const mobileSearchInput = document.getElementById('mobile-search-input');
        
        // 必要な要素が存在しない場合は初期化をスキップ
        if (!hamburgerToggle && !hamburgerMenu && !mobileSearchToggle) {
            return;
        }
        
        // ESCキーイベントハンドラー（一度だけ登録）
        let escKeyHandler = null;
        
        // オーバーレイを作成
        let overlay = document.querySelector('.hamburger-menu-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'hamburger-menu-overlay';
            overlay.setAttribute('aria-hidden', 'true');
            document.body.appendChild(overlay);
        }

        // ハンバーガーメニューの開閉
        if (hamburgerToggle && hamburgerMenu) {
            hamburgerToggle.addEventListener('click', function() {
                const isExpanded = hamburgerToggle.getAttribute('aria-expanded') === 'true';
                
                if (isExpanded) {
                    closeHamburgerMenu();
                } else {
                    openHamburgerMenu();
                }
            });

            // オーバーレイをクリックで閉じる
            overlay.addEventListener('click', function() {
                closeHamburgerMenu();
            });

            // ESCキーで閉じる（一度だけ登録）
            if (!escKeyHandler) {
                escKeyHandler = function(e) {
                    if (e.key === 'Escape') {
                        if (hamburgerToggle && hamburgerToggle.getAttribute('aria-expanded') === 'true') {
                            closeHamburgerMenu();
                        } else if (mobileSearchToggle && mobileSearchToggle.getAttribute('aria-expanded') === 'true') {
                            closeMobileSearch();
                        }
                    }
                };
                document.addEventListener('keydown', escKeyHandler);
            }
        }

        function openHamburgerMenu() {
            hamburgerToggle.setAttribute('aria-expanded', 'true');
            hamburgerMenu.setAttribute('aria-hidden', 'false');
            overlay.setAttribute('aria-hidden', 'false');
            overlay.classList.add('active');
            // bodyのスクロールをロック（メニュー外のスクロールを防ぐ）
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            
            // フォーカストラップを設定
            if (window.createFocusTrap) {
                window.focusTrapCleanup = window.createFocusTrap(hamburgerMenu);
            }
            
            // 最初のフォーカス可能要素にフォーカス
            const firstFocusable = hamburgerMenu.querySelector('button, a, input');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }

        function closeHamburgerMenu() {
            hamburgerToggle.setAttribute('aria-expanded', 'false');
            hamburgerMenu.setAttribute('aria-hidden', 'true');
            overlay.setAttribute('aria-hidden', 'true');
            overlay.classList.remove('active');
            // bodyのスクロールロックを解除
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            
            // フォーカストラップを解除
            if (window.focusTrapCleanup) {
                window.focusTrapCleanup();
                window.focusTrapCleanup = null;
            }
            
            // ハンバーガーボタンにフォーカスを戻す
            hamburgerToggle.focus();
        }

        // モバイル検索バーの開閉
        if (mobileSearchToggle && mobileSearchBox) {
            mobileSearchToggle.addEventListener('click', function() {
                const isExpanded = mobileSearchToggle.getAttribute('aria-expanded') === 'true';
                
                if (isExpanded) {
                    closeMobileSearch();
                } else {
                    openMobileSearch();
                }
            });

            if (mobileSearchClose) {
                mobileSearchClose.addEventListener('click', function() {
                    closeMobileSearch();
                });
            }
        }

        function openMobileSearch() {
            if (!mobileSearchToggle || !mobileSearchBox || !mobileSearchInput) {
                return;
            }
            mobileSearchToggle.setAttribute('aria-expanded', 'true');
            mobileSearchBox.setAttribute('aria-hidden', 'false');
            mobileSearchInput.focus();
        }

        function closeMobileSearch() {
            mobileSearchToggle.setAttribute('aria-expanded', 'false');
            mobileSearchBox.setAttribute('aria-hidden', 'true');
            mobileSearchToggle.focus();
        }

        // ハンバーガーメニュー内のサブメニュー開閉
        const menuContainer = document.querySelector('.header__global-menu--mobile');
        if (menuContainer) {
            const submenuToggles = menuContainer.querySelectorAll('.submenu-toggle');
            submenuToggles.forEach(toggle => {
                // 既にイベントリスナーが登録されているかチェック
                if (toggle.dataset.listenerAttached === 'true') {
                    return;
                }
                
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const listItem = toggle.closest('.has-submenu');
                    if (!listItem) return;
                    
                    const isOpen = listItem.classList.contains('open');
                    
                    // 他のサブメニューを閉じる
                    const allMenuItems = menuContainer.querySelectorAll('.has-submenu');
                    allMenuItems.forEach(item => {
                        if (item !== listItem) {
                            item.classList.remove('open');
                            const toggleBtn = item.querySelector('.submenu-toggle');
                            if (toggleBtn) {
                                toggleBtn.setAttribute('aria-expanded', 'false');
                            }
                        }
                    });
                    
                    // 現在のサブメニューを開閉
                    if (isOpen) {
                        listItem.classList.remove('open');
                        toggle.setAttribute('aria-expanded', 'false');
                    } else {
                        listItem.classList.add('open');
                        toggle.setAttribute('aria-expanded', 'true');
                    }
                });
                
                // イベントリスナー登録済みフラグを設定
                toggle.dataset.listenerAttached = 'true';
            });
        }

        // モバイル検索フォーム送信
        const mobileSearchForm = mobileSearchBox ? mobileSearchBox.querySelector('form') : null;
        if (mobileSearchForm) {
            mobileSearchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const searchTerm = mobileSearchInput.value.trim();
                
                if (searchTerm) {
                    const announcement = document.getElementById('mobile-search-results-announcement');
                    if (announcement) {
                        announcement.textContent = `「${searchTerm}」の検索を実行しました。検索機能は準備中です。`;
                    }
                    
                    // ページタイトルを更新
                    if (window.updateTitleOnSearch) {
                        window.updateTitleOnSearch(searchTerm);
                    }
                    
                    // 検索処理（実際の実装ではサーバーに送信）
                    alert('検索機能は準備中です。検索語: ' + searchTerm);
                }
            });
        }

        // モバイル用ユニバーサルスイッチのイベントリスナーは
        // accessibility.jsで一元管理されているため、ここでは設定しない
        
        // 初期化完了フラグを設定
        isInitialized = true;
    }

    // グローバルスコープに公開（load-common.jsから呼び出せるように）
    window.initMobileMenu = initMobileMenu;

    // 初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }

    // ヘッダー読み込み後にも再度初期化（動的読み込み対策）
    document.addEventListener('headerLoaded', initMobileMenu);
})();

