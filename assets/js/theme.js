/* === theme.js | Must load FIRST in <head> to prevent FOUC === */
(function () {
    'use strict';
    try {
        var saved = localStorage.getItem('portfolio-theme');
        /* Default to dark — only apply light if explicitly saved */
        var theme = saved === 'light' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
        /* localStorage unavailable (private mode etc.) — fall back to dark */
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}());
