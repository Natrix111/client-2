let app = new Vue({
    el: "#app",
    template: `
        <div class="columns">
            <div class="column">
                <h2>Колонка 1 (макс. 3)</h2>
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
});