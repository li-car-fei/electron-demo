<template>
  <div>
    <div v-for="(todo,index) in todos" :key="index">
      <TodoItem :todo="todo" :id="todo.id" />
    </div>
  </div>
</template>

<script>
import TodoItem from "./TodoItem.vue";

export default {
  name: "Todos",
  components: {
    TodoItem
  },
  computed: {
    todos() {
      return this.$store.state.todo_list;
    }
  }
};
</script>

<style>
</style>

