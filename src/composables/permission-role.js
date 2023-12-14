import axios from "axios";
import { ref } from "vue";

export default function usePermissionRole() {

    const permissionRoleData = ref([]);
    const errors = ref({});
    
    const getAllPermissionRole = async () => {

        const response = await axios.get(`http://127.0.0.1:8000/api/ScrumPro/permission-role`);
        permissionRoleData.value = response.data;
    };

    const manageAssignPermissionRole = async (data) => {

        try {
            await axios.post(`http://127.0.0.1:8000/api/ScrumPro/manage-assign-permission-to-role` , data);
            location.reload();

        } catch (error) {

            if(error.response.status === 422){

                errors.value = error.response.data.errors;
            }
        }
    }

    return{
        permissionRoleData , 
        getAllPermissionRole ,
        manageAssignPermissionRole ,
        errors ,
    }
}