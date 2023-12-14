<script>

import useRoles from '@/composables/roles';
import useCategories from '@/composables/categories';
import useSkills from '@/composables/skills';
import DeleteUserModal from '@/components/modal components/users/DeleteUserModal.vue';
import CreateUserModal from '@/components/modal components/users/CreateUserModal.vue';
import ViewUserModal from '@/components/modal components/users/ViewUserModal.vue';
import ChangeUserStatusModal from '@/components/modal components/users/ChangeStatusModal.vue';
import '@/styles/users-management.css';
import '@/styles/create-user-modal.css';
import { onMounted, ref, reactive, watchEffect } from 'vue';
import axios from 'axios';

export default {
    components:{
        DeleteUserModal , 
        CreateUserModal ,
        ViewUserModal ,
        ChangeUserStatusModal
    } ,
    
    setup(){

        const permissions = JSON.parse(localStorage.getItem('permissions'));

        const {roles , getAllRoles} = useRoles();
        const {categories , getAllCategories} = useCategories();
        const {skills , getAllSkillsInCategory} = useSkills();

        let isShowCreateUserModal = ref(false);
        let isShowMsgUserCreate = ref(false);

        const userData = ref({});

        let formData = reactive({
            full_name: '' ,
            email: '' ,
            password: '' ,
            phone: '' ,
            address: '' ,
            gender: '' ,
            birthday: '' ,
            role_id: '' ,
            rank: 0 ,
            category_id: null ,
            hourly_rate: null ,
            skills : ref([]) ,
        });
        let errors = ref({});

        let formDataSearch = reactive({
            search: '' ,
            status: '' ,
            role: '' ,
            category: ''
        });

        /***********************************
         * Show / Close Create User Modal
        ***********************************/
        const showCreateUserModal = () => {

            isShowCreateUserModal.value = true;
            document.body.style.cssText = 'overflow:hidden'; 
        } 
        const closeCreateUserModal = () => {

            isShowCreateUserModal.value = false;
            document.body.style.cssText = 'overflow:scroll';
            formData.full_name = '';
            formData.email = '';
            formData.password = '';
            formData.phone = '';
            formData.address = '';
            formData.gender = '';
            formData.birthday = '';
            formData.role_id = '';
            formData.category_id = null;
            formData.hourly_rate = null;
            formData.skills = ref([]);

            errors.value.email = '';
        } 

        /**************
         * On Mounted
        **************/
        onMounted(()=>{
            getAllRoles();
            getAllCategories();
            getUsers();
        });

        /***************************
         * Show Skills In Category
        ***************************/
        const showSkills = () => {

            watchEffect(()=>{
                getAllSkillsInCategory(formData.category_id);
            });
        }

        /***************
         * Store User
        ***************/
        const storeUser = async (data) => {

            let generatePassword = data.full_name + ' ' + Math.trunc(Math.random()*1000);
            data.password = generatePassword;

            try {
                
                await axios.post(`http://127.0.0.1:8000/api/ScrumPro/users` , data);
                closeCreateUserModal();

                await getUsers();

                isShowMsgUserCreate.value = true;
                setTimeout(() => {
                    isShowMsgUserCreate.value = false;
                }, 3500);

            } catch (error) {

                if(error.response.status === 422){

                    errors.value = error.response.data.errors;
                }
            }
        }

        /*****************
         * get All Users
        *****************/
        let userDataLength = ref('');
        const getUsers = async (URL = 'http://127.0.0.1:8000/api/ScrumPro/users?page=1') =>{

            await axios.get(`${URL}
                             &search=${formDataSearch.search}
                             &status=${formDataSearch.status}
                             &role=${formDataSearch.role}
                             &category=${formDataSearch.category}
                            `)
            .then(response =>{

                userData.value = response.data;
            });
            userDataLength.value = userData.value.links.length;
        }   

        /**********
         * return 
        **********/
        return{
            roles ,
            categories ,
            skills ,
            isShowCreateUserModal ,
            isShowMsgUserCreate ,
            formData ,
            showCreateUserModal ,
            closeCreateUserModal ,
            errors ,
            showSkills ,
            storeUser ,
            userData ,
            getUsers ,
            formDataSearch ,
            userDataLength ,
            permissions
        }
    }
}

</script>

