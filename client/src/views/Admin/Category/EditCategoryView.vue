<template>
    <div class="container" id="category">
        <div class="row mt-5">
            <div class="col-md-12">
                <div class="card shadow">
                    <div class="card-header">
                        <h3>Edit Category
                            <router-link to="/category" class="btn btn-sm btn-outline-primary float-end">Back</router-link>
                        </h3>
                    </div>
                    <div class="card-body">
                        <form>
                            <div class="mb-2">
                                <label for="name">Name:</label>
                                <input type="text" class="form-control" id="name" v-model="category.name">
                                <small v-if="errors.name" class="text-danger">{{ errors.name }}</small>
                            </div>
                            <div class="mb-2">
                                <label for="icon">Icon:</label>
                                <input type="text" class="form-control" id="icon" v-model="category.icon">
                                <small v-if="errors.icon" class="text-danger">{{ errors.icon }}</small>
                            </div>
                            <div class="mb-2">
                                <label for="color">Color:</label>
                                <input type="text" class="form-control" id="color" v-model="category.color">
                                <small v-if="errors.color" class="text-danger">{{ errors.color }}</small>
                            </div>
                            <button type="submit" class="btn btn-sm btn-outline-primary float-end"
                                @click.prevent="updateCategory">Update Category</button>
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
export default {
    data() {
        return {
            category: {
                name: "",
                icon: "",
                color: "",
            },
            errors: {
                name: "",
                icon: "",
                color: "",
            },
            isSubmitted: false,
        };
    },
    watch: {
        category: {
            handler(val) {
                this.errors = {};
                this.validate(val);
            },
            deep: true,
        },
    },

    methods: {
        validate(category) {
            if (this.isSubmitted) {
                if (!category.name.trim()) {
                    this.errors.name = "Name is required.";
                }
                if (!category.icon.trim()) {
                    this.errors.icon = "Icon is required.";
                }
                if (!category.color.trim()) {
                    this.errors.color = "Color is required.";
                }
            }
        },
        async getCategoryById() {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/category/${this.$route.params.id}`);
                this.category = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async updateCategory() {
            this.isSubmitted = true;
            this.validate(this.category);
            if (Object.keys(this.errors).length === 0) {
                try {
                    const response = await axios.put(`http://127.0.0.1:5000/api/category/${this.category._id}`, this.category);
                    const { data } = response;
                    console.log(data);
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Category Updated Successfully',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.$router.push('/category');
                } catch (error) {
                    console.error(error);
                }
            }

        },
    },
    mounted() {
        this.getCategoryById();
    },
}
</script>

<style scoped>
#category {
    width: 500px;
}
</style>