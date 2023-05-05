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
                            <h3>Customer List
                            </h3>

                        </div>
                        <div class="card-body">
                            <table class="table table-bordered table-triped">
                                <thead>
                                    <tr>
                                        <td>STT</td>
                                        <th>UserName</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Address</th>
                                    </tr>
                                </thead>
                                <tbody v-for="(item, index) in customer" :key="item._id">
                                    <tr>
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ item.username }}</td>
                                        <td>{{ hiddenEmail(item.email) }}</td>
                                        <td>{{ item.phone ? formatPhoneNumber(item.phone) : 'No Phone' }}</td>
                                        <td>{{ item.address ? item.address : 'No Address' }}</td>
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
            customer: [],
            loading: true,
        };
    },
    methods: {
        formatPhoneNumber(phoneNumber) {
            const lastFourDigits = phoneNumber.substr(phoneNumber.length - 3);
            return `*******${lastFourDigits}`;
        },
        hiddenEmail(email) { // thay đổi email của bạn ở đây
            const parts = email.split("@");
            const hiddenPart = parts[0].substr(0, 4) + "****";
            return `${hiddenPart}@${parts[1]}`;
        },
    },

    mounted() {
        axios.get('http://127.0.0.1:5000/api/customer', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }).then(response => {
            this.customer = response.data;
            this.loading = false;
        }).catch(error => {
            console.log(error);
            this.loading = false;
        });

    }
}
</script>

<style scoped></style>