<script>

import axios from 'axios'
import '@/styles/tasks-box.css';
import { onMounted, ref } from 'vue';

export default {
    setup() {
        
        const permissions = JSON.parse(localStorage.getItem('permissions'));
        const URL = `http://127.0.0.1:8000/api/ScrumPro`;
        const project = JSON.parse(localStorage.getItem('project'));
        const userInfo = JSON.parse(localStorage.getItem('user-info'));

        /*********************
         * Response Meesage
        *********************/ 
       let isShowResponseMsg = ref(false);
       let responseMsgID = ref('');
       let responseMsgIconClass = ref('');
       let responseMsgContent = ref('');

        /***************************************
         * Get Tasks For Story (in progress)
        ***************************************/
        const foundTasks = ref('');
        const tasks = ref([]);
        const getTasksBox = async () =>{

            const response = await axios.get(`${URL}/get-tasks-box/${project.id}`);
            foundTasks.value = response.data.tasks_count;
            tasks.value = response.data.tasks;
        }

        /***********************
         * Select User Tasks
        ***********************/
        const selectTask = async (formData)=>{
            await axios.post(`${URL}/select-user-tasks` , formData)
            .then((response)=>{

                if(response.data.status){

                    getTasksBox();
                    isShowResponseMsg.value = true;
                    responseMsgID.value = 'alert-success';
                    responseMsgIconClass.value = 'fa fa-check';
                    responseMsgContent.value = response.data.msg;
                    setTimeout(() => {
                        isShowResponseMsg.value = false;
                    }, 2500);

                }else{
                    isShowResponseMsg.value = true;
                    responseMsgID.value = 'alert-danger';
                    responseMsgIconClass.value = 'fa fa-exclamation';
                    responseMsgContent.value = response.data.msg;
                    setTimeout(() => {
                        isShowResponseMsg.value = false;
                    }, 3500);
                }
            });
        }

        /***************
         * On Mounted
        ***************/
        onMounted(()=>{
            getTasksBox();
        });

        /***********
         * return
        ***********/
        return{
            tasks ,
            foundTasks ,
            userInfo ,
            permissions ,
            selectTask ,
            responseMsgID ,
            isShowResponseMsg ,
            responseMsgIconClass ,
            responseMsgContent
        }

    },
}
</script>

<template>
    <div id="tasks-box">
        <header>
            <h4>tasks box</h4>
        </header>

        <div class="container">
            <div class="row">

                <!-- No Tasks Found -->
                <div class="col-sm-10 no-tasks-found" v-if="!foundTasks">
                    <i class="fa fa-ban"></i>
                    <h2>no tasks found, a story must be work to show the tasks !</h2>
                </div>
                <!-- No Tasks Found -->

                <!-- Section Tasks -->
                <div class="col-sm-6 task-box"
                    v-for="task in tasks"
                    :key="task"
                >
                    <div :class="task.is_blocked ? 'box block-task':'box'" v-if="foundTasks">
                        <div class="blocked-lock" v-if="task.is_blocked">
                            <i class="fa fa-lock"></i>
                        </div>
                        <div class="title">
                            <span class="ID">#{{task.id}}</span>
                            {{task.title}}
                        </div>
                        <div class="btn-selected">
                            <button  class="btn btn-secondary"
                                v-if="!task.user_found && !permissions.includes('select tasks to work on')"  
                            >
                                select
                            </button>
                            
                            <button class="btn btn-primary"
                                v-if="permissions.includes('select tasks to work on') && !task.user_found" 
                                @click="selectTask({
                                    userID: userInfo[0].id,
                                    taskID: task.id
                                })"
                            >
                                select
                            </button>
                            
                            <button  class="btn btn-success"
                                v-if="task.user_found" 
                                style="cursor: auto;" 
                            >
                                <i class="fa fa-check"></i>
                                selected
                            </button>
                        </div>
                        <div class="manage">
                            <div class="level">
                                <span>{{task.level}}</span>
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
                            <div class="category-skill">
                                <p class="category">{{task.category_name}}</p>
                                <p class="skill">{{task.skill_name}}</p>
                            </div>
                            <div class="status">
                                <p v-if="task.status == 'to do'" class="todo">to do</p>
                                <p v-else-if="task.status == 'done'" class="todo">done</p>
                                <p v-else class="progress">in progress</p>
                            </div>
                        </div>
                        <div class="user-details" v-if="task.user_found">
                            <img
                            v-if="task.avatar == null && task.gender == 'male'" 
                            src="@/assets/man.png" 
                            width="55" 
                            height="55"
                            class="img-user"
                            > 
                            <img
                                v-else-if="task.avatar == null && task.gender == 'female' "
                                src="@/assets/woman.png" 
                                width="55" 
                                height="55"
                                class="img-user"
                            >
                            <ul>
                                <li class="full-name">
                                    <p class="full-name">{{task.full_name}}</p>
                                </li>
                                <li>
                                    <div class="level">
                                        <span>{{task.user_rank}}</span>
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
                                </li>
                            </ul>
                        </div>
                        <div class="task-dependence">
                            <ul id="ul">
                                <li style="display: flex;">
                                    <i>Blocking By :</i>
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
                                    <i>Blocked :</i>
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
                        </div>
                    </div>
                </div>
                <!-- Section Tasks -->
            </div>
        </div>
    </div>

    <!-- Response Message -->
    <div :id="responseMsgID" v-if="isShowResponseMsg">
        <i :class="responseMsgIconClass"> </i>
        <p>
            {{responseMsgContent}}
        </p>
    </div>
    <!-- Response Message -->
</template>