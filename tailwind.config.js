const myColors = require('./src/lib/tailwindcss/colors.js');
const px2rem = function (pxValue) {
  return `${pxValue / 16}rem`;
};
const breakpoints = [768, 1024];
// const breakpoints = JSON.parse(process.env.npm_package_config_breakpoints);
console.log('\x1b[36m%s\x1b[0m', `Load TailwindCSS`);

module.exports = {
  content: ['./src/**/*.{htm,html,js,jsx,tpl}', './public/**/*.{htm,html,js,jsx}'],
  theme: {
    backgroundPosition: theme => theme('positions'),
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
      ...myColors,
      primary: {
        light: myColors.cyan[400],
        DEFAULT: myColors.cyan[600],
        dark: myColors.cyan[800],
      },
      secondary: {
        light: myColors.blueGray[100],
        DEFAULT: myColors.blueGray[400],
        dark: myColors.blueGray[500],
      },
      tertiary: {
        light: myColors.blueGray[300],
        DEFAULT: myColors.blueGray[400],
        dark: myColors.blueGray[500],
      },
      info: {
        light: myColors.lightBlue[300],
        DEFAULT: myColors.lightBlue[500],
        dark: myColors.lightBlue[700],
      },
      success: {
        light: myColors.green[200],
        DEFAULT: myColors.green[400],
        dark: myColors.green[600],
      },
      warning: {
        light: myColors.amber[200],
        DEFAULT: myColors.amber[400],
        dark: myColors.amber[600],
      },
      danger: {
        light: myColors.red[500],
        DEFAULT: myColors.red[700],
        dark: myColors.red[900],
      },
    },
    container: {
      center: true,
    },
    extend: {
      animation: {
        appear: 'appear 1s',
        rotate: 'rotate 1s infinite linear',
        shakeX: 'shakeX 1s both',
      },
      backgroundSize: {
        '0%': '0 0',
        '100%': '100% 100%',
      },
      borderWidth: {
        3: '3px',
        5: '5px',
      },
      fill: theme => ({
        primary: theme('colors.primary.DEFAULT'),
        success: theme('colors.success.DEFAULT'),
        info: theme('colors.info.DEFAULT'),
        warning: theme('colors.warning.DEFAULT'),
        danger: theme('colors.danger.DEFAULT'),
      }),
      gridTemplateColumns: {
        fluid: 'repeat(auto-fill,minmax(10rem,1fr))',
      },
      height: {
        '200%': '200%',
      },
      keyframes: {
        appear: {
          '0%': {
            opacity: 0,
          },
        },
        rotate: {
          to: {
            transform: 'rotate(360deg)',
          },
        },
        shakeX: {
          '0%,to': {
            transform: 'translateZ(0)',
          },
          '10%,30%,50%,70%,90%': {
            transform: 'translate3d(-10px,0,0)',
          },
          '20%,40%,60%,80%': {
            transform: 'translate3d(10px,0,0)',
          },
        },
      },
      lineHeight: {
        12: '3rem',
      },
      listStyleType: {
        'upper-alpha': 'upper-alpha',
        'lower-alpha': 'lower-alpha',
        'trad-chinese-formal': 'trad-chinese-formal',
        'trad-chinese-informal': 'trad-chinese-informal',
      },
      maxWidth: {
        '100vh': '100vh',
      },
      padding: {
        '1%': '1%',
        '2%': '2%',
      },
      spacing: {
        15: '3.75rem',
      },
      transitionProperty: {
        opacity: 'opacity',
        width: 'width',
        height: 'height',
        spacing: 'margin, padding',
      },
      width: {
        '200%': '200%',
      },
    },
    fontFamily: {
      sans: [
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        'Ubuntu',
        '"Helvetica Neue"',
        'Arial',
        '"Noto Sans"',
        'Meiryo',
        '"游ゴシック Medium"',
        '"Kozuka Gothic Pro"',
        '"Hiragino Kaku Gothic Pro"',
        '"Microsoft YaHei UI"',
        '"Microsoft YaHei"',
        '"Microsoft JhengHei"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      serif: [
        'ui-serif',
        'Georgia',
        'Cambria',
        '"Times New Roman"',
        'Times',
        'PMingLiU',
        '"LiSong Pro"',
        '"Kozuka Mincho Pro"',
        '"MS Mincho"',
        'serif',
      ],
      mono: [
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace',
      ],
      'ubuntu-mono': [
        '"Ubuntu Mono"',
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace',
      ],
      mySans: ['my-sans-serif'],
      mySerif: ['my-serif'],
      icon: ['Material Icons'],
      inherit: ['inherit'],
      a: ['a'],
    },
    fontSize: {
      0: ['0', { lineHeight: '0' }],
      xs: ['0.75rem', { lineHeight: '1.33' }],
      sm: ['0.875rem', { lineHeight: '1.42' }],
      base: ['1rem', { lineHeight: '1.5' }],
      lg: ['1.125rem', { lineHeight: '1.55' }],
      xl: ['1.25rem', { lineHeight: '1.4' }],
      '2xl': ['1.5rem', { lineHeight: '1.33' }],
      '3xl': ['1.875rem', { lineHeight: '1.2' }],
      '4xl': ['2.25rem', { lineHeight: '1.1' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    objectPosition: theme => theme('positions'),
    positions: {
      bottom: 'bottom',
      'bottom-4': 'center bottom 1rem',
      center: 'center',
      'center-top': 'center top',
      left: 'left',
      'left-bottom': 'left bottom',
      'left-center': 'left center',
      'left-top': 'left top',
      right: 'right',
      'right-bottom': 'right bottom',
      'right-center': 'right center',
      'right-top': 'right top',
      top: 'top',
    },
    rotate: {
      '-180': '-180deg',
      '-90': '-90deg',
      '-45': '-45deg',
      0: '0',
      45: '45deg',
      90: '90deg',
      180: '180deg',
    },
    screens: {
      sm: { max: px2rem(breakpoints[0] - 1) },
      'sm-landscape': { raw: `screen and (max-width: ${px2rem(breakpoints[0] - 1)}) and (orientation: landscape)` },
      md: { min: px2rem(breakpoints[0]), max: px2rem(breakpoints[1] - 1) },
      'md-landscape': {
        raw: `screen and (min-width: ${px2rem(breakpoints[0])}) and (max-width: ${px2rem(
          breakpoints[1] - 1,
        )}) and (orientation: landscape)`,
      },
      lemd: { max: px2rem(breakpoints[1]) },
      gemd: px2rem(breakpoints[0]),
      lg: px2rem(breakpoints[1]),
      landscape: { raw: 'screen and (orientation: landscape)' },
      portrait: { raw: 'screen and (orientation: portrait)' },
      print: { raw: 'print' },
      dark: { raw: '(prefers-color-scheme: dark)' },
    },
    zIndex: {
      '-1': '-1',
      '-2': '-2',
      '-3': '-3',
      auto: 'auto',
      0: '0',
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      998: '998',
      999: '999',
    },
  },
  corePlugins: {
    accessibility: false,
    placeholderOpacity: false,
    stroke: false,
    strokeWidth: false,
    // 取消原生 'aspect-ratio'，改用 '@tailwindcss/aspect-ratio'
    // aspectRatio: false
  },
  plugins: [
    // require('@tailwindcss/line-clamp'), // tailwindcss v3.3已內建
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
