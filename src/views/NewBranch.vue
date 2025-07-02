<template>
    <v-container>
        <h1 class="text-brown-lighten-1">Create New Branch</h1>
        <v-row>
            <v-col cols="12" lg="6" md="6" sm="12">
                <v-card class="pa-5">
                    <v-card-text>
                        <v-form ref="newBranchForm" @submit.prevent="showConfirmDialog">
                            <v-row>
                                <v-col cols="12" lg="6" md="6" sm="12">
                                    <v-text-field v-model="branch_name" label="Branch name"
                                        :rules="[v => !!v || 'Required']" variant="outlined" />
                                </v-col>
                                <v-col cols="12" lg="6" md="6" sm="12">
                                    <v-text-field v-model="branch_location" label="Branch location"
                                        :rules="[v => !!v || 'Required']" variant="outlined" />
                                </v-col>
                                <v-col cols="12" lg="6" md="6" sm="12">
                                    <v-text-field v-model="m_name" label="Branch manager name"
                                        :rules="[v => !!v || 'Required']" variant="outlined" />
                                </v-col>
                                <v-col cols="12" lg="6" md="6" sm="12">
                                    <v-text-field v-model="m_email" label="Branch manager email"
                                        :rules="[v => !!v || 'Required']" variant="outlined" />
                                </v-col>
                                <v-col cols="12" lg="6" md="6" sm="12">
                                    <v-text-field v-model="contact" label="Branch manager contact"
                                        :rules="[v => !!v || 'Required']" variant="outlined" />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" lg="6" md="6">
                                    <v-btn prepend-icon="mdi-check" color="green" variant="tonal"
                                        :disabled="!isFormValid || validatingBranch" @click="showConfirmDialog">
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
                    <p class="text-center">Do you want to save new branch?</p>
                </v-card-text>
                <v-card-actions class="mx-4 my-4">
                    <v-spacer></v-spacer>
                    <v-btn class="px-3" color="red" variant="tonal" prepend-icon="mdi-close-circle"
                        :disabled="validatingBranch" @click="closeConfirmDialog">Check
                        again</v-btn>
                    <v-btn class="px-3" color="success" variant="tonal" prepend-icon="mdi-content-save"
                        :disabled="validatingBranch" @click="submitNewBranch">
                        <v-progress-circular v-if="validatingBranch" size="20" color="white" label="Loading..."
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
import { useBranchStore } from '../stores/branchStore';
import Snackbar from '@/components/Snackbar.vue';
import { ref } from 'vue';

export default {
    name: 'NewBranchView',
    components: {
        Snackbar
    },
    setup() {
        const branchStore = useBranchStore();
        const newBranchForm = ref(null);
        const snackbarRef = ref(null);
        const tabCreate = ref('option-1')

        return {
            branchStore,
            newBranchForm,
            snackbarRef,
            tabCreate,
        };
    },
    data() {
        return {
            branch_name: '',
            branch_location: '',
            m_name: '',
            m_email: '',
            contact: '',
            confirmDialog: false,
        }
    },
    computed: {
        isFormValid() {
            return this.branch_name !== '' &&
                this.branch_location !== '' &&
                this.m_name !== '' &&
                this.m_email !== '' &&
                this.contact !== '';
        },
        validatingBranch() {
            return this.branchStore.validatingBranch;
        }
    },
    methods: {
        addClone() {

        },
        addManual() {

        },
        showConfirmDialog() {
            if (this.isFormValid) this.confirmDialog = true;
        },
        closeConfirmDialog() {
            this.confirmDialog = false;
        },
        async submitNewBranch() {
            try {
                if (!(await this.newBranchForm.validate())) return;

                const payload = {
                    branch_name: this.branch_name,
                    branch_location: this.branch_location,
                    m_name: this.m_name,
                    m_email: this.m_email,
                    contact: this.contact,
                };

                const response = await this.branchStore.createBranch(payload);
                if (response && response.message) {
                    this.confirmDialog = false;
                    this.snackbarRef.showSnackbar(response.message, 'success');
                    this.resetForm();
                } else {
                    throw new Error('Branch creation failed');
                }
            } catch (error) {
                console.error('Error creating branch:', error);
                this.snackbarRef.showSnackbar('New branch creation failed!', 'error');
                this.confirmDialog = false;
            }
        },
        resetForm() {
            this.branch_name = '-';
            this.branch_location = '-';
            this.m_name = '-';
            this.m_email = '-';
            this.contact = '-';
            if (this.newBranchForm.resetValidation) {
                this.newBranchForm.resetValidation();
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