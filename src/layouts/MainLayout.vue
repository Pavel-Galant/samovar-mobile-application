<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar :class="toolBarClass">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Samovar ({{ powerStatus }})
        </q-toolbar-title>

        <div>v. {{ version }} <span class="text-warning"><strong>{{ stm }}</strong></span></div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Samovar mobile (ver.{{ appVersion }})
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Home',
    caption: 'Dashboard',
    icon: 'dashboard',
    link: '/',
    external: false,
  },
  {
    title: 'Settings',
    caption: 'Application, device settings',
    icon: 'settings',
    link: '/settings',
    external: false,
  },
  {
    title: 'Project site',
    caption: 'https://www.samovar-tool.ru',
    icon: 'home',
    link: 'https://www.samovar-tool.ru',
    external: true,
  },
  {
    title: 'Forum',
    caption: 'https://alcodistillers.ru',
    icon: 'record_voice_over',
    link: 'https://alcodistillers.ru/forum/viewtopic.php?id=1812',
    external: true,
  },
  {
    title: 'Samovar repository',
    caption: 'github.com',
    icon: 'code',
    link: 'https://github.com/LKosoj/Samovar',
    external: true,
  },
];

import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false);
    const $store = useStore();

    const powerStatus = computed({
      get: () => Number($store.state.device.data.PowerOn) === 1 ? 'On' : 'Off',
    })

    const stm = computed({
      get: () => $store.state.device.data.stm === null ? '' : ` | ${$store.state.device.data.stm}`,
    })

    const version = computed({
      get: () => $store.state.device.data.version,
    })

    const toolBarClass = computed({
      get: () => $store.state.global.isNotConnectedCount === 0 ? 'bg-primary' : 'bg-negative',
    })

    const appVersion = computed({
      get: () => $store.state.global.version,
    })

    return {
      powerStatus,
      stm,
      version,
      appVersion,
      toolBarClass,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
