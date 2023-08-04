import moment from 'moment'
// QUANDO SI UTILIZZA MOMENT BISOGNA PRIMA FARE TUTTE LE OPERAZIONI NECESSARIE PER RICEVERE IL RISULTATO DESIDERATO E INFINE NORMALIZZARE LA DATA
// FORMATTA LA DATA NEL MODO CORRETTO PER IL BACK END
import { useMediaQuery } from '@vueuse/core';

const functions = {
    site: undefined,
    translate: undefined,

    // DEVICE TYPE
    isMobile(dim = '(max-width: 640px)') {
        return useMediaQuery(dim).value
    },
    isTablet(dim = '(min-width: 641px) and (max-width: 991px)') {
        return useMediaQuery(dim).value
    },
    isDesktop(dim = '(min-width: 992px)') {
        return useMediaQuery(dim).value
    },

    // UTILITY
    imgUrl(path, format = "png") {
        if (path.startsWith("/")) path.replace("/", "");
        return `https://cdn.octavianlab.com/v3/bo/${this.site}/${path}.${format}`;
    },
    toast(severity, name, duration = 2700, toastInstance) {
        let detail;
        if (typeof name === "string") {
            detail = this.translate(`admin.toast.message.${name.toLowerCase()}`);
        } else {
            // CASE DELL'ERROR CHE PASSA L'ERROR MESSAGE DAL BACKEND
            if (name.response) {
                detail = `${name.response.data.code} - ${name.response.data.message}`;
            } else {
                detail = this.translate("admin.generic.error");
            }
        }
        toastInstance.add({
            severity: severity,
            summary: this.translate(`admin.toast.${severity}.title`),
            detail: detail,
            life: duration,
        });
    },
    generateSelects(data, optionValue, optionLabel) {
        let ret = [];
        if (!Array.isArray(data)) {
            console.warn(
                "Generazione select impossibile non è un array o è un array vuoto: ",
                data
            );
            return ret;
        }
        for (let el of data) {
            ret.push({
                label: el[optionLabel],
                value: el[optionValue],
            });
        }
        return ret;
    },
    doOpenConfirmDialog(
        el,
        fn,
        confirmInstance,
        message = `${this.translate("admin.generic.confirm.remove.element")} : ${el} ?`,
        header = this.translate("admin.generic.confirm"),
        acceptLabel = this.translate("admin.generic.yes")
    ) {
        confirmInstance.require({
            header: header,
            acceptLabel: acceptLabel,
            message: message,
            icon: "fad fa-exclamation-triangle text-warning p-mr-3 animate__infinite animate__animated animate__heartBeat animate__slow",
            accept: () => {
                fn(el);
            },
        });
    },
    isParsable(str) {
        try {
            JSON.parse(str)
            return true
        } catch (e) {
            return false
        }
    },

    // DATE
    normalizeForRequest(date) {
        return moment(date).utc().toDate().Date
    },
    getMidNight(date) {
        return moment(date).set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
    },
    getNow() {
        return moment()
    },
    getYesterday() {
        return moment().subtract(1, 'days')
    },
    getStartOf(date, period) {
        //PERIOD DEVE ESSERE AL SINGOLARE (es. day,month,...)
        return moment(date).startOf(period)
    },
    getEndOf(date, period) {
        // PERIOD DEVE ESSERE AL SINGOLARE (es. day,month,...)
        return moment(date).endOf(period).add(1, 'milliseconds')
    },
    addPeriod(date, amount, period) {
        //PERIOD DEVE ESSERE AL PLURALE (es. days,months,...)
        if (amount < 0) {
            return moment(date).subtract(Math.abs(amount), period)
        } else {
            return moment(date).add(Math.abs(amount), period)
        }
    },
    addOrSubtract(date, operation, amount, period) {
        //PERIOD DEVE ESSERE AL PLURALE (es. days,months,...)
        if (operation === '-') {
            return moment(date).subtract(+amount, period)
        } else {
            return moment(date).add(+amount, period)
        }
    },
    compareDate(date1, date2, operation) {
        switch (operation) {
            case 'equal':
                return moment(date1).isSame(moment(date2))
            case 'before':
                return moment(date1).isBefore(moment(date2))
            case 'after':
                return moment(date1).isAfter(moment(date2))
        }
    },
    difference(date1, date2, period) {
        //PERIOD DEVE ESSERE AL PLURALE (es. days,months,...)
        let unitToShow = `as${period.charAt(0).toUpperCase() + period.slice(1)}`
        let diff = moment.duration(moment(date1).diff(date2))
        return diff[unitToShow]()
    },

    // TODO
    /*setTranslateKeyAttribute(prefix, name) {
        return this.translate(prefix + name, '', true)
            .replaceAll('-', '')
            .replaceAll(' ', '')
    }*/
}

export default {
    install(app, options) {
        functions.site = options.site;
        functions.translate = options.fxTranslate;

        app.config.globalProperties.$functions = functions;
    }
}