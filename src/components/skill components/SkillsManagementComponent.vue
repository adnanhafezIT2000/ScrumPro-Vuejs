<script>

import { onMounted, watchEffect, ref, reactive } from 'vue';
import axios from 'axios';
import useCategories from '@/composables/categories';
import useSkills from '@/composables/skills';
import DeleteSkillModal from '../modal components/skills/DeleteSkillModal.vue';
import EditSkillModal from '../modal components/skills/EditSkillModal.vue';
import '@/styles/skills-management.css';
import '@/styles/create-skill-modal.css';
import { useRoute } from 'vue-router';

export default{
    components:{
        DeleteSkillModal ,
        EditSkillModal
    } ,

    props:['id'] ,

    setup(props){

        const permissions = JSON.parse(localStorage.getItem('permissions'));

        const route = useRoute();

        const {category , getCategory} = useCategories();
        const {skills , getAllSkillsInCategory} = useSkills();

        onMounted( ()=>{

            // watchEffect --> prop value changed
            watchEffect(()=>{
                getCategory(props.id);
                getAllSkillsInCategory(props.id);
            });
        });

        let isShowCreateSkillModal = ref(false);
        let isShowMsgSkillCreate = ref(false);

        let isShowMsgSkillDelete = ref(false);
        
        let formData = reactive({
            category_id: props.id ,
            name: '' ,
        });

        let errors = ref({});

        const showCreateSkillModal = () => {

            isShowCreateSkillModal.value = true;
            document.body.style.cssText = 'overflow:hidden'; 
            formData.category_id = props.id
        } 
        const closeCreateSkillModal = () => {

            isShowCreateSkillModal.value = false;
            document.body.style.cssText = 'overflow:scroll';
            formData.name = '';
            errors.value.name = '';
        }  

        const storeSkill = async (data) =>{

            try {

                await axios.post(`http://127.0.0.1:8000/api/ScrumPro/skills` , data);
                getAllSkillsInCategory(props.id);
                closeCreateSkillModal();

                isShowMsgSkillCreate.value = true;
                setTimeout(() => {
                    isShowMsgSkillCreate.value = false;
                }, 3500);
            }
            catch (error) {

                if(error.response.status == 422){

                    errors.value = error.response.data.errors;
                }
            }
        }

        const destroySkill = async (id) =>{

            if(!confirm('Are you sure deleted this skill ?')){

                return;

            } else{
                await axios.delete(`http://127.0.0.1:8000/api/ScrumPro/skills/${id}`);
                await getAllSkillsInCategory(props.id);
                isShowMsgSkillDelete.value = true;
                setTimeout(() => {
                    isShowMsgSkillDelete.value = false;
                }, 3500);
            }
            
        }

        return{
            category ,
            skills ,
            isShowCreateSkillModal ,
            isShowMsgSkillCreate ,
            formData ,
            errors ,
            showCreateSkillModal ,
            closeCreateSkillModal ,
            storeSkill ,
            destroySkill ,
            isShowMsgSkillDelete ,
            permissions
        }
    }
}
</script>

<template>
    <!-- Skill Page -->
    <div id="skills-management">
        <div class="header">
            <h3> {{ category.name + ' Category' }} </h3>
            <button 
                type="button" 
                class="btn btn-primary" 
                @click="showCreateSkillModal"
                v-if="permissions.includes('create new skill')"
            >
                <i class="fa fa-plus"></i>
                create skill
            </button>
        </div>

        <div 
            class="skill-box col-sm-12 shadow-sm"
            v-for="skill in skills" :key="skill"
        >
            <span class="user-count-caetgory" title="Develoeprs Count"> 
                {{skill.users_count}} 
            </span>
            <h5> {{skill.name}} </h5>
            <ul>
                <li> 
                    <i 
                        v-if="permissions.includes('edit skill')"
                        class="fa fa-edit text-success"
                        data-bs-toggle="modal" 
                        :data-bs-target=" '#editSkillModal' + skill.id "
                    >
                    </i>
                </li>
                <li>
                    <i 
                        v-if="permissions.includes('delete skill')"
                        class="fa fa-trash text-danger" 
                        @click="destroySkill(skill.id)"
                    >
                    </i>
                </li>
            </ul>

            <!--
            <DeleteSkillModal 
                data-bs-toggle="modal" 
                :data-bs-target=" '#deleteSkillModal' + skill.id "
                :skillID="skill.id"
                :skillName="skill.name"
                :modelID=" 'deleteSkillModal' + skill.id "
            />
            -->

            <EditSkillModal 
                :skillID="skill.id"
                :modelID=" 'editSkillModal' + skill.id "
            />
        </div>
    </div>
    <!-- Skill Page -->

    <!-- Create Skill Modal -->
    <div class="modal-main" id="createSkillModal" v-if="isShowCreateSkillModal">
        <div class="modal-box">
            <div class="box-header">
                <h5> Create Skill </h5>
                <button class="btn-close" @click="closeCreateSkillModal"></button>
            </div>
            <form @submit.prevent="storeSkill(formData)">
                <div class="box-body">
                    <div class="mb-3">
                        <label for="skill-name" class="col-form-label">Skill Name</label>
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
                            placeholder="Enter skill name" 
                            class="form-control" 
                            id="skill-name"
                            v-model="formData.name"
                            required
                        >
                    </div>
                </div>
                <div class="box-footer">
                    <button 
                        type="button" 
                        class="btn btn-secondary" 
                        @click="closeCreateSkillModal"
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
    <!-- Create Skill Modal -->

    <!-- Success Message Create Skill -->
    <div id="alert-success" v-if="isShowMsgSkillCreate">
        <i class="fa fa-check"> </i>
        <p>
            Successfully <b> Created </b> Skill
        </p>
    </div>
    <!-- Success Message Create Skill -->
    
    <!-- Success Message Delete Skill -->
    <div id="alert-success" v-if="isShowMsgSkillDelete">
        <i class="fa fa-check"> </i>
        <p>
            Successfully <b> Deleted </b> Skill
        </p>
    </div>
    <!-- Success Message Delete Skill -->
</template>
