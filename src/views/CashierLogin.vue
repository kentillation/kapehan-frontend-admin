<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="6">
                <v-container class="mx-auto pa-8 pb-8 mt-12" elevation="8">
                    <h1 class="text-center mb-5">Sign-in</h1>
                    <v-form @submit.prevent="login" ref="form">
                        <v-text-field v-model="email" :rules="[emailRule]" autocomplete="username" density="compact"
                            label="Email" prepend-inner-icon="mdi-email-outline" variant="underlined" class="mb-4"
                            required>
                        </v-text-field>

                        <v-text-field v-model="password" :rules="[passwordRule]" autocomplete="current-password"
                            density="compact" label="Password" prepend-inner-icon="mdi-lock-outline"
                            variant="underlined" :type="visible ? 'text' : 'password'"
                            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye-outline'"
                            @click:append-inner="visible = !visible" required>
                        </v-text-field>

                        <v-btn :disabled="!isFormValid || validating" color="white" type="submit" block
                            class="bg-purple-darken-4 mb-8 mt-5" size="large" variant="tonal" :loading="validating"
                            height="40" text="Validate" width="135" rounded>
                            Proceed
                        </v-btn>
                    </v-form>
                </v-container>
            </v-col>
        </v-row>

        <v-snackbar v-model="snackbar.visible" :color="snackbar.color" location="top" timeout="5000">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>

<script>
import apiClient from '../axios';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Login',
    data() {
        return {
            email: '',
            password: '',
            emailRule: (v) => !!v || 'Email is required',
            passwordRule: (v) => !!v || 'Password is required',
            validating: false,
            visible: false,
            snackbar: {
                visible: false,
                message: '',
                color: ''
            }
        };
    },
    computed: {
        isFormValid() {
            return this.email !== '' && this.password !== '';
        }
    },
    methods: {
        async login() {
            this.validating = true;
            try {
                if (this.$refs.form.validate()) {
                    const response = await apiClient.post('/login', {
                        email: this.email,
                        password: this.password,
                    });

                    if (response.status === 200) {
                        localStorage.setItem('auth_token', response.data.access_token);
                        this.$router.push('/dashboard');
                        this.showSnackbar('Login successful!', 'success');
                    }
                }
            } catch (error) {
                let message = 'An unknown error occurred.';
                let color = 'error';

                if (error.response) {
                    switch (error.response.status) {
                        case 422:
                            message = 'Invalid email address.';
                            break;
                        case 401:
                            message = 'Email or password is incorrect.';
                            break;
                        case 500:
                            message = 'Internal server error. Please try again later.';
                            break;
                        default:
                            message = `Error: ${error.response.status}`;
                    }
                } else if (error.request) {
                    message = 'No response from server.';
                } else {
                    message = 'Request error. Please try again!';
                }

                this.showSnackbar(message, color);
            } finally {
                this.validating = false;
            }
        },
        showSnackbar(message, color) {
            this.snackbar.message = message;
            this.snackbar.color = color;
            this.snackbar.visible = true;
        }
    },
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
