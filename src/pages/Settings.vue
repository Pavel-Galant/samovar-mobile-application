<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <div class="q-gutter-y-md" style="max-width: 650px">
        <q-option-group
          v-model="tab"
          inline
          :options="[
            { label: 'Application', value: 'app' },
            { label: 'Device', value: 'device' },
          ]"
        />

        <q-tab-panels v-model="tab" animated class="shadow-2 rounded-borders">
          <q-tab-panel name="app">
            <div class="text-h6">Application settings</div>
            <q-form
              @submit="onSubmitAppSettings"
              @reset="onResetAppSettings"
              class="q-gutter-md"
            >
              <q-input
                filled
                v-model="settings.application.baseUrl"
                label="Samovar URL"
                hint="Enter device url"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type something']"
              />
              <div>
                <q-btn label="Submit" type="submit" color="primary"/>
                <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
              </div>
            </q-form>
          </q-tab-panel>

          <q-tab-panel name="device">
            <div class="text-h6">Device settings</div>

          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { api } from 'boot/axios';
import { Plugins } from 'app/src-capacitor/node_modules/@capacitor/core';
const { Storage } = Plugins;

export default defineComponent({
  name: 'PageSettings',
  setup() {
    const $store = useStore();
    const tab = ref('app');
    const settings = ref({
      application: {
        baseUrl: $store.state.settings.application.baseUrl,
      }
    });

    onMounted(() => {
      settings.value.application.baseUrl = $store.state.settings.application.baseUrl;
    });

    async function onSubmitAppSettings () {
      //console.log(settings.value.application.url);
      $store.commit('settings/updateApplicationSettings', {
        baseUrl: settings.value.application.baseUrl,
      });
      await Storage.set({
        key: 'baseUrl',
        value: settings.value.application.baseUrl,
      });
      api.defaults.baseURL = settings.value.application.baseUrl;
    }

    function onResetAppSettings () {
      settings.value.application.baseUrl = $store.state.settings.application.baseUrl;
    }
    return {
      tab,
      settings,
      onSubmitAppSettings,
      onResetAppSettings,
    }
  }
})
</script>
