<script>

import useRoles from '@/composables/roles'
import useCategories from '@/composables/categories'
import useSkills from '@/composables/skills'
import { onMounted, reactive, ref, watchEffect } from 'vue'
import '@/styles/create-user-modal.css'

export default { 
    setup() {
        const {roles , getAllRoles} = useRoles();
        const {categories , getAllCategories} = useCategories();
        const {skills , getAllSkillsInCategory} = useSkills();

        const formData = reactive({
            full_name: '' ,
            email: '' ,
            password: '' ,
            phone: '' ,
            address: '' ,
            gender: '' ,
            birthday: '' ,
            role_id: '' ,
            category_id: null ,
            hourly_rate: null ,
            skills : ref([]) ,
            rank: 0
        });

        const validationRankInput = () => {
            const rankInput = document.getElementById('user-rank');
            if(formData.rank > 10 || formData.rank < 0){
                rankInput.style.cssText = `
                    border: 1px solid red;
                    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 
                        0 0 10px rgba(255, 50, 50 , 0.7); 
                    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 10px rgba(255, 50, 50 , 0.7);
                `;
            } else{
                rankInput.style.cssText = 'border: 1px solid #ced4da;'
            }
        }

        const storeUser = () => {
            
            let generatePassword = formData.full_name + ' ' + Math.trunc(Math.random()*1000);
            formData.password = generatePassword;
            
            console.log(formData);
        }

        onMounted(()=>{
            getAllRoles();
            getAllCategories();
        });

        const showSkills = () => {

            watchEffect(()=>{
                getAllSkillsInCategory(formData.category_id);
                console.log(formData.category_id);
            });
        }

        return {
            formData ,
            roles ,
            categories ,
            skills ,
            showSkills ,
            storeUser ,
            validationRankInput
        }
    }
}

</script>

<template>
    <div class="modal fade" id="createNewUserModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title text danger" id="exampleModalLabel">
                        Create New User
                    </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="storeUser">
                    <div class="modal-body from-create-user">
                        <div class="container">
                            <div class="row">
                                <div class="col-sm-6 basic-information">
                                    <h5> basic information </h5>

                                    <!-- Full Name -->
                                    <div class="form-outline mb-4">
                                        <label class="form-label" for="fullName">Full name</label>
                                        <span class="text-danger error"> 
                                            <i class="fa fa-exclamation-circle"></i>
                                            This field is required 
                                        </span>
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

                                    <!-- Birthday -->
                                    <div class="form-outline mb-4">
                                        <label class="form-label" for="birthday">Birthday</label>
                                        <span class="text-danger error"> 
                                            <i class="fa fa-exclamation-circle"></i>
                                            This field is required 
                                        </span>
                                        <input 
                                            type="date" 
                                            class="form-control" 
                                            v-model="formData.birthday"
                                            id="birthday"
                                            required
                                        >
                                    </div>

                                    <!-- Gender -->
                                    <div class="form-outline mb-4">
                                        <label class="form-label">Gender</label>
                                        <span class="text-danger error"> 
                                            <i class="fa fa-exclamation-circle"></i>
                                            This field is required 
                                        </span>
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

                                </div>

                                <div class="col-sm-6 contact-information">
                                    <h5> contact information </h5>

                                    <!-- Email --> 
                                    <div class="form-outline mb-4">
                                        <label class="form-label" for="email">Email</label>
                                        <span class="text-danger error"> 
                                            <i class="fa fa-exclamation-circle"></i>
                                            This field is required 
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

                                    <!-- Phone -->
                                    <div class="form-outline mb-4">
                                        <label class="form-label" for="phone">Phone</label>
                                        <span class="text-danger error"> 
                                            <i class="fa fa-exclamation-circle"></i>
                                            This field is required 
                                        </span>
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

                                    <!-- Address -->
                                    <div class="form-outline mb-4">
                                        <label class="form-label" for="address">Address</label>
                                        <span class="text-danger error"> 
                                            <i class="fa fa-exclamation-circle"></i>
                                            This field is required 
                                        </span>
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
                                </div>

                                <div class="col-sm-12 m-auto work-information">
                                    <h5 class="text-center"> work information </h5>
                                    <div class="col-sm-12 d-flex">
                                        <div class="col-sm-6">

                                            <!-- Role -->
                                            <div class="form-outline mb-4">
                                                <label class="form-label" for="role">User role</label>
                                                <span class="text-danger error"> 
                                                    <i class="fa fa-exclamation-circle"></i>
                                                    This field is required 
                                                </span>
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

                                            <!-- Category -->
                                            <div 
                                                class="form-outline mb-4"
                                                v-if="formData.role_id == 153"
                                            >
                                                <label class="form-label" for="category">User category</label>
                                                <span class="text-danger error"> 
                                                    <i class="fa fa-exclamation-circle"></i>
                                                    This field is required 
                                                </span>
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

                                            <!-- Hourly Rate -->
                                            <div 
                                                class="form-outline mb-4"
                                                v-if="formData.role_id == 153 || formData.role_id == 152"
                                            >
                                                <label class="form-label" for="hourlyRate">Hourly rate</label>
                                                <span class="text-danger error"> 
                                                    <i class="fa fa-exclamation-circle"></i>
                                                    This field is required 
                                                </span>
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter hourly rate($)" 
                                                    id="hourlyRate" 
                                                    class="form-control"
                                                    v-model="formData.hourly_rate" 
                                                    required 
                                                />
                                            </div> 
                                           
                                        </div>
                                        <div class="col-sm-6 skills"
                                            v-if="formData.role_id == 153 && formData.category_id != null"
                                        >
                                            <div class="container col-sm-12">
                                                <div class="row">
                                                    <span class="text-danger error"> 
                                                        <i class="fa fa-exclamation-circle"></i>
                                                        At least one must be selected
                                                    </span>
                                                    <div 
                                                        class="col-sm-3"
                                                        v-for="skill in skills" :key="skill.id"
                                                    >
                                                       <input 
                                                            type="checkbox" 
                                                            :id="skill.name"
                                                            :value="skill.name"
                                                            v-model="formData.skills"
                                                            required 
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
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-success">
                            Create
                        </button>
                    </div>
                </form>
            </div>  
        </div>
    </div>
</template>
