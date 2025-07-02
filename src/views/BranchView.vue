<template>
    <v-container class="px-4">
        <h1 class="text-brown-lighten-2">{{ branchDetails.branch_name || branchName }} Branch</h1>

        <template v-if="branchDetails.branch_name">
            <v-card>
                <v-tabs v-model="activeTab" class="mt-5" align-tabs="center" color="white" show-arrows>
                    <v-tab v-for="tab in tabs" :key="tab.value" class="rounded" :value="tab.value"
                        :class="{ 'active-tab': activeTab === tab.value }"
                        @click="tab.clickHandler ? tab.clickHandler() : null">
                        {{ tab.label }}
                    </v-tab>
                </v-tabs>
                <v-tabs-window v-model="activeTab">
                    <transition name="slide-x-transition" mode="out-in">
                        <div :key="activeTab">
                            <!-- Dashboard -->
                            <v-tabs-window-item value="dashboard">
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" lg="3" md="6" sm="12">
                                            <v-card>
                                                <v-card-text>
                                                    <v-row>
                                                        <v-col cols="6" class="bg-brown-lighten-4 ma-0 rounded">
                                                            <div class="d-flex justify-center">
                                                                <v-icon class="text-brown-darken-1" size="100">mdi-account-cash</v-icon>
                                                            </div>
                                                            
                                                        </v-col>
                                                        <v-col cols="6">
                                                            <div class="d-flex flex-column">
                                                                <h3 class="text-brown-lighten-2 ms-3">Sales</h3>
                                                                <h1 class="ms-3 mt-2">2,315</h1>
                                                                <div class="d-flex justify-end">
                                                                    <h4 class="bg-brown-darken-1 pa-2 mt-3 rounded"
                                                                        style="cursor: pointer;" @click="switchToSalesTab()">
                                                                        View</h4>
                                                                </div>
                                                            </div>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>

                                        <v-col cols="12" lg="3" md="6" sm="12">
                                            <v-card>
                                                <v-card-text>
                                                    <v-row>
                                                        <v-col cols="6" class="bg-brown-lighten-4 ma-0 rounded">
                                                            <div class="d-flex justify-center">
                                                                <v-icon class="text-brown-darken-1" size="100">mdi-invoice-text-outline</v-icon>
                                                            </div>
                                                        </v-col>
                                                        <v-col cols="6">
                                                            <div class="d-flex align-items-center flex-column">
                                                                <h3 class="text-brown-lighten-2 ms-3">Orders</h3>
                                                                <h1 class="ms-3 mt-2">1,665</h1>
                                                                <div class="d-flex justify-end">
                                                                    <h4 class="bg-brown-darken-1 pa-2 mt-3 rounded"
                                                                        style="cursor: pointer;" @click="switchToOrdersTab()">
                                                                        View</h4>
                                                                </div>
                                                            </div>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>

                                        <v-col cols="12" lg="3" md="6" sm="12">
                                            <v-card>
                                                <v-card-text>
                                                    <v-row>
                                                        <v-col cols="6" class="bg-brown-lighten-4 ma-0 rounded">
                                                            <div class="d-flex justify-center">
                                                                <v-icon class="text-brown-darken-1" size="100">mdi-food-outline</v-icon>
                                                            </div>
                                                        </v-col>
                                                        <v-col cols="6">
                                                            <div class="d-flex align-items-center flex-column">
                                                                <h3 class="text-brown-lighten-2 ms-3">Products</h3>
                                                                <h1 class="ms-3 mt-2">356</h1>
                                                                <div class="d-flex justify-end">
                                                                    <h4 class="bg-brown-darken-1 pa-2 mt-3 rounded"
                                                                        style="cursor: pointer;" @click="switchToProductsTab()">
                                                                        View</h4>
                                                                </div>
                                                            </div>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>

                                        <v-col cols="12" lg="3" md="6" sm="12">
                                            <v-card>
                                                <v-card-text>
                                                    <v-row>
                                                        <v-col cols="6" class="bg-brown-lighten-4 ma-0 rounded">
                                                            <div class="d-flex justify-center">
                                                                <v-icon class="text-brown-darken-1" size="100">mdi-archive-outline</v-icon>
                                                            </div>
                                                        </v-col>
                                                        <v-col cols="6">
                                                            <div class="d-flex align-items-center flex-column">
                                                                <h3 class="text-brown-lighten-2 ms-3">Stocks</h3>
                                                                <h1 class="ms-3 mt-2">1,112</h1>
                                                                <div class="d-flex justify-end">
                                                                    <h4 class="bg-brown-darken-1 pa-2 mt-3 rounded"
                                                                        style="cursor: pointer;" type="button"
                                                                        @click="switchToStocksTab()">View</h4>
                                                                </div>
                                                            </div>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-tabs-window-item>

                            <!-- Products -->
                            <v-tabs-window-item value="products">
                                <v-container>
                                    <ProductsTableSkeleton v-if="loadingProducts" />
                                    <ProductsTable v-else @refresh="onRefreshProducts" @edit-product="editProductDialog"
                                        @view-ingredients="ingredientsDialog" :products="products" :loading="loadingProducts"
                                        :shop-id="branchDetails.shop_id" :branch-id="branchDetails.branch_id"
                                        :branch-name="branchDetails.branch_name" />
                                    <ProductEditDialog v-model="productEditDialog"
                                        @update:modelValue="productEditDialog = $event"
                                        @update:product="currentProduct = $event"
                                        @update:confirm="confirmUpdatingProductDialog = $event" :product="currentProduct"
                                        @save="updatingProduct" :valid="formValid" :loading="isSaving"
                                        :confirm="confirmUpdatingProductDialog"
                                        :selected-product="currentProduct?.product_name || ''" />
                                    <ProductIngredientsDialog v-model="dialogIngredients" :product-ingredients="ingredients"
                                        :loading="loadingIngredient" @edit-ingredient="editIngredientDialog"
                                        :shop-id="branchDetails.shop_id" :branch-id="branchDetails.branch_id"
                                        :branch-name="branchDetails.branch_name" :product-id="productId"
                                        :product-name="productName" :product-temp="productTemp" :product-size="productSize" />
                                    <IngredientEditDialog v-model="ingredientEditDialog"
                                        @update:modelValue="ingredientEditDialog = $event"
                                        @update:ingredient="currentIngredient = $event"
                                        @update:confirm="confirmUpdatingIngredientDialog = $event"
                                        :ingredient="currentIngredient" @save="updatingIngredient" :valid="formValid"
                                        :loading="isSaving" :confirm="confirmUpdatingIngredientDialog" />
                                    <!-- :selected-ingredient="currentIngredient?.product_name || ''" -->
                                    <ProductsHistoryDialog v-model="productsHistoryDialog"
                                        :branch-id="branchDetails.branch_id" />
                                    <v-btn @click="openProductHistory" prepend-icon="mdi-history" color="gray" class="mt-3"
                                        variant="tonal">
                                        <span class="to-hide">Products History</span>
                                        <span class="to-show">History</span>
                                    </v-btn>
                                </v-container>
                            </v-tabs-window-item>

                            <!-- Stocks -->
                            <v-tabs-window-item value="stocks">
                                <v-container>
                                    <StocksTableSkeleton v-if="loadingStocks" />
                                    <StocksTable v-else :stocks="stocks" @refresh="onRefreshStocks"
                                        @edit-stock="openEditStockDialog" :branch-id="branchDetails.branch_id"
                                        :branch-name="branchDetails.branch_name" :shop-id="branchDetails.shop_id"
                                        :loading="loadingStocks" />
                                    <StockEditDialog v-model="stockEditDialog" @update:modelValue="stockEditDialog = $event"
                                        @update:stock="currentStock = $event"
                                        @update:confirm="confirmUpdatingStockDialog = $event" :stock="currentStock"
                                        @save="updatingStock" :valid="formValid" :loading="isSaving"
                                        :confirm="confirmUpdatingStockDialog"
                                        :selected-stock="currentStock?.stock_ingredient || ''"
                                        :availability-stock-options="availabilityOptions" />

                                    <StocksHistoryDialog v-model="stockHistoryDialog" :branch-id="branchDetails.branch_id" />
                                    <v-btn @click="openStockHistory" prepend-icon="mdi-history" color="gray" class="mt-3"
                                        variant="tonal">
                                        <span class="to-hide">Stocks History</span>
                                        <span class="to-show">History</span>
                                    </v-btn>
                                </v-container>
                            </v-tabs-window-item>

                            <!-- Branch Info -->
                            <v-tabs-window-item value="branch_info">
                                <v-container>
                                    <div class="d-flex flex-column" v-for="(detail, i) in branchDetailItems" :key="i" cols="12"
                                        lg="3" md="4" sm="6" xs="12">
                                        <p class="text-grey-darken-1">{{ detail.label }}</p>
                                        <h4 class="mb-5">{{ detail.value }}</h4>
                                    </div>
                                </v-container>
                            </v-tabs-window-item>

                            <!-- Reports -->
                            <v-tabs-window-item value="reports">
                                <v-container>
                                    <v-tabs v-model="activeReportsTab" class="bg-brown-lighten-2 d-flex px-4 rounded" align-tabs="left" color="white"
                                        stacked>
                                        <v-tab v-for="tab in reportsTabs" :key="tab.value" class="rounded mt-4 mx-2" :value="tab.value"
                                            :class="{ 'active-tab': activeReportsTab === tab.value }"
                                            @click="tab.clickHandler ? tab.clickHandler() : null">
                                            {{ tab.label }}
                                        </v-tab>
                                    </v-tabs>
                                    <transition name="slide-x-transition" mode="out-in">
                                        <div :key="activeReportsTab">
                                            <SalesReportsTableSkeleton
                                                v-if="loadingTransactionOrdersReports && activeReportsTab === 'sales'" />
                                            <SalesReportTable v-else-if="activeReportsTab === 'sales'"
                                                :sales-data="transactStore.salesData" :loading="loadingTransactionOrdersReports"
                                                @refresh="fetchSalesReport" :shop-id="branchDetails.shop_id"
                                                :shop-name="branchDetails.shop_name" :branch-id="branchDetails.branch_id"
                                                :branch-name="branchDetails.branch_name"
                                                :branch-location="branchDetails.branch_location"
                                                :contact="branchDetails.contact" :shop-logo-link="branchDetails.shop_logo_link"
                                                :admin-name="branchDetails.admin_name" />
                                            
                                            <TransactionsReportsTableSkeleton
                                                v-if="loadingTransactionsReports && activeReportsTab === 'orders'" />
                                            <TransactionsReportTable v-else-if="activeReportsTab === 'orders'"
                                                :transactions="transactStore.transactions" :loading="loadingTransactionsReports"
                                                @refresh="fetchTransactionsReport" :shop-id="branchDetails.shop_id"
                                                :shop-name="branchDetails.shop_name" :branch-id="branchDetails.branch_id"
                                                :branch-name="branchDetails.branch_name"
                                                :branch-location="branchDetails.branch_location"
                                                :contact="branchDetails.contact" :shop-logo-link="branchDetails.shop_logo_link"
                                                :admin-name="branchDetails.admin_name" />

                                            <ProductsReportsTableSkeleton
                                                v-if="loadingProductReports && activeReportsTab === 'products'" />
                                            <ProductsReportTable v-else-if="activeReportsTab === 'products'"
                                                :products="productReports" :loading="loadingProductReports"
                                                @refresh="fetchProductsReport" :shop-id="branchDetails.shop_id"
                                                :shop-name="branchDetails.shop_name" :branch-id="branchDetails.branch_id"
                                                :branch-name="branchDetails.branch_name"
                                                :branch-location="branchDetails.branch_location"
                                                :contact="branchDetails.contact" :shop-logo-link="branchDetails.shop_logo_link"
                                                :admin-name="branchDetails.admin_name" />

                                            <StocksReportsTableSkeleton
                                                v-if="loadingStockReports && activeReportsTab === 'stocks'" />
                                            <StocksReportTable v-else-if="activeReportsTab === 'stocks'" :stocks="stockReports"
                                                :loading="loadingStockReports" @refresh="fetchStocksReport"
                                                :shop-id="branchDetails.shop_id" :shop-name="branchDetails.shop_name"
                                                :branch-id="branchDetails.branch_id" :branch-name="branchDetails.branch_name"
                                                :branch-location="branchDetails.branch_location"
                                                :contact="branchDetails.contact" :shop-logo-link="branchDetails.shop_logo_link"
                                                :admin-name="branchDetails.admin_name" />

                                        </div>
                                    </transition>
                                </v-container>
                            </v-tabs-window-item>
                        </div>
                    </transition>
                </v-tabs-window>

            </v-card>
        </template>
        <Snackbar ref="snackbarRef" />
    </v-container>
