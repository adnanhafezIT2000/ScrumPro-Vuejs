<script>
import useTeams from '@/composables/teams';
import useSkills from '@/composables/skills';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import '@/styles/create-team.css'

export default {
    setup() {
        
        const router = useRouter();

        const {mastersAndDevelopers , getMastersAndDevelopers} = useTeams();
        const {allSkillsToUser , getAllSkillsToUser} = useSkills();

        let isShowMsgTeamCreate = ref(false);

        let formData = reactive({
            "master_id": '' ,
            "developers_id": []
        });
        let errors = ref({});

        onMounted(()=>{
            getMastersAndDevelopers();
        });

        const storeTeam = async (data) =>{

            try{
                await axios.post('http://127.0.0.1:8000/api/ScrumPro/teams' , data);

                isShowMsgTeamCreate.value = true;

                setTimeout(() => {
                    isShowMsgTeamCreate.value = false;
                     router.go(-1);
                }, 3500);

            }
            catch(error){

                if(error.response.status === 422){

                    errors.value = error.response.data.errors;
                }
            }
        }

        return{
            mastersAndDevelopers ,
            formData ,
            allSkillsToUser ,
            getAllSkillsToUser ,
            storeTeam ,
            isShowMsgTeamCreate
        }
    },
}
</script>

<template>
    <form @submit.prevent="storeTeam(formData)">

        <div id="create-team">
        
            <header>
                <h4> create new team </h4>
                <div class="buttons">
                    <button type="submit" class="btn btn-success">
                        Create
                    </button>
                </div>
            </header>

            <div class="container main-container">
                <div class="row">
                    <section class="col-sm-4 section-master">
                        <div class="header text-center"> scrum master </div>
                        <div 
                            class="master-box shadow-sm col-sm-12"
                            v-for="master in mastersAndDevelopers.masters"
                            :key="master"
                        >   
                            <img
                                v-if="master.avatar == null && master.gender == 'male'" 
                                src="@/assets/man.png" 
                                class="shadow-sm"
                            > 
                            <img
                                v-else-if="master.avatar == null && master.gender == 'female' "
                                src="@/assets/woman.png" 
                                class="shadow-sm"
                            >
                            <p class="name"> {{master.full_name}} </p>
                            <div class="rank">
                                <ul>
                                    <li> {{master.rank}} </li>
                                </ul>
                                <div class="stars">
                                    <i 
                                        v-for="star in Math.round(Math.round(master.rank)/2)" 
                                        :key="star"
                                        class="fa fa-star"
                                        >
                                    </i>
                                    <i 
                                        v-for="star in 5 - Math.round(Math.round(master.rank)/2)" 
                                        :key="star"
                                        class="fa fa-star-o"
                                    >
                                    </i>
                                </div>
                            </div>
                            <div class="select-master">
                                <p> Her select scrum master </p>
                                <input 
                                    type="radio"
                                    :value="master.id"
                                    v-model="formData.master_id"
                                    name="master"
                                >
                            </div>
                        </div>
                    </section>

                    <section class="col-sm-8 section-member">
                        <div class="header text-center"> developers </div>
                        <div class="row">
                            <div 
                                class="member-box col-sm-6"
                                v-for="developer in mastersAndDevelopers.developers"
                                :key="developer"
                            >
                                <div class="container-fluid shadow-sm">
                                    <div class="info col-sm-12">
                                        <img
                                            v-if="developer.avatar == null && developer.gender == 'male'" 
                                            src="@/assets/man.png" 
                                            class="shadow-sm"
                                        > 
                                        <img
                                            v-else-if="developer.avatar == null && developer.gender == 'female' "
                                            src="@/assets/woman.png" 
                                            class="shadow-sm"
                                        >
                                        <p class="name"> {{developer.full_name}} </p>
                                        <div class="rank">
                                            <ul>
                                                <li> {{developer.rank}} </li>
                                            </ul>
                                             <div class="stars">
                                                <i 
                                                    v-for="star in Math.round(Math.round(developer.rank)/2)" 
                                                    :key="star"
                                                    class="fa fa-star"
                                                    >
                                                </i>
                                                <i 
                                                    v-for="star in 5 - Math.round(Math.round(developer.rank)/2)" 
                                                    :key="star"
                                                    class="fa fa-star-o"
                                                >
                                                </i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="category-skill">
                                        <ul>
                                            <li class="category"> {{developer.category_name}} </li>
                                            <li 
                                                v-for="skill in developer.skills"
                                                :key="skill"
                                            > 
                                                {{skill.name}} 
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="select-member">
                                        <p> Her select member </p>
                                        <input 
                                            type="checkbox"
                                            :value="developer.id"
                                            v-model="formData.developers_id"
                                            :name="'developer'+developer.id"
                                        >
                                    </div>
                                </div>
                            </div>
                        
                        </div>
                    </section>
                </div>
            </div>
        </div>

    </form>

    <!-- Success Message Create Team -->
    <div id="alert-success" v-if="isShowMsgTeamCreate">
        <i class="fa fa-check"> </i>
        <p>
            Successfully <b> Created </b> Team
        </p>
    </div>
    <!-- Success Message Create Team -->
</template>