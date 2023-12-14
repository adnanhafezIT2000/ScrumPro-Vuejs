<script>
import { computed, onMounted, reactive, ref } from 'vue';
import '@/styles/view-story-info.css'
import axios from 'axios';

export default {
    props:{
        modalID: {} ,
        taskID: {}
    } ,

    setup(props) {

        const URL = 'http://127.0.0.1:8000/api/ScrumPro';
        const userInfo = JSON.parse(localStorage.getItem('user-info'));
        const permissions = JSON.parse(localStorage.getItem('permissions'))
        const modalID = props.modalID;
        const taskID = props.taskID;
        
        /****************************
         * Manage Response Message
        ****************************/
        let isShowMsgUpdateSuccess = ref(false);
        let msgUpdated = ref('');

        /********************
         * Get Task Info
        ********************/
        const task = ref([]);
        const getTask = async () =>{
            const response = await axios.get(`${URL}/tasks/${taskID}`);
            task.value = response.data;
        }

        /*************************************************
         * Variable To Show Forms Updated Story Info
        *************************************************/
        let isShowFormTitle = ref(false);
        let isShowFormDescription = ref(false);
        let isShowFormLevel = ref(false);

        /**********************
         * Manage Task Title
        **********************/
        const showFormTitle = () =>{
            isShowFormTitle.value = true;
            isShowFormDescription.value = false;
            isShowFormLevel.value = false;
        }
        const closeFormTitle = () =>{
            getTask();
            isShowFormTitle.value = false;
        }
        const updateTaskTitle = async (data) =>{
            
            await axios.put(`${URL}/update-task-title/${taskID}` , data);
            closeFormTitle();
            getTask();
            isShowMsgUpdateSuccess.value = true;
            msgUpdated.value = 'Successfully Updated Task Title';
            setTimeout(() => {
                isShowMsgUpdateSuccess.value = false;
            }, 2500);
        }

        /****************************
         * Manage Task Description
        ****************************/
        const showFormDescription = () =>{
            isShowFormDescription.value = true;
            isShowFormTitle.value = false;
            isShowFormLevel.value = false;
        }
        const closeFormDescription = () =>{
            getTask();
            isShowFormDescription.value = false;
        }
        const updateTaskDescription = async (data) =>{
            
            await axios.put(`${URL}/update-task-description/${taskID}` , data);
            closeFormDescription();
            getTask();
            isShowMsgUpdateSuccess.value = true;
            msgUpdated.value = 'Successfully Updated Task Description';
            setTimeout(() => {
                isShowMsgUpdateSuccess.value = false;
            }, 2500);
            
        }

        /*************************
         * Manage Task Comments
        *************************/
        const formCommentData = reactive({
            user_id: userInfo[0].id ,
            task_id: taskID ,
            content: '' ,
        });
        const addComment = async (data) =>{
            await axios.post(`${URL}/comments` , data);
            getTask();
            formCommentData.content = '';
        }

        /*********************
         * On Mounted Page
        *********************/
        onMounted(()=>{
            getTask();
        });
        
        /*************
         * return
        *************/
        return{
            task ,
            modalID ,
            permissions ,
            userInfo ,
            isShowFormTitle ,
            isShowFormDescription ,
            isShowFormLevel ,
            showFormTitle ,
            closeFormTitle ,
            updateTaskTitle ,
            showFormDescription ,
            closeFormDescription ,
            updateTaskDescription ,
            formCommentData ,
            addComment ,
            isShowMsgUpdateSuccess ,
            msgUpdated
        }
    },
}
</script>

