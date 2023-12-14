<script>

import useTeams from '@/composables/teams'
import '@/styles/teams-management.css'
import { onMounted } from 'vue';

export default {
    setup() {
       
        const {allTeams , getAllTeams} = useTeams();

        onMounted(()=>{
            getAllTeams();
        });

        return{
            allTeams
        }
    },
}

</script>

<template>

    <!-- Teams Page -->
    <div id="teams-management">
        
        <!-- Header -->
        <header>
            <h4> teams management </h4>
            <div class="buttons">
                <router-link :to="{name: 'create-team'}">
                    <button type="button" class="btn btn-primary">
                        <i class="fa fa-plus"></i>
                        create new team
                    </button>
                </router-link>
            </div>
        </header>
        <!-- Header -->
        
        <div class="container-fluid" v-if="allTeams.length != 0">
            <div class="row">

                <div 
                    class="team-box col-sm-3 shadow-sm"
                    v-for="team in allTeams"
                    :key="team"
                >
                    <div class="avater-scrum-master shadow-sm">
                        <img
                            v-if="team.master[0].avatar == null && team.master[0].gender == 'male'" 
                            src="@/assets/man.png" 
                        > 
                        <img
                            v-else-if="team.master[0].avatar == null && team.master[0].gender == 'female' "
                            src="@/assets/woman.png" 
                        >                
                    </div>
                    <div class="dropdown">
                        <button class="btn" type="button" id="dropdownMenuTeam" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa fa-ellipsis-h"> </i>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuTeam">
                            <li><a class="dropdown-item" href="#">View</a></li>
                            <li><a class="dropdown-item" href="#">Edit</a></li>
                        </ul>
                    </div>
                    <h5 style="text-transform:capitalize;"> 
                            {{team.master[0].full_name}} 
                    </h5>
                    <i
                        v-if="team.working" 
                        class="team-status status-working"
                    > 
                        working 
                    </i>
                    <i
                        v-else
                        class="team-status status-not-working"
                    > 
                        not working 
                    </i>
                    <p>
                        {{team.description}}
                    </p>
                    <div class="rank">
                        <span>{{team.master[0].rank}}</span>
                        <div class="stars">
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
                        </div>
                    </div>
                    <div class="team-members-avater">
                        <div class="content-avaters">
                             <ul>
                                <li 
                                    v-for="developer in team.developers"
                                    :key="developer"
                                > 
                                    <img
                                        v-if="developer.avatar == null && developer.gender == 'male'" 
                                        src="@/assets/man.png" 
                                    > 
                                    <img
                                        v-else-if="developer.avatar == null && developer.gender == 'female' "
                                        src="@/assets/woman.png" 
                                    >       
                                </li>
                                <li> {{team.developers_count}} </li>
                            </ul>
                        </div>
                    </div>
                    <div class="velocity">
                        <p class="text-center"> 
                            Velocity scrum is 
                            <b v-if="team.velocity == null">0 point</b> 
                            <b v-else>{{team.velocity}} point</b> 
                            in sprint
                        </p>
                    </div>
                </div>

            </div>
        </div>

        <div class="container-fluid" v-if="allTeams.length == 0">
            <div class="row">
                <h1 id="no-teams">Not Found Teams Yet!</h1>
            </div>
        </div>

    </div>
    <!-- Teams Page -->

</template>

<style scoped>
#no-teams{
    margin-top: 40px;
    text-align: center;
    color: var(--gray-text);
    font-weight: 700;
    letter-spacing: 1.02px;
    font-style: italic;
}
</style>