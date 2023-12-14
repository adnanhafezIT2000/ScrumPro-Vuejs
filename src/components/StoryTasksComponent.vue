<script>

import { useRoute } from 'vue-router';
import { onMounted, reactive, ref, watchEffect } from 'vue';
import useSkills from '@/composables/skills';
import useCategories from '@/composables/categories';
import DeleteTaskModal from '@/components/modal components/tasks/DeleteTaskModal.vue'
import TaskInfoModal from '@/components/modal components/tasks/TaskInfoModal.vue'
import '@/styles/tasks.css';
import axios from 'axios';

export default {
    components:{
        DeleteTaskModal ,
        TaskInfoModal
    } ,

    setup() {

        const permissions = JSON.parse(localStorage.getItem('permissions'));

        const route = useRoute();
        const storyID = route.params.id;
        const URL = 'http://127.0.0.1:8000/api/ScrumPro';
        const {categories , getAllCategories} = useCategories();
        const {skills , getAllSkillsInCategory} = useSkills();

        /*********************
         * Response Message
        *********************/
        let isShowResponseMsg = ref(false);
        let responseMsgID = ref('');
        let responseMsgIcon = ref('');
        let responseMsg = ref('');

        /****************************
         * Get All Tasks For Story
        ****************************/
        const storyInfo = ref([]);
        const tasks = ref([]);
        const countTasks = ref('');
        const storyStatus = ref('');
        const getAllTasksForStory = async () =>{

            const response = await axios.get(`${URL}/get-tasks-for-story/${storyID}`);
            storyInfo.value = response.data.story.data;
            tasks.value = response.data.tasks.data;
            countTasks.value = response.data.tasks.count_tasks;
            storyStatus.value = response.data.story.status;
        }

        /*********************
         * Create Task Modal
        *********************/
        const formData = reactive({
            title: '' ,
            description: '' ,
            story_id: storyID ,
            category_id: null ,
            skill_id: null ,
            level: 0, 
        });
        let isShowCreateTaskModal = ref(false);
        const showCreateTaskModal = ()=>{
            isShowCreateTaskModal.value = true;
            document.body.style.cssText = 'overflow:hidden'; 
        }
        const closeCreateTaskModal = ()=>{
            isShowCreateTaskModal.value = false;
            document.body.style.cssText = 'overflow:auto'; 
            formData.category_id = null;
            formData.description = '';
            formData.level = 0;
            formData.skill_id = null;
            formData.title = '';
        }
        const validationTaskLevelInput = () => {
            const levelInput = document.getElementById('task-level');
            if(formData.level > 10 || formData.level < 0){
                levelInput.style.cssText = `
                    border: 1px solid red;
                    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 
                        0 0 10px rgba(255, 50, 50 , 0.7); 
                    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 10px rgba(255, 50, 50 , 0.7);
                `;
            } else{
                levelInput.style.cssText = 'border: 1px solid #ced4da;'
            }
        }
        const showSkillsInTaskModal = () => {
            watchEffect(()=>{
                getAllSkillsInCategory(formData.category_id);
            });
        }
        const storeTask = async (data) =>{

            if(data.level >= 0 && data.level <= 10 && data.skill_id != null){
                
                await axios.post(`${URL}/tasks` , data)
                .then((response)=>{
                    if(response.data.status){
                        getAllTasksForStory();
                        closeCreateTaskModal();
                        isShowResponseMsg.value = true;
                        responseMsgID.value = 'alert-success';
                        responseMsgIcon.value = 'fa fa-check';
                        responseMsg.value = response.data.msg;
                        setTimeout(() => {
                            isShowResponseMsg.value = false;
                        }, 2500);
                    }
                })
            }   
        }

        /*********************** 
         * Tasks Dependence
        ***********************/
        const showSelectDependence = (id) =>{
            
            let select   = document.getElementById(`select${id}`);
            let ul       = document.getElementById(`ul${id}`);
            let btnClose = document.getElementById(`btn-close-select-dependence${id}`);
            ul.style.cssText       = `display:none`;
            select.style.cssText   = `display:block`;
            btnClose.style.cssText = `display:flex`; 
        }
        const closeSelectDependence = (id) =>{

            let select     = document.getElementById(`select${id}`);
            let ul         = document.getElementById(`ul${id}`);
            let btnClose   = document.getElementById(`btn-close-select-dependence${id}`);
            let selectTask = document.getElementById(`selectTask${id}`);
            let btnSave    = document.getElementById(`btn-save-dependence${id}`);
            ul.style.cssText         = `display:block`;
            select.style.cssText     = `display:none`;
            btnClose.style.cssText   = `display:none`; 
            selectTask.style.cssText = `display:none`; 
            btnSave.style.cssText    = `display:none`;
            select.value     = 'select';
            selectTask.value = '';
        }
        const selectDependence = (taskID) =>{

            let dependenceValue = document.getElementById(`select${taskID}`).value;
            if(dependenceValue != 'select'){

                let select     = document.getElementById(`select${taskID}`);
                let selectTask = document.getElementById(`selectTask${taskID}`);
                let btnSave    = document.getElementById(`btn-save-dependence${taskID}`);
                selectTask.style.cssText = `display:block`;
                btnSave.style.cssText    = `display:flex`;
                select.style.cssText     = `display:none`;
            }
        }
        let arrayTasks = ref([]);
        const storeDependence = (taskID) =>{

            let select = document.getElementById(`select${taskID}`);

            const formData = reactive({
                task_id: taskID ,
                type_of_dependence: select.value ,
                tasks_in_dependence: arrayTasks.value
            });
                    
            axios.post(`${URL}/dependences` , formData)
            .then((response)=>{
                if(response.data.status){
                    
                    getAllTasksForStory();
                    closeSelectDependence(formData.task_id);
                    isShowResponseMsg.value = true;
                    responseMsgID.value = 'alert-success';
                    responseMsgIcon.value = 'fa fa-check';
                    responseMsg.value = response.data.msg;
                    setTimeout(() => {
                        isShowResponseMsg.value = false;
                    }, 2500);
                    
                } else{

                    isShowResponseMsg.value = true;
                    responseMsgID.value = 'alert-danger';
                    responseMsgIcon.value = 'fa fa-exclamation';
                    responseMsg.value = response.data.msg;
                    setTimeout(() => {
                        isShowResponseMsg.value = false;
                    }, 2500);
                }
            })
        }

        /*********************
         * On Mounted Page
        *********************/
        onMounted(()=>{
            getAllTasksForStory();
            getAllCategories();
        });

        /**************
         * return
        **************/
        return{
            storyID ,
            formData ,
            isShowCreateTaskModal, 
            showCreateTaskModal ,
            closeCreateTaskModal ,
            validationTaskLevelInput ,
            categories ,
            showSkillsInTaskModal ,
            skills ,
            storeTask ,
            isShowResponseMsg ,
            responseMsgID ,
            responseMsgIcon, 
            responseMsg ,
            storyInfo ,
            tasks ,
            countTasks ,
            showSelectDependence  ,
            closeSelectDependence ,
            selectDependence ,
            storeDependence ,
            arrayTasks ,
            permissions ,
            storyStatus
        }
    },
}
</script>

