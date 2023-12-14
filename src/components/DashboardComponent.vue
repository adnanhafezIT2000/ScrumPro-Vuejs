<script>

import '@/styles/dashboard.css';
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';

export default {
    setup() {

        const userInfo = JSON.parse(localStorage.getItem('user-info'));
        const project  = JSON.parse(localStorage.getItem('project'));

        const users              = ref([]);
        const projects           = ref([]);
        const categoriesSkills   = ref([]);
        const topThreeMasters    = ref([]);
        const topThreeDevelopers = ref([]);

        const getAdminDashboard = async() =>{
            await axios.get(`http://127.0.0.1:8000/api/ScrumPro/get-admin-dashboard`)
            .then((response)=>{
                users.value = response.data.users;
                projects.value = response.data.all_projects;
                categoriesSkills.value = response.data.categories_skills;
                topThreeMasters.value = response.data.top_three_ranked.masters;
                topThreeDevelopers.value = response.data.top_three_ranked.developers;
            });
        }   

        const allStories         = ref([]);
        const todoStories        = ref([]);
        const doneStories        = ref([]);
        const allTasks           = ref([]);
        const todoTasks          = ref([]);
        const doneTasks          = ref([]);
        const countSprints       = ref('');
        const countDefinitions   = ref('');
        const projectDate        = ref([]);
        const projectTeamInfo    = ref([]);
        const storyInProgress    = ref([]);
        const developerTasks     = ref([]);
        const teamVelocity       = ref([]);
        const foundStoryProgress = ref([]);
        const foundMyTasks       = ref('');
        let foundMyTasksDeveloper = '';

        const getDashboard = async () =>{

            if(userInfo[0].role_name == 'product owner'){

                await axios.get(`http://127.0.0.1:8000/api/ScrumPro/get-dashboard/${userInfo[0].role_name}/${project.id}/0`)
                .then((response) =>{
                    allStories.value       = response.data.stories.all;
                    todoStories.value      = response.data.stories.todo;
                    doneStories.value      = response.data.stories.done;
                    countSprints.value     = response.data.sprints;
                    countDefinitions.value = response.data.definitions;
                    projectDate.value      = response.data.project_date;
                    projectTeamInfo.value  = response.data.team;
                    storyInProgress.value  = response.data.story_progress[0];
                    teamVelocity.value     = response.data.team_velocity;
                    foundStoryProgress.value = response.data.found_story_progress;
                });

            } 
            else if(userInfo[0].role_name == 'scrum master'){  

                await axios.get(`http://127.0.0.1:8000/api/ScrumPro/get-dashboard/${userInfo[0].role_name}/${project.id}/0`)
                .then((response) =>{
                    allTasks.value           = response.data.tasks.total;
                    todoTasks.value          = response.data.tasks.todo;
                    doneTasks.value          = response.data.tasks.done;
                    countSprints.value       = response.data.sprints;
                    projectTeamInfo.value    = response.data.team;
                    storyInProgress.value    = response.data.story_progress[0];
                    teamVelocity.value       = response.data.team_velocity;
                    foundStoryProgress.value = response.data.found_story_progress;
                });

            }  
            else if(userInfo[0].role_name == 'developer'){

                await axios.get(`http://127.0.0.1:8000/api/ScrumPro/get-dashboard/${userInfo[0].role_name}/${project.id}/${userInfo[0].id}`)
                .then((response) =>{
                    projectTeamInfo.value  = response.data.team;
                    developerTasks.value   = response.data.my_tasks;
                    teamVelocity.value     = response.data.team_velocity;
                    foundMyTasksDeveloper  = response.data.found_my_tasks;
                });
            }
            else if(userInfo[0].role_name == 'client'){

                await axios.get(`http://127.0.0.1:8000/api/ScrumPro/get-dashboard/${userInfo[0].role_name}/${project.id}/0`)
                .then((response) =>{
                    allStories.value       = response.data.stories.all;
                    todoStories.value      = response.data.stories.todo;
                    doneStories.value      = response.data.stories.done;
                    countSprints.value     = response.data.sprints;
                    countDefinitions.value = response.data.definitions;
                    projectDate.value      = response.data.project_date;
                    projectTeamInfo.value  = response.data.team;
                    storyInProgress.value  = response.data.story_progress[0];
                    teamVelocity.value     = response.data.team_velocity;
                    foundStoryProgress.value = response.data.found_story_progress;
                });
            }
            
        }

        onMounted(()=>{
            if(userInfo[0].role_name == 'super admin' || userInfo[0].role_name == 'admin'){
                getAdminDashboard();
            }
            else if(userInfo[0].role_name == 'product owner'){
                getDashboard();
            }
            else if(userInfo[0].role_name == 'scrum master'){
                getDashboard();
            }
            else if(userInfo[0].role_name == 'developer'){
                getDashboard();
            }
            else if(userInfo[0].role_name == 'client'){
                getDashboard();
            }
        });

        return{
            userInfo ,
            users ,
            projects ,
            categoriesSkills ,
            topThreeDevelopers ,
            topThreeMasters ,
            allStories ,
            todoStories ,
            doneStories ,
            countSprints ,
            countDefinitions ,
            foundMyTasksDeveloper ,
            projectDate ,
            projectTeamInfo ,
            storyInProgress ,
            allTasks ,
            todoTasks ,
            doneTasks ,
            developerTasks ,
            teamVelocity ,
            foundStoryProgress
        }
    },
}

