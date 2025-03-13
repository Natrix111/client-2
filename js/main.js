Vue.component('Card', {
    props: ['card'],
    data() {
        return {
            newTaskText: '',
        };
    },
    template: `
        <div class="card">
            <h3>{{ card.title }}</h3>
            <ul>
                <li v-for="(item, i) in card.items" :key="i">
                    {{ item.text }}
                </li>
            </ul>
            <div class="add-task">
                <input type="text" v-model="newTaskText" placeholder="Добавить задачу" @keyup.enter="addTask">
                <button @click="addTask">Добавить</button>
            </div>
        </div>
    `,
    methods: {
        addTask() {
            if (this.newTaskText.trim() === '') return;
            this.card.items.push({ text: this.newTaskText, done: false });
            this.newTaskText = '';
        },
    },
});

let app = new Vue({
    el: "#app",
    template: `
        <div class="columns">
            <div class="column">
                <h2>Колонка 1 (макс. 3)</h2>
                <button @click="addCard(0)">Добавить карточку</button>
            </div>
            <div class="column">
                <h2>Колонка 2 (макс. 5)</h2>
            </div>
            <div class="column">
                <h2>Колонка 3 (без ограничений)</h2>
            </div>
        </div>
    `,
    data() {
        return {
            columns: [[], [], []],
        };
    },
    methods: {
        addCard(columnIndex) {
            if (columnIndex === 0 && this.columns[0].length >= 3) return;

            const newCard = {
                id: Date.now(),
                title: `Заметка ${this.columns[columnIndex].length + 1}`,
                items: [],
                completedAt: null
            };

            this.columns[columnIndex].push(newCard);
        },
    },
});