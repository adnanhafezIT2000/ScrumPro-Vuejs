<script>

import '@/styles/definition-management.css'
import DeleteDefinitionModal from '@/components/modal components/definition/DeleteDefinitionModal.vue';
import EditDefinitionModal from '@/components/modal components/definition/EditDefinitionModal.vue';
import { onMounted, reactive, ref } from 'vue';
import useDefinition from '@/composables/definitions';
import axios from 'axios';

export default {
    components:{
        DeleteDefinitionModal ,
        EditDefinitionModal
    },

    setup() {

        const permissions = JSON.parse(localStorage.getItem('permissions'));

        let project , projectID , projectStatus;
        project = JSON.parse(localStorage.getItem('project'));
        projectID = project.id; 
        projectStatus = project.status;

        const {allDefinitions , getAllDefinitionForProject} = useDefinition();

        const formData = reactive({
            project_id: projectID,
            description: ''
        });

        let isShowMsgDefinitionCreate = ref(false);
        let isShowCreateDefinitionModal = ref(false);

        /*****************************************
         * Show / Close Create Definition Modal  
        *****************************************/
        const showCreateDefinitionModal = ()=> {
            isShowCreateDefinitionModal.value = true;
        }
        const closeCreateDefinitionModal = ()=> {
            isShowCreateDefinitionModal.value = false;
            formData.description = '';
        }

        /******************************
         * Store Definitions Of Done 
        ******************************/
        const storeDefinition = async (data)=>{

            await axios.post('http://127.0.0.1:8000/api/ScrumPro/definitions-of-done' , data)
            .then(response =>{

                if(response.data.status){
                    closeCreateDefinitionModal()
                    getAllDefinitionForProject(projectID);
                    isShowMsgDefinitionCreate.value = true;
                    setTimeout(() => {
                        isShowMsgDefinitionCreate.value = false;
                    }, 3000);
                }
            });
        }

        /****************
         * On Mounted
        ****************/
        onMounted(()=>{
            getAllDefinitionForProject(projectID);
        })

        /*************
         * return
        *************/
        return{
            isShowCreateDefinitionModal,
            showCreateDefinitionModal, 
            closeCreateDefinitionModal ,
            allDefinitions ,
            formData ,
            storeDefinition ,
            isShowMsgDefinitionCreate ,
            permissions ,
            projectStatus
        }
    },
}

</script>

<template>

    <!-- Definitions Of Done Page -->
    <div id="definition-management">
        
        <!-- Header -->
        <header>
            <h4> 
                definition of done management
                
                <span v-if="allDefinitions.length > 0">
                    (
                        <b style="color:var(--main-color);">{{allDefinitions.length}}</b>
                    )
                </span>
            </h4>
            <div 
                class="buttons"
                v-if="permissions.includes('create definitions of done') && projectStatus == 'open'"
            >
                <button 
                    type="button" 
                    class="btn btn-primary"
                    @click="showCreateDefinitionModal"
                >
                    <i class="fa fa-plus"></i>
                    create definition
                </button>
            </div>
        </header>
        <!-- Header -->

        <!-- Container -->
        <div class="container">
            <ul v-if="allDefinitions.length > 0" >
                <li 
                    class="shadow-sm"
                    v-for="definition in allDefinitions"
                    :key="definition"
                >
                    <p>{{definition.description}}</p> 
                    <div class="actions">
                        <i 
                            class="fa fa-edit text-success"
                            data-bs-toggle="modal" 
                            :data-bs-target="'#editDefinitionModal' + definition.id"
                            v-if="permissions.includes('edit definitions of done') && projectStatus == 'open'"
                        ></i>
                        <i 
                            class="fa fa-trash text-danger"
                            data-bs-toggle="modal" 
                            :data-bs-target="'#deleteDefinitionModal' + definition.id"
                            v-if="permissions.includes('delete definitions of done') && projectStatus == 'open'"
                        ></i>
                    </div>
                    <DeleteDefinitionModal 
                        :modalID="'deleteDefinitionModal' + definition.id"
                        :definitionID="definition.id"
                    />
                    <EditDefinitionModal
                        :modalID="'editDefinitionModal' + definition.id"
                        :definitionID="definition.id"
                    />
                </li>
            </ul>
            <div v-else class="no-definitions-found">
               <i class="fa fa-ban"></i> No definitions found ! 
            </div>
        </div>
        <!-- Container -->
    
    </div>
    <!-- Definitions Of Done Page -->
    
    <!-- Create Definition Model -->
    <div class="modal-main" id="createCategoryModal" v-if="isShowCreateDefinitionModal">
        <div class="modal-box">
            <div class="box-header">
                <h5> Create Definition Of Done </h5>
                <button class="btn-close" @click="closeCreateDefinitionModal"></button>
            </div>
            <form @submit.prevent="storeDefinition(formData)">
                <div class="box-body">
                    <div class="mb-3">
                        <label for="definition-name" class="col-form-label">
                            Definition
                        </label>
                        <textarea 
                            class="form-control" 
                            placeholder="Enter definition description" 
                            id="definition-name"
                            rows="3"
                            v-model="formData.description"
                            required
                            ></textarea>
                    </div>
                </div>
                <div class="box-footer">
                    <button 
                        type="button" 
                        class="btn btn-secondary" 
                        @click="closeCreateDefinitionModal"
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
    <!-- Create Definition Model -->

    <!-- Success Message Create User -->
    <div id="alert-success" v-if="isShowMsgDefinitionCreate">
        <i class="fa fa-check"> </i>
        <p>
            Successfully <b>Created</b> New Definition Of Done
        </p>
    </div>
    <!-- Success Message Create User -->

</template>
