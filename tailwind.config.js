module.exports = {
    prefix: '',
    purge: {
        content: [
            './src/**/*.{html,ts}',
            "./node_modules/flowbite/**/*.js"
        ]
    },
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('flowbite/plugin')
    ],
  };
