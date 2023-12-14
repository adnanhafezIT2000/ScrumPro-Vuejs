<script>
import '@/styles/sprints.css'
import StoryInfoModal from '@/components/modal components/stories/StoryInfoModal.vue';
import axios from 'axios';
import { onMounted, reactive, ref } from 'vue';
import DeleteSprintModal from './modal components/sprints/DeleteSprintModal.vue';
import { useRouter } from 'vue-router';

export default {
    components:{
        DeleteSprintModal ,
        StoryInfoModal
    } ,

    setup() {

        const permissions = JSON.parse(localStorage.getItem('permissions'));

        const router = useRouter();

        const URL = 'http://127.0.0.1:8000/api/ScrumPro';

        const project = JSON.parse(localStorage.getItem('project'));
        const userInfo = JSON.parse(localStorage.getItem('user-info'));
        const projectID = project.id;
        const projectStatus = project.status;

        const sprints = ref([]);
        const totalSprints = ref('');
        const backlog = ref([]);
        const totalStories = ref('');
        const dailyScrum = ref([]);
        const isFoundDailyScrum = ref('');

        const getAllSprintsForProject = async ()=>{
            const response = await axios.get(`${URL}/get-sprints-for-project/${projectID}`);
            sprints.value = response.data.sprints.data;
            totalSprints.value = response.data.sprints.count_sprints;
            backlog.value = response.data.backlog.data;
            totalStories.value = response.data.backlog.total_stories;
            dailyScrum.value = response.data.daily_scrum;
            isFoundDailyScrum.value = response.data.is_found_daily_scrum;
        }

        let formCreateSprint = reactive({
            project_id: projectID ,
            name: '' ,
            strat_date: '' ,
            end_date: '' ,
            goal: '' ,
        });

        let isShowCreateSprintModal = ref(false);
        let isShowMsgErrorCheckCreateSprint = ref(false);
        const showCreateSprintModal = async ()=>{

            await axios.get(`${URL}/check-create-sprint/${projectID}`)
            .then((response)=>{

                if(response.data.create_sprint == true){
                    isShowCreateSprintModal.value = true;
                } else{
                   isShowMsgErrorCheckCreateSprint.value = true;
                   setTimeout(() => {
                        isShowMsgErrorCheckCreateSprint.value = false;
                        router.push('sprint-planning-meeting');
                   }, 3000);
                }
            })
        }
        const closeCreateSprintModal = ()=>{
            isShowCreateSprintModal.value = false;
            formCreateSprint.name = '';
            formCreateSprint.strat_date = '';
            formCreateSprint.end_date = '';
            formCreateSprint.goal = '';
            noteCreateSprint.value = false;
        }

        let isShowMsgSprintCreate = ref(false);
        let noteCreateSprint = ref(false);
        let isShowMsgErrorSprintCreateError = ref(false);
        let msgErrorCreateSprint = ref('');
        const storeSprint = async (data) =>{

            await axios.post(`http://127.0.0.1:8000/api/ScrumPro/sprints` , data)
            .then((response)=>{

                if(response.data.status == true && response.data.store_status == true){

                    getAllSprintsForProject();
                    closeCreateSprintModal();
                    isShowMsgSprintCreate.value = true;
                    setTimeout(() => {
                        isShowMsgSprintCreate.value = false;
                    }, 3000);

                } else if(response.data.status == false && response.data.store_status == true){

                    noteCreateSprint.value = true;

                } else if(response.data.status == false && response.data.store_status == false){
                    
                    isShowMsgErrorSprintCreateError.value = true;
                    msgErrorCreateSprint.value = response.data.msg;
                    closeCreateSprintModal();
                    setTimeout(() => {
                        isShowMsgErrorSprintCreateError.value = false;
                    }, 3500);
                }

            });
        }

        let isShowMsgAddStoryToSprint = ref(false);
        let isShowMsgErrorAddStoryToSprint = ref(false)
        const addStoryToSprint = async (data) =>{

            await axios.post(`${URL}/add-story-to-sprint` , data)
            .then((response)=>{

                if(response.data.status == true){

                    getAllSprintsForProject();
                    isShowMsgAddStoryToSprint.value = true;
                    setTimeout(() => {
                        isShowMsgAddStoryToSprint.value = false;
                    }, 2500);

                } else{

                    isShowMsgErrorAddStoryToSprint.value = true;
                    setTimeout(() => {
                        isShowMsgErrorAddStoryToSprint.value = false;
                    }, 3500);

                }
            });
        }

        let isShowMsgRemoveStoryFromSprint = ref(false);
        const removeStoryFromSprint = async (data)=>{

            await axios.post(`${URL}/remove-story-from-sprint` , data)
            .then((response)=>{

                if( response.data.status == true ){

                    //getBacklogForSprints();
                    getAllSprintsForProject();
                    isShowMsgRemoveStoryFromSprint.value = true;
                    setTimeout(() => {
                        isShowMsgRemoveStoryFromSprint.value = false;
                    }, 2500);
                }
            })
        }

        let isShowMsgUpdateStoryRank = ref(false);
        const updateRankStory = async (data)=>{

            let selectClass = '.story-rank' + data.story_id + data.sprint_id;
            let rank = document.querySelector(selectClass).value;

            let formData = reactive({
                story_id: data.story_id ,
                sprint_id: data.sprint_id ,
                rank: rank ,
            });

            await axios.post(`${URL}/update-story-rank` , formData)
            .then((response)=>{

                if(response.data.status == true){

                    getAllSprintsForProject();
                    isShowMsgUpdateStoryRank.value = true;
                    setTimeout(() => {
                        isShowMsgUpdateStoryRank.value = false;
                    }, 2500);
                }
            });
        }

        let isShowResponseStartSprint = ref(false);
        let responseMsgID = ref('');
        let responseMsgIconClass = ref('');
        let responseMsgContent = ref('');
        const startSprint = async (sprintID) =>{
            await axios.get(`${URL}/start-sprint/${sprintID}`)
            .then((response)=>{

                if(response.data.status){

                    getAllSprintsForProject();

                    isShowResponseStartSprint.value = true;
                    responseMsgID.value = 'alert-success';
                    responseMsgIconClass.value = 'fa fa-check';
                    responseMsgContent.value = response.data.msg;

                    setTimeout(() => {
                        isShowResponseStartSprint.value = false;
                    }, 2500);

                } else{

                    isShowResponseStartSprint.value = true;
                    responseMsgID.value = 'alert-danger';
                    responseMsgIconClass.value = 'fa fa-exclamation-circle';
                    responseMsgContent.value = response.data.msg;

                    setTimeout(() => {
                        isShowResponseStartSprint.value = false;
                    }, 3000);
                }
            })
        }

        const refreshSprints = ()=>{

            getAllSprintsForProject();
        }

        const startStoryWork = async (formData)=>{
            
            await axios.post(`${URL}/start-story-work` , formData)
            .then((response)=>{
                
                if(response.data.status){
                    
                    getAllSprintsForProject();
                    isShowResponseStartSprint.value = true;
                    responseMsgID.value = 'alert-success';
                    responseMsgIconClass.value = 'fa fa-check';
                    responseMsgContent.value = response.data.msg;
                    setTimeout(() => {
                        isShowResponseStartSprint.value = false;
                    }, 2500);

                } else{

                    isShowResponseStartSprint.value = true;
                    responseMsgID.value = 'alert-danger';
                    responseMsgIconClass.value = 'fa fa-exclamation';
                    responseMsgContent.value = response.data.msg;
                    setTimeout(() => {
                        isShowResponseStartSprint.value = false;
                    }, 3500);
                }
            });
        }

        let isShowDailyScrumMeeting = ref(false);
        const formDataDailyScrum = reactive({
            start_time: '' ,
            end_time: '' ,
            type: 'daily scrum' ,
            project_id: projectID , 
        });
        const showDailyScrumMeeting = ()=>{
            isShowDailyScrumMeeting.value = true;
        }
        const closeDailyScrumMeeting = ()=>{
            isShowDailyScrumMeeting.value = false;
            formDataDailyScrum.start_time = '';
            formDataDailyScrum.end_time = '';
        }
        const storeDailyScrumMeeting = async (data)=>{
            await axios.post(`${URL}/store-daily-scrum-meeting` , data)
            .then((response)=>{
                if(response.data.status){
                    
                    closeDailyScrumMeeting();
                    getAllSprintsForProject();
                    isShowResponseStartSprint.value = true;
                    responseMsgID.value = 'alert-success';
                    responseMsgIconClass.value = 'fa fa-check';
                    responseMsgContent.value = response.data.msg;

                    setTimeout(() => {
                        isShowResponseStartSprint.value = false;
                    }, 2500);
                }
            })
        }
        const updateDailyScrumMeeting = async (data)=>{
            await axios.post(`${URL}/update-daily-scrum-meeting` , data)
            .then((response)=>{
                if(response.data.status){
                    
                    formDataDailyScrum.start_time = '';
                    formDataDailyScrum.end_time   = '';
                    getAllSprintsForProject();
                    isShowResponseStartSprint.value = true;
                    responseMsgID.value = 'alert-success';
                    responseMsgIconClass.value = 'fa fa-check';
                    responseMsgContent.value = response.data.msg;

                    setTimeout(() => {
                        isShowResponseStartSprint.value = false;
                    }, 2500);
                }
            })
        }

        onMounted(()=>{
            getAllSprintsForProject();
        });

        return{
            projectID ,
            backlog ,
            totalStories ,
            sprints ,
            isShowCreateSprintModal ,
            isShowMsgSprintCreate ,
            showCreateSprintModal ,
            closeCreateSprintModal ,
            formCreateSprint ,
            storeSprint ,
            noteCreateSprint ,
            isShowMsgErrorSprintCreateError ,
            msgErrorCreateSprint ,
            addStoryToSprint ,
            projectStatus ,
            isShowMsgAddStoryToSprint ,
            isShowMsgErrorAddStoryToSprint ,
            isShowMsgRemoveStoryFromSprint ,
            removeStoryFromSprint ,
            updateRankStory ,
            isShowMsgUpdateStoryRank ,
            isShowMsgErrorCheckCreateSprint ,
            permissions ,
            totalSprints ,
            startSprint ,
            isShowResponseStartSprint ,
            responseMsgID ,
            responseMsgIconClass ,
            responseMsgContent ,
            refreshSprints ,
            startStoryWork ,
            userInfo ,
            isShowDailyScrumMeeting ,
            showDailyScrumMeeting ,
            formDataDailyScrum ,
            closeDailyScrumMeeting , 
            isFoundDailyScrum ,
            dailyScrum,
            storeDailyScrumMeeting ,
            updateDailyScrumMeeting
        }
    },
}
</script>

