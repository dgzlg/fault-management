<template>
  <div id="app" class="white-theme">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>
<style lang="less">
  @import "../static/css/font.css";
  @import './assets/common.less';
  body {
    font-family:PingFang;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    letter-spacing: 1px;
  }
  li, ul, p, div, body, html, table {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html, body {
    height: 100%;
    overflow: hidden;
  }
  li {
    list-style: none;
  }
  a{
    text-decoration-line: none
  }
  #app {
    height: 100%;
  }
</style>
