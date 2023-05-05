<template>
    <div class="container">
        <div v-if="loading" style="position: absolute; top: 50%;left: 50%;">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <div v-else>
            <div class="mt-5">
                <div class="row">
                    <div class="col-md-3">
                        <div class="card card-body bg-primary text-white mb-3 rounded">
                            <h4>Total Product</h4>
                            <h1>{{ totalProd.productCount }}</h1>
                            <router-link to="/product" class=" text-light">View</router-link>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card card-body bg-warning text-white mb-3 rounded">
                            <h4>Total Category</h4>
                            <h1>{{ totalCate.categoryCount }}</h1>
                            <router-link to="/category" class="text-light">View</router-link>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card card-body bg-danger text-white mb-3 rounded">
                            <h4>Total Admin</h4>
                            <h1>{{ totalUser.userCount }}</h1>
                            <router-link to="/dashboard" class="text-light">View</router-link>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card card-body bg-secondary text-white mb-3 rounded">
                            <h4>Total Customer</h4>
                            <h1>{{ totalCustomer.customerCount }}</h1>
                            <router-link to="/customer" class="text-light">View</router-link>
                        </div>
                    </div>
                </div>
                <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
export default {
    components: { Bar },
    data() {
        return {
            totalProd: 0,
            totalCate: 0,
            totalUser: 0,
            totalCustomer: 0,
            loading: true,
            chartData: {
                labels: ['Jan', 'Feb', 'Mar', 'Arp', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Ocp', 'Nov', 'Dec'],
                datasets: [{ 
                    label: 'Statistics on products sold in 2023', 
                    backgroundColor: '#5196f7',
                    data: [34, 20, 10, 8, 3, 22, 33, 11, 5, 28, 8, 35,] 
                }]
            },
            chartOptions: {
                responsive: true
            }
        }
    },
    async mounted() {
        try {
            await axios.get('http://127.0.0.1:5000/api/product/get/count')
                .then(response => {
                    this.totalProd = response.data;
                })
                .catch(error => {
                    console.log(error);
                });

            await axios.get('http://127.0.0.1:5000/api/category/get/count')
                .then(response => {
                    this.totalCate = response.data;
                })
                .catch(error => {
                    console.log(error);
                });

            await axios.get('http://127.0.0.1:5000/api/user/get/count', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then(response => {
                    this.totalUser = response.data;
                })
                .catch(error => {
                    console.log(error);
                });

            await axios.get('http://127.0.0.1:5000/api/customer/get/count', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then(response => {
                    this.totalCustomer = response.data;
                })
                .catch(error => {
                    console.log(error);
                });
            this.loading = false;
        } catch (error) {
            console.log(error);
            this.loading = false;
        }


    }
}
</script>

<style scoped></style>