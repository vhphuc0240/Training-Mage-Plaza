import {render} from 'react-dom';
import NotificationContainer from '../components/NotificationContainer/NotificationContainer';
import React from 'react';

export default class DisplayManager {
  constructor() {
    this.RENDER_TAG_ID = 'Test-Notifications';
    this.notification = [];
    this.settings = {};
  }

  init(notifications, settings) {
    this.insertContainer();
    render(
      <NotificationContainer notifications={notifications} settings={settings} />,
      document.getElementById(this.RENDER_TAG_ID)
    );
  }

  insertContainer() {
    const popupEl = document.createElement('div');
    popupEl.id = this.RENDER_TAG_ID;
    const targetEle = document.getElementsByTagName('body')[0];
    targetEle.appendChild(popupEl);
  }
}
