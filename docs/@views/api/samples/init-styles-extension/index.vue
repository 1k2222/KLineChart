<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-styles-extension"
    chartId="init-styles-extension-chart"
    :code="data.js"/>
</template>