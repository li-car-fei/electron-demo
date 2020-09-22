<template>
  <div class="details">
    <h1>TodoList详细信息</h1>
    <div v-for="(todo,index) in todos" :key="todo.id">
      <Tododetail :todo="todo" :id="todo.id" />
    </div>
  </div>
</template>

<script>
import Tododetail from "../components/Tododetail";

export default {
  name: "Details",
  components: {
    Tododetail
  },
  data() {
    return {
      todos: this.$store.state.todo_list
    };
  }
};
</script>

<style>
.details {
  text-align: center;
  padding: 20px;
}
</style>
