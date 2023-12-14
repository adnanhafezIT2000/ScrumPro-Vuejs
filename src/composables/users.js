import axios from "axios";
import { ref } from "vue";

export default function useUsers(){

    const paginitionUsers = ref({});
    const rowUser = ref({});

    const getPaginitionUsers = async () =>{

        const response = await axios.get('http://127.0.0.1:8000/api/ScrumPro/users');

        paginitionUsers.value = response.data;
    }

    const getUser = async (id) =>{

        const response = await axios.get(`http://127.0.0.1:8000/api/ScrumPro/users/${id}`);

        rowUser.value = response.data;
    }

    const destroyUser = async (id) => {

        await axios.delete(`http://127.0.0.1:8000/api/ScrumPro/users/${id}`);
        location.reload();
    }

    const changeStatusUser = async (data) => {

        await axios.post(`http://127.0.0.1:8000/api/ScrumPro/change-user-status` , data);
        location.reload();
    }

    
    return{
        paginitionUsers ,
        getPaginitionUsers ,
        destroyUser ,
        changeStatusUser ,
        getUser ,
        rowUser
    }
}