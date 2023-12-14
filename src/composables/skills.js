import axios from "axios";
import { ref } from "vue";

export default function useSkills(){

    const URL = 'http://127.0.0.1:8000/api/ScrumPro/skills';

    const skills = ref([]);
    const skill = ref([]);
    const errors = ref({});

    const allSkillsToUser = ref([]);

    const getAllSkillsInCategory = async (id) =>{

        const response = await axios.get(`${URL}/${id}`);
        skills.value = response.data;
    }

    const getSkill = async (id) =>{

        const response = await axios.get(`${URL}/show-skill/${id}`);
        skill.value = response.data;
    }

    const updateSkill = async (id) =>{

        try {

            await axios.patch(`${URL}/${id}` , skill.value);
            location.reload();
        }
        catch (error) {

            if(error.response.status == 422){

                errors.value = error.response.data.errors;
            }
        }
    }

    const getAllSkillsToUser = async (userID) =>{

        const response = await axios.get(`http://127.0.0.1:8000/api/ScrumPro/get-all-skills-to-user/${userID}`);

        allSkillsToUser.value = response.data;
    }

    return{
        getAllSkillsInCategory ,
        getSkill ,
        updateSkill ,
        skills ,
        skill ,
        errors ,

        getAllSkillsToUser ,
        allSkillsToUser
    }
}