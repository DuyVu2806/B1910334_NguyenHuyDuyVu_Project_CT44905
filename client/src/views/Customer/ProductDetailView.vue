<template>
    <div class="container">
        <div v-if="loading" style="position: absolute; top: 50%;left: 50%;">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <div v-else>
            <div class="mb-2">
                <div class="card card-body shadow">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card">
                                <img :src="product.image" alt="" style="height: 550px;">
                            </div>

                        </div>
                        <div class="col-md-6">
                            <h4>{{ product.name }}</h4>
                            <h6>/home/product</h6>
                            <h5 class="text-info mb-4" style="margin-top: 50px;"> ${{ product.price }}</h5>

                            <div class="mb-4">
                                <button @click="decrement" class="btn btn-outline-danger me-1">-</button>
                                <input type="text" readonly v-model="quantity" style="width: 50px; border-color: black;"
                                    class="text-center btn">
                                <button @click="increment" class="btn btn-outline-primary ms-1">+</button>
                            </div>

                            <button class="btn btn-outline-primary" @click="addToCart">Add to cart</button>
                        </div>
                    </div>
                    <div class="col-md-12 mt-3">
                        <ul class="nav nav-tabs" id="myTab" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active h5" id="description-tab" data-bs-toggle="tab"
                                    data-bs-target="#description-tab-pane" type="button" role="tab"
                                    aria-controls="description-tab-pane" aria-selected="true">Description</button>
                            </li>
                        </ul>
                        <div class="tab-content" id="myTabContent">
                            <div class="tab-pane fade border p-3 show active" id="description-tab-pane" role="tabpanel"
                                aria-labelledby="description-tab" tabindex="0">
                                <div v-html="product.description"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import jwt_decode from 'jwt-decode'
import axios from 'axios';
import { mapActions } from 'vuex';
export default {
    data() {
        return {
            product: {
                name: '',
                price: '',
                brand: '',
                category: '',
                image: null,
                description: '',
                rating: 0,

            },
            categories: [],
            quantity: 1,
            loading: true,
            userId: '',
        }
    },
    methods: {
        increment() {
            this.quantity++;
        },
        decrement() {
            if (this.quantity > 1) {
                this.quantity--;
            }
        },
        async getProductById() {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/product/${this.$route.params.id}`);
                this.product = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        ...mapActions(['addToCartAction']),
        addToCart() {
            try {
                const token = localStorage.getItem('tokenCustomer')
                if (token) {
                    const decoded = jwt_decode(token)
                    this.userId = decoded.userId
                }else {
                    this.$router.push('/customer/login');
                }
                const userId = this.userId; // Lấy userId từ state hoặc từ đường dẫn URL
                const productId = this.product._id; // Lấy productId từ đường dẫn URL hoặc từ một đối tượng sản phẩm truyền vào component
                const quantity = this.quantity; // Lấy số lượng sản phẩm từ form hoặc một biến trong state
                if (!userId) {
                    return
                }
                this.addToCartAction({ userId, productId, quantity });
            } catch (error) {
                console.log(error);
            }

        }

    },
    async mounted() {
        await this.getProductById();
        await axios.get('http://127.0.0.1:5000/api/category')
            .then(response => {
                this.categories = response.data;
                this.loading = false;
            })
            .catch(error => {
                console.log(error);
                this.loading = false;
            });
    },
}
</script>

<style scoped></style>