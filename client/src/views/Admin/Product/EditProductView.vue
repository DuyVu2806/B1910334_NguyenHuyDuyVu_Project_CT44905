<template>
    <div class="container">
        <div class="row mt-5">
            <div class="col-md-12">
                <div class="card shadow mb-5">
                    <div class="card-header">
                        <h3>
                            Edit Product
                            <router-link to="/product" class="btn btn-sm btn-outline-primary float-end">Back</router-link>
                        </h3>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="updateProduct">
                            <div class="row mb-2">
                                <div class="col-md-6">
                                    <label for="">Name Product</label>
                                    <input type="text" class="form-control" id="name" v-model="product.name">
                                    <small v-if="errors.name" class="text-danger">{{ errors.name }}</small>
                                </div>
                                <div class="col-md-6">
                                    <label for="">Brand</label>
                                    <input type="text" class="form-control" id="brand" v-model="product.brand">
                                    <small v-if="errors.brand" class="text-danger">{{ errors.brand }}</small>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-md-6">
                                    <label for="">Category Name</label>
                                    <select class="form-control" v-model="product.category._id">
                                        <option value="">Choose a Category</option>
                                        <option v-for="category in categories" :key="category._id" :value="category._id" :selected="product.category._id == category._id">
                                            {{ category.name }}
                                        </option>
                                    </select>
                                    <small v-if="errors.category" class="text-danger">{{ errors.category }}</small>
                                </div>
                                <div class="col-md-3">
                                    <label for="">Count In Stock</label>
                                    <input type="number" class="form-control" id="countInStock"
                                        v-model="product.countInStock">
                                    <small v-if="errors.countInStock" class="text-danger">{{ errors.countInStock }}</small>
                                </div>
                                <div class="col-md-3">
                                    <label for="">Is Feature</label>
                                    <select name="" id="isFeatured" class="form-control" v-model="product.isFeatured">
                                        <option value="true" selected>True</option>
                                        <option value="false">False</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-md-6">
                                    <label for="">Image</label>
                                    <input type="file" ref="image" class="form-control" id="image" @change="onFileChange">
                                    <small v-if="errors.image" class="text-danger">{{ errors.image }}</small>
                                </div>
                                <div class="col-md-3">
                                    <label for="">Price</label>
                                    <input type="text" class="form-control" id="price" v-model="product.price">
                                    <small v-if="errors.price" class="text-danger">{{ errors.price }}</small>
                                </div>
                                <div class="col-md-3">
                                    <label for="">Rating</label>
                                    <input type="text" class="form-control" value="0" readonly>
                                </div>
                            </div>

                            <div class="col-md-6 ms-2">
                                <img v-if="product.selectedImage" :src="product.selectedImage " height="100">
                                <img v-else-if="product.image" :src="product.image" height="100">
                                <button v-if="product.selectedImage" type="button" class="btn btn-sm btn-outline-danger"
                                    @click="deleteImage">Delete</button>
                            </div>

                            <div class="mb-4">
                                <label for="">Description</label>
                                <QuillEditor toolbar="full" id="description" v-model:content="product.description" contentType="html" :style="{ height: '500px' }"/>
                                <small v-if="errors.description" class="text-danger">{{ errors.description }}</small>
                            </div>
                            <button type="submit" class="btn btn-sm btn-outline-primary float-end">Edit Product</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
import axios from 'axios';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
export default {
    components: {
        QuillEditor
    },
    data() {
        return {
            product: {
                name: '',
                price: '',
                brand: '',
                category: '',
                countInStock: '',
                isFeatured: true,
                image: null,
                description: '',
                rating: 0,
                selectedImage: '',
            },
            categories: [],
            errors: {
                name: '',
                price: '',
                brand: '',
                category: '',
                countInStock: '',
                image: null,
                description: '',
            },
            isSubmitted: false,
        }
    },
    watch: {
        product: {
            handler(val) {
                this.errors = {};
                this.validate(val);
            },
            deep: true,
        },
    },
    methods: {
        validate(product) {
            if (this.isSubmitted) {
                if (!product.name.trim()) {
                    this.errors.name = "Name is required.";
                }
                if (!product.price) {
                    this.errors.price = "Price is required.";
                } else if (isNaN(product.price)) {
                    this.errors.price = "Price must be a number.";
                }
                if (!product.brand.trim()) {
                    this.errors.brand = "Brand is required.";
                }
                if (!product.category) {
                    this.errors.category = "Category is required.";
                }
                if (!product.countInStock) {
                    this.errors.countInStock = "Count In Stock is required.";
                }
                if (!product.description.trim()) {
                    this.errors.description = "Description is required.";
                }
                if (product.image == null) {
                    this.errors.image = "Image is required.";
                }
            }
        },

        async getProductById(){
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/product/${this.$route.params.id}`);
                this.product = response.data;
            } catch (error) {
                console.error(error);
            }
        },

        async onFileChange(event) {
            const file = event.target.files[0];
            this.product.image = file;
            this.product.selectedImage = URL.createObjectURL(file);
        },
        deleteImage() {
            this.product.selectedImage = null;
            this.errors.image = null;
            this.$refs.image.value = "";
        },
        async updateProduct() {
            this.isSubmitted = true;
            this.validate(this.product);
            if (Object.keys(this.errors).length === 0) {
                try {
                    const formData = new FormData();
                    formData.append('name', this.product.name);
                    formData.append('price', this.product.price);
                    formData.append('brand', this.product.brand);
                    formData.append('category', this.product.category._id);
                    formData.append('countInStock', this.product.countInStock);
                    formData.append('isFeatured', this.product.isFeatured);
                    formData.append('description', this.product.description);
                    formData.append('rating', this.product.rating);
                    formData.append('image', this.product.image);
                    const response = await axios.put(`http://127.0.0.1:5000/api/product/${this.product._id}`, formData);
                    const { data } = response;
                    console.log(data);
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Product Updated Successfully',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.$router.push('/product');
                } catch (error) {
                    console.error(error.response);
                }
            }

        }
    },

    mounted() {
        this.getProductById();
        axios.get('http://127.0.0.1:5000/api/category')
            .then(response => {
                this.categories = response.data;
            })
            .catch(error => {
                console.log(error);
            });
    },
}
</script>

<style scoped></style>