<template>

    <!-- Users Management Page -->
    <div id="users-management">

        <!-- Users Page Header -->
        <header>
            <h4> users management </h4>
            <!-- 
                data-bs-toggle="modal" data-bs-target="#createNewUserModal"
            -->
            <div 
                class="buttons"
                v-if="permissions.includes('create new user')"
            >
                <button type="button" class="btn btn-primary" @click="showCreateUserModal">
                    <i class="fa fa-plus"></i>
                    create new user
                </button>
            </div>
        </header>
        <!-- Users Page Header -->

        <!-- Filter User -->
        <form @submit.prevent="getUsers()">
            <section class="filter">
                <div class="filter-icon">
                    <i class="fa fa-filter"></i>
                </div>
                <div class="select-role">
                    <select v-model="formDataSearch.role"  class="form-select form-control" aria-label="Default select example">
                        <option value=""> all roles </option>
                        <option
                            v-for="role in roles" :key="role.id"
                            :value="role.name"
                        >
                            {{role.name}}
                        </option>
                    </select>
                </div>
                <div class="select-status">
                    <select v-model="formDataSearch.status" class="form-select form-control" aria-label="Default select example">
                        <option value=""> all status </option>
                        <option value="1">active</option>
                        <option value="0">deactive</option>
                    </select>
                </div>
                <div class="select-catgeory">
                    <select v-model="formDataSearch.category" class="form-select form-control" aria-label="Default select example">
                        <option value=""> all categories </option>
                        <option
                            v-for="category in categories" :key="category.id"
                            :value="category.name"
                        >
                            {{category.name}}
                        </option>
                    </select>
                </div>
                <div class="input-search">
                    <i id="input-icon-search" class="fa fa-search"></i>
                    <input 
                        type="text" 
                        class="form-control" 
                        placeholder="Serach ..."
                        v-model="formDataSearch.search"
                    >
                    <button type="submit" class="btn">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
            </section>
        </form>
        <!-- Filter User -->

        <!-- Users Management Table -->
        <table class="table shadow-sm">
            <thead>
                <tr>
                    <th class="th-sm">Name</th>
                    <th class="th-sm">Email</th>
                    <th class="th-sm">Role</th>
                    <th class="th-sm">Category</th>
                    <th class="th-sm">Status</th>
                    <th class="th-sm">Actions</th>
                </tr>
            </thead>
            <tbody>
                
                <tr v-for="user in userData.data" :key="user">
                    <td>
                        <img
                            v-if="user.avatar == null && user.gender == 'male'" 
                            src="@/assets/man.png" 
                            width="55" 
                            height="55"
                            class="img-user"
                        > 
                        <img
                            v-else-if="user.avatar == null && user.gender == 'female' "
                            src="@/assets/woman.png" 
                            width="55" 
                            height="55"
                            class="img-user"
                        >
                        {{user.full_name}}
                    </td>
                    <td> {{user.email}} </td>
                    <td> {{user.role_name}} </td>
                    <td v-if="user.category_name != null"> {{user.category_name}} </td>
                    <td v-else> none </td>
                    <td> 
                        <div 
                            v-if="user.status" 
                            class="status"
                            data-bs-toggle="modal" 
                            :data-bs-target="'#changeStatusUserModal' + user.id"
                        >
                            <span class="bg-success"></span>
                            <p> active </p> 
                        </div>
                        <div 
                            v-else 
                            class="status"
                            data-bs-toggle="modal" 
                            :data-bs-target="'#changeStatusUserModal' + user.id" 
                        >
                            <span class="bg-danger"></span>
                            <p> deactive </p> 
                        </div>
                    </td>
                    <td>
                        <ul>
                            <li>
                                <i 
                                    class="fa fa-gear text-secondary dropdown-item" 
                                    title="View"
                                    data-bs-toggle="modal" 
                                    :data-bs-target="'#viewUserInfoModal' + user.id"
                                ></i>
                            </li>
                            <li v-if="permissions.includes('edit user profile')"> 
                                <i class="fa fa-edit text-success" title="Edit"></i> 
                            </li>
                            <li v-if="permissions.includes('delete user')"> 
                                <i 
                                    class="fa fa-trash text-danger dropdown-item" 
                                    title="Delete"
                                    data-bs-toggle="modal" 
                                    :data-bs-target="'#deleteUserModal' + user.id"
                                ></i> 
                            </li>
                        </ul>
                    </td>

                    <DeleteUserModal 
                        :modalID ="'deleteUserModal' + user.id"
                        :userID  ="user.id" 
                        :userFullName ="user.full_name"
                    />

                    
                    <ChangeUserStatusModal 
                        :modalID ="'changeStatusUserModal' + user.id"
                        :userID  ="user.id" 
                        :userFullName ="user.full_name"
                    />


                    <ViewUserModal 
                        :modelID="'viewUserInfoModal' + user.id"
                        :userID="user.id"
                    />

                </tr>
                
            </tbody>
        </table>
        <!-- Users Management Table -->
    
    </div>
    <!-- Users Management Page -->

    <!-- Create User Modal -->
    <div class="modal-main" id="createUserModal" v-if="isShowCreateUserModal">
        <div class="modal-box">
            <div class="box-header">
                <h5> Create User </h5>
                <button class="btn-close" @click="closeCreateUserModal"></button>
            </div>
            <form @submit.prevent="storeUser(formData)">
                <div class="box-body">
                    <div class="container">
                        <div class="row">
                            <div class="col-sm-6 basic-information">
                                <h5> basic information </h5>
                                <!-- Full Name -->
                                <div class="form-outline mb-4">
                                    <label class="form-label" for="fullName">Full name</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter full name" 
                                        class="form-control"
                                        v-model="formData.full_name" 
                                        id="fullName"
                                        name="fullname"
                                        required
                                    />
                                </div>
                                <!-- Full Name -->
                                <!-- Birthday -->
                                <div class="form-outline mb-4">
                                    <label class="form-label" for="birthday">Birthday</label>
                                    <input 
                                        type="date" 
                                        class="form-control" 
                                        v-model="formData.birthday"
                                        id="birthday"
                                        required
                                    >
                                </div>
                                <!-- Birthday -->
                                <!-- Gender -->
                                <div class="form-outline mb-4">
                                    <label class="form-label">Gender</label>
                                    <div class="content-gender-radio">
                                        <div class="content-male">
                                            <input 
                                                type="radio" 
                                                id="male" 
                                                value="male"
                                                name="gender"
                                                v-model="formData.gender"
                                                required
                                            >
                                            <label for="male">male</label>
                                        </div>
                                        <div class="content-female">
                                            <input 
                                                type="radio"
                                                id="female"
                                                value="female"
                                                name="gender"
                                                v-model="formData.gender"
                                                required
                                            >
                                            <label for="female">female</label>
                                        </div>
                                    </div>
                                </div>
                                <!-- Gender -->
                            </div>

                            <div class="col-sm-6 contact-information">
                                <h5> contact information </h5>
                                <!-- Email --> 
                                <div class="form-outline mb-4">
                                    <label class="form-label" for="email">Email</label>
                                    <span 
                                        class="text-danger error" 
                                        v-if="errors.email && errors.email[0] != ''"
                                    > 
                                        <i 
                                            class="fa fa-exclamation-circle"
                                        ></i>
                                        {{errors.email[0]}}
                                    </span>
                                    <input 
                                        type="email" 
                                        placeholder="Enter email" 
                                        class="form-control"
                                        v-model="formData.email" 
                                        id="email"
                                        name="email"
                                        required
                                    />
                                </div>
                                <!-- Email -->
                                <!-- Phone -->
                                <div class="form-outline mb-4">
                                    <label class="form-label" for="phone">Phone</label>
                                    <input 
                                        type="tel" 
                                        placeholder="Enter phone" 
                                        class="form-control"
                                        v-model="formData.phone" 
                                        id="phone"
                                        name="phone"
                                        required
                                    />
                                </div>
                                <!-- Phone -->
                                <!-- Address -->
                                <div class="form-outline mb-4">
                                    <label class="form-label" for="address">Address</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter address"  
                                        class="form-control"
                                        v-model="formData.address" 
                                        id="address"
                                        name="address"
                                        required
                                    />
                                </div>
                                <!-- Address -->
                            </div>

                            <div class="col-sm-12 m-auto work-information">
                                <h5 class="text-center"> work information </h5>
                                <div class="col-sm-12 d-flex">
                                    <div class="col-sm-6">
                                        <!-- Role -->
                                        <div class="form-outline mb-4">
                                            <label class="form-label" for="role">User role</label>
                                            <select 
                                                name="role" 
                                                v-model="formData.role_id" 
                                                class="form-control" 
                                                id="role" 
                                                aria-label="Default select example"
                                                required 
                                            >
                                                <option selected value="">Select user role</option>
                                                <option
                                                    v-for="role in roles" :key="role.id"
                                                    :value="role.id" 
                                                >
                                                    {{role.name}}
                                                </option>
                                            </select>
                                        </div>
                                        <!-- Role -->
                                        <!-- Category -->
                                        <div 
                                            class="form-outline mb-4"
                                            v-if="formData.role_id == 153"
                                        >
                                            <label class="form-label" for="category">User category</label>
                                            <select 
                                                name="category" 
                                                v-model="formData.category_id" 
                                                class="form-control" 
                                                id="category" 
                                                aria-label="Default select example"
                                                @input="showSkills"
                                                required 
                                            >
                                                <option selected :value="null">Select user category</option>
                                                <option
                                                    v-for="category in categories" :key="category.id"
                                                    :value="category.id" 
                                                >
                                                    {{category.name}}
                                                </option>
                                                
                                            </select>
                                        </div>
                                        <!-- Category -->
                                        <!-- Hourly Rate -->
                                        <div 
                                            class="form-outline mb-4"
                                            v-if="formData.role_id == 153 || formData.role_id == 152"
                                        >
                                            <label class="form-label" for="hourlyRate">Hourly rate</label>
                                            <input 
                                                type="text" 
                                                placeholder="Enter hourly rate($)" 
                                                id="hourlyRate" 
                                                class="form-control"
                                                v-model="formData.hourly_rate" 
                                                required 
                                            />
                                        </div> 
                                        <!-- Rank -->
                                        <div 
                                            class="form-outline mb-4"
                                            v-if="formData.role_id == 153 || formData.role_id == 152"
                                        >
                                            <label class="form-label" for="userRank"> Ranking (range from 0 to 10) </label>
                                            <div 
                                                class="create-user-rank"
                                                v-if="formData.rank >= 0 && formData.rank <= 10"
                                            >
                                                <i 
                                                    v-for="star in Math.round(Math.round(formData.rank)/2)" 
                                                    :key="star"
                                                    class="fa fa-star"
                                                >
                                                </i>
                                                <i 
                                                    v-for="star in 5 - Math.round(Math.round(formData.rank)/2)" 
                                                    :key="star"
                                                    class="fa fa-star-o"
                                                >
                                                </i>
                                            </div>
                                            <input 
                                                type="number" 
                                                placeholder="Enter user rank" 
                                                id="userRank" 
                                                class="form-control"
                                                v-model="formData.rank" 
                                                required 
                                            />
                                        </div> 
                                        <!-- Rank -->
                                    </div>
                                    <div 
                                        class="col-sm-6 skills"
                                        v-if="formData.role_id == 153 && formData.category_id != null"
                                    >
                                        <div class="container col-sm-12">
                                            <div class="row">
                                                <div 
                                                    class="col-sm-4 skill-box"
                                                    v-for="skill in skills" :key="skill.id"
                                                >
                                                    <input 
                                                        type="checkbox" 
                                                        :id="skill.name"
                                                        :value="skill.id"
                                                        v-model="formData.skills" 
                                                    >
                                                    <label 
                                                        :for="skill.name"
                                                    >
                                                        {{skill.name}}
                                                    </label>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box-footer">
                    <button 
                        type="button" 
                        class="btn btn-secondary" 
                        @click="closeCreateUserModal"
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
    <!-- Create User Modal -->

    <!-- Success Message Create User -->
    <div id="alert-success" v-if="isShowMsgUserCreate">
        <i class="fa fa-check"> </i>
        <p>
            Successfully <b> Created </b> User
        </p>
    </div>
    <!-- Success Message Create User -->

    <!-- Paginition -->
    <nav aria-label="Page navigation example" id="paginition-nav">
        <ul class="pagination">

            <li :class="[{disabled: !userData.prev_page_url}]">
                <a 
                    class="page-link" 
                    aria-label="Previous"
                    @click="getUsers(userData.prev_page_url)"
                >
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>

            <li class="page-item" v-for="(link , index) in userData.links" :key="index">
                <a 
                    :class="link.active ? 'page-link active' : 'page-link' " 
                    v-if="index != 0 && index != userDataLength - 1"
                    @click="getUsers(link.url)"
                >
                    {{link.label}}
                </a>       
            </li>
           
            <li :class="[{disabled: !userData.next_page_url}]">
                <a 
                    class="page-link" 
                    aria-label="Next"
                    @click="getUsers(userData.next_page_url)"
                >
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>

        </ul>
    </nav>
    <!-- Paginition -->

</template>