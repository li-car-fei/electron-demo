import Vue from 'vue'
import Vuex from 'vuex'
import { local, getDate } from '../util/local_data'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        todo_list: [],
    },
    getters: {
        getToDo_length: state => state.todo_list.filter(todo => !todo.completed).length,
        getToDo: state => state.todo_list.filter(todo => !todo.completed),
        getDone_length: state => state.todo_list.filter(todo => todo.completed).length,
        getDone: state => state.todo_list.filter(todo => todo.completed),
        getAll_length: state => state.todo_list.length,
        getAll: state => state.todo_list,
    },
    mutations: {
        delete_completed(state) {
            state.todo_list = state.todo_list.filter(todo => !todo.completed);
            local.set(state.todo_list);
        },
        addTodo(state, newTodo) {
            // const add_time = getDate();
            // newTodo.add_time = add_time;
            state.todo_list.push(newTodo);
            local.set(state.todo_list)
        },
        delete_todo(state, id) {
            const index = state.todo_list.findIndex(todo => todo.id == id);
            state.todo_list.splice(index, 1);
            local.set(state.todo_list)
        },
        todo_change_completed(state, id) {
            const todo = state.todo_list.find(todo => todo.id == id);
            todo.completed = !todo.completed;
            local.set(state.todo_list)
        },
        change_todo_content(state, change_todo) {
            const todo = state.todo_list.find(todo => todo.id == change_todo.id);
            todo.description = change_todo.description;
            local.set(state.todo_list)
        }
    },
    actions: {
        async get_todo_list(context) {
            const data = local.get()
            //const res = await http.get('/todos/');
            //const data = await Axios.get('http://127.0.0.1:8000/api/todos')
            //console.log(res.data);
            //context.state.todo_list = res.data
            context.state.todo_list = data;
        },

        async addTodo({ state, commit }, newTodo) {
            const add_time = getDate();
            newTodo.created = add_time;
            commit('addTodo', newTodo);
            //console.log(newTodo);
            //Axios.post('http://localhost:8000/api/todos/', newTodo).then(res => commit('addTodo', res.data))
            //http.post('/todos', JSON.stringify(newTodo)).then(res => { console.log(res) })
        },

        async change_todo_content({ state, commit }, change_todo) {
            //console.log(change_todo);
            //Axios.put(`http://localhost:8000/api/todos/${change_todo.id}/`, change_todo).then(res => console.log(res))
            commit('change_todo_content', change_todo)
        },

        async delete_todo({ state, commit }, id) {
            //Axios.delete(`http://localhost:8000/api/todos/${id}`).then(res => console.log(res))
            commit('delete_todo', id)
        },

        async todo_change_completed({ state, commit }, id) {
            let todo = state.todo_list.find(item => item.id == id);
            !todo.completed;
            //console.log(todo);
            //Axios.put(`http://localhost:8000/api/todos/${id}/`, todo).then(res => console.log(res))
            commit('todo_change_completed', id)
        },

        async delete_completed({ state, commit }) {
            //const res = await http.get('/todos/completed/');
            //window.alert(res.data);
            commit('delete_completed')
        }
    }
})

export default store