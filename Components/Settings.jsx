/* Essential Packages */
const { React } = require('powercord/webpack');

const { KeybindRecorder, SwitchItem } = require('powercord/components/settings');

module.exports = class Settings extends React.PureComponent  {
    render() {
        const { getSetting, updateSetting, toggleSetting } = this.props;
        return (
            <div>
                <KeybindRecorder
                    value={getSetting('blurBind')} // The second parameter is the default setting
                    onChange={(e) => {
                        this.setState({ value: e })
                        updateSetting("blurBind", e)
                    }}
                    onReset={() => {
                        this.setState({ value: "F6" })
                        updateSetting("blurBind", "F6")
                    }}
                >
                    Blur Screen Keybind
                </KeybindRecorder>
                {getSetting('blurBind') != 'F6' && <SwitchItem
                    value={getSetting('useDefaultKeybind', false)}
                    onChange={() => {
                        toggleSetting('useDefaultKeybind', false);
                    }}
                    note='If Enabled, the default keybind (F6) can still be used in case something breaks.'
                >
                    Also use default keybind
                </SwitchItem>}
                <SwitchItem
                    value={getSetting('useMouseClick', false)}
                    onChange={() => {
                        toggleSetting('useMouseClick', false);
                    }}
                    note='If Enabled, screen can be unblurred using mouse click.'
                >
                    Mouse click unblur
                </SwitchItem>
            </div>
        );
    }
};
