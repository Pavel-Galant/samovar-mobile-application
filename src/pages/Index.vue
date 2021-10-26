<template>
  <q-page >
    <q-toolbar class="bg-amber-7 text-white shadow-2">
      <q-space />
      <q-tabs v-model="tab" shrink stretch>
        <q-tab name="hotZone" label="Hot Zone" />
        <q-tab name="coldZone" label="Cold Zone" />
        <q-tab name="other" label="Other" />
      </q-tabs>
      <q-space />
    </q-toolbar>
    <q-tab-panels v-model="tab" animated class="w100 h100">
      <q-tab-panel name="hotZone" class="flex flex-center">
        <div class="text-h6">Temperature &#8451; (hot zone)</div>
        <v-chart autoresize class="chart" :option="temperatureHotOption" />
      </q-tab-panel>

      <q-tab-panel name="coldZone" class="flex flex-center">
        <div class="text-h6">Temperature &#8451; (cold zone)</div>
        <v-chart autoresize class="chart" :option="temperatureColdOption" />
      </q-tab-panel>

      <q-tab-panel name="other">
        <div class="text-h6 text-center">Other</div>
        <div class="row">
          <div class="col-12">
            <span class="text-subtitle2 text-weight-medium">Current voltage:</span> <span class="text-subtitle2 text-primary">{{ currentVoltage }} V</span>
          </div>
          <div class="col-12">
            <span class="text-subtitle2 text-weight-medium">Target voltage:</span> <span class="text-subtitle2 text-primary">{{ targetVoltage }} V</span>
          </div>
          <div class="col-12">
            <span class="text-subtitle2 text-weight-medium">Current power:</span> <span class="text-subtitle2 text-primary">{{ currentPower }} W</span>
          </div>
          <div class="col-12">
            <span class="text-subtitle2 text-weight-medium">Current pressure:</span> <span class="text-subtitle2 text-primary">{{ currentPressure }} mmHg</span>
          </div>
          <div class="col-12">
            <span class="text-subtitle2 text-weight-medium">Initial pressure:</span> <span class="text-subtitle2 text-primary">{{ initialPressure }} mmHg</span>
          </div>
          <div class="col-12">
            <span class="text-subtitle2 text-weight-medium">Current speed:</span> <span class="text-subtitle2 text-primary">{{ currentSpeed }} steps/s</span>
          </div>
          <div class="col-12">
            <span class="text-subtitle2 text-weight-medium">Current steps:</span> <span class="text-subtitle2 text-primary">{{ currentSteps }} steps</span>
          </div>
          <div class="col-12">
            <span class="text-subtitle2 text-weight-medium">Target steps:</span> <span class="text-subtitle2 text-primary">{{ targetSteps }} steps</span>
          </div>
          <div class="col-12">
            <span class="text-subtitle2 text-weight-medium">Current volume:</span> <span class="text-subtitle2 text-primary">{{ currentVolume }} ml</span>
          </div>
          <div class="col-12">
            <span class="text-subtitle2 text-weight-medium">Current volume speed:</span> <span class="text-subtitle2 text-primary">{{ currentVolumeSpeed }} L/hour</span>
          </div>
          <div class="col-12">
            <span class="text-subtitle2 text-weight-medium">Volume progress:</span> <span class="text-subtitle2 text-primary">{{ volumePercentProgress }} %</span>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import {computed, defineComponent, ref} from 'vue';
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { GaugeChart } from "echarts/charts";
import VChart from "vue-echarts";
import { useStore } from 'vuex';
import { tools } from "boot/tools";

use([CanvasRenderer, GaugeChart]);

export default defineComponent({
  name: 'PageIndex',
  components: {
    VChart
  },

  setup() {
    const $store = useStore();
    const tab = ref('hotZone');
    const temperatureHotOption = computed({
      get: () => $store.state.device.temperatureHotOption,
    })
    const temperatureColdOption = computed({
      get: () => $store.state.device.temperatureColdOption,
    })
    const currentVoltage = computed({
      get: () => Math.round(Number($store.state.device.data.current_power_volt)),
    })
    const targetVoltage = computed({
      get: () => Math.round(Number($store.state.device.data.target_power_volt)),
    })
    const currentPower = computed({
      get: () => Math.round(Number($store.state.device.data.current_power_p)),
    })
    //  начальное давление
    const initialPressure = computed({
      get: () => tools.math.truncate2dec(Number($store.state.device.data.start_pressure)),
    })
    //  текущее давление
    const currentPressure = computed({
      get: () => tools.math.truncate2dec(Number($store.state.device.data.bme_pressure)),
    })
    // текущая скорость шагового двигателя шагов/сек
    const currentSpeed = computed({
      get: () => Math.round(Number($store.state.device.data.CurrrentSpeed)),
    })
    // кол-во сделанных шагов
    const currentSteps = computed({
      get: () => Math.round(Number($store.state.device.data.CurrrentStepps)),
    })
    // кол-во шагов до окончания текущей строки программы
    const targetSteps = computed({
      get: () => Math.round(Number($store.state.device.data.TargetStepps)),
    })
    // Отобранный объем в мл
    const currentVolume = computed({
      get: () => Math.round(Number($store.state.device.data.VolumeAll)),
    })
    // Скорость отбора в л
    const currentVolumeSpeed = computed({
      get: () => tools.math.truncate3dec(Number($store.state.device.data.ActualVolumePerHour)),
    })
    // отобрано в процентах
    const volumePercentProgress = computed({
      get: () => Math.round(Number($store.state.device.data.WthdrwlProgress)),
    })

    return {
      temperatureHotOption,
      temperatureColdOption,
      tab,
      currentVoltage,
      targetVoltage,
      currentPower,
      initialPressure,
      currentPressure,
      currentSpeed,
      currentSteps,
      targetSteps,
      currentVolume,
      currentVolumeSpeed,
      volumePercentProgress,
    };
  }
})
</script>
<style scoped>
.chart {
  height: 70vh;
}
.h100 {
  height: 100%;
}
.w100 {
  width: 100%;
}
</style>
