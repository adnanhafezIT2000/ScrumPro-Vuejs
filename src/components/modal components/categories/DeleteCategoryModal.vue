<script>
import useCategories from '@/composables/categories';

export default {
    props:{
        categoryID:{} ,
        categoryName:{} ,
        modelID:{}
    } ,
    setup(props) {

        let categoryID = props.categoryID;
        let categoryName = props.categoryName;
        let modelID = props.modelID;

        const {destroyCategory} = useCategories();

        return{categoryID , categoryName , modelID , destroyCategory};
    },
}
</script>

<template>
    <!-- Delete Category Modal  -->
    <div class="modal fade gooclose" :id="modelID" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title text danger" id="exampleModalLabel">
                        <i class="fa fa-exclamation-triangle text-danger"></i>
                        Delete Category
                    </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure to <b>delete {{categoryName}}</b> category ?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button 
                        type="button" 
                        class="btn btn-danger"
                        id="closeBtn"
                        @click.prevent="destroyCategory(categoryID)"
                    >
                        <i class="fa fa-trash text-white"></i>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- Delete Category Modal  -->
</template>
