/** Enterprise DS — Storybook 설정 (HTML 프레임워크, 리액트 없음) */
export default {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.js'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/html-vite', options: {} },
  // js/datepicker.js 는 일반 <script>로 읽는다 (JSP와 같은 방식) → preview-head.html
  staticDirs: [{ from: '../js', to: '/ds-js' }],
};
