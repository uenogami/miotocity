// ページタイトルの動的更新機能

(function() {
    'use strict';

    // ページタイトルを更新
    function updatePageTitle(newTitle, suffix) {
        const defaultSuffix = ' | 澪都市公式ウェブサイト';
        const title = suffix ? newTitle + suffix : newTitle + defaultSuffix;
        document.title = title;
        
        // スクリーンリーダーに通知（aria-liveリージョンを使用）
        const announcement = document.getElementById('page-title-announcement');
        if (announcement) {
            announcement.textContent = `ページタイトルが変更されました: ${newTitle}`;
        }
    }

    // エラー発生時にタイトルを更新
    function updateTitleOnError(errorMessage) {
        const originalTitle = document.title;
        const errorPrefix = 'エラー: ';
        updatePageTitle(errorPrefix + errorMessage);
        
        // 5秒後に元のタイトルに戻す
        setTimeout(function() {
            document.title = originalTitle;
        }, 5000);
    }

    // フォーム送信成功時にタイトルを更新
    function updateTitleOnSuccess(message) {
        const originalTitle = document.title;
        const successPrefix = '送信完了: ';
        updatePageTitle(successPrefix + message);
        
        // 3秒後に元のタイトルに戻す
        setTimeout(function() {
            document.title = originalTitle;
        }, 3000);
    }

    // 検索実行時にタイトルを更新
    function updateTitleOnSearch(searchTerm) {
        const originalTitle = document.title;
        updatePageTitle(`検索結果: ${searchTerm}`);
        
        // 検索結果表示後、元のタイトルに戻す（実際の実装では検索結果ページに遷移するため不要かも）
    }

    // スライド変更時にタイトルを更新（オプション）
    function updateTitleOnSlideChange(slideTitle) {
        // スライダーでのタイトル更新は通常不要（通知のみで十分）
        // 必要に応じて実装
    }

    // グローバルに公開
    window.updatePageTitle = updatePageTitle;
    window.updateTitleOnError = updateTitleOnError;
    window.updateTitleOnSuccess = updateTitleOnSuccess;
    window.updateTitleOnSearch = updateTitleOnSearch;
})();

