/**
 * 3D-сцена Spline (робот) в секции About Me.
 * Загружается через @splinetool/runtime (ESM).
 */
(function () {
    const SCENE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';
    const canvas = document.getElementById('canvas3d');
    if (!canvas) return;

    var splineApp = null;

    function resizeCanvas() {
        var container = canvas.parentElement;
        if (!container || !splineApp) return;
        var w = container.clientWidth;
        var h = container.clientHeight;
        if (w && h) splineApp.setSize(w, h);
    }

    async function initSpline() {
        try {
            var Application = (await import('https://esm.sh/@splinetool/runtime@1')).Application;
            splineApp = new Application(canvas);
            await splineApp.load(SCENE_URL);
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
        } catch (e) {
            console.warn('Spline scene failed to load:', e);
        }
    }

    initSpline();
})();
