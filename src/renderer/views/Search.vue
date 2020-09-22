<template>
   <div class="todo_search">
      <select name="search_choice" id="search_choice" v-model="search_choice" @change="search">
          <option value="all">全部</option>
          <option value="done">已完成</option>
          <option value="gotodo">未完成</option>
      </select>
      <input type="text" v-model="search_str" placeholder="search here..." @keyup.enter="search"></input>
       <div v-for="(todo,index) in todos" :key="todo.id">
          <Tododetail :todo="todo" :id="todo.id"/>
       </div>
   </div>
</template>

<script>
import Tododetail from '../components/Tododetail'
export default {
    name:'Search',
    components:{
        Tododetail
    },
    data() {
        return {
            search_choice:"all",
            search_str:'',
            todos:[]
        }
    },
    methods:{
        search(){
             const search_choice=this.search_choice;
             const search_str=this.search_str;
             let search_todo_list=[];
             switch (search_choice) {
               case 'all':
                  search_todo_list=this.$store.getters.getAll;
                  break;
               case 'done':
                  search_todo_list=this.$store.getters.getDone;
                  break;
               case 'gotodo':
                  search_todo_list=this.$store.getters.getToDo;
                  break;
                default:
                    console.log('识别不到search_choice')
                    break;
                };
                search_todo_list=search_todo_list.filter(todo => todo.description.indexOf(search_str) !== -1 || todo.title.indexOf(search_str) !== -1);
                this.todos=search_todo_list
                this.search_str=''
        }
    },
    created(){
        const des_from=this.$route.query.des;
        switch(des_from){
            case 'ToDo':
                this.search_choice='gotodo';
                break;
            case 'Done':
                this.search_choice='done';
                break;
            case 'All':
                this.search_choice='all';
                break;
            default:
                console.log('从header跳转来')
                break;
        }
        this.search();
    }
}
</script>

<style>
.todo_search{
    width: 100%;
    display: inline-block;
    text-align: center;
    margin-top: 15px;
}
</style>