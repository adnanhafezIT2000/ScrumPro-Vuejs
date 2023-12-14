<script>

import useStories from '@/composables/stories'
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';

export default {
    props:{
        modalID: {} ,
        storyID: {}
    } ,

    setup(props) {

        const URL = 'http://127.0.0.1:8000/api/ScrumPro';

        const userInfo = JSON.parse(localStorage.getItem('user-info'));

        const permissions = JSON.parse(localStorage.getItem('permissions'));

        const {showStory , storyInfo , getBacklog} = useStories();
        
        const modalID = props.modalID;
        const storyID = props.storyID;

        let isShowMsgUpdateSuccess = ref(false);
        let msgUpdated = ref('');

        /* Variable To Show Forms Updated Story Info */
        let isShowFormTitle = ref(false);
        let isShowFormDescription = ref(false);
        let isShowFormPoints = ref(false);
        let isShowFormPriority = ref(false);

        /* Story Title */
        const showFormTitle = () =>{
            isShowFormTitle.value = true;
            isShowFormDescription.value = false;
            isShowFormPoints.value = false;
            isShowFormPriority.value = false;
        }
        const closeFormTitle = () =>{
            showStory(storyID);
            isShowFormTitle.value = false;
        }
        const updateStoryTitle = async (data) =>{
            await axios.put(`${URL}/update-story-title/${storyID}` , data);
            closeFormTitle();
            showStory(storyID);
            isShowMsgUpdateSuccess.value = true;
            msgUpdated.value = 'Successfully Updated Story Title';
            setTimeout(() => {
                isShowMsgUpdateSuccess.value = false;
            }, 2500);
        }

        /* Story Description */
        const showFormDescription = () =>{
            isShowFormDescription.value = true;
            isShowFormTitle.value = false;
            isShowFormPoints.value = false;
            isShowFormPriority.value = false;
        }
        const closeFormDescription = () =>{
            showStory(storyID);
            isShowFormDescription.value = false;
        }
        const updateStoryDescription = async (data) =>{
            await axios.put(`${URL}/update-story-description/${storyID}` , data);
            closeFormDescription();
            showStory(storyID);
            isShowMsgUpdateSuccess.value = true;
            msgUpdated.value = 'Successfully Updated Story Description';
            setTimeout(() => {
                isShowMsgUpdateSuccess.value = false;
            }, 2500);
        }

        /* Story Points */
        const showFormPoints = () =>{
            isShowFormPoints.value = true;
            isShowFormTitle.value = false;
            isShowFormDescription.value = false;
            isShowFormPriority.value = false;
        }
        const closeFormPoints = () =>{
            showStory(storyID);
            isShowFormPoints.value = false;
        }
        const updateStoryPoints = async (data) =>{
            await axios.put(`${URL}/update-story-point/${storyID}` , data);
            closeFormPoints();
            showStory(storyID);
            isShowMsgUpdateSuccess.value = true;
            msgUpdated.value = 'Successfully Updated Story Points';
            setTimeout(() => {
                isShowMsgUpdateSuccess.value = false;
            }, 2500);
        }

        /* Story Proiority */
        const showFormPriority = () =>{
            isShowFormPriority.value = true;
            isShowFormTitle.value = false;
            isShowFormDescription.value = false;
            isShowFormPoints.value = false;
        }
        const closeFormPriority = () =>{
            showStory(storyID);
            isShowFormPriority.value = false;
        }
        const updateStoryPriority = async (data) =>{
            await axios.put(`${URL}/update-story-priority/${storyID}` , data);
            closeFormPriority();
            showStory(storyID);
            isShowMsgUpdateSuccess.value = true;
            msgUpdated.value = 'Successfully Updated Story Priority';
            setTimeout(() => {
                isShowMsgUpdateSuccess.value = false;
            }, 2500);
        }

        /* Acceptance Critiria */
        const acceptances = ref([]);
        const formData = reactive({
            story_id: storyID ,
            description: ''
        });
        const getAcceptanceCritiria = async ()=>{
            const response = await axios.get(`${URL}/get-acceptance-critiria-for-story/${storyID}`);
            acceptances.value = response.data;
        }
        const storeAcceptanceCritiria = async (data)=>{
            await axios.post(`${URL}/acceptance-critiria` , data);
            getAcceptanceCritiria();
            isShowMsgUpdateSuccess.value = true;
            msgUpdated.value = 'Successfully Created New Acceptance Critiria';
            setTimeout(() => {
                isShowMsgUpdateSuccess.value = false;
            }, 2500);
            formData.description = '';

        }
        const destroyAcceptance = async (id) =>{
            if( confirm('Are you sure deleted this acceptance critiria ?') ){
                await axios.delete(`${URL}/acceptance-critiria/${id}`);
                getAcceptanceCritiria();
                isShowMsgUpdateSuccess.value = true;
                msgUpdated.value = 'Successfully Deleted Acceptance Critiria';
                setTimeout(() => {
                    isShowMsgUpdateSuccess.value = false;
                }, 2500);
            }
        }

        /* Comments */
        const comments = ref([]);
        const formCommentData = reactive({
            user_id: userInfo[0].id ,
            story_id: storyID ,
            content: '' ,
        });
        const getCommentsForStory = async ()=>{
            const response = await axios.get(`${URL}/get-comments-for-story/${storyID}`);
            comments.value = response.data;
        }
        const addComment = async (data) =>{
            await axios.post(`${URL}/comments` , data);
            getCommentsForStory();
            formCommentData.content = '';
        }

        onMounted(()=>{
            showStory(storyID);
            getAcceptanceCritiria();
            getCommentsForStory();
        });

        return{
            userInfo ,
            getBacklog ,
            storyInfo ,
            modalID ,
            storyID ,
            isShowFormTitle ,
            showFormTitle ,
            closeFormTitle ,
            updateStoryTitle ,
            isShowFormDescription ,
            showFormDescription ,
            closeFormDescription ,
            updateStoryDescription ,
            isShowFormPoints ,
            showFormPoints ,
            closeFormPoints ,
            updateStoryPoints ,
            isShowFormPriority ,
            showFormPriority ,
            closeFormPriority ,
            updateStoryPriority ,
            isShowMsgUpdateSuccess ,
            msgUpdated ,
            acceptances ,
            formData ,
            storeAcceptanceCritiria ,
            destroyAcceptance ,
            formCommentData ,
            addComment , 
            comments ,
            permissions
        }
    },
}