<template>
    <!-- Tasks Page -->
    <div class="tasks-page">
        <header>
            <h4> manage tasks </h4>
        </header>
        <div class="container">
            <div class="row">

                <!-- Story Section -->
                <section class="story-section col-sm-5"
                    v-for="story in storyInfo"
                    :key="story"
                >
                    <h3 class="header-section"> story info </h3>
                    <div class="story-sprint">
                        <h4> sprint </h4>
                        <p>{{story.sprint_name}}</p>
                    </div>
                    <div>
                        <h4> title </h4>
                        <p>{{story.title}}</p>
                    </div>
                    <div>
                        <h4>description</h4>
                        <p>{{story.description}}</p>
                    </div>
                    <div>
                        <h4>acceptance critiria</h4>
                        <ol 
                            v-for="row in story.acceptance_critiria"
                            :key="row"
                        >
                            <li>{{row.description}}</li>
                        </ol>
                    </div>
                    <div>
                        <h4>status</h4>
                        <p v-if="story.status == 'to do'" class="status-todo">to do</p>
                        <p v-else-if="story.status == 'done'" class="status-done">done</p>
                        <p v-else-if="story.status == 'not complete'" class="status-not-complete">not complete</p>
                        <p v-else class="status-progress">in progress</p>
                    </div>
                    <div>
                        <h4>points</h4>
                        <p>
                            <span class="point-number">{{story.points}}</span> points
                        </p>
                    </div>
                    <div>
                        <h4>rank</h4>
                        <p>
                            <span class="rank-number">{{story.rank}}</span> 
                            from 
                            <span class="rank-number">{{story.stories_count}}</span> 
                            stories
                        </p>
                    </div>
                </section>  
                <!-- Story Section -->

                <!-- Tasks Section -->
                <section class="task-section col-sm-7">
                        <h3 class="header-section"> tasks </h3>
                        <div class="buttons">
                            <button 
                                type="button" 
                                class="btn btn-primary btn-create-task"
                                @click="showCreateTaskModal"
                                v-if="permissions.includes('create task') && storyStatus != 'done'"
                            >
                                <i class="fa fa-plus"></i>
                                create task
                            </button>
                            <button
                                type="button"
                                class="btn btn-refresh"
                                title="refresh tasks"
                            >
                                <i class="fa fa-refresh"></i>
                            </button>
                        </div>

                        <div class="all-tasks-box">
                            <div class="no-tasks-found" v-if="countTasks == 0" >
                                <i class="fa fa-ban"></i>
                                no tasks found 
                            </div>
                            <div 
                                v-for="task in tasks"
                                :key="task"
                            >
                                <div :class="task.is_blocked ? 'task-box block-task' : 'task-box'">
                                    <div class="blocked-lock"
                                          v-if="task.is_blocked"
                                    >
                                        <i class="fa fa-lock"></i>
                                    </div>
                                    <p class="task-title">
                                        <i class="task-id">#{{task.id}}</i>
                                        {{task.title}}
                                    </p>
                                    <div class="task-manage">
                                        <span>{{task.level}}</span>
                                        <div class="task-level">
                                            <i 
                                                v-for="star in Math.round(Math.round(task.level)/2)" 
                                                :key="star"
                                                class="fa fa-star"
                                            >
                                            </i>
                                            <i 
                                                v-for="star in 5 - Math.round(Math.round(task.level)/2)" 
                                                :key="star"
                                                class="fa fa-star-o"
                                            >
                                            </i>
                                        </div>
                                        <div v-if="task.status == 'to do'" class="task-status task-todo">
                                            to do
                                        </div>
                                        <div v-else-if="task.status == 'in progress'" class="task-status task-progress">
                                            in progress
                                        </div>
                                        <div v-else-if="task.status == 'not complete'" class="task-status task-not-complete">
                                            not complete
                                        </div>
                                        <div v-else class="task-status task-done">
                                           done
                                        </div>
                                        <div class="btn-group dropup">
                                            <button type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="fa fa-ellipsis-h"></i>
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li 
                                                    class="dropdown-item"
                                                    style="cursor: pointer;"
                                                    data-bs-toggle="modal" 
                                                    :data-bs-target="'#taskInfoModal'+task.id"
                                                >
                                                    View
                                                </li>
                                                <li 
                                                    class="dropdown-item"
                                                    style="cursor: pointer;"
                                                    data-bs-toggle="modal" 
                                                    :data-bs-target="'#deleteTaskModal'+task.id"
                                                    v-if="permissions.includes('delete task')"
                                                >
                                                    Delete
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="user-details"
                                        v-if="task.user_found"
                                    >
                                        <img 
                                            src="@/assets/man.png" 
                                            width="60" 
                                            height="60"
                                        >
                                        <div class="username-category-level">
                                            <div class="username-level">
                                                <p class="username">
                                                    {{task.full_name}}
                                                </p>
                                                <span>{{task.user_rank}}</span>
                                                <div class="user-level">
                                                    <i 
                                                        v-for="star in Math.round(Math.round(task.user_rank)/2)" 
                                                        :key="star"
                                                        class="fa fa-star"
                                                    >
                                                    </i>
                                                    <i 
                                                        v-for="star in 5 - Math.round(Math.round(task.user_rank)/2)" 
                                                        :key="star"
                                                        class="fa fa-star-o"
                                                    >
                                                    </i>
                                                </div>
                                            </div>
                                            <ul class="category-skill-ul">
                                                <li class="category">{{task.category_name}}</li>
                                                <li class="skill">{{task.skill_name}}</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="task-block-section">
                                         
                                        <ul 
                                            @dblclick="showSelectDependence(task.id)"
                                            :id="'ul'+task.id"
                                        >
                                            <li style="display: flex;">
                                                    blocking by :
                                                    <ul 
                                                        class="list-task-id"
                                                        v-if="task.blocking_by_tasks == 'none' || task.blocking_by_tasks.length == 0"
                                                    >
                                                        <li>none</li>
                                                    </ul>
                                                    <ul 
                                                        class="list-task-id"
                                                        v-else
                                                    >
                                                        <li
                                                            v-for="ID in task.blocking_by_tasks"
                                                            :key="ID"
                                                        >
                                                            {{'#'+ID}}
                                                        </li>
                                                    </ul>
                                                </li>
                                            <li style="display: flex;">
                                                blocked :
                                                <ul 
                                                    class="list-task-id"
                                                    v-if="task.blocked_tasks == 'none' || task.blocked_tasks.length == 0"
                                                >
                                                    <li>none</li>
                                                </ul>
                                                <ul 
                                                    class="list-task-id"
                                                    v-else
                                                >
                                                    <li
                                                        v-for="ID in task.blocked_tasks"
                                                        :key="ID"
                                                    >
                                                        {{'#'+ID}}
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                        
                                        <select 
                                            class="form-control"
                                            :id="'select'+task.id"
                                            @input="selectDependence(task.id)"
                                        >
                                            <option value="select">select dependence</option>
                                            <option value="blocking_by">blocking by</option>
                                            <option value="blocked">blocked</option>
                                        </select>

                                        <select 
                                            class="form-control select-tasks-to-dependence"
                                            :id="'selectTask'+task.id"
                                            multiple
                                            v-model="arrayTasks"
                                        >
                                            <option
                                                v-for="ID in tasks"
                                                :key="ID"
                                                :value="ID.id"
                                            >
                                                {{ID.id}}
                                            </option>
                                        </select>

                                        <button 
                                            class="btn-close-select-dependence"
                                            :id="'btn-close-select-dependence'+task.id"
                                            @click="closeSelectDependence(task.id)"
                                        >
                                            <i class="fa fa-close"></i>
                                        </button>

                                        <button
                                            class="btn-save-dependence"
                                            :id="'btn-save-dependence'+task.id"
                                            @click="storeDependence(task.id)"
                                        >
                                            <i class="fa fa-check"></i>
                                        </button>
                                    </div>
                                </div>

                                <DeleteTaskModal 
                                    :modalID="'deleteTaskModal'+task.id"
                                    :taskID="task.id"
                                />

                                <TaskInfoModal 
                                    :modalID="'taskInfoModal'+task.id"
                                    :taskID="task.id"
                                />
                            </div>
                        </div>
                </section>
                <!-- Tasks Section -->

            </div>
        </div>
    </div>
    <!-- Tasks Page -->

    <!-- Create Task Modal -->
    <div class="modal-main" id="createTaskModal" v-if="isShowCreateTaskModal">
        <div class="modal-box">
            <div class="box-header">
                <h5> Create New Task </h5>
                <button class="btn-close" @click="closeCreateTaskModal"></button>
            </div>
            <form @submit.prevent="storeTask(formData)">
                <div class="box-body">
                    <div class="mb-3">
                        <label for="task-title" class="col-form-label">Title</label>
                        <textarea 
                            class="form-control" 
                            placeholder="Enter task title..." 
                            id="task-title"
                            v-model="formData.title"
                            required
                        ></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="task-desc" class="col-form-label">Description</label>
                        <textarea 
                            class="form-control" 
                            placeholder="Enter task description..." 
                            id="task-desc"
                            v-model="formData.description"
                            required
                        ></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="task-category" class="col-form-label">Category</label>
                        <select 
                            id="task-category" 
                            class="form-control"
                            v-model="formData.category_id"
                            @input="showSkillsInTaskModal"
                        >
                            <option selected :value="null">Select category</option>
                            <option
                                v-for="category in categories" :key="category.id"
                                :value="category.id" 
                            >
                                {{category.name}}
                            </option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="task-skill" class="col-form-label">Skill</label>
                        
                        <div 
                            class="no-skill-select"
                            v-if="formData.category_id == null"
                        >
                            <i class="fa fa-exclamation"></i>
                            plaese select category to show skills
                        </div>
                        
                        <div class="skill-box-inputs" v-else>
                            <div class="skills" v-for="skill in skills" :key="skill.id">
                                <input 
                                    type="radio" 
                                    :id="skill.id"
                                    :value="skill.id"
                                    v-model="formData.skill_id" 
                                    name="skills"
                                >
                                <label 
                                    :for="skill.id"
                                >
                                    {{skill.name}}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label id="label-level" for="task-level" class="col-form-label">
                            Level (range number from 0 to 10)
                            <div 
                                class="create-task-level"
                                v-if="formData.level >= 0 && formData.level <= 10"
                            >
                                <i 
                                    v-for="star in Math.round(Math.round(formData.level)/2)" 
                                    :key="star"
                                    class="fa fa-star"
                                >
                                </i>
                                <i 
                                    v-for="star in 5 - Math.round(Math.round(formData.level)/2)" 
                                    :key="star"
                                    class="fa fa-star-o"
                                >
                                </i>
                            </div>
                        </label>
                        <input
                            type="number"
                            id="task-level"
                            class="form-control"
                            v-model="formData.level"
                            required
                            @input="validationTaskLevelInput"
                        >
                    </div>
                </div>
                <div class="box-footer">
                    <button 
                        type="button" 
                        class="btn btn-secondary" 
                        @click="closeCreateTaskModal"
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
    <!-- Create Task Modal -->

    <!-- Response Message -->
    <div :id="responseMsgID" v-if="isShowResponseMsg">
        <i :class="responseMsgIcon"> </i>
        <p>
            {{responseMsg}}
        </p>
    </div>
    <!-- Response Message -->
</template>
