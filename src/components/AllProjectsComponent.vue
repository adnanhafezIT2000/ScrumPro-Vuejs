<script>

import ViewProjectModal from '@/components/modal components/projects/ViewProjectModal.vue';
import CloseProjectModal from '@/components/modal components/projects/CloseProjectModal.vue';
import { onMounted, reactive, ref } from 'vue';
import useTeams from '@/composables/teams';
import axios from 'axios';
import { useRouter } from 'vue-router';
import '@/styles/all-project.css';
import '@/styles/create-project-modal.css'

export default {
   components:{
        ViewProjectModal ,
        CloseProjectModal
   } ,

   setup(){

        const router = useRouter();

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd ;

        const permissions = JSON.parse(localStorage.getItem('permissions'));
        const userInfo = JSON.parse(localStorage.getItem('user-info'));

        const {teamsToCreateProject , countTeams , getTeamsToCreateProject} = useTeams();

        let formData = reactive({
            "owner_id": userInfo[0].id ,
            "team_id": '7' ,
            "name": '' ,
            "description": '' ,
            "budget": '' ,
            "planned_termination_date": '' ,
            "client_name": '' ,
            "client_email": ''
        })

        let isShowCreateProjectModal = ref(false);
        let isShowMsgProjectCreate = ref(false);

        /******************************
         * Show Create Project Modal 
        ******************************/
        const showCreateProjectModal = () =>{
            isShowCreateProjectModal.value = true;
            getTeamsToCreateProject();
        }

        /********************************
         * Close Create Project Mdoal 
        ********************************/
        const closeCreateProjectModal = () =>{
            isShowCreateProjectModal.value = false;
            formData.team_id = '';
            formData.name = '';
            formData.description = '';
            formData.budget = '';
            formData.planned_termination_date = '';
        }
        
        var formDataSearch;
        if(permissions.includes('show only projects he has worked on')){
            formDataSearch = reactive({
                status: '' ,
                ownerID: userInfo[0].id ,
                search: ''
            });

        } 
        else {
            formDataSearch = reactive({
                status: '' ,
                ownerID: '',
                search: ''
            });
        }

        const allProjects = ref({});
        let getAllProjectLength = ref('');
        let getAllProjectsToOwnerLength = ref('');

        /*********************
         * Get All projects
        *********************/
        const getAllProjects = async (URL = 'http://127.0.0.1:8000/api/ScrumPro/projects?page=1')=>{
            await axios.get(`${URL}
                             &status=${formDataSearch.status}
                             &ownerID=${formDataSearch.ownerID}
                             &search=${formDataSearch.search}
                            `)
            .then(response =>{

                allProjects.value = response.data;
            });
            getAllProjectLength.value = allProjects.value.links.length;
        }
        
        /*************************************
         * Get All Projects To Product Owner
        *************************************/
        const getAllProjectsToOwner = async (id , URL = `http://127.0.0.1:8000/api/ScrumPro/get-all-projects-owner/${id}?page=1`)=>{
            await axios.get(`${URL}
                             &status=${formDataSearch.status}
                             &ownerID=${formDataSearch.ownerID}
                             &search=${formDataSearch.search}
                            `)
            .then(response =>{

                allProjects.value = response.data;
            });
            getAllProjectsToOwnerLength.value = allProjects.value.links.length;
        }

        /************************************
         * Get All Projects To Scrum Master
        ************************************/
        const getAllProjectsToMaster = async (id , URL = `http://127.0.0.1:8000/api/ScrumPro/get-all-projects-master/${id}?page=1`)=>{
            await axios.get(`${URL}
                             &status=${formDataSearch.status}
                             &ownerID=${formDataSearch.ownerID}
                             &search=${formDataSearch.search}
                            `)
            .then(response =>{

                allProjects.value = response.data;
            });
            getAllProjectsToOwnerLength.value = allProjects.value.links.length;
        }

        /**********************************
         * Get All Projects To Developer
        **********************************/
        const getAllProjectsToDeveloper = async (id , URL = `http://127.0.0.1:8000/api/ScrumPro/get-all-projects-developer/${id}?page=1`)=>{
            await axios.get(`${URL}
                             &status=${formDataSearch.status}
                             &ownerID=${formDataSearch.ownerID}
                             &search=${formDataSearch.search}
                            `)
            .then(response =>{

                allProjects.value = response.data;
            });
            getAllProjectsToOwnerLength.value = allProjects.value.links.length;
        }

        /**********************************
         * Get All Projects To Client
        **********************************/
        const getAllProjectsToClient = async (id , URL = `http://127.0.0.1:8000/api/ScrumPro/get-all-projects-client/${id}?page=1`)=>{
            await axios.get(`${URL}
                             &status=${formDataSearch.status}
                             &ownerID=${formDataSearch.ownerID}
                             &search=${formDataSearch.search}
                            `)
            .then(response =>{

                allProjects.value = response.data;
            });
            getAllProjectsToOwnerLength.value = allProjects.value.links.length;
        }

        /***************************
         * Get All Product Owner
        ***************************/
        let allOwners = ref([]);
        const getAllOwners = async ()=>{
            
            const response = await axios.get('http://127.0.0.1:8000/api/ScrumPro/get-owners');
            allOwners.value = response.data;
        }

        /*******************
         * Store Project
        *******************/
        const storeProject = async (data) =>{

            await axios.post('http://127.0.0.1:8000/api/ScrumPro/projects' , data);
            closeCreateProjectModal();
            getAllProjectsToOwner(userInfo[0].id);
            isShowMsgProjectCreate.value = true;

            setTimeout(() => {
                isShowMsgProjectCreate.value = false;
            }, 3000);

        };  

        /***************
         * On Mounted 
        ***************/
        onMounted(()=>{
            
            if( permissions.includes('show all projects (open,close)') ){

                        getAllProjects();
                        getAllOwners();

            } 
            else if( permissions.includes('show only projects he has worked on') && 
                       userInfo[0].role_name == 'product owner'
                    ){

                        getAllProjectsToOwner(userInfo[0].id);

            } 
            else if( permissions.includes('show only projects he has worked on') &&
                       userInfo[0].role_name == 'scrum master'
                    ){

                        getAllProjectsToMaster(userInfo[0].id)

            } 
            else if( permissions.includes('show only projects he has worked on') &&
                        userInfo[0].role_name == 'developer' 
                    ){
                        getAllProjectsToDeveloper(userInfo[0].id)
            } 
            else if(permissions.includes('show only projects he has worked on') &&
                        userInfo[0].role_name == 'client'
                    ){
                        getAllProjectsToClient(userInfo[0].id)
            }
        });

        const filterProjects = () =>{

            if( permissions.includes('show all projects (open,close)') ){

                getAllProjects();

            } else if( permissions.includes('show only projects he has worked on') ){

                getAllProjectsToOwner(userInfo[0].id);
            }
        }

        /****************************
         * Router To Manage Project 
        ****************************/
        const goToManageProject = (id , name , status)=>{

            localStorage.removeItem('project');

            let project = { id: id , name: name , status: status }
            localStorage.setItem('project' , JSON.stringify(project));

            router.push("/dashboard");
        }

        /***********
         * return
        ***********/
        return{
            permissions ,
            userInfo ,
            showCreateProjectModal ,
            closeCreateProjectModal ,
            isShowCreateProjectModal ,
            today ,
            formData ,
            teamsToCreateProject ,
            storeProject ,
            isShowMsgProjectCreate ,
            allProjects ,
            getAllProjectLength ,
            getAllProjectsToOwnerLength ,
            getAllProjects ,
            getAllProjectsToOwner ,
            filterProjects ,
            formDataSearch ,
            allOwners ,
            goToManageProject ,
            countTeams
        }
   }
}