</template>

<script>
import apiClient from '../axios';
import { ref } from 'vue';
import { useLoadingStore } from '@/stores/loading';
import { useStocksStore } from '@/stores/stocksStore';
import { useProductsStore } from '@/stores/productsStore';
import { useTransactStore } from '@/stores/transactStore';
import Snackbar from '@/components/Snackbar.vue';
import ProductsTable from '@/components/ProductsTable.vue';
import ProductsTableSkeleton from '@/components/ProductsTableSkeleton.vue';
import ProductEditDialog from '@/components/ProductEditDialog.vue';
import IngredientEditDialog from '@/components/IngredientEditDialog.vue';
import ProductIngredientsDialog from '@/components/ProductIngredientsDialog.vue';
import StocksTable from '@/components/StocksTable.vue';
import StocksTableSkeleton from '@/components/StocksTableSkeleton.vue';
import StockEditDialog from '@/components/StockEditDialog.vue';
import StocksHistoryDialog from '@/components/StocksHistoryDialog.vue';
import ProductsHistoryDialog from '@/components/ProductsHistoryDialog.vue';
import ProductsReportsTableSkeleton from '@/components/ProductsReportsTableSkeleton.vue';
import ProductsReportTable from '@/components/ProductsReportTable.vue';
import StocksReportTable from '@/components/StocksReportTable.vue';
import StocksReportsTableSkeleton from '@/components/StocksReportsTableSkeleton.vue';
import TransactionsReportTable from '@/components/TransactionsReportTable.vue';
import TransactionsReportsTableSkeleton from '@/components/TransactionsReportsTableSkeleton.vue';
import SalesReportTable from '@/components/SalesReportTable.vue';
import SalesReportsTableSkeleton from '@/components/SalesReportsTableSkeleton.vue';


