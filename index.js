const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getModule } = require('powercord/webpack');

/* Plugin Specific Packages */
const { ContextMenu } = require('powercord/components');

/* Settings */
const Settings = require('./Components/Settings.jsx');
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
        powercord.api.settings.registerSettings(_this.entityID, {
            category: _this.entityID,
            label: _this.manifest.name,
            render: Settings
        });
    }
    pluginWillUnload() {
        powercord.api.settings.unregisterSettings(_this.entityID);
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
                for (const id in _this.styles) {
                    _this.styles[id].compiler.on('src-update', _this.styles[id].compile);
                    _this.styles[id].compiler.disableWatcher();
                    document.getElementById(`style-${_this.entityID}-${id}`).remove();
                }
                isBlurred = false
            }
        }
    }

    async click(event) {
        if (_this.settings.get('useMouseClick') && isBlurred) {
            for (const id in _this.styles) {
                _this.styles[id].compiler.on('src-update', _this.styles[id].compile);
                _this.styles[id].compiler.disableWatcher();
                document.getElementById(`style-${_this.entityID}-${id}`).remove();
            }
            isBlurred = false
        }
    }
};