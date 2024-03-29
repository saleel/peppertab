// @ts-check

import React from 'react';
import Switch from 'react-switch';
import useSettings from '../../hooks/use-settings';
import { SettingKeys } from '../../constants';
import EditableText from '../editable-text';
import './settings.scss';


function Settings() {
  const [name, setName] = useSettings(SettingKeys.name, '');
  const [weatherUnit, setWeatherUnit] = useSettings(SettingKeys.weatherUnit, 'C');
  const [timeFormat, setTimeFormat] = useSettings(SettingKeys.timeFormat, '24');
  const [colorMode, setColorMode] = useSettings(SettingKeys.colorMode, 'dark');
  const [isLinksEnabled, setIsLinksEnabled] = useSettings(SettingKeys.isLinksEnabled, true);


  React.useEffect(() => {
    window.updateColors();
  }, [colorMode]);


  return (
    <div className="settings">

      <h2 className="settings__title">Settings</h2>

      <div className="settings__section">
        <h3>General</h3>

        <div className="settings__form-item">
          <div className="settings__form-item-label">
            Name
          </div>
          <div className="settings__form-item-value">
            <EditableText onSubmit={setName} value={name} />
          </div>
        </div>

        <div className="settings__form-item">
          <div className="settings__form-item-label">
            Dark Mode
          </div>
          <div className="settings__form-item-value">
            <Switch
              onChange={() => {
                setColorMode((e) => (e === 'dark' ? 'light' : 'dark'));
              }}
              checked={colorMode === 'dark'}
              className="settings__switch"
            />
          </div>
        </div>

      </div>


      <div className="settings__section">
        <h3>Time / Weather</h3>

        <div className="settings__form-item">
          <div className="settings__form-item-label">
            Use Fahrenheit (°F)
          </div>
          <div className="settings__form-item-value">
            <Switch
              onChange={() => {
                setWeatherUnit((e) => (e === 'C' ? 'F' : 'C'));
              }}
              checked={weatherUnit === 'F'}
              className="settings__switch"
            />
          </div>
        </div>

        <div className="settings__form-item">
          <div className="settings__form-item-label">
            Use 24 Hour Format
          </div>
          <div className="settings__form-item-value">
            <Switch
              onChange={() => {
                setTimeFormat((e) => (e === '24' ? '12' : '24'));
              }}
              checked={timeFormat === '24'}
              className="settings__switch"
            />
          </div>
        </div>

      </div>

      {/*
      <div className="settings__section">
        <h3>Greeting</h3>


      </div> */}


      <div className="settings__section">
        <h3>Links</h3>

        <div className="settings__form-item">
          <div className="settings__form-item-label">
            Enabled
          </div>
          <div className="settings__form-item-value">
            <Switch
              onChange={() => {
                setIsLinksEnabled((e) => !e);
              }}
              checked={isLinksEnabled === true}
              className="settings__switch"
            />
          </div>
        </div>

      </div>

    </div>
  );
}


export default Settings;