</script>

<template>

    <!-- All Projects -->
    <div id="all-project">
        <!-- Header Projects Page -->
        <header>
            <h4> projects </h4>
            <div class="buttons">
                <button 
                    type="button" 
                    class="btn btn-primary" 
                    @click="showCreateProjectModal"
                    v-if="permissions.includes('create new project')"
                >
                    <i class="fa fa-plus"></i>
                    create project
                </button>
            </div>
        </header>
        <!-- Header Projects Page -->

        <!-- Filter Projects -->
        <form @submit.prevent="filterProjects()">
            <section class="filter">
                <div class="filter-icon">
                    <i class="fa fa-filter"></i>
                </div>
                <div class="select-status">
                    <select v-model="formDataSearch.status" class="form-select form-control" aria-label="Default select example">
                        <option value=""> All Status </option>
                        <option value="open">open</option>
                        <option value="close">close</option>
                    </select>
                </div>
                <div 
                    class="select-owner"
                    v-if="permissions.includes('show all projects (open,close)')"
                >
                    <select v-model="formDataSearch.ownerID" class="form-select form-control" aria-label="Default select example">
                        <option value=""> All Owner </option>
                        <option
                            v-for="owner in allOwners"
                            :key="owner"
                            :value="owner.id"
                        >
                            {{owner.full_name}}
                        </option>
                    </select>
                </div>
                <div 
                    class="select-owner"
                    v-if="permissions.includes('show only projects he has worked on')"
                >
                    <select v-model="formDataSearch.ownerID" class="form-select form-control" aria-label="Default select example">
                        <option :value="userInfo[0].id" selected> {{userInfo[0].full_name}} </option>
                    </select>
                </div>
                <div class="search-date">
                    <span> from </span>
                    <input 
                        type="date" 
                        class="form-control"
                    >
                    <span> to </span>
                    <input 
                        type="date" 
                        class="form-control"
                    >
                </div>
                <div class="input-search">
                    <i class="fa fa-search"></i>
                    <input 
                        type="text" 
                        class="form-control" 
                        placeholder="Project Name Serach ..."
                        v-model="formDataSearch.search"
                    >
                </div>
                <button type="submit" class="btn">
                    <i class="fa fa-search"></i>
                </button>
            </section>
        </form>
        <!-- Filter Projects -->

        <!-- Table Projects -->
        <table class="table table-striped shadow-sm">
            <thead>
                <tr>
                    <th class="th-sm">Project Name</th>
                    <th 
                        class="th-sm"
                        v-if="permissions.includes('show all projects (open,close)') ||
                        userInfo[0].role_name == 'scrum master' ||
                        userInfo[0].role_name == 'developer' ||
                        userInfo[0].role_name == 'client'"
                    >
                        Product Owner
                    </th>
                    <th 
                        class="th-sm"
                        v-if="permissions.includes('show all projects (open,close)') ||
                        userInfo[0].role_name == 'product owner'"
                    >
                        Scrum Master
                    </th>
                    <th class="th-sm">Status</th>
                    <th class="th-sm">Target_at</th>
                    <th class="th-sm">Close_at</th>
                    <th class="th-sm">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr 
                    v-for="project in allProjects.data"
                    :key="project"
                >
                    <td
                        v-if="permissions.includes('show only projects he has worked on')"
                        @click="goToManageProject(project.id , project.name , project.status)"
                        :style="permissions.includes('show only projects he has worked on') ? 'cursor:pointer' : ''"
                        > 
                        {{project.name}} 
                    </td>
                    <td v-else> {{project.name}} </td>

                    <td
                        v-if="userInfo[0].role_name == 'super admin' || userInfo[0].role_name == 'scrum master' || userInfo[0].role_name == 'developer' || userInfo[0].role_name == 'client'"
                    >
                        <img
                            v-if="userInfo[0].avatar == null && userInfo[0].gender == 'male'" 
                            src="@/assets/man.png" 
                            width="55" 
                            height="55"
                            class="img-user"
                        > 
                        <img
                            v-else-if="userInfo[0].avatar == null && userInfo[0].gender == 'female' "
                            src="@/assets/woman.png" 
                            width="55" 
                            height="55"
                            class="img-user"
                        > 
                        {{project.owner_name}}
                    </td>

                    <td
                        v-if="userInfo[0].role_name == 'super admin' || userInfo[0].role_name == 'product owner'"
                    >
                        <img
                            v-if="userInfo[0].avatar == null && userInfo[0].gender == 'male'" 
                            src="@/assets/man.png" 
                            width="55" 
                            height="55"
                            class="img-user"
                        > 
                        <img
                            v-else-if="userInfo[0].avatar == null && userInfo[0].gender == 'female' "
                            src="@/assets/woman.png" 
                            width="55" 
                            height="55"
                            class="img-user"
                        >  
                        {{project.master_name}}
                    </td>


                    <td> 
                        <div 
                            :class="userInfo[0].role_name != 'product owner' && userInfo[0].role_name != 'scrum master' && userInfo[0].role_name != 'developer' && userInfo[0].role_name != 'client' ? 'status': 'product-owner-status status' "
                            v-if="userInfo[0].role_name != 'product owner'"
                        >
                            <span 
                                :class="project.status == 'open' ? 'bg-success' : 'bg-danger'"
                            ></span>
                            <p> {{project.status}} </p> 
                        </div>

                        <div 
                            :class="userInfo[0].role_name != 'product owner' && userInfo[0].role_name != 'scrum master' && userInfo[0].role_name != 'developer' && userInfo[0].role_name != 'client' ? 'status': 'product-owner-status status' "
                            v-else
                            @click="console.log('adnan')"
                            data-bs-toggle="modal" 
                            :data-bs-target="'#closeProjectModal' + project.id"
                        >
                            <span 
                                :class="project.status == 'open' ? 'bg-success' : 'bg-danger'"
                            ></span>
                            <p> {{project.status}} </p> 
                        </div>
                    </td>


                    <td>  {{project.planned_termination_date}} </td>
                    <td v-if="project.status == 'close'">  
                        {{project.actual_termination_date}} 
                    </td>
                    <td v-else> None </td>
                    <td>
                        <i 
                            class="fa fa-gear text-secondary"
                            title="View"
                            data-bs-toggle="modal" 
                            :data-bs-target="'#viewProjectModal'+project.id"
                            :style="permissions.includes('show only projects he has worked on') ? 'cursor:pointer;font-size: 20px;margin-left:20px' : '' "
                        ></i>
                    </td>

                    <ViewProjectModal 
                        :modalID="'viewProjectModal'+project.id"
                        :projectID="project.id"
                    />

                    <CloseProjectModal
                        :modelID="'closeProjectModal' + project.id"
                        :projectID="project.id"
                    />
                </tr>
            </tbody>
        </table>
        <!-- Table Projects -->
    </div>
    <!-- All Projects -->

    <!-- Create Project Model -->
    <div class="modal-main" id="createProjectModal" v-if="isShowCreateProjectModal">
        <div class="modal-box">
            <div class="box-header">
                <h5> Create New Project </h5>
                <button class="btn-close" @click="closeCreateProjectModal"></button>
            </div>
            <form @submit.prevent="storeProject(formData)">
                <div class="box-body">
                    <div class="container">
                        <div class="row">
                            <div class="col-sm-4">
                                <div class="form-outline mb-4">
                                    <label class="form-label" for="projectName">Project Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter project name" 
                                        id="projectName" 
                                        class="form-control"
                                        v-model="formData.name" 
                                        required
                                    />
                                </div>
                                <div class="form-outline mb-4">
                                    <label class="form-label" for="projectDescription">Project Description</label>
                                    <textarea 
                                        placeholder="Enter project description" 
                                        id="projectDescription" 
                                        class="form-control"
                                        v-model="formData.description"
                                        required 
                                    ></textarea>
                                </div>
                                <div class="form-outline mb-4">
                                    <label class="form-label" for="projectBudget">Project Budget</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter project budget" 
                                        id="projectBudget" 
                                        class="form-control"
                                        v-model="formData.budget"  
                                        required
                                    />
                                </div>
                                <div class="form-outline mb-4">
                                    <label class="form-label" for="projectTargetDate">Start Date</label>
                                    <input type="date" id="projectTargetDate" :value="today" readonly class="form-control" />
                                </div>
                                <div class="form-outline mb-4">
                                    <label class="form-label" for="projectTargetDate">Target Date</label>
                                    <input 
                                        type="date" 
                                        id="projectTargetDate" 
                                        class="form-control"
                                        v-model="formData.planned_termination_date" 
                                        required 
                                    />
                                </div>
                                <!-- Client -->
                                <div class="form-outline mb-4">
                                    <label class="form-label" for="clientName">Client Name</label>
                                    <input 
                                        type="text" 
                                        id="clientName" 
                                        class="form-control"
                                        placeholder="Enter client name"
                                        v-model="formData.client_name"
                                        required 
                                    />
                                </div>
                                <div class="form-outline mb-4">
                                    <label class="form-label" for="clientEmail">Client Email</label>
                                    <input 
                                        type="email" 
                                        id="clientEmail" 
                                        class="form-control"
                                        placeholder="Enter client email"
                                        v-model="formData.client_email"
                                        required 
                                    />
                                </div>
                                <!-- Client -->
                            </div>
                            <section class="col-sm-8 team-select-section">
                                <p> Select Team </p>
                                <div class="row" v-if="countTeams != 0">
                                    <div 
                                        class="col-sm-5 team-box shadow-sm"
                                        v-for="team in teamsToCreateProject"
                                        :key="team"
                                    >
                                        <div class="container-fluid">
                                            <img
                                                v-if="team.master[0].avater == null && team.master[0].gender == 'male'" 
                                                src="@/assets/man.png" 
                                                width="55" 
                                                height="55"
                                                class="img-user"
                                            > 
                                            <img
                                                v-else-if="team.master[0].avater == null && team.master[0].gender == 'female' "
                                                src="@/assets/woman.png" 
                                                width="55" 
                                                height="55"
                                                class="img-user"
                                            >
                                            <h6> {{team.master[0].full_name}} </h6>
                                            <p>
                                                {{team.description}}
                                            </p>
                                            <div class="rank">
                                                <i> 8,6 </i>
                                                <i 
                                                    v-for="star in Math.round(Math.round(team.master[0].rank)/2)" 
                                                    :key="star"
                                                    class="fa fa-star"
                                                    >
                                                </i>
                                                <i 
                                                    v-for="star in 5 - Math.round(Math.round(team.master[0].rank)/2)" 
                                                    :key="star"
                                                    class="fa fa-star-o"
                                                >
                                                </i>
                                                <span>{{team.members_count}} members</span>
                                            </div>
                                            <div class="velocity">
                                                velocity scrum is 
                                                <b v-if="team.velocity == null">0 points</b>
                                                <b v-else>{{team.velocity}} points</b> 
                                                in sprint
                                            </div>
                                            <div class="select">
                                                from here choose the team
                                                <input 
                                                    type="radio"
                                                    name="teamID"
                                                    :value="team.id"
                                                    v-model="formData.team_id"
                                                    required
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row" v-else>
                                    <h3 class="no-teams-create-project">
                                        <i class="fa fa-ban"></i>
                                        no found teams yet!
                                    </h3>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
                <div class="box-footer">
                    <button 
                        type="button" 
                        class="btn btn-secondary" 
                        @click="closeCreateProjectModal"
                    >
                        close
                    </button>
                    <button 
                        type="submit" 
                        class="btn btn-success"
                        v-if="countTeams != 0"
                    >
                        create
                    </button>
                </div>
            </form>
        </div>
    </div>
    <!-- Create Project Model-->

    <!-- Success Message Create Project -->
    <div id="alert-success" v-if="isShowMsgProjectCreate">
        <i class="fa fa-check"> </i>
        <p>
            Successfully <b> Created </b> Project
        </p>
    </div>
    <!-- Success Message Create Project -->

     <!-- Paginition -->
    <nav aria-label="Page navigation example" style="margin-top: 40px; margin-left:-8px;" id="paginition-nav">
        <ul class="pagination">

            <li :class="[{disabled: !allProjects.prev_page_url}]">
                <a 
                    class="page-link" 
                    aria-label="Previous"
                    v-if="permissions.includes('show all projects (open,close)') && userInfo[0].role_name != 'product owner'"
                    @click="getAllProjects(allProjects.prev_page_url)"
                >
                    <span aria-hidden="true">&laquo;</span>
                </a>

                 <a 
                    class="page-link" 
                    aria-label="Previous"
                    v-else-if="permissions.includes('show only projects he has worked on') && userInfo[0].role_name == 'product owner'"
                    @click="getAllProjectsToOwner(userInfo[0].id , allProjects.prev_page_url)"
                >
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>

            <li class="page-item" v-for="(link , index) in allProjects.links" :key="index">
                <a 
                    :class="link.active ? 'page-link active' : 'page-link' " 
                    v-if="permissions.includes('show all projects (open,close)') && userInfo[0].role_name != 'product owner' && index != 0 && index != getAllProjectLength - 1"
                    @click="getAllProjects(link.url)"
                >
                    {{link.label}}
                </a>       

                <a 
                    :class="link.active ? 'page-link active' : 'page-link' " 
                    v-else-if="permissions.includes('show only projects he has worked on') && userInfo[0].role_name == 'product owner' && index != 0 && index != getAllProjectsToOwnerLength - 1"
                    @click="getAllProjectsToOwner(userInfo[0].id , link.url)"
                >
                    {{link.label}}
                </a>  
            </li>
           
            <li :class="[{disabled: !allProjects.next_page_url}]">
                <a 
                    class="page-link" 
                    aria-label="Next"
                    v-if="permissions.includes('show all projects (open,close)') && userInfo[0].role_name != 'product owner'"
                    @click="getAllProjects(allProjects.prev_page_url)"
                >
                    <span aria-hidden="true">&raquo;</span>
                </a>

                 <a 
                    class="page-link" 
                    aria-label="Next"
                    v-else-if="permissions.includes('show only projects he has worked on') && userInfo[0].role_name == 'product owner'"
                    @click="getAllProjectsToOwner(userInfo[0].id , allProjects.prev_page_url)"
                >
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>

        </ul>
    </nav>
    <!-- Paginition -->

</template>