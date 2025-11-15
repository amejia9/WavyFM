export class DJ {
    constructor(name, genres, schedule, rating) {
        this.name = name;
        this.genres = genres;
        this.schedule = schedule;
        this.rating = rating;
    }

    textAll() {
        return `${this.name} ${this.genres} ${this.schedule} ${this.rating}%`.toLowerCase();
    }

    matches(query) {
        if(!query) {
            return true;
        }
        const q = query.trim().toLowerCase();
        return this.textAll().includes(q);
    }
}
export function renderRoster(list, container) {
    if (!container) return;

    const items = Array.isArray(list) ? list : [];

    container.innerHTML = (items.length ? items.map(dj =>
        `<li>
            <article class="djCard">
                <div class="avatar" aria-hidden="true"></div>
                <header>
                    <h4>${dj.name}</h4>
                </header>
                <div class="meta">
                    <p>${dj.genres} - ${dj.schedule}</p>
                    <p>Rating <strong>${dj.rating}</strong></p>
                </div>
            </article>
        </li>
        `).join('')
        : `<li><p class="empty"> No DJs match your search.</p></li>`);

}

export function filterRoster(all, query) {
    return all.filter(dj => dj.matches(query));
}

export function refreshRoster(all) {
    all.forEach(dj => {
        const delta = Math.floor(Math.random() * 7) - 3;
        dj.rating = Math.max(40, Math.min(100, dj.rating + delta));
    });
    return all;
}

// demo data
export const seedDJs = [
    new DJ('DJ A', 'Top 40, Pop', 'weekdays', 90),
    new DJ('DJ B', 'Top 40, R&B', 'weeknights', 77),
    new DJ('DJ C', 'Top 40, Hip-Hop', 'weekends', 50),
    new DJ('DJ D', 'Dance, EDM', 'weekends', 86),
    new DJ('DJ E', 'Latin Pop', 'weeknights', 81),
    new DJ('DJ F', 'Alt, Pop', 'weekdays', 68),
];
