<template>
    <v-container>
        <h1 class="text-brown-lighten-1">Create New Shop</h1>
        <v-row>
            <v-col cols="12" lg="6" md="6" sm="12">
                <v-card class="pa-5">
                    <v-card-text>
                        <v-form ref="newShopForm" @submit.prevent="showConfirmDialog">
                            <v-row>
                                <v-col cols="12" lg="6" md="6" sm="12">
                                    <v-text-field v-model="shop_name" label="Shop name"
                                        :rules="[v => !!v || 'Required']" variant="outlined" />
                                </v-col>
                                <v-col cols="12" lg="6" md="6" sm="12">
                                    <v-text-field v-model="shop_location" label="Shop location"
                                        :rules="[v => !!v || 'Required']" variant="outlined" />
                                </v-col>
                                <v-col cols="12" lg="6" md="6" sm="12">
                                    <v-text-field v-model="shop_m_name" label="Shop manager name"
                                        :rules="[v => !!v || 'Required']" variant="outlined" />
                                </v-col>
                                <v-col cols="12" lg="6" md="6" sm="12">
                                    <v-text-field v-model="shop_m_email" label="Shop manager email"
                                        :rules="[v => !!v || 'Required']" variant="outlined" />
                                </v-col>
                                <v-col cols="12" lg="6" md="6" sm="12">
                                    <v-text-field v-model="contact" label="Shop manager contact"
                                        :rules="[v => !!v || 'Required']" variant="outlined" />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" lg="6" md="6">
                                    <v-btn prepend-icon="mdi-check" color="primary" variant="tonal"
                                        :disabled="!isFormValid || validatingShop" @click="showConfirmDialog">
                                        Confirm
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="confirmDialog" max-width="500px" persistent>
            <v-card>
                <v-card-title>
                    <span class="headline">Confirmation</span>
                </v-card-title>
                <v-card-text>
                    <p class="text-center">Do you want to save new shop?</p>
                </v-card-text>
                <v-card-actions class="mx-4 my-4">
                    <v-spacer></v-spacer>
                    <v-btn class="px-3" color="red" variant="tonal" prepend-icon="mdi-close-circle"
                        :disabled="validatingShop" @click="closeConfirmDialog">Check
                        again</v-btn>
                    <v-btn class="px-3" color="success" variant="tonal" prepend-icon="mdi-content-save"
                        :disabled="validatingShop" @click="submitNewShop">
                        <v-progress-circular v-if="validatingShop" size="20" color="white" label="Loading..."
                            indeterminate />
                        <span v-else>Save</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <Snackbar ref="snackbarRef" />
    </v-container>
</template>

<script>
import { useShopStore } from '../stores/shopStore';
import Snackbar from '@/components/Snackbar.vue';
import { ref } from 'vue';

export default {
    name: 'NewShop',
    components: {
        Snackbar
    },
    setup() {
        const shopStore = useShopStore();
        const newShopForm = ref(null);
        const snackbarRef = ref(null);
        const tabCreate = ref('option-1')

        return {
            shopStore,
            newShopForm,
            snackbarRef,
            tabCreate,
        };
    },
    data() {
        return {
            shop_name: '',
            shop_location: '',
            shop_m_name: '',
            shop_m_email: '',
            contact: '',
            confirmDialog: false,
        }
    },
    computed: {
        isFormValid() {
            return this.shop_name !== '' &&
                this.shop_location !== '' &&
                this.shop_m_name !== '' &&
                this.shop_m_email !== '' &&
                this.contact !== '';
        },
        validatingShop() {
            return this.shopStore.validatingShop;
        }
    },
    methods: {
        showConfirmDialog() {
            if (this.isFormValid) this.confirmDialog = true;
        },
        closeConfirmDialog() {
            this.confirmDialog = false;
        },
        async submitNewShop() {
            try {
                if (!(await this.newShopForm.validate())) return;

                const payload = {
                    shop_name: this.shop_name,
                    shop_location: this.shop_location,
                    shop_m_name: this.shop_m_name,
                    shop_m_email: this.shop_m_email,
                    contact: this.contact,
                };

                const response = await this.shopStore.createShop(payload);
                if (response && response.message) {
                    this.confirmDialog = false;
                    this.snackbarRef.showSnackbar(response.message, 'success');
                    this.resetForm();
                } else {
                    throw new Error('Shop creation failed');
                }
            } catch (error) {
                console.error('Error creating shop:', error);
                this.snackbarRef.showSnackbar('New shop creation failed!', 'error');
                this.confirmDialog = false;
            }
        },
        resetForm() {
            this.shop_name = '-';
            this.shop_location = '-';
            this.shop_m_name = '-';
            this.shop_m_email = '-';
            this.contact = '-';
            if (this.newShopForm.resetValidation) {
                this.newShopForm.resetValidation();
            }
        },
    }
};
</script>

<style>
.custom-avatar-clone .v-list-item__prepend .v-avatar,
.custom-avatar-manual .v-list-item__prepend .v-avatar {
    width: 150px !important;
    height: 150px !important;
}
</style>