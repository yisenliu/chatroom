const breakpoints = process.env.breakpoints;
const mqls = {
  mobile: window.matchMedia(`(max-width: ${breakpoints[0] - 1}px)`),
  tablet: window.matchMedia(`(min-width: ${breakpoints[0]}px) and (max-width: ${breakpoints[1] - 1}px)`),
  desktop: window.matchMedia(`(min-width: ${breakpoints[1]}px)`),
};
let currentDevice = null;
let mediaChangeHandler = null;
let w = window.innerWidth;
const handleMediaChange = deviceName => {
  switch (deviceName) {
    case 'mobile':
      currentDevice = 'mobile';
      break;
    case 'tablet':
      currentDevice = 'tablet';
      break;
    case 'desktop':
      currentDevice = 'desktop';
      break;
    default:
      return;
  }
  if (Object.prototype.toString.call(mediaChangeHandler) === '[object Function]') {
    window.dispatchEvent(new Event('mediaChange'));
  }
};

for (const [deviceName, mql] of Object.entries(mqls)) {
  mql.addEventListener('change', function (event) {
    if (event.matches) {
      handleMediaChange(deviceName);
    }
  });
}

if (w < breakpoints[0]) {
  currentDevice = 'mobile';
} else if (w > breakpoints[1]) {
  currentDevice = 'desktop';
} else {
  currentDevice = 'tablet';
}

export function getDevice() {
  return currentDevice;
}
export function onMediaChange(handler) {
  mediaChangeHandler = handler;
  window.addEventListener('mediaChange', mediaChangeHandler.bind(app));
}

/********************
 *  Usage
 ********************

// app.js
import getDevice from '@assets/js/matchMedia';
Object.defineProperty(app, 'device', {
  get() {
    return getDevice();
  }
});
--- or ---
Object.defineProperties(app, {
  device: {
    get() {
      return getDevice();
    }
  },
  isMobile: {
    get() {
      const device = getDevice();
      return device === 'mobile';
    }
  },
  isDesktop: {
    get() {
      const device = getDevice();
      return device === 'desktop';
    }
  }
});


// entry_page.js
app.device === 'mobile' | 'desktop'
app.isMobile
app.isDesktop

 ********************/