<template>

    <div id="sprint">
        <header>
            <h4> sprints </h4>
            <div class="buttons">
                <button 
                    type="button" 
                    class="btn btn-primary" 
                    @click="showCreateSprintModal"
                    v-if="permissions.includes('create sprint') && projectStatus == 'open'"
                >
                    <i class="fa fa-plus"></i>
                    create new sprint
                </button>
                <button
                    type="button"
                    class="btn btn-primary"
                    v-if="permissions.includes('daily scrum meeting')"
                    @click="showDailyScrumMeeting"
                >
                    Daily Scrum Meeting
                </button>
                <button
                    type="button"
                    class="btn btn-refresh"
                    @click="refreshSprints"
                    title="refresh sprints"
                >
                    <i class="fa fa-refresh"></i>
                </button>
            </div>
        </header>

        <div class="container">
            <div class="row">
                
                <div 
                    class="col-sm-12 no-sprints"
                    v-if="totalSprints == 0"
                >
                    <h1 class="text-center">
                        <i class="fa fa-ban"></i> 
                        You don't have any sprints 
                    </h1>
                </div>

                <!-- Sprint Box -->
                <div class="col-sm-12 sprint-box shadow-sm"
                    v-for="sprint in sprints"
                    :key="sprint"
                    v-else
                >
                    <div class="accordion" id="accordionExample">
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingOne">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#sprintBacklog1" aria-expanded="true" aria-controls="collapseOne">
                                    {{sprint.name}}
                                    <span>
                                        {{sprint.strat_date}} - {{sprint.end_date}}
                                        ({{sprint.count_stories}} stories)
                                    </span>
                                </button>
                                <div class="sprint-manage">
                                    <div class="ul-points" v-if="sprint.count_stories != 0">
                                        <li title="To Do Points" class="point-todo"> 
                                            {{sprint.todo_points}} / {{sprint.all_points}}
                                        </li>
                                        <li title="In Progress Points" class="point-progress"> 
                                            {{sprint.progress_points}} / {{sprint.all_points}} 
                                        </li>
                                        <li title="Done Points" class="point-done"> 
                                            {{sprint.done_Points}} / {{sprint.all_points}} 
                                        </li>
                                    </div>

                                    <div class="ul-points" v-else>
                                        <li title="To Do Points" class="point-todo"> 
                                            0 / 0
                                        </li>
                                        <li title="In Progress Points" class="point-progress"> 
                                            0 / 0
                                        </li>
                                        <li title="Done Points" class="point-done"> 
                                            0 / 0
                                        </li>
                                    </div>
                                    
                                   <div class="button-group">
                                        <button 
                                            id="btn-start-complete"
                                            v-if="sprint.status == 'to do' && permissions.includes('start sprint to work')"
                                            @click="startSprint(sprint.id)"
                                        >
                                            Start Sprint
                                        </button>
                                        <button 
                                            id="btn-start-complete"
                                            v-else-if="sprint.status == 'done'"
                                            style="background: #E3FCEF; color: #006644;"
                                        >
                                            Done Sprint
                                        </button>
                                         <button 
                                            id="btn-start-complete"
                                            v-else-if="sprint.status == 'not complete'"
                                            style="background: #ef5e5e; color: #f1e1e1;"
                                        >
                                            Not Complete
                                        </button>
                                        <button 
                                            id="btn-start-complete"
                                            v-else
                                            style="background: #c9ddfa; color: #0747A6;"
                                        >
                                            In Progress
                                        </button>
        
                                        <div class="btn-group dropup" v-if="sprint.status == 'to do'">
                                            <button type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="fa fa-ellipsis-h"></i>
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li 
                                                    class="dropdown-item"
                                                    data-bs-toggle="modal" 
                                                    data-bs-target="#storyInfoModal"
                                                    v-if="permissions.includes('edit sprint')"
                                                >
                                                    Edit sprint
                                                </li>
                                                <li 
                                                    class="dropdown-item"
                                                    data-bs-toggle="modal" 
                                                    :data-bs-target="'#deleteSprintModal'+sprint.id"
                                                    v-if="permissions.includes('delete sprint')"
                                                >
                                                    Delete sprint
                                                </li>
                                                <li 
                                                    class="dropdown-item"
                                                    style="user-select:none"
                                                    v-if="!permissions.includes('delete sprint') && !permissions.includes('edit sprint')"
                                                >
                                                    Can't manage
                                                </li>
                                            </ul>
                                        </div>
                                   </div>

                                    <DeleteSprintModal 
                                        :modelID="'deleteSprintModal'+sprint.id"
                                        :sprintID="sprint.id"
                                        :sprintName="sprint.name"
                                    />

                                </div>
                            </h2>
                            <div id="sprintBacklog1" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                    <div 
                                        class="story-box col-sm-12"
                                        v-for="story in sprint.stories"
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
                                            <div class="story-point">
                                                <span id="story-point-number"> {{story.points}} </span>
                                            </div>
                                            <!-- Story Status -->
                                            <div v-if="story.status == 'to do'" class="story-status todo">
                                                <span> {{story.status}} </span>
                                            </div>
                                            <div v-else-if="story.status == 'in progress'" class="story-status gprogress">
                                                <span> {{story.status}} </span>
                                            </div>
                                            <div v-else-if="story.status == 'done'" class="story-status done">
                                                <span> {{story.status}} </span>
                                            </div>
                                            <div v-else class="story-status not-complete">
                                                <span>not complete</span>
                                            </div>
                                            <!-- Story Status -->
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
                                                        @click="removeStoryFromSprint({
                                                            story_id: story.id ,
                                                            sprint_id: sprint.id
                                                        })"
                                                        v-if="permissions.includes('create sprint') && sprint.status == 'to do'"
                                                    >
                                                        Remove from sprint
                                                    </li>
                                                    <router-link
                                                        v-if="permissions.includes('show project tasks')"
                                                        :to=" {
                                                            name: 'story-tasks' , 
                                                            params: {id: story.id}
                                                        } " 
                                                        style="text-decoration: none"
                                                    >
                                                        <li
                                                            class="dropdown-item"
                                                        >
                                                            Tasks manage
                                                        </li>
                                                    </router-link>
                                                    <li
                                                        class="dropdown-item"
                                                        v-if="permissions.includes('start story to work in sprint backlog') && sprint.status == 'in progress' && story.status == 'to do'"
                                                        @click="startStoryWork({
                                                            storyID: story.id ,
                                                            sprintID: sprint.id
                                                        })"
                                                    >
                                                        Start work
                                                    </li>
                                                </ul>
                                            </div>
                                            
                                            <div class="rank-story">
                                                <select  
                                                    @input="updateRankStory({
                                                        story_id: story.id ,
                                                        sprint_id: sprint.id
                                                    })" 
                                                    :class="'form-control story-rank' + story.id + sprint.id"
                                                    v-if="sprint.status == 'to do'"
                                                >
                                                    <option value="0">rank</option>
                                                    <option 
                                                        v-for="rank in sprint.count_stories"
                                                        :key="rank"
                                                        :value="rank"
                                                        :selected="story.story_rank == rank ? true : false "
                                                    > 
                                                        {{rank}} 
                                                    </option>
                                                </select>
                                                <select
                                                    :class="'form-control story-rank' + story.id + sprint.id"
                                                    v-else
                                                >
                                                    <option :value="story.story_rank">
                                                        {{story.story_rank}}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        <StoryInfoModal 
                                            :modalID="'storyInfoModal' + story.id" 
                                            :storyID="story.id"
                                        />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Sprint Box -->

                <!-- Backolg -->
                <div class="col-sm-12 backlog shadow-sm">
                    <div class="accordion" id="accordionExample">
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingOne">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#backlog" aria-expanded="true" aria-controls="collapseOne">
                                    Backlog 
                                        <span>({{totalStories}} stories)</span>
                                </button>
                            </h2>
                            <div id="backlog" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                    <div 
                                        class="story-box col-sm-12"
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
                                            <div class="story-point">
                                                <span id="story-point-number">
                                                    {{story.points}} 
                                                </span>
                                            </div>
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
                                                        @click="addStoryToSprint({
                                                            project_id: projectID,
                                                            story_id: story.id ,
                                                        })"
                                                        v-if="permissions.includes('create sprint')"
                                                    >
                                                        Add to sprint
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <StoryInfoModal 
                                            :modalID="'storyInfoModal' + story.id" 
                                            :storyID="story.id"
                                        />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                </div>
                <!-- Backlog -->

            </div>
        </div>
    </div>

    <!-- Add Story To Sprint Modal -->
    <AddStoryToSprintModal />
    <!-- Add Story To Sprint Modal -->

    <!-- Create Sprint Modal -->
    <div class="modal-main" id="createsprintModal" v-if="isShowCreateSprintModal">
    <div class="modal-box">
        <div class="box-header">
            <h5> Create Sprint </h5>
            <button class="btn-close" @click="closeCreateSprintModal"></button>
        </div>
        <form @submit.prevent="storeSprint(formCreateSprint)">
            <div class="box-body">
                <div class="mb-3">
                    <label for="Sprint-name" class="col-form-label">Sprint Name</label>
                    <input 
                        type="text" 
                        placeholder="Enter Sprint name" 
                        class="form-control" 
                        id="skill-name"
                        v-model="formCreateSprint.name"
                        required
                    >
                </div>
                <div class="mb-1">
                    <p v-if="!noteCreateSprint">
                        Note: the duration of the sprint is from 7-days to 30-days
                    </p>
                    <span v-else class="error-sprint-duration">
                        Error, this date not match to role
                    </span>
                </div>
                <div class="mb-3">
                    <label for="start-date" class="col-form-label">Start Date</label>
                    <input 
                        type="date"  
                        class="form-control" 
                        id="start-date"
                        v-model="formCreateSprint.strat_date"
                        required
                    >
                </div>
                    <div class="mb-3">
                    <label for="end-date" class="col-form-label">End Date</label>
                    <input 
                        type="date"  
                        class="form-control" 
                        id="end-date"
                        v-model="formCreateSprint.end_date"
                        required
                    >
                </div>
                    <div class="mb-3">
                    <label for="sprint-goal" class="col-form-label">Sprint Goal</label>
                    <textarea 
                        class="form-control" 
                        placeholder="Enter sprint goal..." 
                        id="sprint-goal"
                        v-model="formCreateSprint.goal"
                        required
                    ></textarea>
                </div>
            </div>
            <div class="box-footer">
                <button 
                    type="button" 
                    class="btn btn-secondary" 
                    @click="closeCreateSprintModal"
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
    <!-- Create Sprint Modal -->

    <!-- Success Message Create Sprint -->
    <div id="alert-success" v-if="isShowMsgSprintCreate">
        <i class="fa fa-check"> </i>
        <p>
            Successfully <b> Created </b> Sprint
        </p>
    </div>
    <!-- Success Message Create Sprint -->

    <!-- Error Message Create Sprint -->
    <div id="alert-danger" v-if="isShowMsgErrorSprintCreateError">
        <i class="fa fa-exclamation-circle"> </i>
        <p>
            {{msgErrorCreateSprint}}
        </p>
    </div>
    <!-- Error Message Create Sprint -->

    <!-- Success Message Add Story To Sprint -->
    <div id="alert-success" v-if="isShowMsgAddStoryToSprint">
        <i class="fa fa-check"> </i>
        <p>
            Successfully <b> Add </b> Story To Sprint
        </p>
    </div>
    <!-- Success Message Add Story To Sprint -->

    <!-- Error Message Create Sprint -->
    <div id="alert-danger" v-if="isShowMsgErrorAddStoryToSprint">
        <i class="fa fa-exclamation-circle"> </i>
        <p>
            There Is <b>No Sprint</b> To Add Stories
        </p>
    </div>
    <!-- Error Message Create Sprint -->

    <!-- Success Message Remove Story From Sprint -->
    <div id="alert-success" v-if="isShowMsgRemoveStoryFromSprint">
        <i class="fa fa-check"> </i>
        <p>
            Successfully <b> Remove </b> Story From Sprint
        </p>
    </div>
    <!-- Success Message Remove Story From Sprint -->

    <!-- Success Message Update Rank Story -->
    <div id="alert-success" v-if="isShowMsgUpdateStoryRank">
        <i class="fa fa-check"> </i>
        <p>
            Successfully <b> Updated </b> Story Rank
        </p>
    </div>
    <!-- Success Message Update Rank Story -->

    <!-- Error Message Check Create Sprint -->
    <div id="alert-danger" v-if="isShowMsgErrorCheckCreateSprint">
        <i class="fa fa-exclamation-circle"> </i>
        <p>
            Meetings and sprints numbers are not identical
        </p>
    </div>
    <!-- Error Message Check Create Sprint -->

    <!-- Response Message Start Sprint -->
    <div :id="responseMsgID" v-if="isShowResponseStartSprint">
        <i :class="responseMsgIconClass"> </i>
        <p>
            {{responseMsgContent}}
        </p>
    </div>
    <!-- Response Message Start Sprint -->

    <!-- Daily Scrum Meeting Modal -->
    <div class="modal-main" id="createDailyScrumModal" v-if="isShowDailyScrumMeeting">
        <div class="modal-box">
            <div class="box-header">
                <h5> Daily Scrum Meeting </h5>
                <button class="btn-close" @click="closeDailyScrumMeeting"></button>
            </div>
            <form v-if="isFoundDailyScrum == 0" @submit.prevent="storeDailyScrumMeeting(formDataDailyScrum)">
                <div class="box-body">
                    <div class="mb-3">
                        <label for="start-time" class="col-form-label">Start Time</label>
                        <input 
                            type="time"  
                            class="form-control" 
                            id="start-time"
                            v-model="formDataDailyScrum.start_time"
                            required
                        >
                        <p v-if="isFoundDailyScrum != 0"> Start Time : {{dailyScrum[0].start_time}} </p>
                    </div>
                        <div class="mb-3">
                        <label for="end-time" class="col-form-label">End Time</label>
                        <input 
                            type="time"  
                            class="form-control" 
                            id="end-time"
                            v-model="formDataDailyScrum.end_time"
                            required
                        >
                        <p v-if="isFoundDailyScrum != 0"> End Time : {{dailyScrum[0].end_time}} </p>
                    </div>
                </div>
                <div class="box-footer">
                    <button 
                        type="button" 
                        class="btn btn-secondary" 
                        @click="closeDailyScrumMeeting"
                    >
                        close
                    </button>
                    <button v-if="userInfo[0].role_name != 'developer' " type="submit" class="btn btn-success">
                        create
                    </button>
                </div>
            </form>
             <form v-else @submit.prevent="updateDailyScrumMeeting(formDataDailyScrum)">
                <div class="box-body">
                    <div class="mb-3">
                        <label for="start-time" class="col-form-label">Start Time</label>
                        <input 
                            type="time"  
                            class="form-control" 
                            id="start-time"
                            v-model="formDataDailyScrum.start_time"
                            required
                        >
                        <p v-if="isFoundDailyScrum != 0"> Start Time : {{dailyScrum[0].start_time}} </p>
                    </div>
                        <div class="mb-3">
                        <label for="end-time" class="col-form-label">End Time</label>
                        <input 
                            type="time"  
                            class="form-control" 
                            id="end-time"
                            v-model="formDataDailyScrum.end_time"
                            required
                        >
                        <p v-if="isFoundDailyScrum != 0"> End Time : {{dailyScrum[0].end_time}} </p>
                    </div>
                </div>
                <div class="box-footer">
                    <button 
                        type="button" 
                        class="btn btn-secondary" 
                        @click="closeDailyScrumMeeting"
                    >
                        close
                    </button>
                    <button v-if="userInfo[0].role_name != 'developer'" type="submit" class="btn btn-success">
                        update
                    </button>
                </div>
            </form>
        </div>
    </div>
    <!-- Daily Scrum Meeting Modal -->

</template>

<style scoped>
#createDailyScrumModal input{
    width: 57%;
}
#createDailyScrumModal .mb-3{
    position: relative;
}
#createDailyScrumModal .mb-3 p{
    position: absolute;
    top: 59%;
    right: 0px;
    font-weight: 700;
    font-style: italic;
    color: var(--black-color);
}
</style>