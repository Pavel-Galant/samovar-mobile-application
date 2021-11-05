<template>
  <q-page >
    <q-toolbar class="bg-amber-7 text-white shadow-2">
      <q-space />
      <q-tabs v-model="tab" shrink stretch>
        <q-tab name="temperature" label="T &#8451;" />
        <q-tab name="data" label="Data" />
        <q-tab name="triggers" label="Triggers" />
      </q-tabs>
      <q-space />
    </q-toolbar>
    <q-tab-panels v-model="tab" animated class="w100 h100">
      <q-tab-panel name="temperature" class="flex flex-center pl-6px pr-6px">
        <q-card class="w100">
          <q-tab-panels v-model="temperatureTab" animated class="w100 h100">
            <q-tab-panel name="hotZone" class="flex flex-center">
              <div class="text-h6">Temperature &#8451; (hot zone)</div>
              <v-chart autoresize class="chart" :option="temperatureHotOption" />
            </q-tab-panel>

            <q-tab-panel name="coldZone" class="flex flex-center">
              <div class="text-h6">Temperature &#8451; (cold zone)</div>
              <v-chart autoresize class="chart" :option="temperatureColdOption" />
            </q-tab-panel>
          </q-tab-panels>
          <q-separator />
          <q-tabs
            v-model="temperatureTab"
            dense
            class="bg-grey-3"
            align="justify"
            narrow-indicator
          >
            <q-tab name="hotZone" label="Hot Zone" />
            <q-tab name="coldZone" label="Cold Zone" />
          </q-tabs>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="data">
        <div class="text-h6 text-center">Data</div>
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

      <q-tab-panel name="triggers">
        <div class="row q-mb-sm">
          <q-space />
          <q-btn label="Add trigger" color="secondary" @click="showAddTriggerDialog = true" />
        </div>
        <q-list bordered v-if="!isEmptyTriggers">
          <q-item tag="label" v-ripple v-for="(item, idx) in triggers" :key="idx">
            <q-item-section avatar>
              <q-toggle color="blue" :model-value="item.active" @update:model-value="changeTriggerStatus(idx)" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.trigger.label }} {{ item.operator }} {{ item.value }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn size="16px" flat dense round icon="delete" @click="removeTrigger(idx)" />
            </q-item-section>
          </q-item>
        </q-list>
        <q-dialog
          v-model="showAddTriggerDialog"
          persistent
          :maximized="true"
          transition-show="flip-up"
          transition-hide="flip-down"
        >
          <q-card>
            <q-bar>
              <q-space />
              <q-btn dense flat icon="close" v-close-popup>
                <q-tooltip class="bg-white text-primary">Close</q-tooltip>
              </q-btn>
            </q-bar>

            <q-form
              ref="addTriggerForm"
              @submit="addNewTrigger"
            >
              <q-card-section>
                <q-select outlined v-model="newTrigger.trigger" :options="triggerList" label="Sensor or parameter" />
              </q-card-section>
              <q-card-section>
                <q-select outlined v-model="newTrigger.operator" :options="['>', '=', '<']" label="Operator" />
              </q-card-section>
              <q-card-section>
                <q-input
                  outlined
                  type="number"
                  v-model.number="newTrigger.value"
                  label="Value"
                  :rules="[
                    val => val !== null && val !== '' || 'Please type number value',
                    val => val > 0 && val < 800 || 'Please type a real value'
                  ]"
                />
              </q-card-section>
              <q-card-section>
                <q-toggle v-model="newTrigger.active" label="Active trigger" />
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn flat label="Add trigger" type="submit" color="primary" />
              </q-card-actions>
            </q-form>
          </q-card>
        </q-dialog>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import { computed, defineComponent, ref, toRaw } from 'vue';
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { GaugeChart } from "echarts/charts";
import VChart from "vue-echarts";
import { useStore } from 'vuex';
import { Plugins } from 'app/src-capacitor/node_modules/@capacitor/core';
const { Storage } = Plugins;
import { tools } from "boot/tools";

use([CanvasRenderer, GaugeChart]);

export default defineComponent({
  name: 'PageIndex',
  components: {
    VChart
  },

  setup() {
    const $store = useStore();
    const tab = ref('temperature');
    const temperatureTab = ref('hotZone');
    const newTrigger = ref({
      trigger: $store.state.global.triggerList[0],
      operator: '>',
      value: 66,
      active: true,
      action: 'notify',
    });

    const showAddTriggerDialog = ref(false);

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
    const triggerList = computed({
      get: () => $store.state.global.triggerList,
    })
    const triggers = computed({
      get: () => $store.state.global.triggers,
    })
    const isEmptyTriggers = computed({
      get: () => $store.state.global.triggers.length === 0,
    })
    return {
      temperatureHotOption,
      temperatureColdOption,
      tab,
      temperatureTab,
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
      triggerList,
      newTrigger,
      showAddTriggerDialog,
      triggers,
      isEmptyTriggers,
      async addNewTrigger () {
        $store.commit('global/addTrigger', JSON.parse(JSON.stringify(newTrigger.value)));
        await Storage.set({
          key: 'triggers',
          value: JSON.stringify($store.state.global.triggers),
        });
        showAddTriggerDialog.value = false;
      },
      async removeTrigger (idx) {
        $store.commit('global/removeTrigger', idx);
        await Storage.set({
          key: 'triggers',
          value: JSON.stringify($store.state.global.triggers),
        });
      },
      async changeTriggerStatus (idx) {
        $store.commit('global/toggleTriggerState', idx)
        await Storage.set({
          key: 'triggers',
          value: JSON.stringify($store.state.global.triggers),
        });
      }
    };
  }
})
</script>
<style scoped>
.chart {
  height: 55vh;
}
.h100 {
  height: 100%;
}
.w100 {
  width: 100%;
}

.pl-6px {
  padding-left: 6px;
}

.pr-6px {
  padding-right: 6px;
}
</style>
