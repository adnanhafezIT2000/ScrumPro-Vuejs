import axios from "axios";
import { ref } from "vue";

export default function useStories(){

    const URL = 'http://127.0.0.1:8000/api/ScrumPro';

    const allPointsBacklog = ref('');
    const ToDoPointsBacklog = ref('');
    const ProgressPointsBacklog = ref('');
    const DonePointsBacklog = ref('');
    const TotalStoriesInBacklog = ref('');
    const storyInfo = ref([]);

    const showStory = async (id)=>{
        
        const response = await axios.get(`${URL}/stories/${id}`);
        storyInfo.value = response.data;
    }

    const destroyStory = async (id)=>{

        await axios.delete(`${URL}/stories/${id}`);
        location.reload();
    }

    return{
        allPointsBacklog ,
        TotalStoriesInBacklog ,
        ToDoPointsBacklog ,
        ProgressPointsBacklog ,
        DonePointsBacklog ,
        showStory ,
        storyInfo ,
        destroyStory
    }
}