import axios from "axios";
import { ref } from "vue";

export default function useCategories(){

    const categories = ref([]);
    const category = ref([]);
    const errors = ref({})

    const getAllCategories = async () => {

        const response = await axios.get(`http://127.0.0.1:8000/api/ScrumPro/categories`);
        categories.value = response.data;
    }
    
    const getCategory = async (id) => {

        const response = await axios.get(`http://127.0.0.1:8000/api/ScrumPro/categories/${id}`);
        category.value = response.data;
    }

    const updateCategory = async (id) => {

        try {

            await axios.patch(`http://127.0.0.1:8000/api/ScrumPro/categories/${id}` , category.value);
            location.reload();  
        }
        catch (error) {

            if(error.response.status == 422){

                errors.value = error.response.data.errors;
            }
        }
  
    }
    
    return{
        getAllCategories , 
        getCategory ,
        updateCategory ,
        categories ,
        category ,
        errors
    }
}