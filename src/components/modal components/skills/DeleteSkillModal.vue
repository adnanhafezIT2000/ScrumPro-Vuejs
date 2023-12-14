<script>
import useSkills from '@/composables/skills';

export default {

    props:{
        skillID:{} ,
        skillName:{} ,
        modelID:{}
    } ,
    
    setup(props) {

        let skillID = props.skillID;
        let skillName = props.skillName;
        let modelID = props.modelID;

        const {destroySkill} = useSkills();

        return{skillID , skillName , modelID , destroySkill};
    },
}
</script>

<template>
    <!-- Delete Skill Modal  -->
    <div class="modal fade gooclose" :id="modelID" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title text danger" id="exampleModalLabel">
                        <i class="fa fa-exclamation-triangle text-danger"></i>
                        Delete Skill
                    </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure to <b>delete {{skillName}}</b> skill ?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button 
                        type="button" 
                        class="btn btn-danger"
                        id="closeBtn"
                        @click.prevent="destroySkill(skillID)"
                    >
                        <i class="fa fa-trash text-white"></i>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- Delete Skill Modal  -->
</template>
