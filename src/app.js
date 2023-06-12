import '@lib/prototype';
import { getDevice, onMediaChange } from '@utils/matchMedia';
import Pace from 'pace-js';

const on = function (eventType, handler) {
  switch (eventType) {
    case 'mediaChange':
      onMediaChange(handler);
      break;
    default:
  }
};

Object.defineProperties(app, {
  device: {
    get() {
      return getDevice();
    },
  },
  isMobile: {
    get() {
      const device = getDevice();
      return device === 'mobile';
    },
  },
  isTablet: {
    get() {
      const device = getDevice();
      return device === 'tablet';
    },
  },
  isDesktop: {
    get() {
      const device = getDevice();
      return device === 'desktop';
    },
  },
});

// pace-js
Pace.options = {
  ajax: false,
};
Pace.start();

// language className
document.documentElement.classList.add(`lang-${navigator.language}`);

export { on };
