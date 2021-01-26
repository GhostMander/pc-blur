const { Plugin } = require('powercord/entities');

/* Settings */
const Settings = require('./Components/Settings.jsx');

// Variables
let isBlurred = false;
let _this
let key2
module.exports = class PowercordBlurPlugin extends Plugin {
    async startPlugin() {
        _this = this
        document.body.removeEventListener("keyup", _this.keyup);
        document.body.addEventListener("keyup", _this.keyup);

        document.body.removeEventListener("click", _this.click);
        document.body.addEventListener("click", _this.click);

        /* Register Settings */
        powercord.api.settings.registerSettings(this.entityID, {
            category: this.entityID,
            label: this.manifest.name,
            render: Settings
        });
    }

    unloadStyleSheet() {
        for (const id in this.styles) {
            const stylesheet = this.styles[id];
            const filename = stylesheet.compiler.file;

            if (filename.endsWith('style.scss')) {
                stylesheet.compiler.on('src-update', stylesheet.compile);
                stylesheet.compiler.disableWatcher();

                document.getElementById(`style-${this.entityID}-${id}`).remove();

                delete this.styles[id];
            }
        }
    }

    pluginWillUnload() {
        powercord.api.settings.unregisterSettings(this.entityID);
        if (!isBlurred) {
            for (const id in _this.styles) {
                _this.styles[id].compiler.on('src-update', _this.styles[id].compile);
                _this.styles[id].compiler.disableWatcher();
                document.getElementById(`style-${_this.entityID}-${id}`).remove();
            }
        }
        document.body.removeEventListener("keyup", _this.keyup);
        document.body.removeEventListener("click", _this.click);
    }

    async keyup(event) {
        if (_this.settings.get("useDefaultKeybind")) { key2 = 'F6' } else { key2 = _this.settings.get("blurBind") }
        if (event.key == _this.settings.get("blurBind") || event.key == key2) {
            if (!isBlurred) {
                _this.loadStylesheet('style.scss')
                isBlurred = true
            } else {
                _this.unloadStyleSheet()
                isBlurred = false
            }
        }
    }

    async click(event) {
        if (_this.settings.get('useMouseClick') && isBlurred) {
            _this.unloadStyleSheet()
            isBlurred = false
        }
    }
};