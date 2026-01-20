interface ToggleSwitchProps {
    isOn: boolean;
    onToggle: (isOn: boolean) => void;
}

const ToggleSwitch = ({ isOn, onToggle }: ToggleSwitchProps) => {
    return (
        <label className="toggle-switch">
            <input
                type="checkbox"
                checked={isOn}
                onChange={(e) => onToggle(e.target.checked)}
            />
            <span className="slider" />
        </label>
    );
};

export default ToggleSwitch;