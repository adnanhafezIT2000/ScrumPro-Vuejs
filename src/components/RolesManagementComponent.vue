<script>

import useRoles from '@/composables/roles';
import usePermissions from '@/composables/permissions';
import usePermissionRole from '@/composables/permission-role';
import { onMounted , ref , reactive } from 'vue';
import axios from 'axios';
import ChangePermissionModal from '@/components/modal components/roles/ChangePermissionModal.vue'
import '@/styles/roles-management.css'

export default {
    components:{
        ChangePermissionModal
    } ,
    setup() {

        const userPermissions = JSON.parse(localStorage.getItem('permissions')); 
        const {roles , getAllRoles} = useRoles();
        const {permissions , getAllPermissions} = usePermissions();
        const {permissionRoleData , getAllPermissionRole} = usePermissionRole();

        let isShowCreateRoleModal = ref(false);
        let isShowMsgRoleCreate = ref();
        let errors = ref({});
        let formData = reactive({
            name: '' ,
            description: ''
        });

        /***************
         * On Mounted 
        ***************/
        onMounted( ()=> {

            getAllRoles();   
            getAllPermissions();
            getAllPermissionRole();
        });

        /***********************************
         * Show / Close Create Role Modal
        ***********************************/
        const showCreateModal = () => {

            isShowCreateRoleModal.value = true;
            document.body.style.cssText = 'overflow:hidden'; 
        } 
        const closeCreateModal = () => {

            isShowCreateRoleModal.value = false;
            document.body.style.cssText = 'overflow:scroll';
            formData.name = '';
            formData.description = '';
            errors.value.name = '';
            errors.value.description = '';
        }     

        /************************************
         * Is Assign Permission To Role ???
        ************************************/
        const isAssign = (data) => {

            for (let i = 0; i < permissionRoleData.value.length; i++) {
            
                if( permissionRoleData.value[i].role_id == data.role_id && 
                    permissionRoleData.value[i].permission_id == data.permission_id
                ){

                    return true;
                }
            }
        }

        /***************
         * Store Role
        ***************/
        const storeRole = async (data) =>{
            try {
            
                await axios.post(`http://127.0.0.1:8000/api/ScrumPro/roles` , data);

                getAllRoles();   
                getAllPermissions();
                getAllPermissionRole();

                closeCreateModal();

                isShowMsgRoleCreate.value = true;

                setTimeout(() => {
                    isShowMsgRoleCreate.value = false;
                }, 3500);

            } catch (error) {

                if(error.response.status === 422){

                    errors.value = error.response.data.errors;
                }
            }
        }

        /*******
         * return
        *******/
        return{
            isShowCreateRoleModal ,
            roles ,
            permissions ,
            isAssign ,
            permissionRoleData ,
            showCreateModal ,
            closeCreateModal ,
            isShowMsgRoleCreate ,
            storeRole ,
            formData ,
            errors ,
            userPermissions
        }
    },
}

</script>

