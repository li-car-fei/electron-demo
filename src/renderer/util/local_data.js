const Local_data = function () {
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

const History_data = function () {
    this.get = function () {
        return localStorage.getItem('trans_history') ? JSON.parse(localStorage.getItem('trans_history')) : [];
    }
    this.set = function (trans_history) {
        localStorage.setItem('trans_history', JSON.stringify(trans_history));
    }
    this.clear = function () {
        localStorage.removeItem('trans_history')
    }
}

const local = new Local_data();
const Trans_history = new History_data()

const getDate = () => { //获取当天日期
    const date = new Date(),
        mouth = parseInt(date.getMonth()) + 1;
    return date.getFullYear() + '-' + mouth + '-' + date.getDate();
}

export { local, Trans_history, getDate }