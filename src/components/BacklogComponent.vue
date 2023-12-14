<script>

import StoryInfoModal from '@/components/modal components/stories/StoryInfoModal.vue';
import DeleteStoryModal from '@/components/modal components/stories/DeleteStoryModal.vue';
import useStories from '@/composables/stories';
import axios from 'axios';
import { onMounted, reactive, ref } from 'vue';
import '@/styles/backlog.css'

export default {
    components:{
        StoryInfoModal ,
        DeleteStoryModal
    } ,
    setup() {

        const permissions = JSON.parse(localStorage.getItem('permissions'));

        let project , projectID , projectStatus;
        project = JSON.parse(localStorage.getItem('project'));
        projectID = project.id;
        projectStatus = project.status;

        const{
                allPointsBacklog , ToDoPointsBacklog ,
                ProgressPointsBacklog , DonePointsBacklog , TotalStoriesInBacklog
            } = useStories();

        const formFilterBacklog = reactive({
            title: '' ,
            status: '' ,
            from: '' ,
            to: ''
        });

        /***************
         * Get Backlog 
        ***************/
        const backlog = ref([]);
        const getBacklog = async ()=>{
            const response = await axios.get(`
                http://127.0.0.1:8000/api/ScrumPro/backlog/${projectID}
                ?title=${formFilterBacklog.title}
                &status=${formFilterBacklog.status}
                &from=${formFilterBacklog.from}
                &to=${formFilterBacklog.to}
            `);
            backlog.value = response.data.backlog;
            TotalStoriesInBacklog.value = response.data.total_stories;
            allPointsBacklog.value = response.data.points.all;
            ToDoPointsBacklog.value = response.data.points.todo;
            ProgressPointsBacklog.value = response.data.points.in_progress;
            DonePointsBacklog.value = response.data.points.done;
        }

        let isShowCreateStoryModal = ref(false);
        let isShowMsgStoryCreate = ref(false)

        let formData = reactive({
            "project_id": projectID,
            "title": ''
        });
        
        /************************************
         * Show / Close Create Story Modal 
        ************************************/
        const showCreateStoryModal = ()=>{
            isShowCreateStoryModal.value = true;
        }
        const closeCreateStoryModal = ()=>{
            isShowCreateStoryModal.value = false;
            formData.title = '';
        }

        /***************
         * Store Story
        ***************/
        const storeStory = async (data)=>{

            let RegEx = data.title.search(/As a [^0-9][a-z]+ || [a-z]+ [a-z]+ , I need to [^0-9][a-z]+ || [a-z]+ [a-z]+ , So that [^0-9][a-z]+ || [a-z]+ [a-z]+/);

            if(RegEx == 0){

                await axios.post(`http://127.0.0.1:8000/api/ScrumPro/stories` , data);
                closeCreateStoryModal();
                getBacklog();
                isShowMsgStoryCreate.value = true;
                setTimeout(() => {
                    isShowMsgStoryCreate.value = false;
                }, 3000);

            } else if(RegEx == -1){

                document.getElementById('story-title').style.cssText = `
                    border-color: #df2435;
                    box-shadow: 0 0 6px 0 #df2435;
                `;
                document.getElementById('errorRegEx').style.cssText = `
                    display:flex;
                `;
            }
        }

        /*******************************
         * Manage Update Story Points 
        *******************************/
        let isShowManagePoint = ref(false);
        const showUpdateFormStoryPoint = () =>{
            isShowManagePoint.value = true
        }
        const closeUpdateFormStoryPoint = () =>{
            isShowManagePoint.value = false;
        }

        /*********************************
         * Manage Update Story Priority 
        *********************************/
        let isShowManagePriority = ref(false);
        const showUpdateFormStoryPriority = () =>{
            isShowManagePriority.value = true
        }
        const closeUpdateFormStoryPriority = () =>{
            isShowManagePriority.value = false;
        }

        /*********************
         * Refresh Backlog
        *********************/
        const refreshBacklog = () =>{

            formFilterBacklog.from = '';
            formFilterBacklog.status = '';
            formFilterBacklog.title = '';
            formFilterBacklog.to = '';

            getBacklog();
        }

        /****************
         * On Mounted
        ****************/
        onMounted(()=>{
            getBacklog();
        });

        /************
         * return
        ***********/
        return{
            getBacklog ,
            backlog ,
            TotalStoriesInBacklog ,
            allPointsBacklog ,
            ToDoPointsBacklog ,
            ProgressPointsBacklog ,
            DonePointsBacklog ,
            formData ,
            isShowCreateStoryModal ,
            showCreateStoryModal ,
            closeCreateStoryModal ,
            storeStory ,
            isShowMsgStoryCreate ,
            isShowManagePoint ,
            showUpdateFormStoryPoint ,
            closeUpdateFormStoryPoint ,
            isShowManagePriority ,
            showUpdateFormStoryPriority ,
            closeUpdateFormStoryPriority ,
            permissions ,
            formFilterBacklog ,
            refreshBacklog ,
            projectStatus
        }
    },
}

