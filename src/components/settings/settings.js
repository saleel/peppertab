// @ts-check

import React from 'react';
import Switch from 'react-switch';
import useLocalStorage from '../../hooks/use-local-storage';
import { SettingKeys } from '../../constants';
import EditableText from '../editable-text';
import './settings.scss';


function Settings() {
  const [name, setName] = useLocalStorage(SettingKeys.name, '');
  const [weatherUnit, setWeatherUnit] = useLocalStorage(SettingKeys.weatherUnit, 'C');
  const [timeFormat, setTimeFormat] = useLocalStorage(SettingKeys.timeFormat, '24');
  // const [weatherLocation, setWeatherLocation] = useLocalStorage(SettingKeys.weatherLocation);


  return (
    <div className="settings">

      <div className="settings__section">
        <h3>General</h3>

        <div className="settings__form-item">
          <div className="settings__form-item-label">
            Name
          </div>
          <div className="settings__form-item-value">
            <EditableText onSubmit={setName} value={name} maxLength={15} />
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
