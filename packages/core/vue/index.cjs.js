'use strict';

require('pagiflow');
var vue = require('vue');

function getPagiflow$1() {
    var _a;
    if (typeof window !== 'undefined' && window.Pagiflow) {
        return window.Pagiflow;
    }
    try {
        const mod = require('pagiflow');
        return ((_a = mod.default) !== null && _a !== void 0 ? _a : mod);
    }
    catch (_b) {
        return null;
    }
}
function initPagiflowFromElement$1(ctor, el, opts) {
    const attrValue = `pf-${Math.random().toString(36).slice(2)}`;
    const selector = `[data-pagiflow-vue-id="${attrValue}"]`;
    el.setAttribute('data-pagiflow-vue-id', attrValue);
    const bySelector = ctor(selector, opts);
    if (!bySelector) {
        el.removeAttribute('data-pagiflow-vue-id');
        return null;
    }
    return bySelector;
}
const Pagiflow = vue.defineComponent({
    name: 'Pagiflow',
    props: {
        options: {
            type: Object,
            default: () => ({}),
        },
        tag: {
            type: String,
            default: 'div',
        },
    },
    emits: ['slideChange', 'ready'],
    setup(props, { slots, attrs, expose, emit }) {
        var _a;
        const rootRef = vue.ref(null);
        const instance = vue.ref(null);
        const currentIndex = vue.ref((_a = props.options.startIndex) !== null && _a !== void 0 ? _a : 0);
        let resizeObserver = null;
        let raf1 = 0;
        let raf2 = 0;
        let timeoutId = 0;
        const next = () => { var _a; return (_a = instance.value) === null || _a === void 0 ? void 0 : _a.next(); };
        const prev = () => { var _a; return (_a = instance.value) === null || _a === void 0 ? void 0 : _a.prev(); };
        const goTo = (index, opts) => { var _a; return (_a = instance.value) === null || _a === void 0 ? void 0 : _a.goTo(index, opts); };
        const play = () => { var _a; return (_a = instance.value) === null || _a === void 0 ? void 0 : _a.play(); };
        const pause = () => { var _a; return (_a = instance.value) === null || _a === void 0 ? void 0 : _a.pause(); };
        const togglePlayPause = () => { var _a; return (_a = instance.value) === null || _a === void 0 ? void 0 : _a.togglePlayPause(); };
        const setOptions = (opts, rebuild = false) => { var _a; return (_a = instance.value) === null || _a === void 0 ? void 0 : _a.setOptions(opts, rebuild); };
        const reInit = (opts = {}) => { var _a; return (_a = instance.value) === null || _a === void 0 ? void 0 : _a.reInit(opts); };
        expose({
            instance,
            currentIndex,
            next,
            prev,
            goTo,
            play,
            pause,
            togglePlayPause,
            setOptions,
            reInit,
        });
        vue.onMounted(() => {
            const el = rootRef.value;
            if (!el)
                return;
            const existing = el.pagiflowInstance;
            if (existing && !existing.destroyed) {
                instance.value = existing;
                return;
            }
            const ctor = getPagiflow$1();
            if (!ctor) {
                console.error('[Pagiflow Vue] Core not found. Install pagiflow or load it via CDN.');
                return;
            }
            const effectiveOptions = Object.assign({}, props.options);
            const inst = initPagiflowFromElement$1(ctor, el, effectiveOptions);
            if (!inst)
                return;
            const syncLayout = () => {
                var _a;
                const api = inst;
                (_a = api.update) === null || _a === void 0 ? void 0 : _a.call(api);
            };
            raf1 = window.requestAnimationFrame(syncLayout);
            raf2 = window.requestAnimationFrame(syncLayout);
            timeoutId = window.setTimeout(syncLayout, 80);
            window.addEventListener('load', syncLayout, { once: true });
            if (typeof ResizeObserver !== 'undefined') {
                resizeObserver = new ResizeObserver(syncLayout);
                resizeObserver.observe(el);
            }
            inst.onSlideChange((idx) => {
                currentIndex.value = idx;
                emit('slideChange', idx);
            });
            instance.value = inst;
            emit('ready', inst);
        });
        vue.watch(() => props.options, (nextOptions) => {
            if (instance.value) {
                instance.value.setOptions(nextOptions, true);
            }
        }, { deep: true });
        vue.onBeforeUnmount(() => {
            const el = rootRef.value;
            window.cancelAnimationFrame(raf1);
            window.cancelAnimationFrame(raf2);
            window.clearTimeout(timeoutId);
            resizeObserver === null || resizeObserver === void 0 ? void 0 : resizeObserver.disconnect();
            if (instance.value && !instance.value.destroyed) {
                try {
                    instance.value.destroy();
                }
                catch (_a) {
                    // ignore unmount destroy errors
                }
            }
            if (el)
                delete el.pagiflowInstance;
            instance.value = null;
        });
        return () => vue.h(props.tag, Object.assign(Object.assign({}, attrs), { ref: rootRef, class: ['pagiflow', attrs.class] }), slots.default ? slots.default() : []);
    },
});

