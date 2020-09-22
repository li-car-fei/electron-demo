const local_data = function () {
    this.get = function () {
        return localStorage.getItem('todo_list') ? JSON.parse(localStorage.getItem('todo_list')) : [];
    }
    this.set = function (todo_list) {
        localStorage.setItem('todo_list', JSON.stringify(todo_list));
    }
    this.clear = function () {
        localStorage.removeItem('todo_list');
    }
};

const local = new local_data();

const getDate = () => { //获取当天日期
    const date = new Date(),
        mouth = parseInt(date.getMonth()) + 1;
    return date.getFullYear() + '-' + mouth + '-' + date.getDate();
}

export { local, getDate }