import axios from "axios";
import { ref } from "vue";

export default function usePermissions() {
    
    const permissions = ref([]);
    
    const getAllPermissions = async () => {

        const response = await axios.get(`http://127.0.0.1:8000/api/ScrumPro/permissions`);
        permissions.value = response.data;
    };

    return{
        permissions , 
        getAllPermissions ,
    }
}