</script>

<template>

    <!-- Dahsboard -->
    <div id="dashboard">

        <!-- Header -->
        <header>
            <h4> Dashboard </h4>
        </header>
        <!-- Header -->

        <!-- Super Admin -->
        <div class="container" v-if="userInfo[0].role_name == 'super admin' || userInfo[0].role_name == 'admin'">
            <div class="row">
                <div class="col-sm-3 box product-owner">
                    <div class="box-content">
                        <h6>product owner</h6>
                        <span>{{users.count_owners}}</span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div> 
                <div class="col-sm-3 box scrum master">
                    <div class="box-content">
                        <h6>scrum master</h6>
                        <span>{{users.count_masters}}</span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div>
                <div class="col-sm-3 box developers">
                    <div class="box-content">
                        <h6>developers</h6>
                        <span>{{users.count_developers}}</span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div>
                <div class="col-sm-3 box clients">
                    <div class="box-content">
                        <h6>clients</h6>
                        <span>{{users.count_clients}}</span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div>
                <div class="col-sm-3 box open-projects">
                    <div class="box-content">
                        <h6>open projects</h6>
                        <span>{{projects.open_projects}}</span>
                        <router-link to="all-projects">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div>
                <div class="col-sm-3 box close-projects">
                    <div class="box-content">
                        <h6>close projects</h6>
                        <span>{{projects.close_projects}}</span>
                        <router-link to="all-projects">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div>
                <div class="col-sm-3 box categories">
                    <div class="box-content">
                        <h6>categories</h6>
                        <span>{{categoriesSkills.count_categories}}</span>
                        <router-link to="categories-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div>
                <div class="col-sm-3 box skills">
                    <div class="box-content">
                        <h6>skills</h6>
                        <span>{{categoriesSkills.count_skills}}</span>
                        <router-link to="categories-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div>

                <div class="col-sm-6 top-three">
                    <div class="top-three-content">
                        <h6>top three scrum master</h6>
                        <div class="user-info"
                            v-for="row in topThreeMasters"
                            :key="row"
                        >
                            <i class="fa fa-trophy" :id="row.rank_color"></i>
                            <img
                                v-if="row.avatar == null && row.gender == 'male'" 
                                src="@/assets/man.png" 
                                width="60" 
                                height="60"
                                class="img-user"
                            > 
                            <img
                                v-else-if="row.avatar == null && row.gender == 'female' "
                                src="@/assets/woman.png" 
                                width="60" 
                                height="60"
                                class="img-user"
                            >
                            <p> {{row.full_name}} </p>
                            <div class="rank">
                                <div>
                                    <span>{{row.rank}}</span>
                                    <i 
                                        v-for="star in Math.round(Math.round(row.rank)/2)" 
                                        :key="star"
                                        class="fa fa-star"
                                    >
                                    </i>
                                    <i 
                                        v-for="star in 5 - Math.round(Math.round(row.rank)/2)" 
                                        :key="star"
                                        class="fa fa-star-o"
                                    >
                                    </i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 top-three">
                    <div class="top-three-content">
                        <h6>top three developers</h6>
                        <div class="user-info"
                            v-for="row in topThreeDevelopers"
                            :key="row"
                        >
                            <i class="fa fa-trophy" :id="row.rank_color"></i>
                            <img
                                v-if="row.avatar == null && row.gender == 'male'" 
                                src="@/assets/man.png" 
                                width="60" 
                                height="60"
                                class="img-user"
                            > 
                            <img
                                v-else-if="row.avatar == null && row.gender == 'female' "
                                src="@/assets/woman.png" 
                                width="60" 
                                height="60"
                                class="img-user"
                            >
                            <p> {{row.full_name}} </p>
                            <div class="rank">
                                <div>
                                    <span>{{row.rank}}</span>
                                    <i 
                                        v-for="star in Math.round(Math.round(row.rank)/2)" 
                                        :key="star"
                                        class="fa fa-star"
                                    >
                                    </i>
                                    <i 
                                        v-for="star in 5 - Math.round(Math.round(row.rank)/2)" 
                                        :key="star"
                                        class="fa fa-star-o"
                                    >
                                    </i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Super Admin -->

        <!-- Product Owner -->
        <div class="container" v-if="userInfo[0].role_name == 'product owner'">
            <div class="row">
                <div class="col-sm-3 box all-stories">
                    <div class="box-content">
                        <h6>All Stories ({{allStories.total}})</h6>
                        <span> {{allStories.points}} <b>points</b> </span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div> 
                <div class="col-sm-3 box todo-stories">
                    <div class="box-content">
                        <h6>to do Stories ({{todoStories.total}})</h6>
                        <span> {{todoStories.points}} <b>points</b> </span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div> 
                <div class="col-sm-3 box done-stories">
                    <div class="box-content">
                        <h6>done Stories ({{doneStories.total}})</h6>
                        <span> {{doneStories.points}} <b>points</b> </span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div> 
                <div class="col-sm-3 box sprints">
                    <div class="box-content">
                        <h6>sprints</h6>
                        <span> {{countSprints}} </span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div> 
                <div class="col-sm-3 box definitions">
                    <div class="box-content">
                        <h6>definitions of done</h6>
                        <span> {{countDefinitions}} </span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div> 
                <div class="col-sm-3 box project-created">
                    <div class="box-content">
                        <h6>project created</h6>
                        <span id="date"> {{projectDate.created_date}} </span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div> 
                <div class="col-sm-3 box project-created">
                    <div class="box-content">
                        <h6>planned terminate</h6>
                        <span id="date"> {{projectDate.planned_terminate_date}} </span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div> 
                <div class="col-sm-3 box project-created">
                    <div class="box-content">
                        <h6>actual terminate</h6>
                        <span id="date" v-if="projectDate.actual_terminate_date == null"> 
                            None
                        </span>
                        <span id="date" v-else>
                            {{projectDate.actual_terminate_date}}
                        </span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div> 

                <div class="col-sm-6 team-info">
                    <div class="team-info-content">
                        <h6>Project Team Info</h6>
                        <div class="user-info"
                            v-for="row in projectTeamInfo"
                            :key="row"
                        >
                            <img
                                v-if="row.avatar == null && row.gender == 'male'" 
                                src="@/assets/man.png" 
                                width="70" 
                                height="70"
                            > 
                            <img
                                v-else-if="row.avatar == null && row.gender == 'female' "
                                src="@/assets/woman.png" 
                                width="60" 
                                height="60"
                                class="img-user"
                            >
                            <ul class="ul-name-rank">
                                <li><p>{{row.full_name}}</p></li>
                                <li>
                                    <div class="rank">
                                        <div>
                                            <span>{{row.rank}}</span>
                                            <i 
                                                v-for="star in Math.round(Math.round(row.rank)/2)" 
                                                :key="star"
                                                class="fa fa-star"
                                            >
                                            </i>
                                            <i 
                                                v-for="star in 5 - Math.round(Math.round(row.rank)/2)" 
                                                :key="star"
                                                class="fa fa-star-o"
                                            >
                                            </i>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div class="category" v-if="row.category_name == null">
                                scrum master
                            </div>
                            <div class="category" v-else>
                                {{row.category_name}}
                            </div>
                            <div class="user-skills">
                                <ul v-for="skill in row.skills" :key="skill">
                                    <li>{{skill.skill_name}}</li>
                                </ul>
                            </div>
                        </div>
                        <div class="velocity">
                            team velocity is <b>{{teamVelocity}} points</b> in sprint
                        </div>
                    </div>
                </div>

                <div class="col-sm-6 story-progress-info">
                    <div class="story-progress-info-content" v-if="foundStoryProgress > 0">
                        <h6>
                            story in progress
                            (<span>{{storyInProgress.points}} <i>points</i></span>)
                        </h6>
                        <div class="story-info-list">
                            <ul>
                                <li>{{storyInProgress.title}}</li>
                                <li>{{storyInProgress.sprint_name}}</li>
                            </ul>
                        </div>
                        <div class="task-box"
                            v-for="task in storyInProgress.tasks"
                            :key="task"
                        >
                            <p><i>#{{task.id}}</i>{{task.title}}</p>
                            <ul>
                                <li>
                                    <div class="rank">
                                        <div>
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
                                    </div>
                                </li>
                                <li><div class="category">{{task.category_name}}</div></li>
                                <li><div class="skill">{{task.skill_name}}</div></li>
                            </ul>
                        </div>
                    </div>
                    <div class="story-progress-info-content" v-else>
                        <h6>story progress</h6>
                        <div class="no-story-progress">
                            <i class="fa fa-ban"></i>
                            No story progress yet!<br />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Product Owner -->

        <!-- Scrum Master -->
        <div class="container" v-if="userInfo[0].role_name == 'scrum master'">
            <div class="row">
                <div class="col-sm-3 box sprints">
                    <div class="box-content">
                        <h6>Sprints</h6>
                        <span>{{countSprints}}</span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div> 
                <div class="col-sm-3 box all-tasks">
                    <div class="box-content">
                        <h6>All Tasks</h6>
                        <span> {{allTasks}} </span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div> 
                <div class="col-sm-3 box todo-tasks">
                    <div class="box-content">
                        <h6>to do tasks</h6>
                        <span> {{todoTasks}} </span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div> 
                <div class="col-sm-3 box done-tasks">
                    <div class="box-content">
                        <h6>done tasks</h6>
                        <span> {{doneTasks}} </span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div> 

                <div class="col-sm-6 team-info">
                    <div class="team-info-content">
                        <h6>Project Team Info</h6>
                        <div class="user-info"
                            v-for="row in projectTeamInfo"
                            :key="row"
                        >
                            <img
                                v-if="row.avatar == null && row.gender == 'male'" 
                                src="@/assets/man.png" 
                                width="70" 
                                height="70"
                            > 
                            <img
                                v-else-if="row.avatar == null && row.gender == 'female' "
                                src="@/assets/woman.png" 
                                width="60" 
                                height="60"
                                class="img-user"
                            >
                            <ul class="ul-name-rank">
                                <li><p>{{row.full_name}}</p></li>
                                <li>
                                    <div class="rank">
                                        <div>
                                            <span>{{row.rank}}</span>
                                            <i 
                                                v-for="star in Math.round(Math.round(row.rank)/2)" 
                                                :key="star"
                                                class="fa fa-star"
                                            >
                                            </i>
                                            <i 
                                                v-for="star in 5 - Math.round(Math.round(row.rank)/2)" 
                                                :key="star"
                                                class="fa fa-star-o"
                                            >
                                            </i>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div class="category" v-if="row.category_name == null">
                                scrum master
                            </div>
                            <div class="category" v-else>
                                {{row.category_name}}
                            </div>
                            <div class="user-skills">
                                <ul v-for="skill in row.skills" :key="skill">
                                    <li>{{skill.skill_name}}</li>
                                </ul>
                            </div>
                        </div>
                        <div class="velocity">
                            team velocity is <b>{{teamVelocity}} points</b> in sprint
                        </div>
                    </div>
                </div>

                <div class="col-sm-6 story-progress-info">
                    <div class="story-progress-info-content" v-if="foundStoryProgress > 0">
                        <h6>
                            story in progress
                            (<span>{{storyInProgress.points}} <i>points</i></span>)
                        </h6>
                        <div class="story-info-list">
                            <ul>
                                <li>{{storyInProgress.title}}</li>
                                <li>{{storyInProgress.sprint_name}}</li>
                            </ul>
                        </div>
                        <div class="task-box"
                            v-for="task in storyInProgress.tasks"
                            :key="task"
                        >
                            <p><i>#{{task.id}}</i>{{task.title}}</p>
                            <ul>
                                <li>
                                    <div class="rank">
                                        <div>
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
                                    </div>
                                </li>
                                <li><div class="category">{{task.category_name}}</div></li>
                                <li><div class="skill">{{task.skill_name}}</div></li>
                            </ul>
                        </div>
                    </div>
                    <div class="story-progress-info-content" v-else>
                        <h6>story progress</h6>
                        <div class="no-story-progress">
                            <i class="fa fa-ban"></i>
                            No story progress yet!<br />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Scrum Master -->

        <!-- Developer -->
        <div class="container" v-if="userInfo[0].role_name == 'developer'">
            <div class="row">
                <div class="col-sm-6 team-info">
                    <div class="team-info-content">
                        <h6>Project Team Info</h6>
                        <div class="user-info"
                            v-for="row in projectTeamInfo"
                            :key="row"
                        >
                            <img
                                v-if="row.avatar == null && row.gender == 'male'" 
                                src="@/assets/man.png" 
                                width="70" 
                                height="70"
                            > 
                            <img
                                v-else-if="row.avatar == null && row.gender == 'female' "
                                src="@/assets/woman.png" 
                                width="60" 
                                height="60"
                                class="img-user"
                            >
                            <ul class="ul-name-rank">
                                <li><p>{{row.full_name}}</p></li>
                                <li>
                                    <div class="rank">
                                        <div>
                                            <span>{{row.rank}}</span>
                                            <i 
                                                v-for="star in Math.round(Math.round(row.rank)/2)" 
                                                :key="star"
                                                class="fa fa-star"
                                            >
                                            </i>
                                            <i 
                                                v-for="star in 5 - Math.round(Math.round(row.rank)/2)" 
                                                :key="star"
                                                class="fa fa-star-o"
                                            >
                                            </i>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div class="category" v-if="row.category_name == null">
                                scrum master
                            </div>
                            <div class="category" v-else>
                                {{row.category_name}}
                            </div>
                            <div class="user-skills">
                                <ul v-for="skill in row.skills" :key="skill">
                                    <li>{{skill.skill_name}}</li>
                                </ul>
                            </div>
                        </div>
                        <div class="velocity">
                            team velocity is <b>{{teamVelocity}} points</b> in sprint
                        </div>
                    </div>
                </div>
                
                <div class="col-sm-6 story-progress-info">
                    <div class="story-progress-info-content">
                        <h6>My Tasks</h6>
                        <div class="task-box"
                            v-for="task in developerTasks"
                            :key="task"
                        >
                            <p><i>#{{task.id}}</i>{{task.title}}</p>
                            <ul>
                                <li>
                                    <div class="rank">
                                        <div>
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
                                    </div>
                                </li>
                                <li><div class="category">{{task.category_name}}</div></li>
                                <li><div class="skill">{{task.skill_name}}</div></li>
                            </ul>
                            <ul class="manage-task-developer">
                                <li>
                                    <div class="task-status">
                                        <p class="status-progress" v-if="task.status == 'in progress'">
                                            {{task.status}}
                                        </p>
                                        <p class="status-done" v-if="task.status == 'done'">
                                            {{task.status}}
                                        </p>
                                    </div>
                                </li>
                                <li>
                                    <button
                                        class="btn btn-primary"
                                        v-if="task.status == 'in progress'"
                                    >
                                        finish task
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!--
                    <div class="story-progress-info-content">
                        <h6>my tasks</h6>
                        <div class="no-story-progress">
                            <i class="fa fa-ban"></i>
                            No tasks yet!<br />
                        </div>
                    </div>
                    -->
                </div>
            </div>
        </div>
        <!-- Developer -->

        <!-- Client -->
        <div class="container" v-if="userInfo[0].role_name == 'client'">
            <div class="row">
                <div class="col-sm-3 box all-stories">
                    <div class="box-content">
                        <h6>All Stories ({{allStories.total}})</h6>
                        <span> {{allStories.points}} <b>points</b> </span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div> 
                <div class="col-sm-3 box todo-stories">
                    <div class="box-content">
                        <h6>to do Stories ({{todoStories.total}})</h6>
                        <span> {{todoStories.points}} <b>points</b> </span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div> 
                <div class="col-sm-3 box done-stories">
                    <div class="box-content">
                        <h6>done Stories ({{doneStories.total}})</h6>
                        <span> {{doneStories.points}} <b>points</b> </span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div> 
                <div class="col-sm-3 box sprints">
                    <div class="box-content">
                        <h6>sprints</h6>
                        <span> {{countSprints}} </span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div> 
                <div class="col-sm-3 box definitions">
                    <div class="box-content">
                        <h6>definitions of done</h6>
                        <span> {{countDefinitions}} </span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div> 
                <div class="col-sm-3 box project-created">
                    <div class="box-content">
                        <h6>project created</h6>
                        <span id="date"> {{projectDate.created_date}} </span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div> 
                <div class="col-sm-3 box project-created">
                    <div class="box-content">
                        <h6>planned terminate</h6>
                        <span id="date"> {{projectDate.planned_terminate_date}} </span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div> 
                <div class="col-sm-3 box project-created">
                    <div class="box-content">
                        <h6>actual terminate</h6>
                        <span id="date" v-if="projectDate.actual_terminate_date == null"> 
                            None
                        </span>
                        <span id="date" v-else>
                            {{projectDate.actual_terminate_date}}
                        </span>
                        <router-link to="users-management">
                            <i class="fa fa-external-link"></i>
                            view more
                        </router-link>
                    </div>
                </div> 

                <div class="col-sm-6 team-info">
                    <div class="team-info-content">
                        <h6>Project Team Info</h6>
                        <div class="user-info"
                            v-for="row in projectTeamInfo"
                            :key="row"
                        >
                            <img
                                v-if="row.avatar == null && row.gender == 'male'" 
                                src="@/assets/man.png" 
                                width="70" 
                                height="70"
                            > 
                            <img
                                v-else-if="row.avatar == null && row.gender == 'female' "
                                src="@/assets/woman.png" 
                                width="60" 
                                height="60"
                                class="img-user"
                            >
                            <ul class="ul-name-rank">
                                <li><p>{{row.full_name}}</p></li>
                                <li>
                                    <div class="rank">
                                        <div>
                                            <span>{{row.rank}}</span>
                                            <i 
                                                v-for="star in Math.round(Math.round(row.rank)/2)" 
                                                :key="star"
                                                class="fa fa-star"
                                            >
                                            </i>
                                            <i 
                                                v-for="star in 5 - Math.round(Math.round(row.rank)/2)" 
                                                :key="star"
                                                class="fa fa-star-o"
                                            >
                                            </i>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div class="category" v-if="row.category_name == null">
                                scrum master
                            </div>
                            <div class="category" v-else>
                                {{row.category_name}}
                            </div>
                            <div class="user-skills">
                                <ul v-for="skill in row.skills" :key="skill">
                                    <li>{{skill.skill_name}}</li>
                                </ul>
                            </div>
                        </div>
                        <div class="velocity">
                            team velocity is <b>{{teamVelocity}} points</b> in sprint
                        </div>
                    </div>
                </div>

                <div class="col-sm-6 story-progress-info">
                    <div class="story-progress-info-content" v-if="foundStoryProgress > 0">
                        <h6>
                            story in progress
                            (<span>{{storyInProgress.points}} <i>points</i></span>)
                        </h6>
                        <div class="story-info-list">
                            <ul>
                                <li>{{storyInProgress.title}}</li>
                                <li>{{storyInProgress.sprint_name}}</li>
                            </ul>
                        </div>
                        <div class="task-box"
                            v-for="task in storyInProgress.tasks"
                            :key="task"
                        >
                            <p><i>#{{task.id}}</i>{{task.title}}</p>
                            <ul>
                                <li>
                                    <div class="rank">
                                        <div>
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
                                    </div>
                                </li>
                                <li><div class="category">{{task.category_name}}</div></li>
                                <li><div class="skill">{{task.skill_name}}</div></li>
                            </ul>
                        </div>
                    </div>
                    <div class="story-progress-info-content" v-else>
                        <h6>story progress</h6>
                        <div class="no-story-progress">
                            <i class="fa fa-ban"></i>
                            No story progress yet!<br />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Client -->

    </div>
    <!-- Dahsboard -->

</template>
