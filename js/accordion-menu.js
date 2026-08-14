// アコーディオンメニューの機能

(function() {
    'use strict';

    // イベント委譲を使用して、動的に読み込まれた要素にも対応
    function initAccordionMenu() {
        // グローバルメニュー全体にイベントリスナーを設定（一度だけ）
        const globalMenu = document.querySelector('.global-menu');
        if (!globalMenu) {
            return; // メニューが存在しない場合は何もしない
        }

        // 既にイベントリスナーが設定されている場合はスキップ
        if (globalMenu.dataset.accordionInitialized === 'true') {
            return;
        }

        // クリックイベントを委譲
        globalMenu.addEventListener('click', function(e) {
            const clickedLink = e.target.closest('.global-menu > ul > li.has-submenu > a');
            
            if (clickedLink) {
                const menuItem = clickedLink.parentElement;
                const submenu = menuItem.querySelector('.submenu');
                
                if (submenu) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // 他のメニューを閉じる
                    const allMenuItems = document.querySelectorAll('.global-menu > ul > li.has-submenu');
                    allMenuItems.forEach(item => {
                        if (item !== menuItem) {
                            item.classList.remove('open');
                        }
                    });
                    
                    // 現在のメニューを開閉
                    menuItem.classList.toggle('open');
                }
            }
        });

        // メニュー外をクリックしたら閉じる（一度だけ登録）
        if (!window.accordionMenuOutsideClickHandler) {
            window.accordionMenuOutsideClickHandler = function(e) {
                if (!e.target.closest('.global-menu')) {
                    const allMenuItems = document.querySelectorAll('.global-menu > ul > li.has-submenu');
                    allMenuItems.forEach(item => {
                        item.classList.remove('open');
                    });
                }
            };
            document.addEventListener('click', window.accordionMenuOutsideClickHandler);
        }

        // キーボードナビゲーション
        globalMenu.addEventListener('keydown', function(e) {
            const target = e.target;
            if (target.tagName === 'A' && target.closest('.global-menu > ul > li.has-submenu')) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    target.click();
                }
            }
        });

        // 初期化済みフラグを設定
        globalMenu.dataset.accordionInitialized = 'true';
    }

    // グローバルスコープに公開
    window.initAccordionMenu = initAccordionMenu;

    // ページ読み込み時に初期化を試みる
    function tryInit() {
        if (document.querySelector('.global-menu')) {
            initAccordionMenu();
        }
    }

    // DOMContentLoaded時に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        tryInit();
    }
})();
