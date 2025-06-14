const {dom} = require('../../util');
const format = require('../../core/format');
const allsettings = require('../../core/settings');
const preview = require('./preview');

const settings = Object.assign({
    enabled: false,
    autoplay: true,
    types: []
}, allsettings['preview-aud']);
const tpl = '<audio id="pv-content-aud"/>';

const updateGui = () => {
    const el = dom('#pv-content-aud')[0];
    if (!el) {
        return;
    }

    preview.setLabels([
        preview.item.label,
        format.formatDate(el.duration * 1000, 'mm:ss', true)
    ]);
};

const addUnloadFn = el => {
    el.unload = () => {
        el.pause();
        el.src = '';
        el.load();
    };
};

const load = item => {
    return new Promise(resolve => {
        const $el = dom(tpl)
            .on('loadedmetadata', () => resolve($el))
            .attr('controls', 'controls');
        if (settings.autoplay) {
            $el.attr('autoplay', 'autoplay');
        }
        addUnloadFn($el[0]);
        $el.attr('src', item.absHref);
    });
};

const init = () => {
    if (settings.enabled) {
        preview.register(settings.types, load, updateGui);
    }
};

init();
