<template>
  <v-app dark>
    <div v-if="connectionStatus !== 'online'" class="connection-container">
      <div class="connection-banner" :class="connectionStatus">
        <v-icon left>
          {{ connectionStatusIcon }}
        </v-icon>
        <span>&nbsp;{{ connectionStatusText }}</span>
      </div>
    </div>
    <v-main>
      <v-app-bar v-if="showSidebar" prominent>
        <v-app-bar-nav-icon v-if="showMenu" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <h3>{{ authStore.shopName }}</h3>
        <v-spacer></v-spacer>
        <v-btn icon>
            <v-icon>mdi-bell-outline</v-icon>
          </v-btn>
        <v-btn @click="toSettings" icon>
          <v-icon>mdi-account-circle-outline</v-icon>
        </v-btn>
      </v-app-bar>
      <v-navigation-drawer class="h-screen pa-3" v-model="drawer" v-if="showSidebar">
        <v-list density="compact" nav>
          <v-list-subheader size="30">Menu</v-list-subheader>
          <v-list-item prepend-icon="mdi-home-outline" @click="toHome" class="bg-brown-darken-3 ps-3">Home</v-list-item>
          <v-list-item prepend-icon="mdi-plus" @click="toNewBranch" class="bg-brown-darken-3 ps-3">Create Branch</v-list-item>
          <v-list-item prepend-icon="mdi-account-cog-outline" @click="toSettings" class="bg-brown-darken-3 ps-3">Settings</v-list-item>
          <v-list-item prepend-icon="mdi-help-circle-outline" @click="toHelp" class="bg-brown-darken-3 ps-3">Help</v-list-item>

          <v-divider class="mt-4"></v-divider>

          <v-list-subheader size="30">Branch</v-list-subheader>
          <template v-if="branchStore.getBranchNames === null || branchStore.getBranchNames === undefined">
            <v-progress-circular indeterminate color="brown" class="ma-4"></v-progress-circular>
          </template>

          <template v-else>
            <v-list-item v-for="(branch, i) in branchStore.getBranchNames" :key="i" :title="`${branch[0]} Branch`"
              :prepend-icon="branch[1]" @click="navigateToBranch(branch[0])" class="bg-brown-darken-3 ps-3"/>
          </template>

          <template v-if="branchStore.getBranchNames && branchStore.getBranchNames.length === 0">
            <span class="text-grey bg-grey-darken-3 ps-3 pe-3 pa-1 ms-7 rounded" style="font-size: 14px;"><em>No branch
                available</em></span>
          </template>

          <v-divider class="mt-4"></v-divider>
          <v-list-item prepend-icon="mdi-power" v-if="showLogout" @click="authStore.logout"
            class="bg-brown-darken-3 ps-3 mt-2" >Signout</v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-layout>
        <router-view />
        <GlobalLoader />
      </v-layout>
    </v-main>
  </v-app>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useBranchStore } from '@/stores/branchStore';
import { useLoadingStore } from '@/stores/loading';
import GlobalLoader from '@/components/GlobalLoader.vue';

export default {
  name: 'App',
  components: {
    GlobalLoader,
  },
  setup() {
    const authStore = useAuthStore();
    const loadingStore = useLoadingStore();
    const branchStore = useBranchStore();
    const connectionStatus = ref('online');

    const updateStatus = () => {
      if (!navigator.onLine) {
        connectionStatus.value = 'offline';
      } else {
        connectionStatus.value = 'online';
      }
    };

    // Optional: Simulate slow/waiting (replace with real logic as needed)
    let waitingTimeout;
    const simulateWaiting = () => {
      connectionStatus.value = 'waiting';
      waitingTimeout = setTimeout(() => {
        connectionStatus.value = navigator.onLine ? 'online' : 'offline';
      }, 3000);
    };

    onMounted(() => {
      window.addEventListener('online', updateStatus);
      window.addEventListener('offline', updateStatus);

      // Example: simulate waiting for connection on mount
      simulateWaiting();

      // Optional: Check for slow connection using Network Information API
      if ('connection' in navigator) {
        navigator.connection.addEventListener('change', () => {
          if (navigator.connection.downlink < 1) {
            connectionStatus.value = 'slow';
          } else if (navigator.onLine) {
            connectionStatus.value = 'online';
          }
        });
      }
    });

    onBeforeUnmount(() => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      if (waitingTimeout) clearTimeout(waitingTimeout);
    });

    const connectionStatusText = computed(() => {
      switch (connectionStatus.value) {
        case 'offline':
          return 'No internet connection';
        case 'slow':
          return 'Low internet connection';
        case 'waiting':
          return 'Waiting for connection...';
        default:
          return '';
      }
    });

    const connectionStatusIcon = computed(() => {
      switch (connectionStatus.value) {
        case 'offline':
          return 'mdi-wifi-off';
        case 'slow':
          return 'mdi-wifi-alert';
        case 'waiting':
          return 'mdi-timer-sand';
        default:
          return '';
      }
    });

    return {
      authStore,
      branchStore,
      loadingStore,
      drawer: ref(true),
      open: ref(false),
      connectionStatus,
      connectionStatusText,
      connectionStatusIcon,
    };
  },
  computed: {
    showSidebar() {
      return this.$route.name !== 'LoginPage';
    },
    showLogout() {
      return this.$route.name !== 'LoginPage';
    },
    showMenu() {
      return this.$route.name !== 'LoginPage';
    },
    themeText() {
      return this.theme.global.name.value === 'light' ? 'Dark Mode' : 'Light Mode';
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler(newRoute) {
        if (this.authStore.isAuthenticated && newRoute.name !== 'LoginPage') {
          this.fetchBranches();
        }
      }
    }
  },
  methods: {
    async fetchBranches() {
      try {
        this.fetchingBranches = true;
        await this.branchStore.fetchAllBranch();
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    },
    toHome() {
      this.$router.push('/home');
    },
    toNewBranch() {
      this.$router.push('/new-branch');
    },
    toSettings() {
      this.$router.push('/settings');
    },
    toHelp() {
      this.$router.push('/help');
    },
    toAbout() {
      this.$router.push('/about');
    },
    navigateToBranch(branchName) {
      const encodedName = encodeURIComponent(branchName);
      this.$router.push({
        path: `/branch/${encodedName}`,
        query: { activeTab: 'home' }
      });
    },
  }
};
</script>
