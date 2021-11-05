<template>
  <router-view />
</template>
<script>
import {defineComponent, onMounted, onUnmounted, watch} from 'vue';
import { api } from 'boot/axios';
import { sound } from 'boot/sound';
import { useStore } from 'vuex';
import { Plugins } from 'app/src-capacitor/node_modules/@capacitor/core';
const { Storage } = Plugins;
import { useSound } from '@vueuse/sound';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'App',

  setup () {
    const $q = useQuasar();
    const $store = useStore();
    let timerId;
    const { play } = useSound(sound['drums'], {
      sprite: {
        kick: [0, 350],
        hihat: [374, 160],
        snare: [666, 290],
        cowbell: [968, 200],
      },
    });

    onMounted(async () => {
      console.log('Компонент примонтирован!');
      api.defaults.baseURL = (await Storage.get({ key: 'baseUrl' })).value ?? api.defaults.baseURL;
      $store.commit('settings/updateApplicationSettings', {
        baseUrl: (await Storage.get({ key: 'baseUrl' })).value,
      });
      const { value }  = await Storage.get({ key: 'triggers' });
      const triggers = value ? JSON.parse(value) : [];
      $store.commit('global/setTriggers', triggers);
      timerId = setInterval(async () => {
        console.log((new Date()).toLocaleTimeString())
        try {
          const data = (await api.get('/ajax')).data;
          $store.commit('device/updateDeviceState', data);
          $store.commit('global/isNotConnectedCount', 0);
          // triggers checking
          $store.state.global.triggers.forEach((item, idx) => {
            if (item.active) {
              // get sensor value
              const sensorValue = Number(data[item.trigger.value]);
              let triggered = false;
              switch(item.operator) {
                case '>':
                  if (sensorValue > Number(item.value)) {
                    triggered = true;
                  }
                  break;
                case '<':
                  if (sensorValue < Number(item.value)) {
                    triggered = true;
                  }
                  break;
                case '=':
                  if (sensorValue === Number(item.value)) {
                    triggered = true;
                  }
                  break;
              }
              if (triggered) {
                play({ id: 'cowbell' });
                $store.commit('global/toggleTriggerState', idx);
                Storage.set({
                  key: 'triggers',
                  value: JSON.stringify($store.state.global.triggers),
                });
                $q.notify({
                  type: 'warning',
                  timeout: 5000,
                  position: 'top',
                  message: `${item.trigger.label} ${item.operator} ${item.value} triggered!`
                });
              }
            }
          });
        } catch (e) {
          $store.commit('global/isNotConnectedCount', $store.state.global.isNotConnectedCount + 1);
        }
      }, 2000);
    });
    onUnmounted(() => {
      console.log('Компонент  отмонтирован!');
      clearInterval(timerId);
    });
    watch(() => $store.state.global.isNotConnectedCount, (current, old) => {
      console.log(current);
      if (current > 0 && current % 10 === 0) {
        play({
          id: 'hihat'
        });
      }
    });

    return [
      play
    ]
  }
})
</script>
