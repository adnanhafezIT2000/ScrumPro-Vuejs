<script>
import useSkills from '@/composables/skills'
import useCategories from '@/composables/categories';
import { onMounted } from 'vue';
import '@/styles/edit-category-model.css'

export default {

    props:{
        skillID: {} ,
        modelID: {} ,
    } ,

    setup(props) {
        
        let skillID = props.skillID;
        let modelID = props.modelID;

        const {skill , errors , getSkill ,  updateSkill} = useSkills();
        const {categories , getAllCategories} = useCategories();

        onMounted( () => {

            getSkill(skillID);
            getAllCategories();
        });

        return{
            updateSkill ,
            skill ,
            errors ,
            modelID ,
            categories, 
        }
    },
}
</script>

<template>
    <!-- Edit Skill Modal -->
    <div class="modal fade editCategoryModal" :id="modelID" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Edit Skill</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="updateSkill(skillID)">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="category-name" class="col-form-label">
                                Skill Name
                            </label>
                            <span class="text-danger error" v-if="errors.name"> 
                                <i
                                    class="fa fa-exclamation-circle"
                                ></i>
                                {{errors.name[0]}}
                            </span>
                            <input 
                                type="text" 
                                placeholder="Enter category name" 
                                class="form-control" 
                                id="category-name"
                                v-model="skill.name"
                                required
                            >
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-success">
                            Edit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- Edit Skill Modal -->
</template>