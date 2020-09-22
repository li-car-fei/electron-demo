<template>
  <header class="header">
    <h1>TodoList</h1>
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/details">Details</router-link>|
      <router-link to="/search">Search</router-link>|
      <router-link to="/ocr">OCR</router-link>|
      <router-link to="/translate">Translate</router-link>
      <span @click="$store.dispatch('delete_completed')">Delete_completed</span>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style>
.header {
  background: rgb(82, 72, 72);
  color: #fff;
  text-align: center;
  padding: 10px;
}

.header a {
  color: #fff;
  padding-right: 5px;
  text-decoration: none;
}

.header span {
  cursor: pointer;
  padding-left: 7%;
}
</style>


