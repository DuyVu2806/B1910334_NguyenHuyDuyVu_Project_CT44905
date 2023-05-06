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
          <div class="col-md-12 mb-3">
            <input type="text" class="form-control" placeholder="Search by product name or description" v-model="search">
          </div>
          <div class="card shadow">
            <div class="card-header">
              <h3>Product List
                <router-link to="/product/add" class="btn btn-sm btn-outline-primary float-end">Add
                  Product</router-link>
              </h3>

            </div>
            <div class="card-body">
              <table class="table table-bordered table-triped">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Count In Stock</th>
                    <th>isFeatured</th>
                    <th>Rating</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody v-for="(product, index) in filteredProducts" :key="product._id">
                  <tr>
                    <td>{{ index + 1 }}</td>
                    <td>{{ product.name }}</td>
                    <td>
                      <img :src="product.image" alt="" style="width:30px;height:30px;">
                    </td>
                    <td>{{ product.brand }}</td>
                    <td>{{ product.category.name }}</td>
                    <td>{{ product.countInStock }}</td>
                    <td>{{ product.isFeatured ? 0 : 1 }}</td>
                    <td>{{ product.rating }}</td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal"
                        v-bind:data-bs-target="'#modal-' + product._id">View</button>
                    </td>
                    <td>
                      <router-link :to="'/product/edit/' + product._id"
                        class="btn btn-sm btn-outline-primary me-2">Edit</router-link>
                      <button class="btn btn-sm btn-outline-danger" @click="deleteProduct(product._id)">Delete</button>
                    </td>
                  </tr>
                  <!-- start modal -->
                  <div class="modal fade" :id="'modal-' + product._id" data-bs-backdrop="static" data-bs-keyboard="false"
                    tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog modal-xl">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h1 class="modal-title fs-5" id="staticBackdropLabel">View Description</h1>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          <div v-html="product.description"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- end modal -->
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
export default ({
  name: 'ProductView',
  data() {
    return {
      products: [],
      loading: true,
      search: ''
    };
  },
  methods: {
    deleteProduct(ProductId) {
      if (confirm("Are you sure you want to delete this category?")) {
        axios.delete(`http://localhost:5000/api/product/${ProductId}`)
          .then(() => {
            this.products = this.products.filter(product => product._id !== ProductId);
          })
          .catch(error => console.log(error));
      }
    },

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
  computed: {
  filteredProducts() {
    return this.products.filter(product => {
      // nếu giá trị của biến search xuất hiện trong tên sản phẩm
      // hoặc trong mô tả sản phẩm và category thì trả về true
      return product.name.toLowerCase().includes(this.search?.toLowerCase()) ||
             product.description.toLowerCase().includes(this.search?.toLowerCase())||
             product.category.name.toLowerCase().includes(this.search?.toLowerCase())||
             product.brand.toLowerCase().includes(this.search?.toLowerCase());
    });
  }
}
});
</script>
