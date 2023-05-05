<template>
    <div class="container">
        <div v-if="loading" style="position: absolute; top: 50%;left: 50%;">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <div v-else>
            <div class="row mt-5">
                <div class="col-md-12">
                    <div class="card shadow">
                        <div class="card-header">
                            <h3>Category List
                                <router-link to="/category/add" class="btn btn-sm btn-outline-primary float-end">Add
                                    Category</router-link>
                            </h3>

                        </div>
                        <div class="card-body">
                            <table class="table table-bordered table-triped">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Name</th>
                                        <th>Icon</th>
                                        <th>Color</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody v-for="category in categories" :key="category._id">
                                    <tr>
                                        <td>{{ category._id }}</td>
                                        <td>{{ category.name }}</td>
                                        <td>{{ category.icon }}</td>
                                        <td>{{ category.color }}</td>
                                        <td>
                                            <router-link :to="'/category/edit/' + category._id"
                                                class="btn btn-sm btn-outline-primary me-2">Edit</router-link>
                                            <button class="btn btn-sm btn-outline-danger"
                                                @click="deleteCategory(category._id)">Delete</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            categories: [],
            loading: true,
        };
    },
    methods: {
        deleteCategory(categoryId) {
            if (confirm("Are you sure you want to delete this category?")) {
                axios.delete(`http://localhost:5000/api/category/${categoryId}`)
                    .then(() => {
                        this.categories = this.categories.filter(category => category._id !== categoryId);
                    })
                    .catch(error => console.log(error));
            }
        },

    },
    mounted() {
        axios.get('http://127.0.0.1:5000/api/category')
            .then(response => {
                this.categories = response.data;
                console.log(response.data);
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