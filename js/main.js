const Card = {
    props: ['card', 'isFirstColumn'],
    data() {
        return {
            newTaskText: '',
            errorMessage: '',
        };
    },
    template: `
      <div class="card">
        <h3>{{ card.title }}</h3>
        <ul>
          <li v-for="(item, i) in card.items" :key="item.id">
            <input type="checkbox" v-model="item.done" @change="$emit('update-progress', card)">
            {{ item.text }}
            <button v-if="isFirstColumn" @click="removeTask(i)" class="remove-task">×</button>
          </li>
        </ul>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="isFirstColumn" class="add-task">
          <input 
            type="text" 
            v-model="newTaskText" 
            placeholder="Добавить задачу" 
            @keyup.enter="addTask"
            :disabled="card.items.length >= 5"
          >
          <button @click="addTask" :disabled="card.items.length >= 5">Добавить</button>
        </div>
        <p v-if="card.completedAt">Завершено: {{ card.completedAt }}</p>
      </div>
    `,
    methods: {
        addTask() {
            if (this.card.items.length >= 5) {
                this.errorMessage = "Максимум 5 задач в карточке.";
                return;
            }

            if (this.newTaskText.trim() === '') {
                this.errorMessage = "Задача не может быть пустой.";
                return;
            }

            this.card.items.push({ id: Date.now(), text: this.newTaskText, done: false });
            this.newTaskText = '';
            this.errorMessage = '';
            this.$emit('update-progress', this.card);
        },
        removeTask(index) {
            if (this.card.items.length <= 3) {
                this.errorMessage = "Минимум 3 задачи в карточке.";
                return;
            }

            this.card.items.splice(index, 1);
            this.errorMessage = '';
            this.$emit('update-progress', this.card);
        },
    },
};

const Column = {
    props: ['cards', 'isBlocked', 'isFirstColumn'],
    template: `
      <div class="column-content" :class="{ blocked: isBlocked }">
        <Card 
          v-for="card in cards" 
          :key="card.id" 
          :card="card" 
          :isFirstColumn="isFirstColumn"
          @update-progress="$emit('update-progress', card)" 
        />
      </div>
    `,
    components: {
        Card,
    },
};

const app = new Vue({
    el: '#app',
    template: `
      <div class="columns">
        <div class="column">
          <h2>Колонка 1 (макс. 3)</h2>
          <button v-if="columns[0].length < 3" @click="addCard(0)" :disabled="isFirstColumnBlocked">
            Добавить карточку
          </button>
          <Column 
            :cards="columns[0]" 
            :isBlocked="isFirstColumnBlocked" 
            :isFirstColumn="true"
            @update-progress="updateProgress" 
          />
        </div>
        <div class="column">
          <h2>Колонка 2 (макс. 5)</h2>
          <Column 
            :cards="columns[1]" 
            @update-progress="updateProgress" 
          />
        </div>
        <div class="column">
          <h2>Колонка 3 (без ограничений)</h2>
          <Column 
            :cards="columns[2]" 
          />
        </div>
      </div>
    `,
    data() {
        return {
            columns: [[], [], []],
        };
    },
    computed: {
        isFirstColumnBlocked() {
            return this.columns[0].length > 0 && this.columns[1].length >= 5;
        },
    },
    methods: {
        addCard(columnIndex) {
            if (columnIndex === 0 && this.columns[0].length >= 3) return;

            const newCard = {
                id: Date.now(),
                title: `Заметка ${this.columns[columnIndex].length + 1}`,
                items: [],
                completedAt: null,
            };

            this.$set(this.columns, columnIndex, [...this.columns[columnIndex], newCard]);
            this.saveData();
        },
        updateProgress(card) {
            const total = card.items.length;
            const completed = card.items.filter((item) => item.done).length;
            const progress = completed / total;

            if (total < 3) return;

            const currentColumn = this.columns.findIndex((col) => col.includes(card));

            if (progress === 1) {
                card.completedAt = new Date().toLocaleString();
                this.moveCard(card, 2);
            } else if (progress >= 0.5 && currentColumn === 0 && this.columns[1].length < 5) {
                this.moveCard(card, 1);
            }

            this.saveData();
        },
        moveCard(card, newColumnIndex) {
            const oldColumnIndex = this.columns.findIndex((col) => col.includes(card));
            this.columns[oldColumnIndex] = this.columns[oldColumnIndex].filter((c) => c !== card);
            this.columns[newColumnIndex].push(card);
            this.saveData();
        },
        saveData() {
            localStorage.setItem('columns', JSON.stringify(this.columns));
        },
        loadData() {
            const savedData = localStorage.getItem('columns');
            if (savedData) {
                this.columns = JSON.parse(savedData);
            }
        },
    },
    mounted() {
        this.loadData();
    },
    components: {
        Column,
    },
});