</script>

<template>
    <div class="modal fade" :id="modalID" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title" id="exampleModalLabel">View Story Info</h3>
                    <button 
                        type="button" 
                        class="btn-close" 
                        data-bs-dismiss="modal" 
                        aria-label="Close"
                        @click="getBacklog"
                    ></button>
                </div>
                <div class="modal-body" id="modal-body-story-view">
                    <div class="container-fluid">
                        <div class="row">

                            <section class="col-sm-6 story-left-section">
                                <!-- Story Title -->
                                <div v-if="permissions.includes('edit story')"
                                    class="story-title col-sm-12"
                                    @dblclick="showFormTitle"
                                >   
                                    <label for="storyTitle" class="form-label">
                                        Title
                                    </label>
                                    <h5 v-if="!isShowFormTitle">{{storyInfo.title}}</h5>
                                    <form 
                                        v-else
                                        @submit.prevent="updateStoryTitle({title: storyInfo.title})"
                                    >
                                       <textarea 
                                            class="form-control" 
                                            placeholder="Enter story..." 
                                            id="storyTitle"
                                            rows="3"
                                            v-model="storyInfo.title"
                                            required
                                        ></textarea>
                                        <div class="buttons">
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
                                    <h5>{{storyInfo.title}}</h5>
                                </div>
                                <!-- Story Title -->

                                <!-- Story Description -->
                                <div v-if="permissions.includes('edit story')"
                                    class="story-description col-sm-12"
                                    @dblclick="showFormDescription"
                                >
                                    <div class="mb-3">
                                        <label for="storyDescription" class="form-label">
                                            description
                                        </label>
                                        <div v-if="!isShowFormDescription">
                                            <p v-if="storyInfo.description == null">
                                                <i class="fa fa-ban"></i>
                                                No description found !
                                            </p>
                                            <p v-else>{{storyInfo.description}}</p>
                                        </div>
                                        <form v-else  @submit.prevent="updateStoryDescription({description: storyInfo.description})">
                                            <textarea 
                                                class="form-control" 
                                                placeholder="Enter story description..." 
                                                id="storyDescription"
                                                rows="3"
                                                v-model="storyInfo.description"
                                                required
                                            ></textarea>
                                            <div class="buttons">
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
                                    <div class="mb-3">
                                        <label for="storyDescription" class="form-label">
                                            description
                                        </label>
                                        <div>
                                            <p v-if="storyInfo.description == null">
                                                <i class="fa fa-ban"></i>
                                                No description found !
                                            </p>
                                            <p v-else>{{storyInfo.description}}</p>
                                        </div>
                                    </div>
                                </div>
                                <!-- Story Description -->

                                <!-- Story Acceptance Critiria -->
                                <div class="story-acceptance-critiria col-sm-12">
                                    <label for="storyAcceptance" class="form-label">
                                        acceptance critiria
                                    </label>

                                    <form 
                                        v-if="permissions.includes('edit story')"
                                        @submit.prevent="storeAcceptanceCritiria(formData)"
                                    >
                                        <input 
                                            type="text"
                                            class="form-control" 
                                            id="storyAcceptance" 
                                            placeholder="Add acceptance critiria ..."
                                            v-model="formData.description"
                                            required
                                        >
                                        <button 
                                            type="submit" 
                                            class="btn btn-success"
                                            style="margin-top:6px;"
                                        > Create </button>
                                    </form>

                                    <ol v-if="acceptances.length > 0">
                                        <li 
                                            v-for="row in acceptances"
                                            :key="row"
                                        >
                                            <div class="acceptance-critiria-box col-sm-12">
                                                <span>{{row.description}}</span>
                                                <i 
                                                    v-if="permissions.includes('edit story')"
                                                    class="fa fa-trash text-danger"
                                                    @click="destroyAcceptance(row.id)"
                                                ></i>
                                            </div>
                                        </li>
                                    </ol>

                                    <p v-else>
                                        <i class="fa fa-ban"></i>
                                        No acceptance critiria found ! 
                                    </p>
                                </div>
                                <!-- Story Acceptance Critiria -->
                            </section>

                            <section class="col-sm-5 story-right-section">

                                <div class="accordion" id="accordionExample">
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="headingOne">
                                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                            Details
                                        </button>
                                        </h2>
                                        <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                            <div class="accordion-body">
                                                <ul>
                                                    <li> status </li>
                                                    <li> sprint </li>
                                                    <li> points </li>
                                                </ul>
                                                <ul>
                                                    <li> {{storyInfo.status}}  </li>
                                                    <li> 
                                                        {{storyInfo.sprint}} 
                                                    </li>
                                                    <li 
                                                        v-if="permissions.includes('edit story')"
                                                        class="details-points"
                                                        @dblclick="showFormPoints"
                                                    > 
                                                        <span v-if="!isShowFormPoints"> 
                                                            {{storyInfo.points}}
                                                            <i style="margin-left: 10px; color:var(--main-color)">
                                                                (1 point = 8.3 hours = 1 day)   
                                                            </i> 
                                                        </span>
                                                        <form v-else @submit.prevent="updateStoryPoints({points: storyInfo.points})">
                                                            <input type="number" v-model="storyInfo.points">
                                                            <div class="buttons">
                                                                <button 
                                                                    class="btn-secondary"
                                                                    @click="closeFormPoints"
                                                                >
                                                                    <i class="fa fa-close"></i>
                                                                </button>
                                                                <button type="submit" class="btn-secondary">
                                                                    <i class="fa fa-check"></i>
                                                                </button>
                                                            </div>
                                                        </form>
    
                                                    </li>
                                                    <li v-else class="details-points"> {{storyInfo.points}} </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="comments">
                                    <section 
                                        v-if="permissions.includes('add comment to story')"  
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
                                        v-if="comments.length > 0"
                                    >

                                        <div 
                                            class="comment-info"
                                            v-for="comment in comments"
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
                            </section>
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