<template>
    <!-- Roles Page -->
    <div id="roles-management">

        <!-- Header -->
        <header>
            <h4> roles & permissions management </h4>
            <div class="buttons" v-if="userPermissions.includes('create new role')">
                <button type="button" class="btn btn-primary" @click="showCreateModal">
                    <i class="fa fa-plus"></i>
                    create new role
                </button>
            </div>
        </header>
        <!-- Header -->

        <!-- Table -->
        <table class="table table-borderless shadow-sm">
            <thead>
                <tr>
                    <th class="text-secondary">Actions</th>
                    <th v-for="role in roles" :key="role.id">
                        {{role.name}} 
                    </th>
                </tr>
            </thead>
            <tbody v-for="permission in permissions" :key="permission.id">

                    <tr class="tr-type" v-if="permission.name == 'modify the password'">
                        <td colspan="20"> personal information management </td>
                    </tr>
                    <tr class="tr-type" v-if="permission.name == 'show all users'">
                        <td colspan="20"> users management </td>
                    </tr>
                    <tr class="tr-type" v-if="permission.name == 'show all categories'">
                        <td colspan="20"> categories & skills management </td>
                    </tr>
                    <tr class="tr-type" v-if="permission.name == 'show all teams'">
                        <td colspan="20"> teams management </td>
                    </tr>
                    <tr class="tr-type" v-if="permission.name == 'show all roles and permissions'">
                        <td colspan="20"> roles & permissions management </td>
                    </tr>
                    <tr class="tr-type" v-if="permission.name == 'show all projects (open,close)'">
                        <td colspan="20"> projects management </td>
                    </tr>
                    <tr class="tr-type" v-if="permission.name == 'show all definitions of done'">
                        <td colspan="20"> definitions of done management </td>
                    </tr>
                    <tr class="tr-type" v-if="permission.name == 'show project backlog'">
                        <td colspan="20"> project backlog management </td>
                    </tr>
                    <tr class="tr-type" v-if="permission.name == 'show project sprints'">
                        <td colspan="20"> project sprint management </td>
                    </tr>
                    <tr class="tr-type" v-if="permission.name == 'sprint planning meeting'">
                        <td colspan="20"> project meeting management </td>
                    </tr>
                    <tr class="tr-type" v-if="permission.name == 'show project tasks'">
                        <td colspan="20"> project tasks management </td>
                    </tr>

                    <tr>
                        <td class="permission-name"> 
                            {{permission.name}}
                        </td>
                        <td v-for="role in roles" :key="role">
                            <div
                                v-if="isAssign({
                                        'role_id': role.id , 
                                        'permission_id': permission.id
                                })" 
                            >   
                                <i
                                    v-if="userPermissions.includes('assign permissions to roles')"
                                    class="fa fa-check status-check"
                                    data-bs-toggle="modal" 
                                    :title="role.name"
                                    :data-bs-target="'#changePermissionModal' + role.id + permission.id"
                                ></i>
                                <i 
                                    v-else 
                                    :title="role.name" 
                                    class="fa fa-check status-check"
                                >  
                                </i>
                            </div>

                            <div v-else>
                                <i 
                                    v-if="userPermissions.includes('assign permissions to roles')"
                                    class="fa fa-close status-not-check"
                                    data-bs-toggle="modal"
                                    :title="role.name" 
                                    :data-bs-target="'#changePermissionModal'+ role.id + permission.id"
                                ></i>
                                <i 
                                    v-else  
                                    class="fa fa-close status-not-check"
                                    :title="role.name"
                                >
                                </i>
                            </div>
                            
                            <ChangePermissionModal 
                                :roleID="role.id"
                                :permissionID="permission.id"
                                :roleName="role.name"
                                :permissionName="permission.name"
                                :modelID=" 'changePermissionModal' + role.id + permission.id "
                            />
                        </td>
                    </tr>
            </tbody>
        </table>
        <!-- Table -->
    </div>
    <!-- Roles Page -->

    <!-- Create Role Modal -->
    <div class="modal-main" id="createRoleModal" v-if="isShowCreateRoleModal">
        <div class="modal-box">
            <div class="box-header">
                <h5> Create Role </h5>
                <button class="btn-close" @click="closeCreateModal"></button>
            </div>
            <form @submit.prevent="storeRole(formData)">
                <div class="box-body">
                    <div class="mb-3">
                        <label for="role-name" class="col-form-label">Role Name</label>
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
                            placeholder="Enter role name" 
                            class="form-control" 
                            id="role-name"
                            v-model="formData.name"
                            required
                        >
                    </div>
                    <div class="mb-3">
                        <label for="role-description" class="col-form-label">Description</label>
                        <span 
                            class="text-danger error" 
                            v-if="errors.description && errors.description[0] != ''"
                        > 
                            <i 
                                class="fa fa-exclamation-circle"
                            ></i>
                           {{errors.description[0]}}
                        </span>
                        <textarea 
                            class="form-control" 
                            placeholder="Enter role description" 
                            id="role-description"
                            v-model="formData.description"
                            required
                        ></textarea>
                    </div>
                </div>
                <div class="box-footer">
                    <button type="button" class="btn btn-secondary" @click="closeCreateModal">
                        close
                    </button>
                    <button type="submit" class="btn btn-success">
                        create
                    </button>
                </div>
            </form>
        </div>
    </div>
    <!-- Create Role Modal -->

    <!-- Success Message Create Role -->
    <div id="alert-success" v-if="isShowMsgRoleCreate">
        <i class="fa fa-check"> </i>
        <p>
        Successfully Created Role
        </p>
    </div>
    <!-- Success Message Create Role -->
</template>
