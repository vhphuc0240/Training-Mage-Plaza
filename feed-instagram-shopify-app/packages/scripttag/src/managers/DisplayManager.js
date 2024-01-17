import {render} from 'react-dom';
import React from 'react';
import PreviewMediaSetup from '@assets/components/PreviewMediaSetup/PreviewMediaSetup';

export default class DisplayManager {
  constructor() {
    this.RENDER_TAG_ID = 'Test-Feed';
  }

  init(medias, settings) {
    this.insertContainer();
    render(
      <PreviewMediaSetup
        medias={medias}
        settings={settings}
        isPreview={false}
        handleEditHidden={() => {}}
      />,
      document.getElementById(this.RENDER_TAG_ID)
    );
  }

  insertContainer() {
    const popupEl = document.createElement('div');
    this.RENDER_TAG_ID = 'Test-Feed';
    popupEl.id = this.RENDER_TAG_ID;
    popupEl.innerText = 'Loading...';

    const targetEle = document.getElementsByTagName('body')[0];

    targetEle.prepend(popupEl);
  }
}