export default {
    name: 'BranchView',
    components: {
        Snackbar,
        ProductsTable,
        ProductsTableSkeleton,
        ProductEditDialog,
        ProductIngredientsDialog,
        IngredientEditDialog,
        StocksTable,
        StocksTableSkeleton,
        StockEditDialog,
        StocksHistoryDialog,
        ProductsHistoryDialog,
        ProductsReportsTableSkeleton,
        ProductsReportTable,
        StocksReportTable,
        StocksReportsTableSkeleton,
        TransactionsReportTable,
        TransactionsReportsTableSkeleton,
        SalesReportTable,
        SalesReportsTableSkeleton,

    },
    data() {
        return {
            // Branch
            branchDetails: {},
            loadingBranchDetails: false,

            // Products
            products: [],
            editProduct: [],
            selectedProduct: '',
            loadingProducts: false,
            productEditDialog: false,
            confirmUpdatingProductDialog: false,
            productsHistoryDialog: false,
            productsLoaded: false,
            currentProduct: null,

            // Product Ingredients
            ingredients: [],
            editIngredient: [],
            productName: '',
            productTemp: '',
            productSize: '',
            productId: 0,
            loadingIngredient: false,
            dialogIngredients: false,
            ingredientEditDialog: false,
            confirmUpdatingIngredientDialog: false,
            currentIngredient: null,

            // Stocks
            stocks: [],
            editStock: [],
            selectedStock: '',
            loadingStocks: false,
            stockEditDialog: false,
            confirmUpdatingStockDialog: false,
            stockHistoryDialog: false,
            stocksLoaded: false,
            currentStock: null,

            // Reports
            activeReportsTab: 'sales',
            productReports: [],
            productReportsLoaded: false,
            loadingProductReports: false,

            stockReports: [],
            stockReportsLoaded: false,
            loadingStockReports: false,

            transactionReports: [],
            transactionReportsLoaded: false,
            loadingTransactionsReports: false,

            salesDataReports: [],
            salesDataReportsLoaded: false,
            loadingTransactionOrdersReports: false,

            formValid: true,
            isSaving: false,
            availabilityOptions: [
                { availability_id: 1, availability_label: 'Available' },
                { availability_id: 2, availability_label: 'Not Available' },
            ],
        };
    },
    props: {
        branchName: {
            type: String,
            required: true
        },
    },
    setup() {
        const loadingStore = useLoadingStore();
        const stocksStore = useStocksStore();
        const productsStore = useProductsStore();
        const transactStore = useTransactStore();
        const activeTab = ref('dashboard');
        return { activeTab, loadingStore, stocksStore, productsStore, transactStore };
    },
    computed: {
        branchDetailItems() {
            return [
                { label: 'Branch name', value: this.branchDetails.branch_name },
                { label: 'Branch manager', value: this.branchDetails.m_name },
                { label: 'Contact', value: this.branchDetails.contact },
                { label: 'Email', value: this.branchDetails.m_email },
                { label: 'Location', value: this.branchDetails.branch_location },
            ];
        },
        tabs() {
            return [
                { label: 'Dashboard', value: 'dashboard' },
                { label: 'Products', value: 'products', },
                { label: 'Stocks', value: 'stocks', },
                { label: 'Branch Info', value: 'branch_info', clickHandler: () => this.switchToBranchInfoTab() },
                { label: 'Reports', value: 'reports', },
            ];
        },
        reportsTabs() {
            return [
                { label: 'Sales', value: 'sales', },
                { label: 'Orders', value: 'orders', },
                { label: 'Products', value: 'products', },
                { label: 'Stocks', value: 'stocks', },
            ];
        },
        stockCost: {
            get() {
                return this.stock.stock_cost_per_unit;
            },
            set(value) {
                this.$emit('update:stock-cost', value.replace(/[^0-9.]/g, ''));
            }
        }
    },
    watch: {
        '$route.params.branchName': {
            immediate: true,
            async handler(newBranchName) {
                if (newBranchName) {
                    await this.fetchBranchDetails();
                    // if (!this.productsLoaded) await this.fetchProducts();
                    // if (!this.stocksLoaded) await this.fetchStocks();
                    this.activeTab = "dashboard";
                }
            }
        },
        activeTab(newTab) {
            if (newTab === 'products') {
                this.fetchProducts();
            } else if (newTab === 'stocks') {
                this.fetchStocks();
            } else if (newTab === 'reports') {
                this.fetchProductsReport();
                this.fetchStocksReport();
                this.fetchTransactionsReport();
                this.fetchSalesReport();
            }
        }
    },
    methods: {
        async fetchBranchDetails() {
            this.loadingBranchDetails = true;
            try {
                const response = await apiClient.get(`/branch-details/${this.$route.params.branchName}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                if (response.status === 200) {
                    this.branchDetails = response.data;
                } else {
                    this.$router.push('/dashboard');
                }
            } catch (error) {
                console.error('Error fetching branch details:', error);
                this.$router.push('/dashboard');
            } finally {
                this.loadingBranchDetails = false;
            }
        },

        switchToSalesTab() {
            this.activeTab = 'reports';
            this.activeReportsTab = 'sales';
        },

        switchToOrdersTab() {
            this.activeTab = 'reports';
            this.activeReportsTab = 'orders';
        },

        switchToProductsTab() {
            this.activeTab = 'reports';
            this.activeReportsTab = 'products';
        },

        switchToStocksTab() {
            this.activeTab = 'reports';
            this.activeReportsTab = 'stocks';
        },

        

        switchToBranchInfoTab() {
            this.activeTab = 'branch_info';
        },

        async ingredientsDialog(item) {
            this.dialogIngredients = true;
            this.ingredients = [];
            this.productId = item.product_id;
            this.productName = item.product_name;
            this.productTemp = item.temp_label;
            this.productSize = item.size_label;
            this.loadingIngredient = true;
            try {
                const response = await apiClient.get(`/ingredients/${item.product_id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                this.ingredients = response.data.map(ingredient => this.formatIngredient(ingredient));
            } catch (error) {
                console.error('Error fetching ingredients:', error);
                this.showError("Error fetching ingredients!");
            } finally {
                this.loadingIngredient = false;
            }
        },

        async fetchProducts() {
            this.loadingProducts = true;
            try {
                this.isSaving = false;
                if (!this.branchDetails.branch_id) {
                    this.showError("Branch ID is not available!");
                    this.products = [];
                    return;
                }
                await this.productsStore.fetchAllProductsStore(this.branchDetails.branch_id);
                if (this.productsStore.products.length === 0) {
                    this.products = [];
                } else {
                    this.products = this.productsStore.products.map(product => this.formatProduct(product));
                }
                this.productsLoaded = true;
                this.loadingProducts = false;
            } catch (error) {
                console.error('Error fetching products:', error);
                this.showError("Error fetching products!");
            } finally {
                this.loadingProducts = false;
            }
        },

        async fetchStocks() {
            this.loadingStocks = true;
            try {
                this.isSaving = false;
                if (!this.branchDetails.branch_id) {
                    this.showError("Branch ID is not available!");
                    this.stocks = [];
                    return;
                }
                await this.stocksStore.fetchAllStocksStore(this.branchDetails.branch_id);
                if (this.stocksStore.stocks.length === 0) {
                    this.stocks = [];
                } else {
                    this.stocks = this.stocksStore.stocks.map(stock => this.formatStock(stock));
                }
                this.stocksLoaded = true;
                this.loadingStocks = false;
            } catch (error) {
                console.error('Error fetching stocks:', error);
                this.showError("Error fetching stocks!");
            } finally {
                this.loadingStocks = false;
            }
        },

        async fetchProductsReport() {
            this.loadingProductReports = true;
            try {
                this.isSaving = false;
                if (!this.branchDetails.branch_id) {
                    this.showError("Branch ID is not available!");
                    this.productReports = [];
                    return;
                }
                await this.productsStore.fetchAllProductsStore(this.branchDetails.branch_id);
                if (this.productsStore.products.length === 0) {
                    this.productReports = [];
                } else {
                    this.productReportsLoaded = true;
                    this.productReports = this.productsStore.products.map(product => this.formatProduct(product));
                }
                this.loadingProductReports = false;
            } catch (error) {
                console.error('Error fetching reports:', error);
                this.showError("Error fetching reports!");
            } finally {
                this.loadingProductReports = false;
            }
        },

        async fetchStocksReport() {
            this.loadingStockReports = true;
            try {
                this.isSaving = false;
                if (!this.branchDetails.branch_id) {
                    this.showError("Branch ID is not available!");
                    this.stockReports = [];
                    return;
                }
                await this.stocksStore.fetchAllStocksStore(this.branchDetails.branch_id);
                if (this.stocksStore.stocks.length === 0) {
                    this.stockReports = [];
                } else {
                    this.stockReports = this.stocksStore.stocks.map(stock => this.formatStock(stock));
                }
                this.stockReportsLoaded = true;
                this.loadingStockReports = false;
            } catch (error) {
                console.error('Error fetching stocks:', error);
                this.showError("Error fetching stocks!");
            } finally {
                this.loadingStockReports = false;
            }
        },

        async fetchTransactionsReport() {
            this.loadingTransactionsReports = true;
            try {
                this.isSaving = false;
                if (!this.branchDetails.branch_id) {
                    this.showError("Branch ID is not available!");
                    this.transactionReports = [];
                    return;
                }
                await this.transactStore.fetchAllTransactionsStore(this.branchDetails.branch_id);
                if (this.transactStore.transactions.length === 0) {
                    this.transactionReports = [];
                } else {
                    this.transactionReports = this.transactStore.transactions.map(transact => this.formatTransactions(transact));
                }
                this.transactionReportsLoaded = true;
                this.loadingTransactionsReports = false;
            } catch (error) {
                console.error('Error fetching transactions:', error);
                this.showError("Error fetching transactions!");
            } finally {
                this.loadingTransactionsReports = false;
            }
        },

        async fetchSalesReport() {
            this.loadingTransactionOrdersReports = true;
            try {
                this.isSaving = false;
                if (!this.branchDetails.branch_id) {
                    this.showError("Branch ID is not available!");
                    this.salesDataReports = [];
                    return;
                }
                await this.transactStore.fetchSalesStore(this.branchDetails.branch_id);
                if (this.transactStore.salesData.length === 0) {
                    this.salesDataReports = [];
                } else {
                    this.salesDataReports = this.transactStore.salesData.map(t_orders => this.formatTransactions(t_orders));
                }
                this.salesDataReportsLoaded = true;
                this.loadingTransactionOrdersReports = false;
            } catch (error) {
                console.error('Error fetching sales:', error);
                this.showError("Error fetching sales!");
            } finally {
                this.loadingTransactionOrdersReports = false;
            }
        },

        async updatingStock() {
            this.isSaving = true;
            try {
                const stockData = {
                    stock_id: Number(this.currentStock.stock_id),
                    stock_ingredient: this.currentStock.stock_ingredient,
                    stock_in: parseFloat(this.currentStock.stock_in),
                    stock_unit: Number(this.currentStock.stock_unit),
                    stock_cost_per_unit: parseFloat(this.currentStock.stock_cost_per_unit),
                    availability_id: Number(this.currentStock.availability_id),
                    branch_id: Number(this.currentStock.branch_id),
                    shop_id: Number(this.currentStock.shop_id)
                };
                this.confirmUpdatingStockDialog = false;
                await this.stocksStore.updateStockStore(stockData);
                this.stockEditDialog = false;
                this.onRefreshStocks();
                this.showSuccess("Stock updated successfully!");
            } catch (error) {
                console.error('Failed to update stock:', error);
                this.showError("Failed to update stock. Please try again!");
            } finally {
                this.isSaving = false;
            }
        },

        async updatingProduct() {
            this.isSaving = true;
            try {
                const productData = {
                    product_id: this.currentProduct.product_id,
                    product_name: this.currentProduct.product_name,
                    product_price: parseFloat(this.currentProduct.product_price),
                    product_size_id: Number(this.currentProduct.product_size_id),
                    product_temp_id: Number(this.currentProduct.product_temp_id),
                    product_category_id: Number(this.currentProduct.product_category_id),
                    availability_id: Number(this.currentProduct.availability_id),
                    shop_id: this.currentProduct.shop_id,
                    branch_id: this.currentProduct.branch_id,
                };
                this.confirmUpdatingProductDialog = false;
                await this.productsStore.updateProductStore(productData);
                this.productEditDialog = false;
                this.onRefreshProducts();
                this.showSuccess("Product updated successfully!");
            } catch (error) {
                console.error('Failed to update product:', error);
                this.showError("Failed to update product. Please try again!");
            } finally {
                this.isSaving = false;
            }
        },

        async updatingIngredient() {
            this.isSaving = true;
            try {
                const ingredientData = {
                    product_id: this.currentIngredient.product_id,
                    stock_id: this.currentIngredient.stock_id,
                    uni_usage: this.currentIngredient.uni_usage,
                    ingredient_capital: parseFloat(this.currentIngredient.ingredient_capital),
                };
                this.confirmUpdatingEditDialog = false;
                console.log(ingredientData);
                // await this.productsStore.updateIngredientStore(ingredientData);
                // this.ingredientEditDialog = false;
                // this.onRefreshProducts();
                // this.showSuccess("Ingredient updated successfully!");
            } catch (error) {
                console.error('Failed to update ingredient:', error);
                this.showError("Failed to update ingredient. Please try again!");
            } finally {
                this.isSaving = false;
            }
        },

        async editProductDialog(item) {
            this.currentProduct = { ...item };
            this.productEditDialog = true;
        },

        async editIngredientDialog(item) {
            this.currentIngredient = { ...item };
            this.ingredientEditDialog = true;
        },

        openEditStockDialog(item) {
            this.currentStock = { ...item };
            this.stockEditDialog = true;
        },

        openHistoryStockDialog(item) {
            this.currentStock = { ...item };
            this.stockHistoryDialog = true;
        },

        openProductHistory() {
            this.currentProduct = { ...this.currentProduct };
            this.productsHistoryDialog = true;
        },

        handleStockUpdate(updatedStock) {
            // Update the local copy
            this.currentStock = updatedStock;
        },

        handleStockCostUpdate(newValue) {
            this.editStock[0] = {
                ...this.editStock[0],
                stock_cost_per_unit: newValue.replace(/[^0-9.]/g, '')
            };
        },

        openStockHistory() {
            this.currentStock = { ...this.currentStock };
            this.stockHistoryDialog = true;
        },

        formatProduct(product) {
            return {
                ...product,
                display_product_name: `${this.capitalizeFirstLetter(product.product_name)}${product.temp_label}${product.size_label}`,
                display_product_price: `₱${product.product_price}`,
                updated_at: this.formatDateTime(product.updated_at),
            };
        },

        formatIngredient(ingredient) {
            return {
                ...ingredient,
                stock_ingredient: this.capitalizeFirstLetter(ingredient.stock_ingredient),
                ingredient_capital: `₱${ingredient.ingredient_capital}`,
                unit: `${ingredient.unit_usage}${ingredient.unit_avb}`,
                updated_at: this.formatDateTime(ingredient.updated_at),
            };
        },

        formatStock(stock) {
            return {
                ...stock,
                stock_ingredient: this.capitalizeFirstLetter(stock.stock_ingredient),
                display_stock_in: `${stock.stock_in}${stock.unit_avb}`,
                display_unit_cost: `₱${stock.stock_cost_per_unit}`,
                updated_at: this.formatDateTime(stock.updated_at),
            };
        },

        formatTransactions(transaction) {
            return {
                ...transaction,
                display_customer_cash: `₱${transaction.customer_cash}`,
                display_customer_charge: `₱${transaction.customer_charge}`,
                display_customer_change: `₱${transaction.customer_change}`,
                updated_at: this.formatDateTime(transaction.updated_at),
            };
        },

        formatReport(productReport) {
            return {
                ...productReport,
                display_product_name: `${this.capitalizeFirstLetter(productReport.product_name)}${productReport.temp_label}${productReport.size_label}`,
                display_product_price: `₱${productReport.product_price}`,
                updated_at: this.formatDateTime(productReport.updated_at),
            };
        },

        capitalizeFirstLetter(text) {
            return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '';
        },

        formatDateTime(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleString('en-PH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Manila'
            });
        },

        formatCost() {
            const cost = parseFloat(this.editStock[0]?.stock_cost_per_unit);
            if (!isNaN(cost)) {
                this.editStock[0].stock_cost_per_unit = cost.toFixed(2);
            } else {
                this.editStock[0].stock_cost_per_unit = '';
            }
        },

        showError(message) {
            this.$refs.snackbarRef.showSnackbar(message, "error");
        },

        showSuccess(message) {
            this.$refs.snackbarRef.showSnackbar(message, "success");
        },

        onRefreshProducts() {
            this.loadingProducts = true;
            setTimeout(() => {
                this.fetchProducts();
            }, 1000);
        },

        onRefreshStocks() {
            this.loadingStocks = true;
            setTimeout(() => {
                this.fetchStocks();
            }, 1000);
        },

        // onRefreshTransactionsoOrdersReport() {
        //     this.loadingTransactionOrdersReports = true;
        //     setTimeout(() => {
        //         this.fetchSalesReport();
        //     }, 1000);
        // },

    }
};
</script>