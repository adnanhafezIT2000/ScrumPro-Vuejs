import { createRouter, createWebHistory } from 'vue-router'

/* import from views */ 
import LandingView from '@/views/LandingView.vue';
import LoginView from '@/views/LoginView.vue';
import AdminLoginView from '@/views/AdminLoginView.vue';
import HomeView from '@/views/HomeView.vue';

/* import from components */
import DashboardComponent from '@/components/DashboardComponent.vue'
import ProfileComponent from '@/components/ProfileComponent.vue';
import UsersManagementComponent from '@/components/UsersManagementComponent.vue';
import CategoriesManagementComponent from '@/components/CategoriesManagementComponent.vue'
import RolesManagementComponent from '@/components/RolesManagementComponent.vue';
import TeamsManagementComponent from '@/components/TeamsManagementComponent.vue';
import CreateTeamComponent from '@/components/CreateTeamComponent.vue'
import DefinitionsManagementComponent from '@/components/DefinitionsManagementComponent.vue';
import AllProjectsComponent from '@/components/AllProjectsComponent.vue';
import BacklogComponent from '@/components/BacklogComponent.vue';
import BoardComponent from '@/components/BoardComponent.vue';
import SprintComponent from '@/components/SprintComponent.vue';
import SprintPlanningMeetingComponent from '@/components/SprintPlanningMeetingComponent.vue';
import StoryTasksComponent from '@/components/StoryTasksComponent.vue';
import TasksBoxComponent from '@/components/TasksBoxComponent.vue';

/* import from profile components*/
import UserAboutComponent from '@/components/profile components/UserAboutComponent.vue';
import ChangePasswordComponent from '@/components/profile components/ChangePasswordComponent.vue';

/* import from skill componnets */
import NoViewSkills from '@/components/skill components/NoViewSkills.vue'
import SkillsManagementComponent from '@/components/skill components/SkillsManagementComponent.vue'

const routes = [
    
    /* route landing page */
    {
        path: '/home' ,
        component: LandingView ,
        name: 'landing'
    } ,
    /* route login page */
    {
        path: '/login',
        component: LoginView ,
        name: 'login'
    },
    /* route admin login page */
    {
        path: '/admin/login',
        component: AdminLoginView ,
        name: 'admin-login'
    },
 

    {
        path: '/',
        component: HomeView , 
        name : 'home' ,
        children: [
            {   
                path: 'my-profile',
                component: ProfileComponent , 
                name: 'my-profile' ,
                children: [
                    {
                        path: '' ,
                        component: UserAboutComponent ,
                        name: 'my-profile-about'
                    } ,
                    {
                        path: 'change-password' ,
                        component: ChangePasswordComponent ,
                        name: 'my-profile-change-password'
                    }
                ]
            },
            {
                path: 'dashboard' ,
                component: DashboardComponent ,
                name: 'dashboard'
            } ,
            {
                path: 'users-management' ,
                component: UsersManagementComponent ,
                name: 'users' ,
            } ,
            {
                path: 'categories-management' ,
                component: CategoriesManagementComponent , 
                name: 'categories' ,
                children:[
                    {
                        path: '' ,
                        component: NoViewSkills , 
                        name: 'no-view-skills' ,
                        alias: 'categories-management' ,
                    } ,
                    {
                        path: ':id' ,
                        component: SkillsManagementComponent ,
                        name: 'view-skills' ,
                        props: true ,
                        alias: 'categories-management' ,
                    }
                ]
            } ,
            {
                path: 'roles-management' , 
                component: RolesManagementComponent ,
                name: 'roles'
            } ,
            {
                path: 'teams-management' ,
                component: TeamsManagementComponent ,
                name: 'teams'
            } ,
            {
                path: 'teams-management/create-team' ,
                component: CreateTeamComponent ,
                name: 'create-team'
            } ,
            {
                path: 'definition-of-done-management' ,
                component: DefinitionsManagementComponent ,
                name: 'definition-of-done-management', 
            } ,
            {
                path: 'all-projects' ,
                component: AllProjectsComponent ,
                name: 'all-projects'
            } ,
            {
                path: 'backlog' ,
                component: BacklogComponent , 
                name: 'backlog'
            } ,
            {
                path: 'board' ,
                component: BoardComponent , 
                name: 'board'
            } ,
            {
                path: 'sprints' ,
                component: SprintComponent , 
                name: 'sprint'
            } ,
            {
                path: 'sprint-planning-meeting' ,
                component: SprintPlanningMeetingComponent , 
                name: 'planning-meeting'
            } ,
            {
                path: 'story-tasks/:id' ,
                component: StoryTasksComponent , 
                name: 'story-tasks' ,
                props: true
            } ,
            {
                path: 'tasks-box' ,
                component: TasksBoxComponent , 
                name: 'tasks-box' ,
            }
        ],
    },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
