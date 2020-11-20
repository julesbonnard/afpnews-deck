<template>
    <div class="shortcuts">
        <div class="shortcuts-start">
            <p>Changer la langue de tous les contenus :</p>
            <select @change="changeAllContentLanguage($event)">
                <option disabled selected>Choix de la langue</option>
                
                <option
                v-for="{ label, value, disabled } in languages"
                :key="value.join('|')"
                :value="value"
                :disabled="disabled"
                >
                {{ label }}
                </option>
            </select>
        </div>
        <div class="shortcuts-end">
            <a class="reset" @click="resetAllColumns()">Réinitialiser tous les contenus</a>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
import config from '@/config/topics'
import { v4 as uuidv4 } from 'uuid'
import afpNews from '@/plugins/api'

export default {
    name: 'Shortcuts',
    computed: {
        languages () {
        return [
            {
            label: this.$t('languages.en'),
            value: ['en'],
            disabled: false
            },
            {
            label: this.$t('languages.fr'),
            value: ['fr'],
            disabled: false
            },
            {
            label: this.$t('languages.de'),
            value: ['de'],
            disabled: false
            },
            {
            label: this.$t('languages.es'),
            value: ['es'],
            disabled: false
            },
            {
            label: this.$t('languages.pt'),
            value: ['pt'],
            disabled: false
            },
            {
            label: this.$t('languages.ar'),
            value: ['ar'],
            disabled: false
            },
            {
            label: this.$t('languages.zh-tw'),
            value: ['zh-tw'],
            disabled: false
            },
            {
            label: this.$t('languages.zh-cn'),
            value: ['zh-cn'],
            disabled: false
            }
        ]
        }
    },
    methods: {
        ...mapMutations([
        'resetAllColumns',
        'addColumn'
        ]),
        changeAllContentLanguage (e) {
            this.resetAllColumns()
            const lang = e.target.value
            const topics = config[lang]

            for (const topic of topics) {
                const column = {id: uuidv4(), params: Object.assign({}, afpNews.defaultSearchParams, { products: ['multimedia'], topics: topic.value, langs: [lang], size: 10, sources: ['afp', 'AFPTV', 'AFP Vidéographie', 'AFP Videographics', 'AFP Vidéographic', 'AFPTV / AFP Videografik'] }), documentsIds: [] }
                this.addColumn(column)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
  @import "@/assets/scss/variables.scss";
    .shortcuts{
        position: fixed;
        width: 100%;
        display: flex;
        align-items: stretch;
        flex-grow: 1;
        flex-shrink: 0;
        top: 7rem;
        padding: 0 2.5rem;
        .shortcuts-start{
            justify-content: flex-start;
            display: flex;

            select{
                background: transparent;
                border: none;
                color: $primary;
                outline: none;
                margin-left: 10px;
            }
        }
        .shortcuts-end{
            margin-left: auto;
            justify-content: flex-end;
            display: flex;

            .reset{
                color: $dark;
                text-decoration: underline;

                &:hover{
                    text-decoration: none;
                }
            }
            
            @media screen and (max-width: 800px) {
                display: none !important;
            }
        }
    }
</style>