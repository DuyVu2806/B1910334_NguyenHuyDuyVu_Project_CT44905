<template>
    <div class="container mt-2">
        <div v-if="loading" style="position: absolute; top: 50%;left: 50%;">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <div v-else class="py-2">
            <swiper :slidesPerView="1" :spaceBetween="10" :pagination="{
                clickable: true, el: '.swiper-pagination',
                type: 'bullets'
            }" :breakpoints="{
    '@0.00': {
        slidesPerView: 1,
        spaceBetween: 10,
    },
    '@0.75': {
        slidesPerView: 2,
        spaceBetween: 20,
    },
    '@1.00': {
        slidesPerView: 3,
        spaceBetween: 40,
    },
    '@1.50': {
        slidesPerView: 4,
        spaceBetween: 50,
    },
}" :modules="modules" class="mySwiper py-4">
                <div class="swiper-pagination" style="bottom: 0;"></div>
                <swiper-slide v-for="product in products" :key="product._id">
                    <div class="card">
                        <h6 class="card-border text-light">Trending</h6>
                        <div class="image-content">
                            <span class="overplay"></span>
                            <div class="card-image">
                                <img class="card-img" :src="product.image" alt="">
                            </div>
                        </div>
                        <div class="card-content">
                            <h2 class="name text-info text-center">{{ product.name }}</h2>
                            <span class="text-secondary">{{ product.category.name }}</span>
                            <span class="decription mb-3">

                                <span class="text-primary">${{ product.price }}</span>
                            </span>
                            <span>
                                <router-link :to="'/customer/product/' + product._id"
                                    class="btn btn-sm btn-outline-primary me-3">View more</router-link>
                                <button @click="addToCart(product._id)" class="btn btn-sm btn-outline-danger">Add to
                                    card</button>
                            </span>

                        </div>
                    </div>
                </swiper-slide>
            </swiper>
        </div>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { mapActions } from 'vuex';
export default {
    components: {
        Swiper,
        SwiperSlide,
    },
    data() {
        return {
            products: [],
            loading: true,
            quantity: 1,
            userId: '',
        };
    },
    setup() {
        return {
            modules: [Pagination],
        };
    },
    mounted() {
        axios.get('http://127.0.0.1:5000/api/product')
            .then(response => {
                this.products = response.data;
                this.loading = false;
            })
            .catch(error => {
                console.log(error);
                this.loading = false;
            });
    },
    methods: {
        ...mapActions(['addToCartAction']),
        addToCart(prodId) {
            try {
                const token = localStorage.getItem('tokenCustomer')
                if (token) {
                    const decoded = jwt_decode(token)
                    this.userId = decoded.userId
                } else {
                    this.$router.push('/customer/login');
                }
                const userId = this.userId; // Lấy userId từ state hoặc từ đường dẫn URL
                const productId = prodId; // Lấy productId từ đường dẫn URL hoặc từ một đối tượng sản phẩm truyền vào component
                const quantity = this.quantity; // Lấy số lượng sản phẩm từ form hoặc một biến trong state
                if (!userId) {
                    // userId is not available, you can handle it accordingly
                    return
                }
                this.addToCartAction({ userId, productId, quantity });
            } catch (error) {
                console.log(error);
            }

        }
    }
}
</script>

<style scoped>
.card-image {
    position: relative;
    height: 230px;
    width: 230px;
}

.card-image .card-img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 10px;
}

.card {
    position: relative;
    /* width: 320px; */
    border-radius: 5px;
    background-color: #fff;
}

.card .card-border {
    position: absolute;
    top: 0%;
    left: 0%;
    z-index: 1;
    border: 1px solid #6ee0ff;
    border-radius: 12px;
    background-color: #6ee0ff;
    padding: 2px 3px
}

.overplay {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: #d0ddff5f;
    border-radius: 25px 25px 0 0;
}

.image-content,
.card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 14px;
}

.image-content {
    position: relative;
    row-gap: 5px
}

.name {
    font-size: 18px;
    font-weight: 500;
    white-space: nowrap;
    width: 260px;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>