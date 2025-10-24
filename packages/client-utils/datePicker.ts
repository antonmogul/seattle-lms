export const tempusDominus = (window as any).tempusDominus;
export const moment = (window as any).moment;

export const datePickerConfig = {
    display: {
        icons: {
            type: 'icons',
            time: 'fa-solid fa-clock',
            date: 'fa-solid fa-calendar',
            up: 'fa-solid fa-arrow-up',
            down: 'fa-solid fa-arrow-down',
            previous: 'fas fa-chevron-left',
            next: 'fas fa-chevron-right',
            today: 'fa-solid fa-calendar-check',
            clear: 'fa-solid fa-trash',
            close: 'fa-solid fa-xmark'
        },
        components: {
            calendar: true,
            date: true,
            month: true,
            year: true,
            decades: true,
            clock: false,
            hours: false,
            minutes: false,
            seconds: false,
            useTwentyfourHour: undefined
        },
        theme: 'light',
        inline: false
    },
};

export const datePickerConfig2 = {
    useCurrent: false,
    display: {
        icons: {
            type: 'icons',
            time: 'fa-solid fa-clock',
            date: 'fa-solid fa-calendar',
            up: 'fa-solid fa-arrow-up',
            down: 'fa-solid fa-arrow-down',
            previous: 'fas fa-chevron-left',
            next: 'fas fa-chevron-right',
            today: 'fa-solid fa-calendar-check',
            clear: 'fa-solid fa-trash',
            close: 'fa-solid fa-xmark'
        },
        components: {
            calendar: true,
            date: true,
            month: true,
            year: true,
            decades: true,
            clock: false,
            hours: false,
            minutes: false,
            seconds: false,
            useTwentyfourHour: undefined
        },
        theme: 'light',
        inline: false
    },
};