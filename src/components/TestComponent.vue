<template>
  <div>
    It Works!
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class TestComponent extends Vue { }
</script>

<style lang="scss" scoped>
  div {
    margin: 0 auto;
    padding: 2rem;
    background-color: $white;
    color: $blue;
  }
</style>
