import axios from "axios";
import { ref } from "vue";

export default function useRoles() {
    
    const roles = ref([]);
    const role  = ref([]);

    const getAllRoles = async () => {

        const response = await axios.get(`http://127.0.0.1:8000/api/ScrumPro/roles`);
        roles.value = response.data;
    };

    const getRole = async (id) => {

        const response = await axios.get(`http://127.0.0.1:8000/api/ScrumPro/roles/${id}`);
        role.value = response.data;
    }

    return{
        roles , 
        getAllRoles ,
        role , 
        getRole
    }
}