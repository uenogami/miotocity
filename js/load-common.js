// 共通コンテンツ（ヘッダー・フッター）を読み込む

(function() {
    'use strict';

    // 共通部品更新時にこの値を上げる（ブラウザキャッシュ対策）
    var COMMON_PARTS_VERSION = '2';

    function withCacheBust(url) {
        var separator = url.indexOf('?') === -1 ? '?' : '&';
        return url + separator + 'v=' + COMMON_PARTS_VERSION;
    }

    // 現在のページの階層レベルを取得（../の数を計算）
    function getBasePath() {
        // スクリプトタグから直接パスを取得（最も確実な方法）
        const scripts = document.getElementsByTagName('script');
        let scriptSrc = '';
        
        for (let i = 0; i < scripts.length; i++) {
            const src = scripts[i].getAttribute('src') || scripts[i].src;
            if (src && src.includes('load-common.js')) {
                scriptSrc = src.split('?')[0].split('#')[0];
                break;
            }
        }
        
        if (scriptSrc) {
            // スクリプトのパスから../の数を数える
            // 例: js/load-common.js -> '' (ルート)
            // 例: ../js/load-common.js -> '../' (1階層下)
            // 例: ../../js/load-common.js -> '../../' (2階層下)
            
            const scriptDir = scriptSrc.substring(0, scriptSrc.lastIndexOf('/'));
            
            // ../の数を数える
            const matches = scriptDir.match(/\.\.\//g);
            if (matches) {
                return matches.join(''); // '../' または '../../' など
            }
            
            // ../がない場合、js/load-common.js または load-common.js
            // js/ がある場合はルート、ない場合は現在のディレクトリ
            if (scriptDir === 'js' || scriptDir === '') {
                return ''; // ルートディレクトリ
            }
        }
        
        // フォールバック: 現在のURLから計算
        const currentPath = window.location.pathname;
        const currentDir = currentPath.replace(/\/[^\/]*\.html?$/, '');
        const pathParts = currentDir.split('/').filter(p => p);
        
        // プロジェクト名（miotocity）を探す
        const projectIndex = pathParts.lastIndexOf('miotocity');
        
        if (projectIndex === -1 || projectIndex === pathParts.length - 1) {
            // プロジェクトルートまたは見つからない場合
            return ''; // ルートディレクトリ
        }
        
        // プロジェクトルート以降の階層数を計算
        const depth = pathParts.length - projectIndex - 1;
        return '../'.repeat(depth);
    }

    // XMLHttpRequestを使用してファイルを読み込む（CORS問題を回避）
    function loadFile(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) { // 0はfile://プロトコルの場合
                    callback(null, xhr.responseText);
                } else {
                    callback(new Error('ファイルの読み込みに失敗しました: ' + url), null);
                }
            }
        };
        xhr.onerror = function() {
            callback(new Error('ネットワークエラー: ' + url), null);
        };
        xhr.send();
    }

    // ヘッダーを読み込む
    function loadHeader() {
        const basePath = getBasePath();
        const headerPath = withCacheBust(basePath + 'includes/header.html');
        const headerPlaceholder = document.getElementById('header-placeholder');
        
        if (headerPlaceholder) {
            loadFile(headerPath, function(error, html) {
                if (error) {
                    console.error('ヘッダーの読み込みエラー:', error);
                    headerPlaceholder.innerHTML = '<p style="color: red; padding: 10px;">ヘッダーの読み込みに失敗しました。ローカルサーバーを使用してください。</p>';
                    return;
                }
                
                headerPlaceholder.innerHTML = html;
                
                // ロゴリンクのパスを修正（デスクトップ版とモバイル版の両方）
                const logoLinks = document.querySelectorAll('.logo__link, #logo-link');
                logoLinks.forEach(logoLink => {
                    if (logoLink) {
                        logoLink.href = basePath + 'index.html';
                    }
                });
                
                // ロゴのSVG画像のパスを修正（デスクトップ版とモバイル版の両方）
                const logoEmblems = document.querySelectorAll('.logo__emblem');
                logoEmblems.forEach(logoEmblem => {
                    if (logoEmblem) {
                        logoEmblem.src = basePath + 'images/miotocity_emblem.svg';
                    }
                });
                
                // 防災情報リンクのパスを修正（モバイル版）
                const disasterLinks = document.querySelectorAll('.header__disaster-link');
                disasterLinks.forEach(disasterLink => {
                    const href = disasterLink.getAttribute('href');
                    if (href && !href.startsWith('http') && !href.startsWith('#')) {
                        if (basePath && !href.startsWith('../') && !href.startsWith('/')) {
                            disasterLink.href = basePath + href;
                        } else if (basePath === '' && href.startsWith('../')) {
                            disasterLink.href = href.replace('../', '');
                        }
                    }
                });
                
                // グローバルメニューのリンクを修正（デスクトップ版とモバイル版の両方）
                const menuLinks = document.querySelectorAll('.global-menu a, .header__global-menu--mobile a');
                menuLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && !href.startsWith('http') && !href.startsWith('#')) {
                        // 既にパスが含まれている場合は調整
                        if (basePath && !href.startsWith('../') && !href.startsWith('/')) {
                            link.href = basePath + href;
                        } else if (basePath === '' && href.startsWith('../')) {
                            link.href = href.replace('../', '');
                        }
                    }
                });
                
                // アコーディオンメニューを初期化
                // ヘッダーが完全にDOMに追加された後に実行
                function initAccordion() {
                    if (typeof window.initAccordionMenu === 'function') {
                        window.initAccordionMenu();
                    } else {
                        // accordion-menu.jsがまだ読み込まれていない場合は少し待つ
                        setTimeout(initAccordion, 50);
                    }
                }
                // 次のイベントループで実行（DOMが完全に更新された後）
                setTimeout(initAccordion, 0);

                // モバイルメニューを初期化
                // ヘッダーが完全にDOMに追加された後に実行
                function initMobileMenu() {
                    if (typeof window.initMobileMenu === 'function') {
                        window.initMobileMenu();
                    } else {
                        // mobile-menu.jsがまだ読み込まれていない場合は動的に読み込む
                        // 既に読み込み済みかチェック
                        const existingScript = document.querySelector('script[src*="mobile-menu.js"]');
                        if (!existingScript) {
                            const script = document.createElement('script');
                            script.src = basePath + 'js/mobile-menu.js';
                            script.onload = function() {
                                // スクリプト読み込み後に初期化
                                if (typeof window.initMobileMenu === 'function') {
                                    window.initMobileMenu();
                                }
                            };
                            document.head.appendChild(script);
                        } else {
                            // 読み込み中の場合、少し待つ
                            setTimeout(initMobileMenu, 50);
                        }
                    }
                }
                // 次のイベントループで実行（DOMが完全に更新された後）
                setTimeout(initMobileMenu, 0);

                // ヘッダー読み込み完了を通知（ユニバーサルスイッチ等の初期化用）
                document.dispatchEvent(new CustomEvent('headerLoaded'));
            });
        }
    }

    // フッターを読み込む
    function loadFooter() {
        const basePath = getBasePath();
        const footerPath = withCacheBust(basePath + 'includes/footer.html');
        const footerPlaceholder = document.getElementById('footer-placeholder');
        
        if (footerPlaceholder) {
            loadFile(footerPath, function(error, html) {
                if (error) {
                    console.error('フッターの読み込みエラー:', error);
                    footerPlaceholder.innerHTML = '<p style="color: red; padding: 10px;">フッターの読み込みに失敗しました。ローカルサーバーを使用してください。</p>';
                    return;
                }
                
                footerPlaceholder.innerHTML = html;
                
                // フッター内のリンクを修正
                const footerLinks = document.querySelectorAll('.footer a');
                footerLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && !href.startsWith('http') && !href.startsWith('#')) {
                        // 既にパスが含まれている場合は調整
                        if (basePath && !href.startsWith('../') && !href.startsWith('/')) {
                            link.href = basePath + href;
                        } else if (basePath === '' && href.startsWith('../')) {
                            link.href = href.replace('../', '');
                        }
                    }
                });
            });
        }
    }

    // 初期化
    function init() {
        loadHeader();
        loadFooter();
    }

    // DOMContentLoaded時に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
