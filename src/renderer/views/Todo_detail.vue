<template>
  <div class="todo_detail">
    <div>标题：{{todo.title}}</div>
    <div>
      <span v-if="todo.completed">已完成</span>
      <span v-else>未完成</span>
      <p>添加时间： {{todo.created}}</p>
    </div>
    <textarea type="text" v-model="todo.description" class="content" cols="20" rows="3"></textarea>
    <br />
    <button type="button" @click="change">修改</button>
    <button type="button" @click="dele">删除</button>
  </div>
</template>

<script>
export default {
  name: "Todo_detail",
  data() {
    return {
      //content: this.$store.state.todo_list[this.$route.params.id].,
      todo: {}
    };
  },
  methods: {
    dele() {
      this.$store.dispatch("delete_todo", this.todo.id);
      this.$router.go(-1);
    },
    change() {
      // const params = {
      //   content: this.content,
      //   title: this.todo.title
      // };
      this.$store.dispatch("change_todo_content", this.todo);
    }
  },
  created() {
    console.log(this.$route.params.id);
    this.todo = this.$store.state.todo_list.find(
      todo => todo.id == this.$route.params.id
    );
    console.log(this.todo);
  }
};
</script>

<style>
.todo_detail {
  display: inline-blockS;
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
}
.todo_detail div {
  margin-bottom: 10px;
}
.todo_detail textarea {
  font-size: 16px;
}
.content {
  width: 400px;
  height: 200px;
  border: 1px solid brown;
}
.todo_detail button {
  width: 60px;
  height: 22px;
  line-height: 22px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 10px;
  background: rgb(51, 79, 102);
}
.todo_detail button:hover {
  opacity: 0.8;
}
</style>