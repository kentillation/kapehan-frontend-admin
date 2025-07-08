<template>
  <v-app dark>
    <v-main>
      <v-app-bar v-if="showSidebar" prominent>
        <v-app-bar-nav-icon v-if="showMenu" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <h3>{{ authStore.shopName }}</h3>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon class="ms-5">mdi-account-circle-outline</v-icon>
        </v-btn>
        <v-btn v-if="showLogout" icon @click="authStore.logout" title="Signout">
          <v-icon>mdi-power</v-icon>
        </v-btn>
      </v-app-bar>
      <v-navigation-drawer class="h-screen pa-3" v-model="drawer" v-if="showSidebar">
        <v-list density="compact" nav>
          <v-list-subheader size="30">Menu</v-list-subheader>
          <v-list-item prepend-icon="mdi-home" @click="toHome" class="bg-brown-darken-3 ps-5"
            style="border-radius: 30px;">Home</v-list-item>
          <v-list-item prepend-icon="mdi-plus" @click="toNewBranch" class="bg-brown-darken-3 ps-5"
            style="border-radius: 30px;">Create
            Branch</v-list-item>
          <v-list-item prepend-icon="mdi-account-cog-outline" class="bg-brown-darken-3 ps-5"
            style="border-radius: 30px;">Settings</v-list-item>
          <v-list-item prepend-icon="mdi-theme-light-dark" @click="toggleTheme" class="bg-brown-darken-3 ps-5"
            style="border-radius: 30px;">Theme</v-list-item>
          <v-list-item prepend-icon="mdi-help-circle-outline" @click="toHelp" class="bg-brown-darken-3 ps-5"
            style="border-radius: 30px;">Help</v-list-item>

          <v-divider class="mt-4"></v-divider>

          <v-list-subheader size="30">Branch</v-list-subheader>
          <!-- Display loader while branches are being fetched -->
          <template v-if="branchStore.getBranchNames === null || branchStore.getBranchNames === undefined">
            <v-progress-circular indeterminate color="brown" class="ma-4"></v-progress-circular>
          </template>

          <!-- Display branches when available -->
          <template v-else>
            <v-list-item v-for="(branch, i) in branchStore.getBranchNames" :key="i" :title="branch[0]"
              :prepend-icon="branch[1]" @click="navigateToBranch(branch[0])" class="bg-brown-darken-3 ps-5"
              style="border-radius: 30px;" />
          </template>

          <!-- If no branches after fetch -->
          <template v-if="branchStore.getBranchNames && branchStore.getBranchNames.length === 0">
            <span class="text-grey bg-grey-darken-3 ps-3 pe-3 pa-1 ms-7 rounded" style="font-size: 14px;"><em>No branch available</em></span>
          </template>

          <v-divider class="mt-4"></v-divider>
          <v-list-item prepend-icon="mdi-logout" v-if="showLogout" @click="authStore.logout"
            class="bg-brown-darken-3 ps-5 mt-2" style="border-radius: 30px;">Signout</v-list-item>
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
import { useTheme } from 'vuetify';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useBranchStore } from '@/stores/branchStore';
import GlobalLoader from '@/components/GlobalLoader.vue';

export default {
  name: 'App',
  components: {
    GlobalLoader,
  },
  setup() {
    const theme = useTheme();
    const authStore = useAuthStore();
    const branchStore = useBranchStore();

    const toggleTheme = () => {
      const newTheme = theme.global.name.value === 'light' ? 'dark' : 'light';
      theme.global.name.value = newTheme;
      localStorage.setItem('theme', newTheme);
    };

    return {
      theme,
      toggleTheme,
      authStore,
      branchStore,
      drawer: ref(true),
      open: ref(false),
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
  mounted() {
    this.fetchBranches();
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

<style scoped>
::v-deep(.hover-table .v-data-table__tr) {
  background-color: rgba(159, 164, 165, 0);
  transition: background-color 0.5s ease-in-out;
  cursor: pointer;
}

::v-deep(.hover-table .v-data-table__tr:hover) {
  animation: backgroundFade 2s infinite;
}

@keyframes backgroundFade {
  0% {
    background-color: rgba(224, 247, 250, 0);
  }

  50% {
    background-color: rgba(117, 62, 62, 0.442);
  }

  100% {
    background-color: rgba(224, 247, 250, 0);
  }
}
</style>
