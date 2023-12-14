<script>

import useCategories from '@/composables/categories';
import DeleteCategoryModal from '@/components/modal components/categories/DeleteCategoryModal.vue';
import EditCategoryModal from '@/components/modal components/categories/EditCategoryModal.vue';
import { onMounted , ref , reactive } from 'vue';
import axios from 'axios';
import '@/styles/categories-management.css'
import '@/styles/create-category-model.css'

export default {
    components:{
        DeleteCategoryModal ,
        EditCategoryModal
    } ,
    setup() {

        const permissions = JSON.parse(localStorage.getItem('permissions'));
        const {categories , getAllCategories , getCategory , category} = useCategories();

        let isShowCreateCategoryModal = ref(false);
        let isShowMsgCategoryCreate = ref(false);
        let isShowMsgCategoryDelete = ref(false);
        let formData = reactive({
            name: '' ,
        });
        let errors = ref({});

        /***************
         * On Mounted
        ***************/
        onMounted(() =>{ 
            getAllCategories(); 
        });

        /**************************************
         * Show / Close Create Category Modal
        **************************************/
        const showCreateCategoryModal = () => {

            isShowCreateCategoryModal.value = true;
            document.body.style.cssText = 'overflow:hidden'; 
        } 
        const closeCreateCategoryModal = () => {

            isShowCreateCategoryModal.value = false;
            document.body.style.cssText = 'overflow:scroll';
            formData.name = '';
            errors.value.name = '';
        } 

        /******************
         * Store Category
        ******************/
        const storeCategory = async (data) => {

            try {

                await axios.post(`http://127.0.0.1:8000/api/ScrumPro/categories` , data);
                getAllCategories();
                closeCreateCategoryModal();

                isShowMsgCategoryCreate.value = true;
                setTimeout(() => {
                    isShowMsgCategoryCreate.value = false;
                }, 3500);
            }
            catch (error) {

                if(error.response.status === 422){

                    errors.value = error.response.data.errors;
                }
            }
            
        }

        /********************
         * Destroy Category
        ********************/
        const destroyCategory = async (id) =>{

            if(!confirm(`Are you sure deleted this category ?`)){
                
                return ;

            } else{
                await axios.delete(`http://127.0.0.1:8000/api/ScrumPro/categories/${id}`);
                await getAllCategories();
                isShowMsgCategoryDelete.value = true;
                setTimeout(() => {
                    isShowMsgCategoryDelete.value = false;
                }, 3500);
            }
        }

        /**********
         * return
        **********/
        return{
            categories ,
            destroyCategory ,
            isShowCreateCategoryModal ,
            showCreateCategoryModal ,
            closeCreateCategoryModal ,
            storeCategory ,
            errors ,
            formData ,
            isShowMsgCategoryCreate , 
            isShowMsgCategoryDelete ,
            permissions
        }
    }
}

</script>

<template>
    <!-- Category page -->
    <div id="categories-management">
        <header>
            <h4> categories & skills management </h4>
            <div class="buttons" v-if="permissions.includes('create new category')">                
                <button type="button" class="btn btn-primary" @click="showCreateCategoryModal">
                    <i class="fa fa-plus"></i>
                    create category
                </button>
            </div>
        </header>

        <section class="container">
            <div class="row">
                <!-- Section Categories -->
                <div class="col-sm-6 categories">
                    <div
                        v-for="category in categories"  :key="category.id"
                        class="category-box col-sm-11 shadow-sm">
                        <span class="user-count-caetgory" title="Developers Count"> 
                            {{category.users_count}} 
                        </span>
                        <h5> {{category.name}} </h5>
                        <ul>

                            <li>
                                <router-link 
                                   :to=" {
                                        name: 'view-skills' , 
                                        params: {id: category.id}
                                   } " 
                                >
                                    <i class="fa fa-gear text-secondary"></i> 
                                </router-link> 
                            </li>
                            <li v-if="permissions.includes('edit category')"> 
                                <i 
                                    class="fa fa-edit text-success"
                                    data-bs-toggle="modal" 
                                    :data-bs-target=" '#editCategoryModal' + category.id "
                                >
                                </i>
                            </li>
                            <li v-if="permissions.includes('delete category')">
                                <i 
                                    class="fa fa-trash text-danger"
                                    @click="destroyCategory(category.id)"
                                    :title="category.id"
                                >
                                </i>
                            </li>
                        </ul>

                        <EditCategoryModal 
                            :categoryID="category.id"
                            :modelID=" 'editCategoryModal' + category.id "
                        />

                    </div>
                </div>
                <!-- Section Categories -->

                <!-- section skills -->
                <div class="col-sm-6 skills">

                    <router-view />
                </div>
            </div>             
        </section>
    </div>
    <!-- Category page -->

    <!-- Create Category Modal -->
    <div class="modal-main" id="createCategoryModal" v-if="isShowCreateCategoryModal">
        <div class="modal-box">
            <div class="box-header">
                <h5> Create Category </h5>
                <button class="btn-close" @click="closeCreateCategoryModal"></button>
            </div>
            <form @submit.prevent="storeCategory(formData)">
                <div class="box-body">
                    <div class="mb-3">
                        <label for="role-name" class="col-form-label">Category Name</label>
                        <span 
                            class="text-danger error" 
                            v-if="errors.name && errors.name[0] != ''"
                        > 
                            <i 
                                class="fa fa-exclamation-circle"
                            ></i>
                            {{errors.name[0]}}
                        </span>
                        <input 
                            type="text" 
                            placeholder="Enter category name" 
                            class="form-control" 
                            id="category-name"
                            v-model="formData.name"
                            required
                        >
                    </div>
                </div>
                <div class="box-footer">
                    <button 
                        type="button" 
                        class="btn btn-secondary" 
                        @click="closeCreateCategoryModal"
                    >
                        close
                    </button>
                    <button type="submit" class="btn btn-success">
                        create
                    </button>
                </div>
            </form>
        </div>
    </div>
    <!-- Create Category Modal -->

    <!-- Success Message Create Catgeory -->
    <div id="alert-success" v-if="isShowMsgCategoryCreate">
        <i class="fa fa-check"> </i>
        <p>
            Successfully <b> Created </b> Category
        </p>
    </div>
    <!-- Success Message Create Catgeory -->

    <!-- Success Message Delete Catgeory -->
    <div id="alert-success" v-if="isShowMsgCategoryDelete">
        <i class="fa fa-check"> </i>
        <p>
            Successfully <b> Deleted </b> Category
        </p>
    </div>
    <!-- Success Message Delete Catgeory -->
</template>
