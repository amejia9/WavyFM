import { DJ, seedDJs, renderRoster, filterRoster, refreshRoster } from './djs.module.js';

window.addEventListener('DOMContentLoaded', () =>{

    // search bar
    const searchInput = document.querySelector('#query');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && searchInput.value.trim().length < 2) {
                e.preventDefault();
                alert('Please enter at least 2 characters to search.');
            }
        });
    }

    // calender functionality
    const calendarTable = document.getElementById('calendarTable');
    const monthInput = document.getElementById('month');
    const monthName = document.getElementById('monthName');

    function renderCalendar(date = new Date()) {
        if (!calendarTable || !monthName) return;

        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        monthName.textContent = date.toLocaleString('default', { month: 'long', year: 'numeric' });

        let html = '';
        let day = 1;
        for (let i = 0; i < 6; i++) {
            html += '<tr>';
            for (let j = 0; j < 7; j++) {
                if ((i === 0 && j < firstDay) || day > daysInMonth) {
                    html += '<td></td>'
                } else {
                    html += `<td dataDay="${day}">${day}</td>`;
                    day++;
                }
            }
            html += '</tr>';
        }
        calendarTable.querySelector('tbody').innerHTML = html;
    }

    let currentDate = new Date();
    renderCalendar(currentDate);

    document.getElementById('calendarControls')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const selected = monthInput?.value;
        if (!selected) return;
        const [year, month] = selected.split('-');
        currentDate = new Date(year, month - 1, 1);
        renderCalendar(currentDate);
    });



    // prev-next buttons
    document.getElementById('prev')?.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    })
    document.getElementById('next')?.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    })
    // today button
    document.getElementById('today')?.addEventListener('click', () => {
        currentDate = new Date();
        renderCalendar(currentDate);
    })

    let selectedISODate = null;
    const pad2 = n => String (n).padStart(2, '0');
    const toISO = d => `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
    const longDate = d => d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });

    const assignDateInput = document.getElementById('assignDate');
    const assignFormTitleEl = document.getElementById('assignFormTitle');
    const slotsTable = document.querySelector('.slots table');

    function openSlotsForDate(dateObj) {
        selectedISODate = toISO(dateObj);

        if (assignFormTitleEl) assignFormTitleEl.textContent = `Assign DJs for ${longDate(dateObj)}`;

        if (assignDateInput) assignDateInput.value = selectedISODate;

        if (slotsTable) {
            slotsTable.querySelectorAll('select').forEach(sel => {
                sel.value = '';
                sel.classList.remove('error');
            });
        }
        
    }

    // day functionality
    calendarTable.addEventListener('click', (e) => {
        const td = e.target.closest('td');
        const dayValue = td?.getAttribute('dataDay');
        if (!dayValue) return;

        calendarTable.querySelectorAll('td').forEach(c => c.classList.remove('selected'));
        td.classList.add('selected');

        const clicked = new Date(currentDate.getFullYear(), currentDate.getMonth(), Number(dayValue));
        openSlotsForDate(clicked);
    });

    document.getElementById('slotControls')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const iso = assignDateInput?.value;
        if(!iso) return;

        const [year, month, day] = iso.split('-').map(Number);
        const chosen = new Date(year, month - 1, day);

        if (currentDate.getFullYear() !== year || currentDate.getMonth() !== (month - 1)) { 
            currentDate = new Date(year, month - 1, 1);
            renderCalendar(currentDate);
        }
        
        const cell = Array.from(calendarTable.querySelectorAll('td'))
            .find(c => c.textContent.trim() === String(day));
        if (cell) {
            calendarTable.querySelectorAll('td').forEach(c => c.classList.remove('selected'));
            cell.classList.add('selected')
        }
        openSlotsForDate(chosen);


    });

    // buttons in slots panel - not finished
    const slotsButtons = document.getElementById('slotsButtons');
    if (slotsButtons && slotsTable) {
        let previousAssignments = [];
        slotsButtons.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const action = btn.value;

            if (action === 'save') {
                previousAssignments = Array.from(slotsTable.querySelectorAll('select')).map(sel => sel.value);
                alert('saved (demo)');
            }
            else if (action === 'undo') {
                if (previousAssignments.length === 0) {
                    alert('nothing to undo');
                    return;
                }
                const selects = slotsTable.querySelectorAll('select');
                selects.forEach((sel, i) => {
                    sel.value = previousAssignments[i] || '';
                });
                alert('prev assignment restored');
            }
            else if (btn.type === 'reset') {
                slotsTable.querySelectorAll('select').forEach(sel => sel.value = '');
                alert('slots cleared');
            }
        });
    }


    // DJ Roster
    const djList = document.querySelector(' .dj ul');
    const djForm = document.getElementById('djControls');
    const djSearch = document.getElementById('djSearch');
    const djActions = document.getElementById('djActions');

    let djs = seedDJs.slice();

    if (djList) {
        renderRoster(djs, djList);
    }

    djForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = djSearch?.value || '';
        const filter = filterRoster(djs, q);

        renderRoster(filter, djList);

        djList.outline = '3px solid var(--accent)';
        setTimeout(() => { djList.style.outline = ''; }, 350);
    });

    djActions?.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        if (btn.value === 'refresh') {
            refreshRoster(djs);
            renderRoster(filterRoster(djs, djSearch?.value || ''), djList);
            alert('roster refreshing (demo)');
        }
        if (btn.value === 'clear') {
            if (djSearch) djSearch.value = '';
            renderRoster(djs, djList)
        }
    })
})