<template>
    <div class="modal fade" :id="modalID" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title" id="exampleModalLabel">View Task Info</h3>
                    <button 
                        type="button" 
                        class="btn-close" 
                        data-bs-dismiss="modal" 
                        aria-label="Close"
                    ></button>
                </div>
                <div class="modal-body" id="modal-body-story-view">
                    <div class="container-fluid">
                        <div class="row">
                            
                            <!-- Task Info Section -->
                            <section class="col-sm-6 story-left-section">
                                <!-- Task Title -->
                                <div v-if="permissions.includes('edit task')"
                                    class="story-title col-sm-12"
                                    @dblclick="showFormTitle"
                                >   
                                    <label for="storyTitle" class="form-label">
                                        Title
                                    </label>
                                    <h5 v-if="!isShowFormTitle">{{task.title}}</h5>
                                    <form 
                                        v-else
                                        @submit.prevent="updateTaskTitle({
                                            title: task.title
                                        })"
                                    >
                                       <textarea 
                                            class="form-control" 
                                            placeholder="Enter story..." 
                                            id="storyTitle"
                                            rows="3"
                                            v-model="task.title"
                                            required
                                        ></textarea>
                                        <div class="buttons" id="btn-task-title">
                                            <button 
                                                class="btn-secondary"
                                                @click="closeFormTitle"
                                            >
                                                <i class="fa fa-close"></i>
                                            </button>
                                            <button type="submit" class="btn-secondary">
                                                <i class="fa fa-check"></i>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <div v-else 
                                    class="story-title col-sm-12"
                                >
                                    <label for="storyTitle" class="form-label">
                                        Title
                                    </label>
                                    <h5>{{task.title}}</h5>
                                </div>
                                <!-- Task Title -->

                                <!-- Task Description -->
                                <div v-if="permissions.includes('edit task')"
                                    class="story-description col-sm-12"
                                    @dblclick="showFormDescription"
                                >
                                    <div class="mb-3">
                                        <label for="storyDescription" class="form-label">
                                            description
                                        </label>
                                        <div v-if="!isShowFormDescription">
                                            <p v-if="task.description == null">
                                                <i class="fa fa-ban"></i>
                                                No description found !
                                            </p>
                                            <p v-else>{{task.description}}</p>
                                        </div>
                                        <form 
                                            v-else  
                                            @submit.prevent="updateTaskDescription({
                                                description: task.description
                                            })">
                                            <textarea 
                                                class="form-control" 
                                                placeholder="Enter story description..." 
                                                id="storyDescription"
                                                rows="3"
                                                v-model="task.description"
                                                required
                                            ></textarea>
                                            <div class="buttons" id="btn-task-description">
                                                <button 
                                                    class="btn-secondary"
                                                    @click="closeFormDescription"
                                                >
                                                    <i class="fa fa-close"></i>
                                                </button>
                                                <button type="submit" class="btn-secondary">
                                                    <i class="fa fa-check"></i>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div v-else 
                                    class="story-description col-sm-12"
                                >
                                    <label for="storyTitle" class="form-label">
                                        Description
                                    </label>
                                    <h5>{{task.description}}</h5>
                                </div>
                                <!-- Task Description -->

                                <!-- Task Category & Skill -->
                                <div class="task-category-skill col-sm-12"
                                >
                                    <div class="mb-3">
                                        <label for="storyDescription" class="form-label">
                                            category & skill
                                        </label>
                                        <div>
                                            <ul>
                                                <li>{{task.category_name}}</li>
                                                <li>{{task.skill_name}}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <!-- Task Category & Skill -->

                                <!-- Task Developer -->
                                <div 
                                    class="task-developer col-sm-12"
                                    v-if="task.user_found"
                                >
                                    <div class="mb-3">
                                        <label for="storyDescription" class="form-label">
                                            Developer
                                        </label>
                                        <div class="user-details">
                                            <img 
                                                src="@/assets/man.png" 
                                                width="60" 
                                                height="60"
                                            >
                                            <p>{{task.full_name}}</p>
                                        </div>
                                    </div>
                                </div>
                                <!-- Task Developer -->
                            </section>
                            <!-- Task Info Section -->

                            <!-- Task Comments Section -->
                            <section class="col-sm-5 story-right-section">

                                <!-- Task Comments -->
                                <div class="comments">
                                    <section 
                                        v-if="permissions.includes('add comment to task')"  
                                        class="form"
                                    >
                                        <form @submit.prevent="addComment(formCommentData)">
                                            <label for="storyComment" class="form-label">comments</label>
                                            <br>
                                            <img
                                                v-if="userInfo[0].avatar == null && userInfo[0].gender == 'male'" 
                                                src="@/assets/man.png" 
                                            > 
                                            <img
                                                v-else-if="userInfo[0].avatar == null && userInfo[0].gender == 'female' "
                                                src="@/assets/woman.png" 
                                            >
                                            <input 
                                                type="text"
                                                class="form-control" 
                                                id="storyComment" 
                                                placeholder="Add comment ..."
                                                v-model="formCommentData.content"
                                                required
                                            >
                                            <button 
                                                type="submit" 
                                                class="btn btn-success"
                                                style="margin-top:10px;"
                                            > 
                                                Add 
                                            </button>
                                        </form>
                                    </section>
                                    <section 
                                        class="comments-body shadow-sm"
                                        v-if="task.comments_count > 0"
                                    >

                                        <div 
                                            class="comment-info"
                                            v-for="comment in task.comments"
                                            :key="comment"
                                        >
                                            <div class="user-comment-info">
                                                <img
                                                    v-if="comment.avatar == null && comment.gender == 'male'" 
                                                    src="@/assets/man.png" 
                                                > 
                                                <img
                                                    v-else-if="comment.avatar == null && comment.gender == 'female' "
                                                    src="@/assets/woman.png" 
                                                >
                                                <p class="name">
                                                    {{comment.full_name}}
                                                </p>
                                                <span class="date">{{comment.created_at}}</span>
                                            </div>
                                            <p class="comment-text">
                                                {{comment.content}}
                                            </p>
                                        </div>                 
                                    </section>
                                    <div class="no-comments-found" v-else>
                                        <i class="fa fa-ban"></i> 
                                        No comments found ! 
                                    </div>
                                </div>
                                <!-- Task Comments -->
                            </section>
                            <!-- Task Comments Section -->

                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="getBacklog" type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Close
                    </button>
                </div>
            </div>
        </div>

        <!-- Success Message -->
        <div 
            id="alert-success"
            v-if="isShowMsgUpdateSuccess"
        >
            <i class="fa fa-check"> </i>
            <p>
                {{msgUpdated}}
            </p>
        </div>
        <!-- Success Message -->

    </div>
</template>

<style scoped>
#btn-task-title{
    position: absolute;
    right: 0px;
    margin-top: 72px;
}
#btn-task-description{
    position: absolute;
    right: 0px;
    margin-top: 72px;
}
.task-category-skill{
    margin-left: 20px;
    position: relative;
    top: 15px;
}
.task-developer{
    margin-left: 20px;
    position: relative;
    top: 15px;
}
.task-developer p{
    position: relative;
    top: 15px;
    left: 15px;
    text-transform: capitalize;
    font-weight: 700;
    letter-spacing: 1.02px;
    font-size: 18px;
}
.task-category-skill label , 
.task-developer label{
    color: var(--black-color);
    letter-spacing: 1.02px;
    font-weight: 500;
    font-size: 20px;
    text-transform: capitalize;
    opacity: 0.8;
}
.task-category-skill ul{
    list-style-type: none;
    display: flex;
    margin-left: -32px;
    margin-top: 3px;
}
.task-category-skill ul li{
    width: fit-content;
    padding: 2px 10px;
    background: var(--yellow-color);
    color: var(--gray-color);
    border-radius: 8px;
    margin-right: 20px;
    font-weight: bold;
    text-transform: capitalize;
}
</style>