const PagiflowSlide = vue.defineComponent({
    name: 'PagiflowSlide',
    props: {
        asChild: {
            type: Boolean,
            default: true,
        },
    },
    setup(props, { attrs, slots }) {
        return () => {
            const defaultSlot = slots.default ? slots.default() : [];
            if (props.asChild && defaultSlot.length === 1) {
                return vue.cloneVNode(defaultSlot[0], attrs);
            }
            return vue.h('div', attrs, defaultSlot);
        };
    },
});

function getPagiflow() {
    var _a;
    if (typeof window !== 'undefined' && window.Pagiflow) {
        return window.Pagiflow;
    }
    try {
        const mod = require('pagiflow');
        return ((_a = mod.default) !== null && _a !== void 0 ? _a : mod);
    }
    catch (_b) {
        return null;
    }
}
function initPagiflowFromElement(ctor, el, opts) {
    const attrValue = `pf-${Math.random().toString(36).slice(2)}`;
    const selector = `[data-pagiflow-vue-id="${attrValue}"]`;
    el.setAttribute('data-pagiflow-vue-id', attrValue);
    const bySelector = ctor(selector, opts);
    if (!bySelector) {
        el.removeAttribute('data-pagiflow-vue-id');
        return null;
    }
    return bySelector;
}
function usePagiflow(options = {}) {
    var _a;
    const sliderRef = vue.ref(null);
    const instance = vue.ref(null);
    const currentIndex = vue.ref((_a = options.startIndex) !== null && _a !== void 0 ? _a : 0);
    let resizeObserver = null;
    let raf1 = 0;
    let raf2 = 0;
    let timeoutId = 0;
    vue.onMounted(() => {
        const el = sliderRef.value;
        if (!el)
            return;
        const existing = el.pagiflowInstance;
        if (existing && !existing.destroyed) {
            instance.value = existing;
            return;
        }
        const ctor = getPagiflow();
        if (!ctor) {
            console.error('[usePagiflow] Pagiflow core not found. Install pagiflow or load it via CDN.');
            return;
        }
        const inst = initPagiflowFromElement(ctor, el, options);
        if (!inst)
            return;
        const syncLayout = () => {
            var _a;
            const api = inst;
            (_a = api.update) === null || _a === void 0 ? void 0 : _a.call(api);
        };
        raf1 = window.requestAnimationFrame(syncLayout);
        raf2 = window.requestAnimationFrame(syncLayout);
        timeoutId = window.setTimeout(syncLayout, 80);
        window.addEventListener('load', syncLayout, { once: true });
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(syncLayout);
            resizeObserver.observe(el);
        }
        inst.onSlideChange((idx) => {
            currentIndex.value = idx;
        });
        instance.value = inst;
    });
    vue.onBeforeUnmount(() => {
        const el = sliderRef.value;
        window.cancelAnimationFrame(raf1);
        window.cancelAnimationFrame(raf2);
        window.clearTimeout(timeoutId);
        resizeObserver === null || resizeObserver === void 0 ? void 0 : resizeObserver.disconnect();
        if (instance.value && !instance.value.destroyed) {
            try {
                instance.value.destroy();
            }
            catch (_a) {
                // ignore unmount destroy errors
            }
        }
        if (el)
            delete el.pagiflowInstance;
        instance.value = null;
    });
    const goTo = (index, opts) => {
        var _a;
        (_a = instance.value) === null || _a === void 0 ? void 0 : _a.goTo(index, opts);
    };
    const next = () => { var _a; return (_a = instance.value) === null || _a === void 0 ? void 0 : _a.next(); };
    const prev = () => { var _a; return (_a = instance.value) === null || _a === void 0 ? void 0 : _a.prev(); };
    const play = () => { var _a; return (_a = instance.value) === null || _a === void 0 ? void 0 : _a.play(); };
    const pause = () => { var _a; return (_a = instance.value) === null || _a === void 0 ? void 0 : _a.pause(); };
    const togglePlayPause = () => { var _a; return (_a = instance.value) === null || _a === void 0 ? void 0 : _a.togglePlayPause(); };
    const setOptions = (opts, rebuild = false) => { var _a; return (_a = instance.value) === null || _a === void 0 ? void 0 : _a.setOptions(opts, rebuild); };
    const reInit = (opts = {}) => { var _a; return (_a = instance.value) === null || _a === void 0 ? void 0 : _a.reInit(opts); };
    return {
        sliderRef,
        instance,
        currentIndex,
        goTo,
        next,
        prev,
        play,
        pause,
        togglePlayPause,
        setOptions,
        reInit,
    };
}

exports.Pagiflow = Pagiflow;
exports.PagiflowSlide = PagiflowSlide;
exports.usePagiflow = usePagiflow;
//# sourceMappingURL=index.cjs.js.map
