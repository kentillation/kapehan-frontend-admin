<template>
    <v-container>
        <h2>{{ branchDetails.branch_name || branchName }} Branch</h2>
        <template v-if="branchDetails.branch_name">
            <v-card class="pa-4 mt-3">
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
                                        <!-- Sales -->
                                        <v-col cols="12" lg="3" md="6" sm="6">
                                            <v-card elevation="5">
                                                <v-card-text>
                                                    <p class="text-grey">Net Sales</p>
                                                    <div class="d-flex justify-center">
                                                        <template v-if="textSkeleton">
                                                            <v-skeleton-loader type="text" width="100" />
                                                        </template>
                                                        <template v-else>
                                                            <h2 class="my-2">₱ {{ totalSales }}</h2>
                                                        </template>
                                                    </div>
                                                    <div class="d-flex justify-end mt-3">
                                                        <v-btn color="#0090b6" 
                                                            class="pa-2 w-50 d-flex justify-center rounded"
                                                            size="small"
                                                            @click="switchToSalesTab()">
                                                            <v-icon>mdi-eye-outline</v-icon>&nbsp; View
                                                        </v-btn>
                                                    </div>
                                                </v-card-text>
                                                <v-icon color="purple" class="position-absolute" 
                                                    style="top: 75px; left: -10px;" 
                                                    size="80">mdi-account-cash</v-icon>
                                            </v-card>
                                        </v-col>

                                        <!-- Orders -->
                                        <v-col cols="12" lg="3" md="6" sm="6">
                                            <v-card elevation="5">
                                                <v-card-text>
                                                    <p class="text-grey">Total Orders</p>
                                                    <div class="d-flex justify-center">
                                                        <template v-if="textSkeleton">
                                                            <v-skeleton-loader type="text" width="100" />
                                                        </template>
                                                        <template v-else>
                                                            <div class="d-flex align-center">
                                                                <h2 class="my-2">{{ totalOrders }}</h2> &nbsp;
                                                                <span style="font-size: 18px;">
                                                                    <p>{{ totalOrders > 1 ? 'items' : 'item' }}</p>
                                                                </span>
                                                            </div>
                                                        </template>
                                                    </div>
                                                    <div class="d-flex justify-end mt-3">
                                                        <v-btn color="#0090b6" 
                                                            class="pa-2 w-50 d-flex justify-center rounded"
                                                            size="small"
                                                            @click="switchToOrdersTab()">
                                                            <v-icon>mdi-eye-outline</v-icon>&nbsp; View
                                                        </v-btn>
                                                    </div>
                                                </v-card-text>
                                                <v-icon color="green" class="position-absolute" 
                                                    style="top: 70px; left: -10px;" 
                                                    size="80">mdi-invoice-text-outline</v-icon>
                                            </v-card>
                                        </v-col>

                                        <!-- Products -->
                                        <v-col cols="12" lg="3" md="6" sm="6">
                                            <v-card elevation="5">
                                                <v-card-text>
                                                    <p class="text-grey">Total Products</p>
                                                    <div class="d-flex  align-center justify-center">
                                                        <template v-if="textSkeleton">
                                                            <v-skeleton-loader type="text" width="100" />
                                                        </template>
                                                        <template v-else>
                                                            <h2 class="my-2">{{ totalProducts }}</h2> &nbsp;
                                                            <span style="font-size: 18px;">
                                                                <p>{{ totalProducts > 1 ? 'items' : 'item' }}</p>
                                                            </span>
                                                        </template>
                                                    </div>
                                                    <div class="d-flex justify-end mt-3">
                                                        <v-btn color="#0090b6" 
                                                            class="pa-2 w-50 d-flex justify-center rounded"
                                                            size="small"
                                                            @click="switchToProductsTab()">
                                                            <v-icon>mdi-eye-outline</v-icon>&nbsp; View
                                                        </v-btn>
                                                    </div>
                                                </v-card-text>
                                                <v-icon color="orange" class="position-absolute" 
                                                    style="top: 75px; left: -10px;" 
                                                    size="80">mdi-food-outline</v-icon>
                                            </v-card>
                                        </v-col>

                                        <!-- Stocks -->
                                        <v-col cols="12" lg="3" md="6" sm="6">
                                            <v-card elevation="5">
                                                <v-card-text>
                                                    <p class="text-grey">Total Stocks</p>
                                                    <div class="d-flex align-center justify-center">
                                                        <template v-if="textSkeleton">
                                                            <v-skeleton-loader type="text" width="100" />
                                                        </template>
                                                        <template v-else>
                                                            <h2 class="my-2">{{ totalStocks }}</h2> &nbsp;
                                                            <span style="font-size: 18px;">
                                                                <p>{{ totalStocks > 1 ? 'items' : 'item' }}</p>
                                                            </span>
                                                        </template>
                                                    </div>
                                                    <div class="d-flex justify-end mt-3">
                                                        <v-btn color="#0090b6" 
                                                            class="pa-2 w-50 d-flex justify-center rounded"
                                                            size="small"
                                                            @click="switchToStocksTab()">
                                                            <v-icon>mdi-eye-outline</v-icon>&nbsp; View
                                                        </v-btn>
                                                    </div>
                                                </v-card-text>
                                                <v-icon color="brown" class="position-absolute" 
                                                    style="top: 70px; left: -10px;" 
                                                    size="80">mdi-archive-outline</v-icon>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-container>

                                <!-- Sales Visualization -->
                                <v-container>
                                    <h3 class="my-3">Sales Trends</h3>
                                    <v-card>
                                        <v-card-text>
                                            <SalesChart :sales-by-month="salesByMonthReports" :sales-only="totalSales"
                                                :orders-only="totalOrders" @month-changed="fetchSalesByMonthReport"
                                                @sales-changed="fetchSalesOnly" @orders-changed="fetchOrdersOnly" />
                                            <!-- added (:orders-only="totalOrders" and @orders-changed="fetchOrdersOnly -->
                                        </v-card-text>
                                    </v-card>
                                </v-container>
                            </v-tabs-window-item>

                            <!-- Products -->
                            <v-tabs-window-item value="products">
                                <v-container>
                                    <ProductsTableSkeleton v-if="loadingProducts" />
                                    <ProductsTable v-else @refresh="fetchProducts" @edit-product="editProductDialog"
                                        @view-ingredients="ingredientsDialog" :products="products"
                                        :loading="loadingProducts" :shop-id="branchDetails.shop_id"
                                        :branch-id="branchDetails.branch_id" :branch-name="branchDetails.branch_name" />
                                    <ProductEditDialog v-model="productEditDialog"
                                        @update:modelValue="productEditDialog = $event"
                                        @update:product="currentProduct = $event"
                                        @update:confirm="confirmUpdatingProductDialog = $event"
                                        :product="currentProduct" @save="updatingProduct" :valid="formValid"
                                        :loading="isSaving" :confirm="confirmUpdatingProductDialog"
                                        :selected-product="currentProduct?.product_name || ''" />
                                    <ProductIngredientsDialog v-model="dialogIngredients"
                                        :product-ingredients="ingredients" :loading="loadingIngredient"
                                        @edit-ingredient="editIngredientDialog" :shop-id="branchDetails.shop_id"
                                        :branch-id="branchDetails.branch_id" :branch-name="branchDetails.branch_name"
                                        :product-id="productId" :product-name="productName" :product-temp="productTemp"
                                        :product-size="productSize" />
                                    <IngredientEditDialog v-model="ingredientEditDialog"
                                        @update:modelValue="ingredientEditDialog = $event"
                                        @update:ingredient="currentIngredient = $event"
                                        @update:confirm="confirmUpdatingIngredientDialog = $event"
                                        :ingredient="currentIngredient" @save="updatingIngredient" :valid="formValid"
                                        :loading="isSaving" :confirm="confirmUpdatingIngredientDialog" />
                                    <ProductsHistoryDialog v-model="productsHistoryDialog"
                                        :branch-id="branchDetails.branch_id" />
                                    <v-btn @click="openProductHistory" prepend-icon="mdi-history" color="#0090b6"
                                        class="mt-3" variant="flat">
                                        <span class="to-hide">Products History</span>
                                        <span class="to-show">History</span>
                                    </v-btn>
                                </v-container>
                            </v-tabs-window-item>

                            <!-- Stocks -->
                            <v-tabs-window-item value="stocks">
                                <v-container>
                                    <StocksTableSkeleton v-if="loadingStocks" />
                                    <StocksTable v-else :stocks="stocks" @refresh="fetchStocks"
                                        @edit-stock="openEditStockDialog" :branch-id="branchDetails.branch_id"
                                        :branch-name="branchDetails.branch_name" :shop-id="branchDetails.shop_id"
                                        :loading="loadingStocks" />
                                    <StockEditDialog v-model="stockEditDialog"
                                        @update:modelValue="stockEditDialog = $event"
                                        @update:stock="currentStock = $event"
                                        @update:confirm="confirmUpdatingStockDialog = $event" :stock="currentStock"
                                        @save="updatingStock" :valid="formValid" :loading="isSaving"
                                        :confirm="confirmUpdatingStockDialog"
                                        :selected-stock="currentStock?.stock_ingredient || ''" />

                                    <StocksHistoryDialog v-model="stockHistoryDialog"
                                        :branch-id="branchDetails.branch_id" />
                                    <v-btn @click="openStockHistory" prepend-icon="mdi-history" color="#0090b6"
                                        class="mt-3" variant="flat">
                                        <span class="to-hide">Stocks History</span>
                                        <span class="to-show">History</span>
                                    </v-btn>
                                </v-container>
                            </v-tabs-window-item>

                            <!-- Void Reversal -->
                            <v-tabs-window-item value="void-orders">
                                <v-container>
                                    <VoidReversalTableSkeleton v-if="loadingVoidReversal" />
                                    <VoidReversalTable v-else 
                                        :void-by-date="transactStore.voidOrdersByDate"
                                        @refresh="fetchVoidOrders"
                                        :loading="loadingVoidReversal" 
                                        :branch-id="branchDetails.branch_id" />
                                </v-container>
                            </v-tabs-window-item>

                            <!-- Branch Info -->
                            <v-tabs-window-item value="branch-info">
                                <v-container>
                                    <v-tabs v-model="activeBranchInfoTab" style="background: #01546b;" class="d-flex px-3 rounded"
                                        align-tabs="left" color="white" stacked show-arrows>
                                        <v-tab v-for="tab in branchInfoTabs" :key="tab.value" class="rounded text-white mt-4 mx-2"
                                            :value="tab.value" :class="{ 'active-tab': activeBranchInfoTab === tab.value }"
                                            @click="tab.clickHandler ? tab.clickHandler() : null">
                                            {{ tab.label }}
                                        </v-tab>
                                    </v-tabs>
                                    <transition name="slide-x-transition" mode="out-in">
                                        <div :key="activeBranchInfoTab">
                                            <!-- <v-container v-if="loadingBranchDetails && activeBranchInfoTab === 'details'" /> -->
                                            <v-container v-if="activeBranchInfoTab === 'details'" class="mt-5">
                                                <v-row>
                                                    <v-col v-for="(detail, i) in branchDetailItems" :key="i" cols="12" lg="6" md="6" sm="6">
                                                        <p class="text-grey-darken-1">{{ detail.label }}</p>
                                                        <h4 class="mb-5">{{ detail.value }}</h4>
                                                    </v-col>
                                                </v-row>
                                                <div class="d-flex justify-end">
                                                    <v-btn prepend-icon="mdi-pencil" color="#0090b6" variant="flat"
                                                        @click="activeBranchInfoTab = 'details'">&nbsp; Edit</v-btn>
                                                </div>
                                            </v-container>

                                            <!-- <v-container v-if="loadingCashierPersonnel && activeBranchInfoTab === 'cashier'" /> -->
                                            <v-container v-if="activeBranchInfoTab === 'cashier'">
                                                <h3>Cashier Personnel</h3>
                                            </v-container>

                                            <!-- <v-container v-if="loadingKitchenPersonnel && activeBranchInfoTab === 'kitchen'" /> -->
                                            <v-container v-if="activeBranchInfoTab === 'kitchen'">
                                                <h3>Kitchen Personnel</h3>
                                            </v-container>
                                            
                                            <!-- <v-container v-if="loadingBaristaPersonnel && activeBranchInfoTab === 'barista'" /> -->
                                            <v-container v-if="activeBranchInfoTab === 'barista'">
                                                <h3>Barista Personnel</h3>
                                            </v-container>

                                        </div>
                                    </transition>
                                </v-container>
                            </v-tabs-window-item>

                            <!-- Reports -->
                            <v-tabs-window-item value="reports">
                                <v-container>
                                    <v-tabs v-model="activeReportsTab" style="background: #01546b;" class="d-flex px-3 rounded"
                                        align-tabs="left" color="white" stacked show-arrows>
                                        <v-tab v-for="tab in reportsTabs" :key="tab.value" class="text-white rounded mt-4 mx-2"
                                            :value="tab.value" :class="{ 'active-tab': activeReportsTab === tab.value }"
                                            @click="tab.clickHandler ? tab.clickHandler() : null">
                                            {{ tab.label }}
                                        </v-tab>
                                    </v-tabs>
                                    <transition name="slide-x-transition" mode="out-in">
                                        <div :key="activeReportsTab">
                                            <SalesReportsTableSkeleton
                                                v-if="loadingTransactionOrdersReports && activeReportsTab === 'sales'" />
                                            <SalesReportTable v-else-if="activeReportsTab === 'sales'"
                                                :sales-by-date="transactStore.grossSalesByDate"
                                                :loading="loadingTransactionOrdersReports" @refresh="fetchSalesReport"
                                                :shop-id="branchDetails.shop_id" :shop-name="branchDetails.shop_name"
                                                :branch-id="branchDetails.branch_id"
                                                :branch-name="branchDetails.branch_name"
                                                :branch-location="branchDetails.branch_location"
                                                :contact="branchDetails.contact"
                                                :admin-name="branchDetails.admin_name" />

                                            <OrdersReportsTableSkeleton
                                                v-if="loadingTransactionsReports && activeReportsTab === 'orders'" />
                                            <OrdersReportTable v-else-if="activeReportsTab === 'orders'"
                                                :transactions="transactStore.transactions"
                                                :loading="loadingTransactionsReports" @refresh="fetchAllOrdersReport"
                                                :shop-id="branchDetails.shop_id" :shop-name="branchDetails.shop_name"
                                                :branch-id="branchDetails.branch_id"
                                                :branch-name="branchDetails.branch_name"
                                                :branch-location="branchDetails.branch_location"
                                                :contact="branchDetails.contact"
                                                :admin-name="branchDetails.admin_name" />

                                            <StocksReportsTableSkeleton
                                                v-if="loadingStockReports && activeReportsTab === 'stocks'" />
                                            <StocksReportTable v-else-if="activeReportsTab === 'stocks'"
                                                :stocks="stockReports" :loading="loadingStockReports"
                                                @refresh="fetchStocksReport" :shop-id="branchDetails.shop_id"
                                                :shop-name="branchDetails.shop_name"
                                                :branch-id="branchDetails.branch_id"
                                                :branch-name="branchDetails.branch_name"
                                                :branch-location="branchDetails.branch_location"
                                                :contact="branchDetails.contact"
                                                :admin-name="branchDetails.admin_name" />
                                            
                                            <ProductsReportsTableSkeleton
                                                v-if="loadingProductReports && activeReportsTab === 'products'" />
                                            <ProductsReportTable v-else-if="activeReportsTab === 'products'"
                                                :products="productReports" :loading="loadingProductReports"
                                                @refresh="fetchProductsReport" :shop-id="branchDetails.shop_id"
                                                :shop-name="branchDetails.shop_name"
                                                :branch-id="branchDetails.branch_id"
                                                :branch-name="branchDetails.branch_name"
                                                :branch-location="branchDetails.branch_location"
                                                :contact="branchDetails.contact"
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
        <Alert ref="lowStockAlertRef" />
    </v-container>
</template>

<script>
import apiClient from '../axios';
import { ref, computed } from 'vue';
import { mapState } from 'pinia';
import { useLoadingStore } from '@/stores/loading';
import { useStocksStore } from '@/stores/stocksStore';
import { useProductsStore } from '@/stores/productsStore';
import { useProductOptionsStore } from '@/stores/productOptionsStore'; 
import { useTransactStore } from '@/stores/transactStore';
import Snackbar from '@/components/Snackbar.vue';
import Alert from '@/components/Alert.vue';
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
import OrdersReportTable from '@/components/OrdersReportTable.vue';
import OrdersReportsTableSkeleton from '@/components/OrdersReportsTableSkeleton.vue';
import SalesReportTable from '@/components/SalesReportTable.vue';
import SalesReportsTableSkeleton from '@/components/SalesReportsTableSkeleton.vue';
import VoidReversalTable from '@/components/VoidReversalTable.vue';
import VoidReversalTableSkeleton from '@/components/VoidReversalTableSkeleton.vue';
import SalesChart from '@/components/SalesChart.vue';

export default {
    name: 'BranchView',
    components: {
        Snackbar,
        Alert,
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
        OrdersReportTable,
        OrdersReportsTableSkeleton,
        SalesReportTable,
        SalesReportsTableSkeleton,
        VoidReversalTable,
        VoidReversalTableSkeleton,
        SalesChart,
    },
    data() {
        return {
            // Branch
            branchDetails: {},
            loadingBranchDetails: false,

            // Dashboard
            textSkeleton: false,
            totalSales: null,
            totalOrders: null,
            totalProducts: null,
            totalStocks: null,
            loadingSalesOnly: false,
            loadingOrdersOnly: false,
            loadingProductsOnly: false,
            loadingStocksOnly: false,

            // Products
            products: [],
            editProduct: [],
            selectedProduct: '',
            product_alone: '',
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

            // Void Blotter
            loadingVoidReversal: false,
            voidByDate: [],

            // Reports
            // activeReportsTab: 'sales',
            productReports: [],
            productReportsLoaded: false,
            loadingProductReports: false,

            stockReports: [],
            stockReportsLoaded: false,
            loadingStockReports: false,

            transactionReports: [],
            transactionReportsLoaded: false,
            loadingTransactionsReports: false,

            salesByDateReports: [],
            salesByDateReportsLoaded: false,
            loadingTransactionOrdersReports: false,

            salesByMonthReports: [],
            loadingSalesByMonthReports: false,

            formValid: true,
            isSaving: false,
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
        const productOptionsStore = useProductOptionsStore(); 
        const productTemperatureOption = computed(() => productOptionsStore.temperatureOptions); 
        const productSizeOption = computed(() => productOptionsStore.sizeOptions); 
        const productCategoryOption = computed(() => productOptionsStore.categoryOptions); 
        const productAvailabilityOption = computed(() => productOptionsStore.availabilityOptions); 
        const transactStore = useTransactStore();
        const activeTab = ref('dashboard');
        const activeReportsTab = ref('sales');
        const activeBranchInfoTab = ref('details');
        return { loadingStore, 
            stocksStore, 
            productsStore,
            productOptionsStore, 
            productTemperatureOption, 
            productSizeOption, 
            productCategoryOption, 
            productAvailabilityOption,  
            transactStore, 
            activeTab, 
            activeReportsTab,
            activeBranchInfoTab };
    },
    computed: {
        ...mapState(useStocksStore, ['stockNotificationQty']),
        branchDetailItems() {
            return [
                // { label: 'Store name', value: this.branchDetails.shop_name },
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
                { label: 'Void Orders', value: 'void-orders', },
                { label: 'Branch Info', value: 'branch-info', },
                { label: 'Reports', value: 'reports', },
            ];
        },
        reportsTabs() {
            return [
                { label: 'Sales', value: 'sales', },
                { label: 'Orders', value: 'orders', },
                { label: 'Stocks', value: 'stocks', },
                { label: 'Products', value: 'products', },
            ];
        },
        branchInfoTabs() {
            return [
                { label: 'Details', value: 'details', },
                { label: 'Cashier', value: 'cashier', },
                { label: 'Kitchen', value: 'kitchen', },
                { label: 'Barista', value: 'barista', },
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
                    this.loadingStore.show("Preparing...");
                    this.onDashboard();
                    this.loadingStore.hide();
                }
            }
        },
        activeTab(newTab) {
            if (newTab === 'dashboard') {
                this.loadingStore.show("Preparing...");
                this.onDashboard();
                this.loadingStore.hide();
            } else if (newTab === 'products') {
                this.loadingStore.show("Preparing...");
                this.fetchProducts();
                this.loadingStore.hide();
            } else if (newTab === 'stocks') {
                this.loadingStore.show("Preparing...");
                this.fetchStocks();
                this.loadingStore.hide();
            } else if (newTab === 'void-orders') {
                this.loadingStore.show("Preparing...");
                this.fetchVoidOrders();
                this.loadingStore.hide();
            } else if (newTab === 'branch-info') {
                this.loadingStore.show("Preparing...");
                // this.fetchVoidOrders();
                this.loadingStore.hide();
            } else if (newTab === 'reports') {
                this.loadingStore.show("Preparing...");
                this.fetchSalesReport();
                this.loadingStore.hide();
            }
        },
        activeReportsTab(newReportsTab) {
            if (newReportsTab === 'sales') {
                console.log("Current Reports Tab: ", newReportsTab);
            } else if (newReportsTab === 'orders') {
                this.loadingStore.show("Preparing...");
                this.fetchAllOrdersReport();
                this.loadingStore.hide();
            } else if (newReportsTab === 'products') {
                this.loadingStore.show("Preparing...");
                this.fetchProductsReport();
                this.loadingStore.hide();
            } else if (newReportsTab === 'stocks') {
                this.loadingStore.show("Preparing...");
                this.fetchStocksReport();
                this.loadingStore.hide();
            }
        },
        activeBranchInfoTab (newBranchInfoTab) {
            if (newBranchInfoTab === 'details') {
                this.loadingStore.show("Preparing...");
                this.fetchBranchDetails();
                this.loadingStore.hide();
            } else if (newBranchInfoTab === 'cashier') {
                this.loadingStore.show("Preparing...");
                // this.fetchCashierPersonnel();
                this.loadingStore.hide();
            } else if (newBranchInfoTab === 'kitchen') {
                this.loadingStore.show("Preparing...");
                // this.fetchKitchenPersonnel();
                this.loadingStore.hide();
            } else if (newBranchInfoTab === 'barista') {
                this.loadingStore.show("Preparing...");
                // this.fetchCashierPersonnel();
                this.loadingStore.hide();
            }
        }
    },
    methods: {
        async fetchLowStocks() {
            try {
                const response = await this.stocksStore.fetchLowStocksStore();
                const formattedBranches = {};
                Object.entries(response.data.branches).forEach(([id, branch]) => {
                formattedBranches[id.toString()] = branch;
                });
                this.lowStockBranches = formattedBranches;
                this.totalLowStock = response.data.total_count;
                if (this.totalLowStock > 0) {
                const branchDetails = Object.values(this.lowStockBranches).map(
                    branch => `${branch.name} branch (${branch.count} item${branch.count !== 1 ? 's' : ''})`
                );
                const message = `Low stock alert: ${branchDetails.join(', ')}`;
                this.showStockAlert(message);
                }
            } catch (error) {
                console.error('Error fetching stocks:', error);
            }
        },

        async onDashboard () {
            await this.fetchBranchDetails();
            this.activeTab = "dashboard";
            const currentMonth = new Date().getMonth() + 1;
            this.fetchSalesOnly(currentMonth);
            this.fetchOrdersOnly(currentMonth);
            this.fetchProductsOnly(currentMonth);
            this.fetchStocksOnly();
            this.fetchSalesByMonthReport(currentMonth);
        },

        async fetchBranchDetails() {
            this.loadingBranchDetails = true;
            try {
                const response = await apiClient.get(`/admin/branch-details/${this.$route.params.branchName}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                if (response.status === 200) {
                    this.branchDetails = response.data;
                } else {
                    this.$router.push('/home');
                }
            } catch (error) {
                console.error('Error fetching branch details:', error);
                this.showError("Error fetching branch details!");
                this.$router.push('/home');
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
            this.activeTab = 'products';
            // this.activeReportsTab = 'products';
        },

        switchToStocksTab() {
            this.activeTab = 'stocks';
            // this.activeReportsTab = 'stocks';
        },

        switchToBranchInfoTab() {
            this.activeTab = 'branch-info';
            this.activeBranchInfoTab = 'details';
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
                const response = await apiClient.get(`/admin/ingredients/${item.product_id}`, {
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
            } catch (error) {
                console.error('Error fetching products:', error);
                this.showError("Error fetching products!");
            } finally {
                this.loadingProducts = false;
            }
        },

        async fetchProductAlone(productId) {
            try {
                await this.productsStore.fetchProductAloneStore(productId);
                if (this.productsStore.productAlone.length === 0) {
                    this.product_alone = '';
                } else {
                    this.product_alone = this.productsStore.productAlone.map(product => this.formatProduct(product));
                }
            } catch (error) {
                console.error('Error fetching product_alone:', error);
                this.showError("Error fetching product_alone!");
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

        async fetchVoidOrders() {
            this.loadingVoidReversal = true;
            try {
                if (!this.branchDetails.branch_id) {
                    this.showError("Branch ID is not available!");
                    this.voidByDate = [];
                    return;
                }
                await this.transactStore.fetchVoidByDateStore(this.branchDetails.branch_id);
                if (this.transactStore.voidOrdersByDate.length === 0) {
                    this.voidByDate = [];
                } else {
                    this.voidByDate = this.transactStore.voidOrdersByDate.map(rev_orders => this.formatReversalOrders(rev_orders));
                }
                this.loadingVoidReversal = false;
            } catch (error) {
                console.error('Error fetching void orders:', error);
                this.showError("Error fetching void orders!");
            } finally {
                this.loadingVoidReversal = false;
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
                console.error('Error fetching products report:', error);
                this.showError("Error fetching products report!");
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
                await this.stocksStore.fetchStocksReportStore(this.branchDetails.branch_id);
                if (this.stocksStore.stocks.length === 0) {
                    this.stockReports = [];
                } else {
                    this.stockReports = this.stocksStore.stocks.map(stock => this.formatStock(stock));
                }
                this.stockReportsLoaded = true;
                this.loadingStockReports = false;
            } catch (error) {
                console.error('Error fetching stocks report:', error);
                this.showError("Error fetching stocks report!");
            } finally {
                this.loadingStockReports = false;
            }
        },

        async fetchAllOrdersReport() {
            this.loadingTransactionsReports = true;
            try {
                this.isSaving = false;
                if (!this.branchDetails.branch_id) {
                    this.showError("Branch ID is not available!");
                    this.transactionReports = [];
                    return;
                }
                await this.transactStore.fetchAllOrdersStore(this.branchDetails.branch_id);
                if (this.transactStore.transactions.length === 0) {
                    this.transactionReports = [];
                } else {
                    this.transactionReports = this.transactStore.transactions.map(transact => this.formatTransactions(transact));
                }
                this.transactionReportsLoaded = true;
                this.loadingTransactionsReports = false;
            } catch (error) {
                console.error('Error fetching orders report:', error);
                this.showError("Error fetching orders report!");
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
                    this.salesByDateReports = [];
                    return;
                }
                await this.transactStore.fetchGrossSalesByDateStore(this.branchDetails.branch_id);
                if (this.transactStore.grossSalesByDate.length === 0) {
                    this.salesByDateReports = [];
                } else {
                    this.salesByDateReports = this.transactStore.grossSalesByDate.map(t_orders => this.formatSalesByDate(t_orders));
                }
                this.salesByDateReportsLoaded = true;
                this.loadingTransactionOrdersReports = false;
            } catch (error) {
                console.error('Error fetching sales report:', error);
                this.showError("Error fetching sales! report");
            } finally {
                this.loadingTransactionOrdersReports = false;
            }
        },

        async fetchSalesOnly(month = null) {
            this.loadingSalesOnly = true;
            this.textSkeleton = true;
            try {
                if (!this.branchDetails.branch_id) {
                    this.showError("Branch ID is not available!");
                    this.totalSales = '';
                    this.textSkeleton = false;
                    return;
                }
                await this.transactStore.fetchGrossSalesStore(this.branchDetails.branch_id, month);
                const value = Number(this.transactStore.grossSales.total_sales);
                this.totalSales = (Math.round(value * 100) / 100).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '';
            } catch (error) {
                console.error('Error fetching gross sales:', error);
                this.showError("Error fetching gross sales!");
            } finally {
                this.loadingSalesOnly = false;
                this.textSkeleton = false;
            }
        },

        async fetchOrdersOnly(month = null) {
            this.loadingOrdersOnly = true;
            this.textSkeleton = true;
            try {
                if (!this.branchDetails.branch_id) {
                    this.showError("Branch ID is not available!");
                    this.totalOrders = '';
                    this.textSkeleton = false;
                    return;
                }
                await this.transactStore.fetchOrdersOnlyStore(this.branchDetails.branch_id, month); // month added
                this.totalOrders = Number(this.transactStore.ordersOnly.total_orders).toLocaleString('en-PH') || '';
            } catch (error) {
                console.error('Error fetching orders:', error);
                this.showError("Error fetching orders!");
            } finally {
                this.loadingOrdersOnly = false;
                this.textSkeleton = false;
            }
        },

        async fetchProductsOnly() {
            this.loadingProductsOnly = true;
            try {
                if (!this.branchDetails.branch_id) {
                    this.showError("Branch ID is not available!");
                    this.totalProducts = '';
                    return;
                }
                await this.transactStore.fetchProductsOnlyStore(this.branchDetails.branch_id);
                this.totalProducts = Number(this.transactStore.productsOnly.total_products).toLocaleString('en-PH') || '';
            } catch (error) {
                console.error('Error fetching total products:', error);
                this.showError("Error fetching total products!");
            } finally {
                this.loadingProductsOnly = false;
            }
        },

        async fetchStocksOnly() {
            this.loadingStocksOnly = true;
            try {
                if (!this.branchDetails.branch_id) {
                    this.showError("Branch ID is not available!");
                    this.totalStocks = '';
                    return;
                }
                await this.transactStore.fetchStocksOnlyStore(this.branchDetails.branch_id);
                if (this.transactStore.stocksOnly.length === 0) {
                    this.totalStocks = '';
                } else {
                    this.totalStocks = this.transactStore.stocksOnly.total_stocks;
                }
                this.loadingStocksOnly = false;
            } catch (error) {
                console.error('Error fetching total stocks:', error);
                this.showError("Error fetching total stocks!");
            } finally {
                this.loadingStocksOnly = false;
            }
        },

        async fetchSalesByMonthReport(month = null) {
            this.loadingSalesByMonthReports = true;
            try {
                this.isSaving = false;
                if (!this.branchDetails.branch_id) {
                    this.showError("Branch ID is not available!");
                    this.salesByMonthReports = [];
                    return;
                }
                await this.transactStore.fetchSalesByMonthStore(this.branchDetails.branch_id, month);
                this.salesByMonthReports = this.transactStore.salesByMonth || [];
                this.loadingSalesByMonthReports = true;
            } catch (error) {
                console.error('Error fetching sales trends:', error);
                this.showError("Error fetching sales trends!");
            } finally {
                this.loadingSalesByMonthReports = false;
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
                this.fetchStocks();
                this.fetchLowStocks();
                this.showSuccess("Stock updated successfully!");
            } catch (error) {
                console.error('Failed to update stock:', error);
                this.showError("Failed to update stock. Please try again!");
            } finally {
                this.isSaving = false;
            }
        },

        async updatingProduct() {
            if (!this.currentProduct || !this.currentProduct.product_id) {
                this.showError("Invalid product data!");
                return;
            }
            this.isSaving = true;
            this.confirmUpdatingProductDialog = false;
            try {
                const now = new Date();
                const formattedDate = now.toISOString();
                const productData = {
                    product_id: this.currentProduct.product_id,
                    product_name: this.currentProduct.product_name?.trim(),
                    product_price: Number(this.currentProduct.product_price),
                    product_size_id: Number(this.currentProduct.product_size_id),
                    product_temp_id: Number(this.currentProduct.product_temp_id),
                    product_category_id: Number(this.currentProduct.product_category_id),
                    availability_id: Number(this.currentProduct.availability_id),
                    shop_id: this.currentProduct.shop_id,
                    branch_id: this.currentProduct.branch_id,
                };
                const productDataWithUpdatedAt = {
                    product_id: this.currentProduct.product_id,
                    product_name: this.currentProduct.product_name?.trim(),
                    product_price: parseFloat(this.currentProduct.product_price),
                    product_size_id: Number(this.currentProduct.product_size_id),
                    product_temp_id: Number(this.currentProduct.product_temp_id),
                    product_category_id: Number(this.currentProduct.product_category_id),
                    availability_id: Number(this.currentProduct.availability_id),
                    shop_id: this.currentProduct.shop_id,
                    branch_id: this.currentProduct.branch_id,
                    updated_at: formattedDate,
                };
                await this.productsStore.updateProductStore(productData);
                console.log("Updated product:", productData);

                await this.productOptionsStore.fetchAllOptions(); 
                // Insert condition
                const updatedProduct = this.formatProduct({ ...this.currentProduct, ...productDataWithUpdatedAt });
                const index = this.products.findIndex(
                    p => p.product_id === this.currentProduct.product_id
                );
                if (index !== -1) {
                    this.products.splice(index, 1, updatedProduct);
                }
                this.productEditDialog = false;
                this.fetchLowStocks();
                this.showSuccess("Product updated successfully!");
            } catch (error) {
                console.error("Failed to update product:", error);
                this.showError(error);
            } finally {
                this.isSaving = false;
            }
        },

        async updatingIngredient() {
            this.isSaving = true;
            try {
                const ingredientData = {
                    product_ingredient_id: this.currentIngredient.product_ingredient_id,
                    product_id: this.currentIngredient.product_id,
                    stock_id: this.currentIngredient.stock_id,
                    unit_usage: this.currentIngredient.unit_usage,
                    ingredient_capital: parseFloat(this.currentIngredient.ingredient_capital),
                };
                console.log(ingredientData);
                await this.productsStore.updateIngredientStore(ingredientData);
                this.productEditDialog = false;
                this.confirmUpdatingEditDialog = false;
                this.ingredientEditDialog = false;
                this.dialogIngredients = false;
                this.confirmUpdatingIngredientDialog = false
                this.fetchProducts();
                this.showSuccess("Ingredient updated successfully!");
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
            const temp = this.productTemperatureOption.find(t => t.temp_id === Number(product.product_temp_id)); 
            const size = this.productSizeOption.find(s => s.size_id === Number(product.product_size_id)); 
            const category = this.productCategoryOption.find(c => c.category_id === Number(product.product_category_id)); 
            const availability = this.productAvailabilityOption.find(a => a.availability_id === Number(product.availability_id)); 
            return {
                ...product,
                temp_label: temp?.temp_label,
                size_label: size?.size_label,
                category_label: category?.category_label,
                availability_label: availability?.availability_label,
                product_temp_id: Number(product.product_temp_id),
                product_size_id: Number(product.product_size_id),
                product_category_id: Number(product.product_category_id),
                availability_id: Number(product.availability_id),
                product_name: this.capitalizeFirstLetter(product.product_name),
                display_product_price: `₱${product.product_price}`,
                updated_at: this.formatDateTime(product.updated_at),
            };
        },

        formatIngredient(ingredient) {
            return {
                ...ingredient,
                stock_ingredient: this.capitalizeFirstLetter(ingredient.stock_ingredient),
                ingredient_capital: ingredient.ingredient_capital,
                unit: `${ingredient.unit_usage}${ingredient.unit_avb}`,
                updated_at: this.formatDateTime(ingredient.updated_at),
            };
        },

        formatStock(stock) {
            return {
                ...stock,
                stock_ingredient: this.capitalizeFirstLetter(stock.stock_ingredient),
                stock_unit: Number(stock.stock_unit),
                stock_in: Number(stock.stock_in),
                stock_alert_qty: Number(stock.stock_alert_qty),
                availability_id: Number(stock.availability_id),
                display_stock_in: `${stock.stock_in} ${stock.stock_in > 1 ? 'items' : 'item'}`,
                display_unit_cost: `₱${stock.stock_cost_per_unit}`,
                updated_at: this.formatDateTime(stock.updated_at),
            };
        },

        formatReversalOrders(rev_order) {
            return {
                ...rev_order,
                display_product_name: `${ rev_order.product_name }${ rev_order.temp_label }${ rev_order.size_label }` || '',
                updated_at: rev_order.updated_at ? this.formatDateTime(rev_order.updated_at) : 'N/A',
            };
        },

        formatTransactions(orders) {
            return {
                ...orders,
                display_customer_cash: `₱${orders.customer_cash}`,
                display_customer_charge: `₱${orders.customer_charge}`,
                display_customer_change: `₱${orders.customer_change}`,
                display_total_quantity: orders.total_quantity,
                updated_at: this.formatDateTime(orders.updated_at),
            };
        },

        formatSalesByDate(sale) {
            return {
                ...sale,
                display_product_name: `${sale.product_name}${sale.temp_label}${sale.size_label}`,
                updated_at: this.formatDateTime(sale.updated_at),
                display_product_price: `₱${sale.product_price}`,
                display_total_quantity: sale.total_quantity,
                display_sales: `₱${sale.sales}`,
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
                hour12: true,
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

        showStockAlert(message) {
            this.$refs.lowStockAlertRef.showSnackbarAlert(message, "error");
        },

        showSuccess(message) {
            this.$refs.snackbarRef.showSnackbar(message, "success");
        },

    }
};
</script>