</script>

<template>

    <!-- Backlog Page -->
    <div id="backlog">
        <!-- Haeder -->
        <header>
            <h4> backlog (<span>{{TotalStoriesInBacklog + ' stories'}}</span>) </h4>
            <div class="buttons">
                <div 
                    :class="permissions.includes('create story') ? 'story-status' : 'story-status story-status-no-create'"
                >
                    <div class="todo-story bg-secondary" title="To Do Points">
                        {{ToDoPointsBacklog + '/' + allPointsBacklog}}
                    </div>
                    <div class="progress-story bg-primary" title="In Progress Points">
                        {{ProgressPointsBacklog + '/' + allPointsBacklog }}
                    </div>
                    <div class="done-story bg-success" title="Done Points">
                        {{DonePointsBacklog + '/' + allPointsBacklog}}
                    </div>
                </div>
                <button 
                    type="button" 
                    class="btn btn-primary"
                    @click="showCreateStoryModal"
                    v-if="permissions.includes('create story') && projectStatus == 'open'"
                >
                    <i class="fa fa-plus"></i>
                    create story
                </button>
                <button
                    type="button"
                    class="btn btn-refresh"
                    @click="refreshBacklog"
                    title="refresh backlog"
                >
                    <i class="fa fa-refresh"></i>
                </button>
            </div>
        </header>
        <!-- Haeder -->

        <!-- Filter -->
        <form @submit.prevent="getBacklog">
            <section class="filter">
                <div class="filter-icon">
                    <i class="fa fa-filter"></i>
                </div>
                <div class="select-status">
                    <select v-model="formFilterBacklog.status" class="form-select form-control" aria-label="Default select example">
                        <option value=""> Select status </option>
                        <option value="to do">to do</option>
                        <option value="in progress">in progress</option>
                        <option value="done">done</option>
                    </select>
                </div>
                <div class="search-point">
                    <span> Points </span>
                    <input 
                        type="number" 
                        class="form-control"
                        v-model="formFilterBacklog.from"
                        placeholder="form"
                    >
                    <span> - </span>
                    <input 
                        type="number" 
                        class="form-control"
                        v-model="formFilterBacklog.to"
                        placeholder="to"
                    >
                </div>
                <div class="input-search">
                    <i class="fa fa-search"></i>
                    <input 
                        type="text" 
                        class="form-control" 
                        placeholder="Serach story title ..."
                        v-model="formFilterBacklog.title"
                    >
                </div>
                <button type="submit" class="btn btn-primary">
                    <i class="fa fa-search"></i>
                </button>
            </section>
        </form>
        <!-- Filter -->

        <!-- Content -->
        <div class="content">
            <div class="conatiner">
                <div class="row">

                    <div 
                        class="backlog-empty col-sm-8"
                        v-if="TotalStoriesInBacklog == 0"
                    >
                        <h3> <i class="fa fa-ban"> </i> your backlog is empty ! </h3>
                    </div>

                    <div 
                        class="story-box col-sm-12 shadow-sm"
                        v-else
                        v-for="story in backlog"
                        :key="story"
                    >
                        <div class="story-icon">
                            <i class="fa fa-bookmark bg-success"></i>
                        </div>
                        <div class="story-title">
                            <p>
                                {{story.title}}
                            </p>
                        </div>
                        <div class="story-manage">

                            <!-- Story Point -->
                            <div class="story-point">
                                <span id="story-point-number"> 
                                    {{story.points}} 
                                </span>
                            </div>
                            <!-- Story Point -->

                            <!-- Story Status -->
                            <div v-if="story.status == 'to do'" class="story-status todo">
                                <span> {{story.status}} </span>
                            </div>
                            <div v-else-if="story.status == 'in progress'" class="story-status progress">
                                <span> {{story.status}} </span>
                            </div>
                            <div v-else-if="story.status == 'not complete'" class="story-status not-complete">
                                <span> {{story.status}} </span>
                            </div>
                            <div v-else class="story-status done">
                                <span> {{story.status}} </span>
                            </div>
                            <!-- Story Status -->

                            <!-- Story Button Group -->
                            <div class="btn-group dropup">
                                <button type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa fa-ellipsis-h"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li 
                                        class="dropdown-item"
                                        data-bs-toggle="modal" 
                                        :data-bs-target="'#storyInfoModal' + story.id"
                                    >
                                        View
                                    </li>
                                    <li 
                                        class="dropdown-item"
                                        data-bs-toggle="modal" 
                                        :data-bs-target="'#deleteStoryModal' + story.id"
                                        v-if="permissions.includes('delete story')"
                                    >
                                        Delete
                                    </li>
                                </ul>
                            </div>
                            <!-- Story Button Group -->
                        </div>

                        <DeleteStoryModal 
                            :modalID="'deleteStoryModal' + story.id"
                            :storyID="story.id"
                            v-if="permissions.includes('delete story')"
                        />

                        <StoryInfoModal 
                            :modalID="'storyInfoModal' + story.id" 
                            :storyID="story.id"
                        />
                    </div>

                </div>
            </div>
        </div>
        <!-- Content -->
    </div>
    <!-- Backlog Page -->

    <!-- Create Story Modal -->
    <div class="modal-main" id="createCategoryModal" v-if="isShowCreateStoryModal">
        <div class="modal-box">
            <div class="box-header">
                <h5> Create New Story </h5>
                <button class="btn-close" @click="closeCreateStoryModal"></button>
            </div>
            <form @submit.prevent="storeStory(formData)">
                <div class="box-body">
                    <div class="mb-3">
                        <label for="story-title" class="col-form-label">
                            Story Title
                        </label>
                        <div id="errorRegEx">
                            <i class="fa fa-exclamation"></i>
                            <p> Story title not match with role. </p>
                        </div>
                        <textarea 
                            class="form-control" 
                            placeholder="As a [type of user] , I need to [perform some task] , So that [achieve some goal]" 
                            id="story-title"
                            rows="4"
                            v-model="formData.title"
                            required
                            ></textarea>
                    </div>
                </div>
                <div class="box-footer">
                    <button 
                        type="button" 
                        class="btn btn-secondary" 
                        @click="closeCreateStoryModal"
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
    <!-- Create Story Modal -->

    <!-- Success Message Create Story -->
    <div id="alert-success" v-if="isShowMsgStoryCreate">
        <i class="fa fa-check"> </i>
        <p>
            Successfully <b> Created </b> New Story
        </p>
    </div>
    <!-- Success Message Create Story -->

</template>

<style scoped>
#errorRegEx{
    display: none;
    position: absolute;
    top: 88px;
    right: 20px;
    color: #df2435;
    font-weight: 600;
    font-size: 17px;
}
#errorRegEx i{
    position: relative;
    top: 4px;
    right: 5px;
}
</style>
