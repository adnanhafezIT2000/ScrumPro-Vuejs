<script>

import '@/styles/sprint-meeting.css';
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import DeleteMeetingModal from './modal components/meeting/DeleteMeetingModal.vue';

export default {

    components:{
        DeleteMeetingModal
    } ,

    setup() {
        
        const router = useRouter();
        const URL = 'http://127.0.0.1:8000/api/ScrumPro';

        const project = JSON.parse(localStorage.getItem('project'));
        const projectID = project.id;
        const projectStatus = project.status;

        let isShowCreatePlanningMeetingModal = ref(false);
        const showCreatePlanningMeetingModal = ()=>{
            isShowCreatePlanningMeetingModal.value = true;
        }
        const closeCreatePlanningMeetingModal = ()=>{
            isShowCreatePlanningMeetingModal.value = false;
        }

        let formData = reactive({
            project_id: projectID ,
            type: 'planning meeting' ,
            date: '' ,
            start_time: '' ,
            end_time: '' ,
            description: '' ,
        });
        let isShowMsgCreatePlanningMeeting = ref(false);
        const storePlanningMeeting = async (data)=>{

            await axios.post(`${URL}/store-planning-meeting` , data)
            .then((response)=>{

                if(response.data.status == true){

                    getAllPlanningMeeting();
                    closeCreatePlanningMeetingModal();
                    isShowMsgCreatePlanningMeeting.value = true;
                    setTimeout(() => {
                        isShowMsgCreatePlanningMeeting.value = false;
                        router.push('sprints');
                    }, 2500);
                    
                }
            })
        }

        const meetings = ref([]);
        const getAllPlanningMeeting = async ()=>{
            
            const response = await axios.get(`${URL}/get-all-planning-meeting/${projectID}`);
            meetings.value = response.data;
        }

        onMounted(()=>{
            getAllPlanningMeeting();
        });

        return{
            isShowCreatePlanningMeetingModal ,
            showCreatePlanningMeetingModal ,
            closeCreatePlanningMeetingModal ,
            formData ,
            storePlanningMeeting ,
            isShowMsgCreatePlanningMeeting ,
            meetings, 
            projectStatus
        }
    },
}

</script>

<template>

    <!-- Sprint Planning Meeting -->
    <div id="sprint-meeting">

        <!-- Header -->
        <header>
            <h4> sprint planning meeting </h4>
            <div class="buttons">
                <button 
                    type="button" 
                    class="btn btn-primary"
                    @click="showCreatePlanningMeetingModal"
                    v-if="projectStatus == 'open'"
                >
                    <i class="fa fa-plus"></i>
                    create planning meeting
                </button>
            </div>
        </header>
        <!-- Header -->

        <!-- Container -->
        <div class="container">

            <div class="no-found-meetings" v-if="meetings.length == 0">
                <h1 class="text-center">
                    <i class="fa fa-ban"></i> 
                    You don't have any sprint planning meetings 
                </h1>
            </div>

            <table v-else class="table table-striped shadow-sm">
                <thead>
                    <tr>
                        <th class="th-sm">Meeting Date</th>
                        <th class="th-sm">Start time</th>
                        <th class="th-sm">End time</th>
                        <th class="th-sm">Created at</th>
                        <th class="th-sm">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="meeting in meetings" :key="meeting">
                        <td> {{meeting.date}} </td>
                        <td> {{meeting.start_time}} </td>
                        <td> {{meeting.end_time}} </td>
                        <td> {{meeting.created_at.split("T")[0]}} </td>
                        <td>
                            <i 
                                class="fa fa-trash"
                                style="color:#dc3545;font-size:20px;cursor: pointer;"
                                data-bs-toggle="modal" 
                                :data-bs-target="'#deleteMeetingModal' + meeting.id"
                            ></i>
                        </td>
                        <DeleteMeetingModal 
                           :modalID="'deleteMeetingModal' + meeting.id"
                           :meetingID="meeting.id"
                        />
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Container -->

    </div>
    <!-- Sprint Planning Meeting -->

    <!-- Create Sprint Planning Meeting -->
    <div class="modal-main" id="createPlanningMeetingModal" v-if="isShowCreatePlanningMeetingModal">
        <div class="modal-box">
            <div class="box-header">
                <h5> Create Planning Meeting </h5>
                <button class="btn-close" @click="closeCreatePlanningMeetingModal"></button>
            </div>
            <form @submit.prevent="storePlanningMeeting(formData)">
                <div class="box-body">
                    <div class="mb-3">
                        <label for="meeting-date" class="col-form-label">Meeting Date</label>
                        <input 
                            type="date"  
                            class="form-control" 
                            id="meeting-date"
                            v-model="formData.date"
                            required
                        >
                    </div>
                    <div class="mb-3">
                        <label for="start-time" class="col-form-label">Start Time</label>
                        <input 
                            type="time"  
                            class="form-control" 
                            id="start-time"
                            v-model="formData.start_time"
                            required
                        >
                    </div>
                        <div class="mb-3">
                        <label for="end-time" class="col-form-label">End Time</label>
                        <input 
                            type="time"  
                            class="form-control" 
                            id="end-time"
                            v-model="formData.end_time"
                            required
                        >
                    </div>
                        <div class="mb-3">
                        <label for="meeting-description" class="col-form-label">Meeting Description</label>
                        <textarea 
                            class="form-control" 
                            placeholder="Enter planning meeting description..." 
                            id="meeting-description"
                            v-model="formData.description"
                            required
                        ></textarea>
                    </div>
                </div>
                <div class="box-footer">
                    <button 
                        type="button" 
                        class="btn btn-secondary" 
                        @click="closeCreatePlanningMeetingModal"
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
    <!-- Create Sprint Planning Meeting -->

    <!-- Success Message Create Sprint Planning Meeting -->
    <div id="alert-success" v-if="isShowMsgCreatePlanningMeeting">
        <i class="fa fa-check"> </i>
        <p>
            Successfully <b> Created </b> Sprint Planning Meeting
        </p>
    </div>
    <!-- Success Message Create Sprint Planning Meeting -->
</template>
