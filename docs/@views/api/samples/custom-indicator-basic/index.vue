<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="custom-indicator-basic"
    chartId="custom-indicator-basic-chart"
    :code="data.js"/>
</template>