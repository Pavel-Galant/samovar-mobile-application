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


export default defineComponent({
  name: 'App',

  setup () {
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
      timerId = setInterval(async () => {
        console.log((new Date()).toLocaleTimeString())
        try {
          const data = (await api.get('/ajax')).data;
          $store.commit('device/updateDeviceState', data);
          $store.commit('global/isNotConnectedCount', 0);
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
