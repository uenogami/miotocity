// フォームバリデーション機能

(function() {
    'use strict';

    // エラーメッセージの定義
    const errorMessages = {
        required: 'この項目は必須です。',
        email: '正しいメールアドレスを入力してください。',
        minLength: function(min) { return `少なくとも${min}文字以上入力してください。`; },
        maxLength: function(max) { return `${max}文字以内で入力してください。`; }
    };

    // エラーメッセージを表示
    function showError(field, message) {
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.setAttribute('aria-live', 'polite');
        }
        
        field.setAttribute('aria-invalid', 'true');
        field.classList.add('error');
    }

    // エラーメッセージをクリア
    function clearError(field) {
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.textContent = '';
        }
        
        field.setAttribute('aria-invalid', 'false');
        field.classList.remove('error');
    }

    // フィールドをバリデート
    function validateField(field) {
        clearError(field);

        // 必須チェック
        if (field.hasAttribute('required') && !field.value.trim()) {
            showError(field, errorMessages.required);
            return false;
        }

        // メールアドレスのバリデーション
        if (field.type === 'email' && field.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(field.value)) {
                showError(field, errorMessages.email);
                return false;
            }
        }

        // テキストエリアの最小文字数チェック
        if (field.tagName === 'TEXTAREA' && field.hasAttribute('required')) {
            if (field.value.trim().length < 10) {
                showError(field, errorMessages.minLength(10));
                return false;
            }
        }

        return true;
    }

    // フォーム全体をバリデート
    function validateForm(form) {
        const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        const errors = [];

        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
                const label = form.querySelector(`label[for="${field.id}"]`);
                const labelText = label ? label.textContent.replace(/\s*\*\s*$/, '').trim() : field.id;
                errors.push(`${labelText}: ${document.getElementById(field.id + '-error').textContent}`);
            }
        });

        // フォーム全体のエラーメッセージを表示
        const formErrorsElement = document.getElementById('form-errors');
        if (formErrorsElement) {
            if (!isValid) {
                formErrorsElement.innerHTML = '<ul><li>' + errors.join('</li><li>') + '</li></ul>';
                formErrorsElement.setAttribute('aria-live', 'assertive');
                formErrorsElement.setAttribute('aria-atomic', 'true');
                
                // フォーカスをエラーメッセージに移動
                formErrorsElement.focus();
                formErrorsElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                formErrorsElement.innerHTML = '';
            }
        }

        return isValid;
    }

    // フォーム初期化
    function initFormValidation() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        // 各フィールドにリアルタイムバリデーションを追加
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            // フォーカスアウト時にバリデート
            field.addEventListener('blur', function() {
                if (field.hasAttribute('required') || field.type === 'email') {
                    validateField(field);
                }
            });

            // 入力中にエラーをクリア
            field.addEventListener('input', function() {
                if (field.getAttribute('aria-invalid') === 'true') {
                    validateField(field);
                }
            });
        });

        // フォーム送信時のバリデーション
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm(form)) {
                // エラー時にタイトルを更新
                if (window.updateTitleOnError) {
                    window.updateTitleOnError('入力内容に誤りがあります');
                }
                return;
            }
            
            if (validateForm(form)) {
                // バリデーション成功時の処理
                const formErrorsElement = document.getElementById('form-errors');
                if (formErrorsElement) {
                    formErrorsElement.innerHTML = '';
                }
                
                // ページタイトルを更新（送信成功時）
                if (window.updateTitleOnSuccess) {
                    window.updateTitleOnSuccess('お問い合わせフォーム');
                }
                
                // 実際の送信処理（ここではアラートで代用）
                alert('フォームの送信処理を実行します。\n（実際の実装ではサーバーに送信します）');
                
                // フォームをリセット
                form.reset();
                fields.forEach(field => {
                    clearError(field);
                });
            } else {
                // 最初のエラーフィールドにフォーカス
                const firstErrorField = form.querySelector('[aria-invalid="true"]');
                if (firstErrorField) {
                    firstErrorField.focus();
                }
            }
        });
    }

    // 初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFormValidation);
    } else {
        initFormValidation();
    }
})();

