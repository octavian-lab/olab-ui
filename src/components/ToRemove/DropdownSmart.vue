<template>
    <Dropdown
        :filter="selects.list.length > 2"
        :options="selects.list"
        :optionLabel="optionLabel"
        :disabled="disabled"
        :optionValue="optionValue"
        :showClear="showClear"
        :placeholder="$translate('admin.generic.dropdown.placeholder')"
        :filterFields="filterFields"
        v-model="value"
    >
        <template #value="el">
            <span v-html="templateSetter('value', el)" v-if="el.value != null"> </span>
            <span v-else> {{ el.placeholder }} </span>
        </template>
        <template #option="el">
            <span v-html="templateSetter('option', el)"></span>
        </template>
    </Dropdown>
</template>
<script>
export default {
    name: "DropdownSmart",
    data() {
        return {
            value: null,
            selects: {
                list: [],
            },
        };
    },
    props: {
        autoUpdateSkins: {
            type: Number,
            required: false,
        },
        filterFields: {
            type: Array,
            required: false,
            default: () => ["id", "description"],
        },
        addZeroVal: {
            type: Boolean,
            required: false,
            // default: !this.$store.getters.info.idSkin ? false : true,
            default: false,
        },
        filter: {
            type: Boolean,
            required: false,
            default: true,
        },
        placeholder: {
            type: String,
            required: false,
        },
        type: {
            type: String,
            required: true,
            default: "skins",
        },
        optionValue: {
            type: String,
            required: false,
            default: "id",
        },
        optionLabel: {
            type: String,
            required: false,
            default: "description",
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        autoUpdateSkins: {
            handler(idLicensee) {
                this.selects.list = this.$store.getters.getSkinsByLicensee(idLicensee);
                this.handleZeroVisibilityInList();

                if (this.selects.list.length === 1)
                    this.$emit("autoUpdate", this.selects.list[0].id);
            },
            immediate: true,
        },
    },
    computed: {
        showClear() {
            if (this.$store.getters.isAdminRoot) return true;
            return this.selects.list.length > 1;
        },
        storeType() {
            let ret;
            switch (this.type) {
                case "skins":
                    ret = "Skin";
                    break;
                case "licensees":
                    ret = "Licensee";
                    break;
                case "platforms":
                    ret = "Platform";
                    break;
            }
            return ret;
        },
    },
    methods: {
        handleZeroVisibilityInList() {
            // if (!this.addZeroVal) return;
            if (this.$store.getters.info.idSkin || !this.addZeroVal) {
                return;
            }
            switch (this.type) {
                case "skins":
                    this.selects.list = this.handleSelects(this.selects.list);
                    break;
                case "licensees":
                    if (this.$store.getters.isAdminRoot)
                        this.selects.list = this.handleSelects(this.selects.list);
                    break;
                case "languages":
                    this.selects.list = this.handleSelects(
                        this.selects.list,
                        "WW",
                        this.$translate("decode.language.WW")
                    );
                    break;
                case "platforms":
                    break;
            }
        },
        optionCalc(el) {
            let option;
            switch (this.type) {
                case "languages":
                    if (el.option.id === "WW") {
                        const icon = "<i class='fad fa-globe fa-xl p-mr-2'></i>";
                        option = `${icon}${el.option.description}`;
                    } else {
                        const img = `<img class="flag flag-${el.option.id.toLowerCase()} p-mr-2" />`;
                        option = `${img}${el.option.description}`;
                    }
                    break;
                default:
                    option = `${el.option.id} - ${el.option.description}`;
                    break;
            }

            return option;
        },
        valuesCalc(el) {
            let value;
            let flag;
            const copy = [...this.selects.list];
            let description;
            switch (this.type) {
                case "languages":
                    description = copy.find((it) => it.id === el.value)?.description;
                    if (el.value === "WW") {
                        flag = "<i class='fad fa-globe fa-xl p-mr-2'></i>";
                    } else {
                        flag = `<img class="flag flag-${el.value?.toLowerCase()} p-mr-2" />`;
                    }
                    value = `${flag}${description}`;
                    break;
                default:
                    value = this.$store.getters[`get${this.storeType}Description`](el.value);
            }
            return value;
        },
        templateSetter(type, el) {
            if (type === "value") {
                return this.valuesCalc(el);
            } else {
                return this.optionCalc(el);
            }
        },
        chooseDropdownType() {
            switch (this.type) {
                case "skins":
                    this.selects.list = [...this.$store.getters.skins];
                    break;
                case "licensees":
                    this.selects.list = [...this.$store.getters.licensees];
                    break;
                case "platforms":
                    if (this.$store.getters.info.idLicensee) {
                        this.selects.list = [...this.$store.getters.platformsByLicensee];
                    } else {
                        this.selects.list = [...this.$store.getters.platforms];
                    }
                    break;
                case "languages":
                    this.selects.list = [...this.$store.getters.languages];
                    break;
            }
        },
    },
    created() {
        if (this.autoUpdateSkins == null) this.chooseDropdownType();
        this.handleZeroVisibilityInList();
    },
};
</script>
