import React from 'react';
import toolState from "../store/tool.state";
import '../styles/settings-bar.css';

const SettingBar = () => {
    return (
        <div className="settings-bar">
            <label
                className="settings-bar__label"
                htmlFor="line-width"
            >
                Толщина линии
            </label>
            <input
                onChange={(e) => toolState.setLineWidth(+e.target.value, true)}
                id="line-width"
                type="number"
                defaultValue={1}
                min={1}
                max={50}
            />

            <label
                className="settings-bar__label"
                htmlFor="fill-color"
            >
                Цвет заливки
            </label>
            <input
                id="fill-color"
                type="color"
                onChange={e => toolState.setFillColor(e.target.value, true)}
            />

            <label
                className="settings-bar__label"
                htmlFor="stroke-color"
            >
                Цвет линии и обводки
            </label>
            <input
                onChange={(e) => toolState.setStrokeColor(e.target.value, true)}
                id="stroke-color"
                type="color"
            />

            <label
                className="settings-bar__label"
                htmlFor="has-stroke"
            >
                Есть обводка?
            </label>
            <input
                onChange={(e) => toolState.setHasStroke(e.target.checked, true)}
                id="has-stroke"
                type="checkbox"
            />
        </div>
    );
};

export default SettingBar;
