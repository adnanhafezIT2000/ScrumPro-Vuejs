import axios from "axios";
import { ref } from "vue";

export default function useDefinition (){

    const allDefinitions = ref([]);
    const definition = ref([]);

    const getAllDefinitionForProject = async (id)=>{

        const response = axios.get(`http://127.0.0.1:8000/api/ScrumPro/get-definition-for-project/${id}`);
        allDefinitions.value = (await response).data;
    }

    const showDefinition = async (id)=>{

        const response = axios.get(`http://127.0.0.1:8000/api/ScrumPro/show-definition/${id}`)
        definition.value = (await response).data;
    }

    const updateDefinition = async (id)=>{

        await axios.put(`http://127.0.0.1:8000/api/ScrumPro/update-definition/${id}` , definition.value);
        location.reload();
    }

    const destroyDefinition = async (id)=>{

        await axios.delete(`http://127.0.0.1:8000/api/ScrumPro/destroy-definition/${id}`);
        location.reload();
    }

    return{
        allDefinitions,
        getAllDefinitionForProject ,
        definition ,
        showDefinition ,
        updateDefinition ,
        destroyDefinition
    }
}