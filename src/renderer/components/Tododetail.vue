<template>
  <div class="todo-detail">
    <div class="todo-detail-item" :class="{'is-complete':todo.completed}">
      <input type="checkbox" v-on:change="markComplete" :checked="todo.completed" />
      <router-link :to="`/todo_detail/${id}`">{{todo.title}}</router-link>
      <button @click="dele" class="del" type="button">x</button>
    </div>
    <p>添加时间： {{todo.created}}</p>
    <p>具体内容： {{todo.content}}</p>
  </div>
</template>

<script>
export default {
  name: "Tododetail",
  props: ["todo", "id"],
  methods: {
    markComplete() {
      this.$store.dispatch("todo_change_completed", this.todo.id);
    },
    dele() {
      this.$store.dispatch("delete_todo", this.todo.id);
      this.$destroy();
      //this.$router.go(-1);
    }
  }
};
</script>

<style>
.todo-detail {
  width: 50%;
  display: inline-block;
  margin-top: 40px;
  border: rgb(161, 83, 83) solid 1.5px;
}
.todo-detail-item {
  margin-bottom: 4px;
}
.is-complete {
  text-decoration: line-through;
}
.del {
  background: #7e7e7e;
  color: #fff;
  border: none;
  padding: 5px 9px;
  border-radius: 50%;
  float: right;
  cursor: pointer;
  transition: 0.3s;
}
.del :hover {
  background: red;
}
a {
  text-decoration: none;
  color: black;
}
</style>