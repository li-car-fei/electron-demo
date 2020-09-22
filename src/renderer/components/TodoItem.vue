<template>
  <div
    class="todo-item"
    :class="{'is-complete':todo.completed}"
    :style="{background:bgcolor}"
    @mouseenter="handle(true)"
    @mouseleave="handle(false)"
  >
    <input type="checkbox" v-on:change="markComplete" :checked="todo.completed" />
    <router-link :to="`/todo_detail/${todo.id}`">{{todo.title}}</router-link>
    <span class="time">{{todo.created}}</span>
    <button @click="dele" class="del" v-show="isshow">x</button>
  </div>
</template>

<script>
export default {
  name: "TodoItem",
  props: ["todo", "id"],
  data() {
    return {
      bgcolor: "#f4f4f4",
      isshow: false
    };
  },
  methods: {
    markComplete() {
      this.$store.dispatch("todo_change_completed", this.todo.id);
    },
    dele() {
      this.$store.dispatch("delete_todo", this.todo.id);
    },
    handle(bool) {
      if (bool) {
        this.bgcolor = "#665a5a";
        this.isshow = true;
      } else {
        this.bgcolor = "#f4f4f4";
        this.isshow = false;
      }
    }
  }
};
</script>

<style>
.todo-item {
  padding: 10px;
  border-bottom: 1px #ccc dotted;
  cursor: pointer;
}
.todo-item input {
  margin-right: 5%;
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
  cursor: pointer;
  float: right;
}
a {
  text-decoration: none;
  color: inherit;
}
.time {
  padding-left: 30%;
}
</style>

