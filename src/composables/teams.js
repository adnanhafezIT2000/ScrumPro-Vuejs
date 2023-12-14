import axios from "axios";
import { ref } from "vue";

export default function useTeams(){

    const mastersAndDevelopers = ref([]);
    const allTeams = ref([]);
    const teamsToCreateProject = ref([]);
    const countTeams = ref('')

    const getAllTeams = async () =>{

        const response = await axios.get('http://127.0.0.1:8000/api/ScrumPro/teams');
        allTeams.value = response.data;
    }

    const getMastersAndDevelopers = async () =>{

        const response = await axios.get('http://127.0.0.1:8000/api/ScrumPro/get-masters-and-developers');
        mastersAndDevelopers.value = response.data;
    }

    const getTeamsToCreateProject = async () =>{

        const response = await axios.get('http://127.0.0.1:8000/api/ScrumPro/get-teams-to-create-project');
        teamsToCreateProject.value = response.data.teams;
        countTeams.value = response.data.count_teams
    }

    return{
        getMastersAndDevelopers ,
        mastersAndDevelopers ,
        getAllTeams ,
        allTeams ,
        getTeamsToCreateProject ,
        teamsToCreateProject ,
        countTeams
    }
}