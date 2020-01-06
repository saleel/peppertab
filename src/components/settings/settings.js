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
  // const [weatherLocation, setWeatherLocation] = useLocalStorage(SettingKeys.weatherLocation);


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

      </div>


      <div className="settings__section">
        <h3>Weather</h3>

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

      </div>


      <div className="settings__section">
        <h3>Time</h3>

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

    </div>
  );
}


export default Settings;
