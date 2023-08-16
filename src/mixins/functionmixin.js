import { useMediaQuery } from '@vueuse/core';

export default {
    data() {
        return {
            site: localStorage.getItem('site'),
            isMobile: useMediaQuery("(max-width: 640px)"),
            isTablet: useMediaQuery("(min-width: 641px) and (max-width: 991px)"),
            isDesktop:  useMediaQuery("(min-width: 992px)"),
        };
    },
    methods: {
        // UTILITY
        getAppVersion() {
            return import.meta.env.VUE_APP_VERSION;
        },
        imgUrl(path, format = "png") {
            if (path.startsWith("/")) path.replace("/", "");
            return `https://cdn.octavianlab.com/v3/bo/${this.site}/${path}.${format}`;
        },
        toast(severity, name, duration = 2700) {
            let detail;
            if (typeof name === "string") {
                detail = this.$translate(`admin.toast.message.${name.toLowerCase()}`);
            } else {
                // CASE DELL'ERROR CHE PASSA L'ERROR MESSAGE DAL BACKEND
                if (name.response) {
                    detail = `${name.response.data.code} - ${name.response.data.message}`;
                } else {
                    detail = this.$translate("admin.generic.error");
                }
            }
            this.$toast.add({
                severity: severity,
                summary: this.$translate(`admin.toast.${severity}.title`),
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
            message = `${this.$translate("admin.generic.confirm.remove.element")} : ${el} ?`,
            header = this.$translate("admin.generic.confirm"),
            acceptLabel = this.$translate("admin.generic.yes")
        ) {
            this.$confirm.require({
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

        // TODO
        /*setTranslateKeyAttribute(prefix, name) {
            return this.$translate(prefix + name, '', true)
                .replaceAll('-', '')
                .replaceAll(' ', '')
        }*/
    }
}