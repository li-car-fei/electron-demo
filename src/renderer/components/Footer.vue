<template>
  <footer class="footer">
    <p @click="goto_search(1)">待完成：{{$store.getters.getToDo_length}}件</p>
    <p @click="goto_search(2)">已完成：{{$store.getters.getDone_length}}件</p>
    <p @click="goto_search(3)">共 计：{{$store.getters.getAll_length}}件</p>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  methods: {
    goto_search(to) {
      switch (to) {
        case 1:
          this.$router.push({
            path: "/search",
            query: {
              des: "ToDo"
            }
          });
          break;
        case 2:
          this.$router.push({
            path: "/search",
            query: {
              des: "Done"
            }
          });
          break;
        case 3:
          this.$router.push({
            path: "/search",
            query: {
              des: "All"
            }
          });
          break;
        default:
          console.log("错误跳转路由");
          break;
      }
    }
  }
};
</script>

<style>
.footer {
  position: flex;
  bottom: 0;
  width: 100%;
  line-height: 40px;
  background: #f8f8f8;
  text-align: center;
  font-size: 18px;
  color: #666;
  border-top: 1px solid #ddd;
  margin-top: 10px;
}
.footer :hover {
  color: rgb(26, 68, 145);
  cursor: pointer;
}
</style>