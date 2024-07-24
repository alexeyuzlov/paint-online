import React from 'react';
import toolState from "../store/toolState";

const SettingBar = () => {
    return (
        <div className="setting-bar" style={{display: "flex", flexAlign: "center", gap: 10, padding: 10}}>
            <label style={{marginBottom: 0}} htmlFor="line-width">Толщина линии</label>
            <input
                onChange={e => toolState.setLineWidth(e.target.value)}
                id="line-width"
                type="number" defaultValue={1} min={1} max={50}/>
            <label style={{marginBottom: 0}}  htmlFor="stroke-color">Цвет обводки</label>
            <input onChange={e => toolState.setStrokeColor(e.target.value)} id="stroke-color" type="color"/>
        </div>
    );
};

export default SettingBar;
